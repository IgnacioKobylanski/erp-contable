import type { AccountType } from '../types';

export const accountTypeColorClass: Record<AccountType, string> = {
  Asset: 'typeAsset',
  Liability: 'typeLiability',
  Equity: 'typeEquity',
  Income: 'typeIncome',
  Expense: 'typeExpense',
};