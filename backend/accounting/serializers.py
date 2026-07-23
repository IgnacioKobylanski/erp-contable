from rest_framework import serializers
from django.db import transaction
from .models import Account, AccountTag, Transaction, Entry
from decimal import Decimal

class AccountTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountTag
        fields = ['id', 'name', 'category']


class AccountSerializer(serializers.ModelSerializer):
    tags = AccountTagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=AccountTag.objects.all(),
        source='tags',
        many=True,
        write_only=True,
        required=False
    )

    class Meta:
        model = Account
        fields = '__all__'

    def validate_tag_ids(self, tags):
        categories_seen = []
        for tag in tags:
            if tag.category in categories_seen:
                raise serializers.ValidationError(
                    f"No se puede asignar más de un tag de la categoría '{tag.category}' a la misma cuenta."
                )
            categories_seen.append(tag.category)
        return tags

class EntrySerializer(serializers.ModelSerializer):
    account_id = serializers.PrimaryKeyRelatedField(
        queryset=Account.objects.all(), source='account'
    )
    transaction = serializers.PrimaryKeyRelatedField(
        queryset=Transaction.objects.all(), required=False
    )

    class Meta:
        model = Entry
        fields = ['transaction', 'account_id', 'amount', 'type']

    def validate(self, data):
        """
        'transaction' is only required when this serializer is used
        standalone (e.g. POST /entries/). When nested inside
        TransactionSerializer, the transaction is assigned after
        creation, so it must NOT be required here.
        """
        if self.parent is None and 'transaction' not in data:
            raise serializers.ValidationError({
                'transaction': 'Este campo es obligatorio al crear un asiento de forma individual.'
            })
        return data

class TransactionSerializer(serializers.ModelSerializer):
    entries = EntrySerializer(many=True)

    class Meta:
        model = Transaction
        fields = ['id', 'date', 'description', 'entries']

    def validate_entries(self, value):
        """
        Validates that Total Debits = Total Credits before touching the DB.
        """
        if not value:
            raise serializers.ValidationError("A transaction must have at least one entry.")

        total_debit = Decimal('0.00')
        total_credit = Decimal('0.00')

        for entry_data in value:
            amount = entry_data['amount']
            if entry_data['type'] == 'Debit':
                total_debit += amount
            else:
                total_credit += amount

        if total_debit != total_credit:
            raise serializers.ValidationError(
                f"Transaction not balanced: Debits ({total_debit}) != Credits ({total_credit})"
            )
        
        return value

    def create(self, validated_data):
        """
        Saves Transaction and Entries inside a single database transaction.
        """
        entries_data = validated_data.pop('entries')

        with transaction.atomic():
            instance = Transaction.objects.create(**validated_data)
            for entry_data in entries_data:
                entry_data.pop('transaction', None)  # defensa: evita choque de kwargs
                Entry.objects.create(transaction=instance, **entry_data)

        return instance

    def update(self, instance, validated_data):
        """
        Updates a Transaction and replaces its Entries entirely
        (delete + recreate) inside a single database transaction.
        """
        entries_data = validated_data.pop('entries')

        with transaction.atomic():
            instance.description = validated_data.get('description', instance.description)
            instance.save()

            instance.entries.all().delete()
            for entry_data in entries_data:
                entry_data.pop('transaction', None)  # defensa: evita choque de kwargs
                Entry.objects.create(transaction=instance, **entry_data)

        return instance