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
    running_balance = serializers.DecimalField(
        max_digits=15,
        decimal_places=2,
        help_text="Saldo acumulado de la cuenta hasta este movimiento, inclusive"
    )


class LedgerSerializer(serializers.Serializer):
    account = serializers.CharField(help_text="Cuenta contable")
    opening_balance = serializers.DecimalField(
        max_digits=15,
        decimal_places=2,
        help_text="Saldo acumulado antes del inicio del período filtrado (0 si no hay filtro de fecha)"
    )
    entries = LedgerEntrySerializer(many=True, help_text="Lista de movimientos para la cuenta")


class IncomeAccountSerializer(serializers.Serializer):
    account = serializers.CharField(help_text="Nombre de la cuenta")
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, help_text="Monto de la cuenta")
    percentage = serializers.DecimalField(max_digits=5, decimal_places=2, help_text="Porcentaje sobre el total de ingresos")


class ExpenseAccountSerializer(serializers.Serializer):
    account = serializers.CharField(help_text="Nombre de la cuenta")
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, help_text="Monto de la cuenta")
    percentage = serializers.DecimalField(max_digits=5, decimal_places=2, help_text="Porcentaje sobre el total de egresos")
    expense_nature = serializers.CharField(
        allow_null=True,
        required=False,
        help_text="Naturaleza del gasto (Fijo/Variable), si la cuenta tiene el tag asignado"
    )


class IncomeStatementSerializer(serializers.Serializer):
    income_accounts = IncomeAccountSerializer(many=True, help_text="Detalle de cuentas de ingreso")
    expense_accounts = ExpenseAccountSerializer(many=True, help_text="Detalle de cuentas de egreso")
    total_income = serializers.DecimalField(max_digits=12, decimal_places=2, help_text="Total de ingresos")
    total_expense = serializers.DecimalField(max_digits=12, decimal_places=2, help_text="Total de egresos")
    total_fixed_expense = serializers.DecimalField(max_digits=12, decimal_places=2, help_text="Total de egresos fijos")
    total_variable_expense = serializers.DecimalField(max_digits=12, decimal_places=2, help_text="Total de egresos variables")
    net_result = serializers.DecimalField(max_digits=12, decimal_places=2, help_text="Resultado neto (ingresos - egresos)")

class TotalsSerializer(serializers.Serializer):
    total_debit = serializers.DecimalField(
        max_digits=15,
        decimal_places=2,
        help_text="Suma total de todos los débitos registrados"
    )
    total_credit = serializers.DecimalField(
        max_digits=15,
        decimal_places=2,
        help_text="Suma total de todos los créditos registrados"
    )
    is_balanced = serializers.BooleanField(
        help_text="Indica si el libro contable está balanceado globalmente"
    )