import api from './api';
import type { Account } from '../types';

export const getAccounts = async (): Promise<Account[]> => {
  const response = await api.get<Account[]>('/accounts/');
  return response.data;
};

export const createAccount = async (account: Omit<Account, 'id'>): Promise<Account> => {
  const response = await api.post<Account>('/accounts/', account);
  return response.data;
};