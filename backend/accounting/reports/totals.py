from accounting.models import Entry
from django.db.models import Sum


def generate_totals():
    total_debit = Entry.objects.filter(type='Debit').aggregate(
        total=Sum('amount')
    )['total'] or 0

    total_credit = Entry.objects.filter(type='Credit').aggregate(
        total=Sum('amount')
    )['total'] or 0

    return {
        'total_debit': total_debit,
        'total_credit': total_credit,
        'is_balanced': total_debit == total_credit,
    }