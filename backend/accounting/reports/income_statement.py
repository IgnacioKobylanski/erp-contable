from accounting.models import Account, Entry
from django.db.models import Sum

def generate_income_statement():
    income_accounts = Account.objects.filter(type='Income')
    expense_accounts = Account.objects.filter(type='Expense')

    total_income = 0
    total_expense = 0

    for account in income_accounts:
        credit_sum = Entry.objects.filter(account=account, type='Credit').aggregate(total=Sum('amount'))['total'] or 0
        debit_sum = Entry.objects.filter(account=account, type='Debit').aggregate(total=Sum('amount'))['total'] or 0
        total_income += credit_sum - debit_sum

    for account in expense_accounts:
        debit_sum = Entry.objects.filter(account=account, type='Debit').aggregate(total=Sum('amount'))['total'] or 0
        credit_sum = Entry.objects.filter(account=account, type='Credit').aggregate(total=Sum('amount'))['total'] or 0
        total_expense += debit_sum - credit_sum

    net_result = total_income - total_expense

    return {
        'total_income': total_income,
        'total_expense': total_expense,
        'net_result': net_result
    }
