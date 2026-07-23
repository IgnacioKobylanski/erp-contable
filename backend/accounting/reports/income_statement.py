from accounting.models import Account, Entry
from django.db.models import Sum


EXPENSE_NATURE_CATEGORY = 'Naturaleza del gasto'


def _get_expense_nature(account):
    tag = account.tags.filter(category=EXPENSE_NATURE_CATEGORY).first()
    return tag.name if tag else None


def generate_income_statement():
    income_accounts = Account.objects.filter(type='Income')
    expense_accounts = Account.objects.filter(type='Expense')

    income_detail = []
    total_income = 0

    for account in income_accounts:
        credit_sum = Entry.objects.filter(account=account, type='Credit').aggregate(total=Sum('amount'))['total'] or 0
        debit_sum = Entry.objects.filter(account=account, type='Debit').aggregate(total=Sum('amount'))['total'] or 0
        amount = credit_sum - debit_sum
        if amount != 0:
            income_detail.append({'account': account.name, 'amount': amount})
        total_income += amount

    expense_detail = []
    total_expense = 0
    total_fixed_expense = 0
    total_variable_expense = 0

    for account in expense_accounts:
        debit_sum = Entry.objects.filter(account=account, type='Debit').aggregate(total=Sum('amount'))['total'] or 0
        credit_sum = Entry.objects.filter(account=account, type='Credit').aggregate(total=Sum('amount'))['total'] or 0
        amount = debit_sum - credit_sum

        if amount != 0:
            nature = _get_expense_nature(account)
            expense_detail.append({
                'account': account.name,
                'amount': amount,
                'expense_nature': nature,
            })
            if nature == 'Fijo':
                total_fixed_expense += amount
            elif nature == 'Variable':
                total_variable_expense += amount

        total_expense += amount

    for item in income_detail:
        item['percentage'] = round((item['amount'] / total_income) * 100, 2) if total_income else 0

    for item in expense_detail:
        item['percentage'] = round((item['amount'] / total_expense) * 100, 2) if total_expense else 0

    net_result = total_income - total_expense

    return {
        'income_accounts': income_detail,
        'expense_accounts': expense_detail,
        'total_income': total_income,
        'total_expense': total_expense,
        'total_fixed_expense': total_fixed_expense,
        'total_variable_expense': total_variable_expense,
        'net_result': net_result,
    }