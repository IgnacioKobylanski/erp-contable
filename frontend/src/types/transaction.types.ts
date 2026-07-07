import type { Entry, EntryPayload } from "./entry.types";

export interface Transaction {
    id: number;
    date: string;
    description: string;
    entries: Entry[];
}

export interface TransactionPayload {
    description: string;
    entries: EntryPayload[];
}