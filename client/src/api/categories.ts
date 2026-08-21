import { apiClient } from './client'
import type { Category, PaginatedResponse, ApiResponse, DeleteResponse } from '../types/api'

export interface CreateCategoryInput {
	name: string;
	icon?: string;
	color?: string;
	type?: 'INCOME' | 'EXPENSE';
}

export const categoriesApi = {
	getAll: async (params?: { type?: 'INCOME' | 'EXPENSE'; limit?: number; }) => {
		const response = await apiClient.get<PaginatedResponse<Category>>('/categories', { params });
		return response.data;
	},
	
	getById: async (id: string) => {
		const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
		return response.data;
	},

	create: async (data: CreateCategoryInput) => {
		const response = await apiClient.post<ApiResponse<Category>>('/categories', data);
		return response.data;
	},

	update: async (id: string, data: Partial<CreateCategoryInput>) => {
		const response = await apiClient.put<ApiResponse<Category>>(`/categories/${id}`, data);
		return response.data;
	},

	delete: async (id: string) => {
		const response = await apiClient.delete<DeleteResponse>(`/categories/${id}`);
		return response.data;
	},
};