from accounting.models import Account, Entry

def generate_ledger():
    ledger = []

    accounts = Account.objects.all() # pylint: disable=invalid-str-returned
    for account in accounts:
        entries = Entry.objects.filter(account=account).order_by('transaction__date') # pylint: disable=invalid-str-returned
        account_data = {
            'account': account.name,
            'entries': [
                {
                    'date': entry.transaction.date,
                    'description': entry.transaction.description,
                    'type': entry.type,
                    'amount': entry.amount
                }
                for entry in entries
            ]
        }
        ledger.append(account_data)

    return ledger
