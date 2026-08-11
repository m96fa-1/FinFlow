export interface User {
	id: string;
	fullName: string;
	email: string;
	createdAt: string;
}

export interface Transaction {
	id: string;
	userId: string;
	amount: number;
	category: string;
	date: string;
	description: string;
}

export interface Budget {
	id: string;
	userId: string;
	category: string;
	limitAmount: number;
	period: string;
	
	spentAmount?: number;
	remainingAmount?: number;
	isOverBudget?: boolean;
}

export interface AuthResponse {
	success: boolean;
	message: string;
	token: string;
	user: User;
}

export interface ApiResponse<T> {
	success: boolean;
	message?: string;
	data: T;
}

export interface PaginatedResponse<T> {
	success: boolean;
	count: number;
	data: T[];
}