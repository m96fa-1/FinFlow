import { apiClient } from './client'
import type { Transaction, PaginatedResponse, ApiResponse, DeleteResponse } from '../types/api'

export interface CreateTransactionInput {
	categoryId: string;
	amount: number;
	type?: 'INCOME' | 'EXPENSE';
	date?: string;
	description?: string;
}

export const transactionsApi = {
	getAll: async (params?: { categoryId?: string; type?: 'INCOME' | 'EXPENSE'; limit?: number }) => {
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
		const response = await apiClient.delete<DeleteResponse>(`/transactions/${id}`);
		return response.data;
	},
};