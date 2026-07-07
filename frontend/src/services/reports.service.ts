import api from './api';
import type {
  BalanceSheetItem,
  JournalRecord,
  LedgerRecord,
  IncomeStatement,
  PaginatedResponse,
} from '../types';

export const getBalanceSheet = async (): Promise<PaginatedResponse<BalanceSheetItem>> => {
  const response = await api.get<PaginatedResponse<BalanceSheetItem>>('/reports/balance-sheet/');
  return response.data;
};

export const getJournal = async (): Promise<PaginatedResponse<JournalRecord>> => {
  const response = await api.get<PaginatedResponse<JournalRecord>>('/reports/journal/');
  return response.data;
};

export const getLedger = async (): Promise<PaginatedResponse<LedgerRecord>> => {
  const response = await api.get<PaginatedResponse<LedgerRecord>>('/reports/ledger/');
  return response.data;
};

export const getIncomeStatement = async (): Promise<IncomeStatement> => {
  const response = await api.get<IncomeStatement>('/reports/income-statement/');
  return response.data;
};