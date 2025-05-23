from accounting.models import Account, Entry
from django.db.models import Sum, Q

def generate_balance_sheet():
    accounts = Account.objects.all()  # pylint: disable=no-member
    balance = {}

    for account in accounts:
        debit_sum = Entry.objects.filter(account=account, type='Debit').aggregate(total=Sum('amount'))['total'] or 0  # pylint: disable=no-member
        credit_sum = Entry.objects.filter(account=account, type='Credit').aggregate(total=Sum('amount'))['total'] or 0  # pylint: disable=no-member
        if account.type == 'Asset':
            saldo = debit_sum - credit_sum
        else:
            saldo = credit_sum - debit_sum

        balance[account.name] = saldo

    return balance
