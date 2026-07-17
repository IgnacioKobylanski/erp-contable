from accounting.models import Account, Entry


def _apply_sign(account, entry_type, amount):
    if account.type in ('Asset', 'Expense'):
        return amount if entry_type == 'Debit' else -amount
    return amount if entry_type == 'Credit' else -amount


def generate_ledger(date_from=None, date_to=None):
    ledger = []
    accounts = Account.objects.all()

    for account in accounts:
        all_entries = Entry.objects.filter(account=account).order_by('transaction__date')

        # Saldo inicial: todo lo que pasó ANTES del date_from, sin importar date_to.
        opening_balance = 0
        if date_from:
            prior_entries = all_entries.filter(transaction__date__lt=date_from)
            for entry in prior_entries:
                opening_balance += _apply_sign(account, entry.type, entry.amount)

        # Entries dentro del rango filtrado (o todas, si no hay filtro).
        period_entries = all_entries
        if date_from:
            period_entries = period_entries.filter(transaction__date__gte=date_from)
        if date_to:
            period_entries = period_entries.filter(transaction__date__lte=date_to)

        running_balance = opening_balance
        entry_list = []

        for entry in period_entries:
            running_balance += _apply_sign(account, entry.type, entry.amount)
            entry_list.append({
                'date': entry.transaction.date,
                'description': entry.transaction.description,
                'type': entry.type.lower(),
                'amount': entry.amount,
                'running_balance': running_balance,
            })

        ledger.append({
            'account': account.name,
            'opening_balance': opening_balance,
            'entries': entry_list,
        })

    return ledger