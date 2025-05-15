from django.db import models

class Account(models.Model):
    ACCOUNT_TYPES = [
        ('Asset', 'Asset'),
        ('Liability', 'Liability'),
        ('Income', 'Income'),
        ('Expense', 'Expense'),
    ]

    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=ACCOUNT_TYPES)
    description = models.TextField()

    def __str__(self):
        return self.name


class Transaction(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    description = models.TextField()
    accounts = models.ManyToManyField(Account, through='Entry')

    def __str__(self):
        return f'Transaction {self.id} - {self.description}'


class Entry(models.Model):
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=10, choices=[('Debit', 'Debit'), ('Credit', 'Credit')])

    def __str__(self):
        return f'{self.type} - {self.account.name} - {self.amount}'
