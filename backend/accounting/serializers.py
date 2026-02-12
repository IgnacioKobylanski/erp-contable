from rest_framework import serializers
from .models import Account, Transaction, Entry

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'

class EntrySerializer(serializers.ModelSerializer):
    account_name = serializers.ReadOnlyField(source='account.name')

    class Meta:
        model = Entry
        fields = ['id', 'account', 'account_name', 'amount', 'type']

class TransactionSerializer(serializers.ModelSerializer):
    entries = EntrySerializer(many=True, read_only=True, source='entry_set')

    class Meta:
        model = Transaction
        fields = ['id', 'date', 'description', 'entries']