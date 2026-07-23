from django import forms
from django.contrib import admin
from .models import Account, Transaction, Entry, AccountTag


class AccountAdminForm(forms.ModelForm):
    class Meta:
        model = Account
        fields = '__all__'

    def clean_tags(self):
        tags = self.cleaned_data.get('tags')
        categories_seen = []
        for tag in tags:
            if tag.category in categories_seen:
                raise forms.ValidationError(
                    f"No se puede asignar más de un tag de la categoría '{tag.category}' a la misma cuenta."
                )
            categories_seen.append(tag.category)
        return tags


class EntryInline(admin.TabularInline):
    model = Entry
    extra = 2
    fields = ('account', 'amount', 'type')

@admin.register(AccountTag)
class AccountTagAdmin(admin.ModelAdmin):
    list_display = ('category', 'name')
    list_filter = ('category',)
    search_fields = ('name', 'category')

@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    form = AccountAdminForm
    list_display = ('name', 'type', 'description')
    list_filter = ('type', 'tags')
    search_fields = ('name',)
    filter_horizontal = ('tags',)

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'date', 'description')
    search_fields = ('description',)
    inlines = [EntryInline]

@admin.register(Entry)
class EntryAdmin(admin.ModelAdmin):
    list_display = ('transaction', 'account', 'amount', 'type')
    list_filter = ('type', 'account')