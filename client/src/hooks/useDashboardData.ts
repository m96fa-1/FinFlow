import React from 'react'
import { transactionsApi } from '../api/transactions'
import { budgetsApi } from '../api/budgets'
import type { Transaction, Budget } from '../types/api'

export interface DashboardData {
	transactions: Transaction[];
	budgets: Budget[];
	loading: boolean;
}

export function useDashboardData() {
	const [data, setData] = React.useState<DashboardData>({
		transactions: [],
		budgets: [],
		loading: true,
	});

	React.useEffect(() => {
		async function fetchDashboard() {
			const now = new Date();
			
			const [transactionRes, budgetRes] = await Promise.all([
				transactionsApi.getAll(),
				budgetsApi.getAll({ month: now.getUTCMonth() + 1, year: now.getUTCFullYear() }),
			]);

			setData({
				transactions: transactionRes.data,
				budgets: budgetRes.data,
				loading: false,
			});
		}
		fetchDashboard();
	}, []);

	return data;
}