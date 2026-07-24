import api from './api';
import type {
  BalanceSheetItem,
  JournalRecord,
  LedgerRecord,
  IncomeStatement,
  Totals,
  PaginatedResponse,
  Cashflow,
} from '../types';

interface DateRangeParams {
  dateFrom?: string;
  dateTo?: string;
}

export const getBalanceSheet = async (): Promise<PaginatedResponse<BalanceSheetItem>> => {
  const response = await api.get<PaginatedResponse<BalanceSheetItem>>('/reports/balance-sheet/');
  return response.data;
};

export const getJournal = async (params?: DateRangeParams): Promise<PaginatedResponse<JournalRecord>> => {
  const response = await api.get<PaginatedResponse<JournalRecord>>('/reports/journal/', {
    params: {
      date_from: params?.dateFrom || undefined,
      date_to: params?.dateTo || undefined,
    },
  });
  return response.data;
};

export const getLedger = async (params?: DateRangeParams): Promise<PaginatedResponse<LedgerRecord>> => {
  const response = await api.get<PaginatedResponse<LedgerRecord>>('/reports/ledger/', {
    params: {
      date_from: params?.dateFrom || undefined,
      date_to: params?.dateTo || undefined,
    },
  });
  return response.data;
};

export const getIncomeStatement = async (): Promise<IncomeStatement> => {
  const response = await api.get<IncomeStatement>('/reports/income-statement/');
  return response.data;
};

export const getTotals = async (): Promise<Totals> => {
  const response = await api.get<Totals>('/reports/totals/');
  return response.data;
};

export const getCashflow = async (params?: DateRangeParams): Promise<Cashflow> => {
  const response = await api.get<Cashflow>('/reports/cashflow/', {
    params: {
      date_from: params?.dateFrom || undefined,
      date_to: params?.dateTo || undefined,
    },
  });
  return response.data;
};