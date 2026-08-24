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
			const [transactionRes, budgetRes] = await Promise.all([
				transactionsApi.getAll(),
				budgetsApi.getAll({ month: new Date().getMonth() + 1, year: new Date().getFullYear() }),
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