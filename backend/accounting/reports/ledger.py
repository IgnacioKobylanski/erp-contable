from accounting.models import Account, Entry


def generate_ledger():
    ledger = []
    accounts = Account.objects.all()

    for account in accounts:
        entries = Entry.objects.filter(account=account).order_by('transaction__date')

        running_balance = 0
        entry_list = []

        for entry in entries:
            if account.type in ('Asset', 'Expense'):
                if entry.type == 'Debit':
                    running_balance += entry.amount
                else:
                    running_balance -= entry.amount
            else:
                if entry.type == 'Credit':
                    running_balance += entry.amount
                else:
                    running_balance -= entry.amount

            entry_list.append({
                'date': entry.transaction.date,
                'description': entry.transaction.description,
                'type': entry.type.lower(),
                'amount': entry.amount,
                'running_balance': running_balance,
            })

        ledger.append({
            'account': account.name,
            'entries': entry_list,
        })

    return ledger