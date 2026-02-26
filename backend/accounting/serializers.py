from rest_framework import serializers
from django.db import transaction
from .models import Account, Transaction, Entry
from decimal import Decimal

class AccountSerializer(serializers.ModelSerializer):
    class Model:
        model = Account
        fields = '__all__'

class EntrySerializer(serializers.ModelSerializer):
    account_id = serializers.PrimaryKeyRelatedField(
        queryset=Account.objects.all(), source='account'
    )

    class Meta:
        model = Entry
        fields = ['account_id', 'amount', 'type']

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
                Entry.objects.create(transaction=instance, **entry_data)
        
        return instance