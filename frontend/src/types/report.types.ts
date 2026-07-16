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
    entries: LedgerEntry[];
}

export interface IncomeStatement {
    total_income: string;
    total_expense: string;
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