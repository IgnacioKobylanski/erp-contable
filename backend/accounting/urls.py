from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AccountViewSet, TransactionViewSet, EntryViewSet, balance_sheet_view

router = DefaultRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'entries', EntryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('balance-sheet/', balance_sheet_view, name='balance-sheet'),
]