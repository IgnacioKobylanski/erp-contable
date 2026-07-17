from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,permissions
from .pagination import StandardResultsSetPagination
from accounting.reports.balance_sheet import generate_balance_sheet
from accounting.reports.journal import generate_journal
from accounting.reports.ledger import generate_ledger
from accounting.reports.income_statement import generate_income_statement
from .serializers import (
    BalanceSheetSerializer,
    JournalSerializer,
    LedgerSerializer,
    IncomeStatementSerializer,
    TotalsSerializer,
)
from drf_spectacular.utils import extend_schema
from accounting.reports.totals import generate_totals
from drf_spectacular.utils import extend_schema, OpenApiParameter

class BalanceSheetView(APIView):
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.AllowAny] 

    @extend_schema(
        responses=BalanceSheetSerializer(many=True),
        description="Obtiene el balance general paginado."
    )
    def get(self, request):
        try:
            balance = generate_balance_sheet()
            if not balance:
                return Response({"message": "No hay datos para el balance."}, status=status.HTTP_404_NOT_FOUND)

            data = [{'account': k, 'balance': v} for k, v in balance.items()]
            paginator = self.pagination_class()
            page = paginator.paginate_queryset(data, request, view=self)

            serializer = BalanceSheetSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        except Exception:
            return Response({"error": "Error interno del servidor."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class JournalView(APIView):
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        parameters=[
            OpenApiParameter('date_from', str, description='Fecha desde (YYYY-MM-DD), inclusive'),
            OpenApiParameter('date_to', str, description='Fecha hasta (YYYY-MM-DD), inclusive'),
        ],
        responses=JournalSerializer(many=True),
        description="Obtiene los registros del diario contable paginados, opcionalmente filtrados por fecha."
    )
    def get(self, request):
        try:
            date_from = request.query_params.get('date_from')
            date_to = request.query_params.get('date_to')
            data = generate_journal(date_from=date_from, date_to=date_to)
            if not data:
                return Response({"message": "No hay datos para el diario."}, status=status.HTTP_404_NOT_FOUND)

            paginator = self.pagination_class()
            page = paginator.paginate_queryset(data, request, view=self)

            serializer = JournalSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        except Exception:
            return Response({"error": "Error interno del servidor."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LedgerView(APIView):
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        parameters=[
            OpenApiParameter('date_from', str, description='Fecha desde (YYYY-MM-DD), inclusive'),
            OpenApiParameter('date_to', str, description='Fecha hasta (YYYY-MM-DD), inclusive'),
        ],
        responses=LedgerSerializer(many=True),
        description="Obtiene los movimientos del libro mayor paginados, opcionalmente filtrados por fecha."
    )
    def get(self, request):
        try:
            date_from = request.query_params.get('date_from')
            date_to = request.query_params.get('date_to')
            data = generate_ledger(date_from=date_from, date_to=date_to)
            if not data:
                return Response({"message": "No hay datos para el libro mayor."}, status=status.HTTP_404_NOT_FOUND)

            paginator = self.pagination_class()
            page = paginator.paginate_queryset(data, request, view=self)

            serializer = LedgerSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        except Exception:
            return Response({"error": "Error interno del servidor."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class IncomeStatementView(APIView):
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.AllowAny] 

    @extend_schema(
        responses=IncomeStatementSerializer,
        description="Obtiene el estado de resultados."
    )
    def get(self, request):
        try:
            data = generate_income_statement()
            if not data:
                return Response({"message": "No hay datos para el estado de resultados."}, status=status.HTTP_404_NOT_FOUND)

            serializer = IncomeStatementSerializer(data)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception:
            return Response({"error": "Error interno del servidor."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TotalsView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        responses=TotalsSerializer,
        description="Obtiene la suma total de débitos y créditos de todo el libro contable."
    )
    def get(self, request):
        try:
            data = generate_totals()
            serializer = TotalsSerializer(data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Error interno del servidor."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)