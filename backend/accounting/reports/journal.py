from accounting.models import Transaction, Entry

def generate_journal():
    journal = []
    transactions = Transaction.objects.order_by('date').all()# pylint: disable=no-member

    for txn in transactions:
        entries = Entry.objects.filter(transaction=txn)# pylint: disable=no-member
        entry_list = []
        for e in entries:
            entry_list.append({
                'account': e.account.name,
                'type': e.type,
                'amount': e.amount,
            })
        journal.append({
            'transaction_id': txn.id,
            'date': txn.date,
            'description': txn.description,
            'entries': entry_list,
        })
    return journal
