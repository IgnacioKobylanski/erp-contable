import api from './api';
import type { Transaction } from '../types';

export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get<Transaction[]>('/transactions/');
  return response.data;
};

export const createTransaction = async (transaction: any): Promise<Transaction> => {
  const response = await api.post<Transaction>('/transactions/', transaction);
  return response.data;
};