export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';

export interface Account {
    id: number;
    code: string;
    name: string;
    type: AccountType;
    description?: string; 
    parent?: number | null; 
}