import type { AccountType } from '../types';

export const accountTypeColorClass: Record<AccountType, string> = {
  Asset: 'typeAsset',
  Liability: 'typeLiability',
  Equity: 'typeEquity',
  Income: 'typeIncome',
  Expense: 'typeExpense',
};

export const accountTypeLabel: Record<AccountType, string> = {
  Asset: 'Activo',
  Liability: 'Pasivo',
  Equity: 'Patrimonio',
  Income: 'Ingreso',
  Expense: 'Egreso',
};