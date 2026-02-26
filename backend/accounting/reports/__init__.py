from django.db.models import Sum, Q, Value, DecimalField
from django.db.models.functions import Coalesce
from ..models import Account

def generate_balance_sheet():
    accounts_with_totals = Account.objects.annotate(
        total_debit=Coalesce(
            Sum('entries__amount', filter=Q(entries__type='Debit')), 
            Value(0),
            output_field=DecimalField()
        ),
        total_credit=Coalesce(
            Sum('entries__amount', filter=Q(entries__type='Credit')), 
            Value(0),
            output_field=DecimalField()
        )
    )

    balance_report = []
    for acc in accounts_with_totals:
        if acc.type in ['Asset', 'Expense']:
            balance = acc.total_debit - acc.total_credit
        else:
            balance = acc.total_credit - acc.total_debit

        balance_report.append({
            'code': acc.code,
            'name': acc.name,
            'type': acc.type,
            'balance': float(balance)
        })

    return balance_report