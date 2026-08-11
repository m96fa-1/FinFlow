import { apiClient } from './client'
import type { Transaction, PaginatedResponse, ApiResponse } from '../types/api'

export interface CreateTransactionInput {
  amount: number;
  category: string;
  description?: string;
  date?: string;
  type?: 'EXPENSE' | 'INCOME';
}

export const transactionsApi = {
  getAll: async (params?: { category?: string; limit?: number }) => {
    const response = await apiClient.get<PaginatedResponse<Transaction>>('/transactions', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Transaction>>(`/transactions/${id}`);
    return response.data;
  },

  create: async (data: CreateTransactionInput) => {
    const response = await apiClient.post<ApiResponse<Transaction>>('/transactions', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateTransactionInput>) => {
    const response = await apiClient.put<ApiResponse<Transaction>>(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/transactions/${id}`);
    return response.data;
  },
};