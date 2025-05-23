from rest_framework.views import APIView
from rest_framework.response import Response
from accounting.reports.balance_sheet import generate_balance_sheet
from accounting.reports.journal import generate_journal
from accounting.reports.ledger import generate_ledger
from accounting.reports.income_statement import generate_income_statement

class BalanceSheetView(APIView):
    def get(self, request):
        balance = generate_balance_sheet()
        data = [{'account': k, 'balance': v} for k, v in balance.items()]
        return Response(data)
    


class JournalView(APIView):
    def get(self, request):
        data = generate_journal()
        return Response(data)


class LedgerView(APIView):
    def get(self, request):
        data = generate_ledger()
        return Response(data)
    

class IncomeStatementView(APIView):
    def get(self, request):
        data = generate_income_statement()
        return Response(data)