from accounting.models import Account, Entry
from accounting.reports.income_statement import generate_income_statement
from django.db.models import Sum


def generate_balance_sheet():

    accounts = Account.objects.filter(type__in=['Asset', 'Liability', 'Equity'])
    balance = {}

    for account in accounts:
        debit_sum = Entry.objects.filter(account=account, type='Debit').aggregate(total=Sum('amount'))['total'] or 0
        credit_sum = Entry.objects.filter(account=account, type='Credit').aggregate(total=Sum('amount'))['total'] or 0

        if account.type == 'Asset':
            saldo = debit_sum - credit_sum
        else:
            saldo = credit_sum - debit_sum

        balance[account.name] = saldo

    income_statement = generate_income_statement()
    net_result = income_statement['net_result']

    if net_result != 0:
        label = 'Resultado del Ejercicio (Ganancia)' if net_result > 0 else 'Resultado del Ejercicio (Pérdida)'
        balance[label] = net_result

    return balance