import os
import django

# Configurar el entorno Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erp_contable_backend.settings')
django.setup()

from accounting.models import Account, Transaction, Entry
from django.core.exceptions import ValidationError

def main():
    # Crear cuentas
    cash = Account.objects.create(name="Cash", type="Asset", description="Caja chica") # pylint: disable=no-member
    income = Account.objects.create(name="Income", type="Income", description="Ingresos varios") # pylint: disable=no-member

    # Crear transacción balanceada
    transaction = Transaction(description="Venta de producto")
    transaction.save()

    Entry.objects.create(transaction=transaction, account=cash, amount=100, type="Debit") # pylint: disable=no-member
    Entry.objects.create(transaction=transaction, account=income, amount=100, type="Credit") # pylint: disable=no-member

    try:
        transaction.clean()
        print("Transacción balanceada correctamente")
    except ValidationError as e:
        print("Error de validación:", e)

    # Crear transacción no balanceada para test
    transaction2 = Transaction(description="Transacción no balanceada")
    transaction2.save()

    Entry.objects.create(transaction=transaction2, account=cash, amount=100, type="Debit") # pylint: disable=no-member
    Entry.objects.create(transaction=transaction2, account=income, amount=50, type="Credit") # pylint: disable=no-member
    try:
        transaction2.clean()
    except ValidationError as e:
        print("Error esperado en transacción no balanceada:", e)

if __name__ == "__main__":
    main()