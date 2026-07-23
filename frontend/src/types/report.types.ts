export interface BalanceSheetItem {
    account: string;
    balance: string;
}

export interface JournalEntry {
    account: string;
    type: 'debit' | 'credit';
    amount: string;
}

export interface JournalRecord {
    transaction_id: number;
    date: string;
    description: string;
    entries: JournalEntry[];
}

export interface LedgerEntry {
  date: string;
  description: string;
  type: 'debit' | 'credit';
  amount: string;
  running_balance: string;
}

export interface LedgerRecord {
  account: string;
  opening_balance: string;
  entries: LedgerEntry[];
}

export interface IncomeAccount {
  account: string;
  amount: string;
  percentage: string;
}

export interface ExpenseAccount {
  account: string;
  amount: string;
  percentage: string;
  expense_nature: string | null;
}

export interface IncomeStatement {
  income_accounts: IncomeAccount[];
  expense_accounts: ExpenseAccount[];
  total_income: string;
  total_expense: string;
  total_fixed_expense: string;
  total_variable_expense: string;
  net_result: string;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface Totals {
  total_debit: string;
  total_credit: string;
  is_balanced: boolean;
}