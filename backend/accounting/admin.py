from django.contrib import admin
from .models import Account, Transaction, Entry

class EntryInline(admin.TabularInline):
    model = Entry
    extra = 2 
    fields = ('account', 'amount', 'type')

@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'description')
    list_filter = ('type',)
    search_fields = ('name',)

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'date', 'description')
    search_fields = ('description',)
    inlines = [EntryInline]

@admin.register(Entry)
class EntryAdmin(admin.ModelAdmin):
    list_display = ('transaction', 'account', 'amount', 'type')
    list_filter = ('type', 'account')
