from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Account, Transaction, Entry
from .serializers import AccountSerializer, TransactionSerializer, EntrySerializer
from .reports import generate_balance_sheet

class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [permissions.AllowAny]

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.AllowAny]

class EntryViewSet(viewsets.ModelViewSet):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
    permission_classes = [permissions.AllowAny]

@api_view(['GET'])
def balance_sheet_view(request):
    """
    Returns the calculated balance sheet.
    """
    try:
        data = generate_balance_sheet()
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)