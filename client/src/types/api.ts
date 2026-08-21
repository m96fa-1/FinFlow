export type TransactionType = 'INCOME' | 'EXPENSE';
export type BudgetPeriod = 'MONTHLY' | 'YEARLY';

export interface User {
	id:									string;
	fullName:						string;
	email:							string;
	createdAt:					string;
}

export interface Category {
	id:									string;
	userId:							string | null;
	name:								string;
	icon:								string | null;
	color:							string | null;
	type:								TransactionType;
	_count:							{ transactions: number; budgets: number; };
}

export interface Transaction {
	id:									string;
	userId:							string;
	categoryId:					string;
	amount:							number;
	type:								TransactionType;
	date:								string;
	description:				string | null;
	createdAt:					string;

	category:						Category;
}

export interface Budget {
	id:									string;
	userId:							string;
	categoryId:					string;
	limitAmount:				number;
	period:							BudgetPeriod;
	month:							number;
	year:								number;
	createdAt:					string;

	category:						Category;
	
	spentAmount?:				number;
	remainingAmount?:		number;
	isOverBudget?:			boolean;
}

export interface AuthResponse {
	success:						boolean;
	message:						string;
	token:							string;
	user:								User;
}

export interface UserResponse {
	success:						boolean;
	user:								User;
}

export interface PaginatedResponse<T> {
	success:						boolean;
	count:							number;
	data:								T[];
}

export interface ApiResponse<T> {
	success:						boolean;
	message?:						string;
	data:								T;
}

export interface DeleteResponse {
	success:						boolean;
	message:						string;
}

export interface BudgetPaginatedResponse {
	success:						boolean;
	period:							{ month: number; year: number };
	count:							number;
	data:								Budget[];
}