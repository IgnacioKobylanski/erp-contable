from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Sum, Q

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

    def __str__(self) -> str:
        return str(self.name)  # pylint: disable=invalid-str-returned


class Transaction(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateTimeField(auto_now_add=True)
    description = models.TextField()
    accounts = models.ManyToManyField(Account, through='Entry')

    def clean(self):
        # Validar que debitos = creditos
        totals = Entry.objects.filter(transaction=self).aggregate(  # pylint: disable=no-member
            total_debit=Sum('amount', filter=Q(type='Debit')),
            total_credit=Sum('amount', filter=Q(type='Credit'))
        )
        total_debit = totals['total_debit'] or 0
        total_credit = totals['total_credit'] or 0

        if total_debit != total_credit:
            raise ValidationError(
                f'La transacción no está balanceada: Débitos = {total_debit}, Créditos = {total_credit}'
            )

    def save(self, *args, **kwargs):
        if not self.pk:
            super().save(*args, **kwargs)
        self.clean()
        if self.pk:
            super().save(*args, **kwargs)




    """ def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs) """

    def __str__(self):
        return f'Transaction {self.id} - {self.description}'


class Entry(models.Model):
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=10, choices=[('Debit', 'Debit'), ('Credit', 'Credit')])

    def __str__(self):
        return f'{self.type} - {self.account.name} - {self.amount}'
