from rest_framework import serializers

class BalanceSheetSerializer(serializers.Serializer):
    account = serializers.CharField()
    balance = serializers.DecimalField(max_digits=10, decimal_places=2)

class EntrySerializer(serializers.Serializer):
    account = serializers.CharField()
    type = serializers.CharField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)


class JournalSerializer(serializers.Serializer):
    transaction_id = serializers.IntegerField()
    date = serializers.DateTimeField()
    description = serializers.CharField()
    entries = EntrySerializer(many=True)


class LedgerEntrySerializer(serializers.Serializer):
    date = serializers.DateTimeField()
    description = serializers.CharField()
    type = serializers.CharField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)


class LedgerSerializer(serializers.Serializer):
    account = serializers.CharField()
    entries = LedgerEntrySerializer(many=True)


class IncomeStatementSerializer(serializers.Serializer):
    total_income = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_expense = serializers.DecimalField(max_digits=12, decimal_places=2)
    net_result = serializers.DecimalField(max_digits=12, decimal_places=2)