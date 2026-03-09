import type { Entry } from "./entry.types";

export interface Transaction {
    id: number;
    date: string; 
    description: string;
    entries?: Entry[]; 
}