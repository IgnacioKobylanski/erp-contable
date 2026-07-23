from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Sum, Q
from django.db.models.signals import m2m_changed
from django.dispatch import receiver


class AccountTag(models.Model):
    """
    Etiqueta de clasificación gerencial/analítica para cuentas.
    No forma parte del Plan de Cuentas contable en sí —
    es una capa de metadata para análisis (fijo/variable,
    centro de costo, área, etc.), separada del dominio contable.
    """
    name = models.CharField(max_length=100)
    category = models.CharField(
        max_length=50,
        help_text="Agrupador del tag, ej: 'Naturaleza del gasto', 'Centro de Costo', 'Área'"
    )

    class Meta:
        unique_together = ('name', 'category')

    def __str__(self):
        return f"{self.category}: {self.name}"


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

    tags = models.ManyToManyField(AccountTag, blank=True, related_name='accounts')

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


@receiver(m2m_changed, sender=Account.tags.through)
def validate_account_tag_uniqueness(sender, instance, action, pk_set, **kwargs):
    if action == 'pre_add':
        current_tags = list(instance.tags.all())
        new_tags = AccountTag.objects.filter(pk__in=pk_set)

        categories_seen = {tag.category for tag in current_tags}
        for tag in new_tags:
            if tag.category in categories_seen:
                raise ValidationError(
                    f"No se puede asignar más de un tag de la categoría '{tag.category}' a la misma cuenta."
                )
            categories_seen.add(tag.category)