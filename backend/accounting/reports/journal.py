from accounting.models import Transaction, Entry


def generate_journal(date_from=None, date_to=None):
    transactions = Transaction.objects.order_by('date').all()  # pylint: disable=no-member

    if date_from:
        transactions = transactions.filter(date__gte=date_from)
    if date_to:
        transactions = transactions.filter(date__lte=date_to)

    journal = []
    for txn in transactions:
        entries = Entry.objects.filter(transaction=txn)  # pylint: disable=no-member
        entry_list = []
        for e in entries:
            entry_list.append({
                'account': e.account.name,
                'type': e.type.lower(),
                'amount': e.amount,
            })
        journal.append({
            'transaction_id': txn.id,
            'date': txn.date,
            'description': txn.description,
            'entries': entry_list,
        })
    return journal