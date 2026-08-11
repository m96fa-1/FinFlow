import { apiClient } from './client'
import type { User } from '../types/api'

export const authApi = {
	register: async (data: { fullName: string; email: string; password: string }) => {
		const response = await apiClient.post('/auth/register', data);
		return response.data;
	},

	login: async (data: { email: string; password: string }) => {
		const response = await apiClient.post('/auth/login', data);
		return response.data;
	},

	getCurrentUser: async () => {
		const response = await apiClient.get<{ success: boolean; user: User }>('/auth/user');
		return response.data;
	},
};