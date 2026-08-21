import { apiClient } from './client'
import type { Budget, ApiResponse, BudgetPaginatedResponse, DeleteResponse } from '../types/api'

export interface CreateBudgetInput {
	category: string;
	limitAmount: number;
	period?: string;
	month: number;
	year: number;
}

export const budgetsApi = {
	getAll: async (params?: { month?: number; year?: number }) => {
		const response = await apiClient.get<BudgetPaginatedResponse>('/budgets', { params });
		return response.data;
	},

	getById: async (id: string) => {
		const response = await apiClient.get<ApiResponse<Budget>>(`/budgets/${id}`);
		return response.data;
	},

	createOrUpdate: async (data: CreateBudgetInput) => {
		const response = await apiClient.post<ApiResponse<Budget>>('/budgets', data);
		return response.data;
	},

	update: async (id: string, data: Partial<Budget>) => {
		const response = await apiClient.put<ApiResponse<Budget>>(`/budgets/${id}`, data);
		return response.data;
	},

	delete: async (id: string) => {
		const response = await apiClient.delete<DeleteResponse>(`/budgets/${id}`);
		return response.data;
	},
};