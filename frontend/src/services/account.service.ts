import api from './api';
import type { Account, AccountPayload } from '../types';

export const getAccounts = async (): Promise<Account[]> => {
  const response = await api.get<Account[]>('/accounts/');
  return response.data;
};

export const getAccount = async (id: number): Promise<Account> => {
  const response = await api.get<Account>(`/accounts/${id}/`);
  return response.data;
};

export const createAccount = async (account: AccountPayload): Promise<Account> => {
  const response = await api.post<Account>('/accounts/', account);
  return response.data;
};

export const updateAccount = async (id: number, account: AccountPayload): Promise<Account> => {
  const response = await api.put<Account>(`/accounts/${id}/`, account);
  return response.data;
};

export const deleteAccount = async (id: number): Promise<void> => {
  await api.delete(`/accounts/${id}/`);
};