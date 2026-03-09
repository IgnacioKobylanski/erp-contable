export type EntryType = 'Debit' | 'Credit';

export interface Entry {
    id: number;
    transaction: number; 
    account: number;     
    amount: number;      
    type: EntryType;
}