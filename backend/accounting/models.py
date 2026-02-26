from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Sum, Q

class Account(models.Model):
    ACCOUNT_TYPES = [
        ('Asset', 'Asset'),
        ('Liability', 'Liability'),
        ('Equity', 'Equity'),
        ('Income', 'Income'),
        ('Expense', 'Expense'),
    ]
    
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=ACCOUNT_TYPES)
    description = models.TextField(blank=True)
    
    parent = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='children'
    )

    class Meta:
        ordering = ['code']

    def __str__(self) -> str:
        return f"{self.code} - {self.name}"


class Transaction(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateTimeField(auto_now_add=True)
    description = models.TextField()
    accounts = models.ManyToManyField(Account, through='Entry')

    def __str__(self):
        return f'Transaction {self.id} - {self.description}'


class Entry(models.Model):
    transaction = models.ForeignKey(
        Transaction, 
        on_delete=models.CASCADE, 
        related_name='entries'
    )
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    type = models.CharField(
        max_length=10, 
        choices=[('Debit', 'Debit'), ('Credit', 'Credit')]
    )

    def __str__(self):
        return f'{self.type} - {self.account.name} - {self.amount}'