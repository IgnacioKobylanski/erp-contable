from rest_framework import serializers


TYPE_CHOICES = (
    ('debit', 'Débito'),
    ('credit', 'Crédito'),
)

class BalanceSheetSerializer(serializers.Serializer):
    account = serializers.CharField(help_text="Nombre o código de cuenta")
    balance = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Saldo de la cuenta"
    )


class EntrySerializer(serializers.Serializer):
    account = serializers.CharField(help_text="Cuenta asociada al asiento")
    type = serializers.ChoiceField(choices=TYPE_CHOICES, help_text="Tipo de movimiento: debit o credit")
    amount = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Monto del asiento"
    )


class JournalSerializer(serializers.Serializer):
    transaction_id = serializers.IntegerField(help_text="ID de la transacción")
    date = serializers.DateTimeField(help_text="Fecha del asiento")
    description = serializers.CharField(help_text="Descripción de la transacción")
    entries = EntrySerializer(many=True, help_text="Lista de movimientos asociados")

    def validate(self, data):
        debit_total = sum(e['amount'] for e in data['entries'] if e['type'] == 'debit')
        credit_total = sum(e['amount'] for e in data['entries'] if e['type'] == 'credit')
        if debit_total != credit_total:
            raise serializers.ValidationError("Los débitos y créditos deben ser iguales.")
        return data


class LedgerEntrySerializer(serializers.Serializer):
    date = serializers.DateTimeField(help_text="Fecha del movimiento")
    description = serializers.CharField(help_text="Descripción del movimiento")
    type = serializers.ChoiceField(choices=TYPE_CHOICES, help_text="Tipo de movimiento: debit o credit")
    amount = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Monto del movimiento"
    )


class LedgerSerializer(serializers.Serializer):
    account = serializers.CharField(help_text="Cuenta contable")
    entries = LedgerEntrySerializer(many=True, help_text="Lista de movimientos para la cuenta")


class IncomeStatementSerializer(serializers.Serializer):
    total_income = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="Total de ingresos"
    )
    total_expense = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="Total de egresos"
    )
    net_result = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="Resultado neto (ingresos - egresos)"
    )



""" from rest_framework import serializers

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
    net_result = serializers.DecimalField(max_digits=12, decimal_places=2) """