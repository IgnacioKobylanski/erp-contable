export type EntryType = 'Debit' | 'Credit';

export interface Entry {
    id: number;
    transaction: number;
    account_id: number;
    amount: string;
    type: EntryType;
}

export interface EntryPayload {
    account_id: number;
    amount: string;
    type: EntryType;
}