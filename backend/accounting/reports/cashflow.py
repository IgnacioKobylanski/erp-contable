from accounting.models import Account, Entry


LIQUIDITY_CATEGORY = 'Liquidez'
LIQUIDITY_TAG = 'Efectivo'


def generate_cashflow(date_from=None, date_to=None):
    cash_accounts = Account.objects.filter(
        tags__category=LIQUIDITY_CATEGORY,
        tags__name=LIQUIDITY_TAG
    )

    entries = Entry.objects.filter(account__in=cash_accounts).order_by('transaction__date')

    opening_balance = 0
    if date_from:
        prior_entries = entries.filter(transaction__date__lt=date_from)
        for entry in prior_entries:
            if entry.type == 'Debit':
                opening_balance += entry.amount
            else:
                opening_balance -= entry.amount

    period_entries = entries
    if date_from:
        period_entries = period_entries.filter(transaction__date__gte=date_from)
    if date_to:
        period_entries = period_entries.filter(transaction__date__lte=date_to)

    running_balance = opening_balance
    movements = []
    total_in = 0
    total_out = 0

    for entry in period_entries:
        if entry.type == 'Debit':
            running_balance += entry.amount
            total_in += entry.amount
        else:
            running_balance -= entry.amount
            total_out += entry.amount

        movements.append({
            'date': entry.transaction.date,
            'description': entry.transaction.description,
            'account': entry.account.name,
            'type': entry.type.lower(),
            'amount': entry.amount,
            'running_balance': running_balance,
        })

    return {
        'opening_balance': opening_balance,
        'closing_balance': running_balance,
        'total_in': total_in,
        'total_out': total_out,
        'net_cashflow': total_in - total_out,
        'movements': movements,
    }