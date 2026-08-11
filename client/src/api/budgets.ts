import { apiClient } from './client'
import type { Budget } from '../types/api'

export interface CreateBudgetInput {
  category: string;
  limitAmount: number;
  period?: string;
}

export const budgetsApi = {
  getAll: async (params?: { month?: number; year?: number }) => {
    const response = await apiClient.get<{
      success: boolean;
      period: { month: number; year: number };
      data: Budget[];
    }>('/budgets', { params });
    return response.data;
  },

  createOrUpdate: async (data: CreateBudgetInput) => {
    const response = await apiClient.post<{ success: boolean; data: Budget }>('/budgets', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Budget>) => {
    const response = await apiClient.put<{ success: boolean; data: Budget }>(`/budgets/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/budgets/${id}`);
    return response.data;
  },
};