from django.urls import path
from .views import BalanceSheetView, JournalView,LedgerView, IncomeStatementView

urlpatterns = [
    path('reports/balance-sheet/', BalanceSheetView.as_view(), name='balance-sheet'),
    path('reports/journal/', JournalView.as_view(), name='journal'),
    path('reports/ledger/', LedgerView.as_view(), name='ledger'),
    path('reports/income-statement/', IncomeStatementView.as_view(), name='income-statement'),
]
