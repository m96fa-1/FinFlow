import { apiClient } from './client'
import type { AuthResponse, UserResponse } from '../types/api'

export const authApi = {
	register: async (data: { fullName: string; email: string; password: string }) => {
		const response = await apiClient.post<AuthResponse>('/auth/register', data);
		return response.data;
	},

	login: async (data: { email: string; password: string }) => {
		const response = await apiClient.post<AuthResponse>('/auth/login', data);
		return response.data;
	},

	getCurrentUser: async () => {
		const response = await apiClient.get<UserResponse>('/auth/user');
		return response.data;
	},
};