import api from './api';
import type { Transaction, TransactionPayload } from '../types';

export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get<Transaction[]>('/transactions/');
  return response.data;
};

export const getTransaction = async (id: number): Promise<Transaction> => {
  const response = await api.get<Transaction>(`/transactions/${id}/`);
  return response.data;
};

export const createTransaction = async (transaction: TransactionPayload): Promise<Transaction> => {
  const response = await api.post<Transaction>('/transactions/', transaction);
  return response.data;
};

export const updateTransaction = async (id: number, transaction: TransactionPayload): Promise<Transaction> => {
  const response = await api.put<Transaction>(`/transactions/${id}/`, transaction);
  return response.data;
};

export const deleteTransaction = async (id: number): Promise<void> => {
  await api.delete(`/transactions/${id}/`);
};