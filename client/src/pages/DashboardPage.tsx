import React from 'react'
import { Link } from 'react-router-dom'

import { useDashboardData, type DashboardData } from '../hooks/useData'
import type { Transaction, Budget } from '../types/api'

import DashboardLayout from '../layouts/DashboardLayout'
import AddTransactionButton from '../components/AddTransactionButton'
import ContextPill from '../components/ContextPill'
import { LineChart, PieChart } from '../components/Charts'

import { BanknoteArrowDown, Layers, Landmark, PiggyBank } from 'lucide-react'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'

export default function DashboardPage() {
	const data = useDashboardData();

	if (data.loading) {
		return (
			<DashboardLayout>
				<div className='h-full flex items-center justify-center'>
					<div className='loading-circle' />
				</div>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout>
			<div className='flex items-center justify-between'>
				<AddTransactionButton />
				<ContextPill />
			</div>

			<KeyMetricsSummary data={data} />

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				<MonthlySpendingChart transactions={data.transactions} />
				<CategoryBreakdown transactions={data.transactions} />
				<RecentTransactions transactions={data.transactions} />
				<TopBudgets budgets={data.budgets} />
			</div>
		</DashboardLayout>
	);
}

const KeyMetricsSummary = ({ data }: { data: DashboardData; }) => {
	const metricsData = React.useMemo(() => {
		const now = new Date();
		const currentYear = now.getUTCFullYear();
		const currentMonth = now.getUTCMonth();

		const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
		const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

		let totalIncome = 0;
		let totalExpense = 0;
		let monthIncome = 0;
		let monthExpenses = 0;
		let lastMonthIncome = 0;
		let lastMonthExpenses = 0;

		data.transactions.forEach(tx => {
			if (tx.category.type === 'INCOME') {
				totalIncome += tx.amount;
			} else {
				totalExpense += tx.amount;
			}
			
			const d = new Date(tx.date);
			const year = d.getUTCFullYear();
			const month = d.getUTCMonth();

			if (year === currentYear && month === currentMonth) {
				if (tx.category.type === 'INCOME') monthIncome += tx.amount;
				else monthExpenses += tx.amount;
			} else if (year === lastMonthYear && month === lastMonth) {
				if (tx.category.type === 'INCOME') lastMonthIncome += tx.amount;
				else lastMonthExpenses += tx.amount;
			}
		});

		let bSpents = 0;
		let bLimits = 0;

		data.budgets.forEach(budget => {
			if (budget.year === currentYear && budget.month - 1 === currentMonth) {
				bSpents += budget.isOverBudget ? budget.limitAmount : budget.spentAmount!;
				bLimits += budget.limitAmount;
			}
		});

		const balance = (totalIncome - totalExpense).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
		const bPercent = bLimits > 0 ? Math.round(bSpents / bLimits * 100) : 0;
		const savingsRate = monthIncome > 0 ? Math.round((monthIncome - monthExpenses) / monthIncome * 100) : 0;
		const lastSavingsRate = lastMonthIncome > 0 ? Math.round((lastMonthIncome - lastMonthExpenses) / lastMonthIncome * 100) : 0;

		return {
			totalBalance: {
				amount: balance,
				changeValue: '',
				changeStatus: 'positive',
				noteStatus: 'positive',
			},
			monthlySpending: {
				amount: monthExpenses.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
				changeValue: `${monthExpenses > lastMonthExpenses ? '+' : ''}$${Math.round(monthExpenses - lastMonthExpenses)}`,
				changeStatus: monthExpenses > lastMonthExpenses ? 'negative' : 'positive',
				noteStatus: monthExpenses > lastMonthExpenses ? 'negative' : 'positive',
			},
			budgetUsed: {
				amount: `${bPercent}%`,
				changeValue: (bLimits - bSpents).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
				changeStatus: 'neutral',
				noteStatus: bPercent < 80 ? 'positive' : 'negative',
			},
			savingsRate: {
				amount: `${savingsRate}%`,
				changeValue: `${savingsRate > lastSavingsRate ? '+' : ''}${parseFloat((savingsRate - lastSavingsRate).toFixed(2))}%`,
				changeStatus: savingsRate > lastSavingsRate ? 'positive' : 'negative',
				noteStatus: savingsRate >= 25 ? 'positive' : 'negative',
			},
		};
	}, [data]);

	const metrics = [
		{
			title: 'Total Balance',
			amount: metricsData.totalBalance.amount,
			changeValue: metricsData.totalBalance.changeValue,
			changeText: 'Across all Accounts',
			changeStatus: metricsData.totalBalance.changeStatus,
			note: 'Active Accounts',
			noteStatus: metricsData.totalBalance.noteStatus,
			lucideElement: <Landmark strokeWidth='1.5' className='text-bluish-cyan' />
		},
		{
			title: 'Monthly Spending',
			amount: metricsData.monthlySpending.amount,
			changeValue: metricsData.monthlySpending.changeValue,
			changeText: 'vs last month',
			changeStatus: metricsData.monthlySpending.changeStatus,
			note: 'Manual & Linked',
			noteStatus: metricsData.monthlySpending.noteStatus,
			lucideElement: <BanknoteArrowDown strokeWidth='1.5' className='text-bluish-cyan' />
		},
		{
			title: 'Budgets Used',
			amount: metricsData.budgetUsed.amount,
			changeValue: metricsData.budgetUsed.changeValue,
			changeText: 'remaining',
			changeStatus: metricsData.budgetUsed.changeStatus,
			note: 'Target < 80%',
			noteStatus: metricsData.budgetUsed.noteStatus,
			lucideElement: <Layers strokeWidth='1.5' className='text-bluish-cyan' />
		},
		{
			title: 'Savings Rate',
			amount: metricsData.savingsRate.amount,
			changeValue: metricsData.savingsRate.changeValue,
			changeText: 'vs last month',
			changeStatus: metricsData.savingsRate.changeStatus,
			note: 'Goal 25%',
			noteStatus: metricsData.savingsRate.noteStatus,
			lucideElement: <PiggyBank strokeWidth='1.5' className='text-bluish-cyan' />
		},
	];

	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
			{metrics.map((metric, index) => (
				<div key={index} className='rounded-xl shadow-sm transition-shadow hover:shadow-md'>
					<div className='bg-white p-4 rounded-t-xl border-x border-t border-gray-100'>
						<div className='flex items-center justify-between mb-2'>
							<span className='text-sm font-medium text-gray-500'>{metric.title}</span>
							{metric.lucideElement}
						</div>
						<div className='text-2xl font-bold text-gray-900'>{metric.amount}</div>
						<div className='text-xs mt-2 text-gray-600 font-medium'>
							<span className={metric.changeStatus === 'positive' ? 'text-emerald-600' : metric.changeStatus === 'negative' ? 'text-red-500' : 'text-black'}>
								{metric.changeValue}
							</span>
							{' ' + metric.changeText}
						</div>
					</div>
					<div className={`p-2.5 ${metric.noteStatus === 'positive' ? 'bg-green-200' : 'bg-[#ffc0c0]'} text-sm text-center rounded-b-xl`}>{metric.note}</div>
				</div>
			))}
		</div>
	);
};

const MonthlySpendingChart = ({ transactions }: { transactions: Transaction[] }) => {
	const [timeRange, setTimeRange] = React.useState<'6M' | '1Y' | 'All'>('6M');

	const data = React.useMemo(() => {
		const expenseTransactions = transactions.filter(tx => tx.category.type === 'EXPENSE');
		if (expenseTransactions.length === 0) return [];

		const now = new Date();
		const currentYear = now.getUTCFullYear();
		const currentMonth = now.getUTCMonth();

		let monthCount = 6;

		if (timeRange === '1Y') {
			monthCount = 13;
		} else if (timeRange === 'All') {
			// It's already ordered in dates from the api call so last transacion in the array is the oldest one
			const oldestDate = new Date(expenseTransactions[expenseTransactions.length - 1].date);
			
			monthCount = (currentYear - oldestDate.getUTCFullYear()) * 12 + (currentMonth - oldestDate.getUTCMonth()) + 1;
			monthCount = Math.max(monthCount, 1);
		}

		const monthlyTotals: Record<string, { xv: string; yv: number }> = {};

		for (let i = monthCount - 1; i >= 0; i--) {
			const d = new Date(Date.UTC(currentYear, currentMonth - i, 1));
			const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
			const monthLabel = d.toLocaleString('en-US', { timeZone: 'UTC', year: '2-digit', month: 'short' });
			
			monthlyTotals[key] = { xv: monthLabel, yv: 0 };
		}

		expenseTransactions.forEach((tx) => {
			const txDate = new Date(tx.date);
			const key = `${txDate.getUTCFullYear()}-${txDate.getUTCMonth()}`;

			if (monthlyTotals[key]) {
				monthlyTotals[key].yv += tx.amount;
				monthlyTotals[key].yv = Number(monthlyTotals[key].yv.toFixed(2));
			}
		});

		return Object.values(monthlyTotals);
	}, [transactions, timeRange]);

	return (
		<div className='lg:col-span-2 min-h-80 p-6 flex flex-col justify-between bg-white rounded-xl border border-gray-100 shadow-sm'>
			<div className='flex items-center justify-between mb-4'>
				<h2 className='text-gray-800 text-lg font-semibold'>Monthly Spending History</h2>
				<div className='flex gap-4 text-xs font-medium text-gray-400'>
					{(['6M', '1Y', 'All'] as ('6M' | '1Y' | 'All')[]).map(range => (
						<button
							key={range}
							onClick={() => setTimeRange(range)}

							className={`rounded-md transition-all ${
								timeRange === range
									? 'bg-white text-bluish-cyan font-semibold'
									: 'hover:text-gray-600'
							}`}
						>
							{range}
						</button>
					))}
				</div>
			</div>
			<div className='flex-1'>
				{transactions.length > 0 ? (
					<LineChart data={data} />
				) : (
					<div>Empty</div>
				)}
			</div>
		</div>
	);
};

const CategoryBreakdown = ({ transactions }: { transactions: Transaction[] }) => {
	const { data, icons } = React.useMemo(() => {
		const now = new Date();
		const currentYear = now.getUTCFullYear();
		const currentMonth = now.getUTCMonth();

		const monthExpenses = transactions.filter((tx) => {
			if (tx.category.type !== 'EXPENSE') return false;
			const d = new Date(tx.date);
			return d.getUTCFullYear() === currentYear && d.getUTCMonth() === currentMonth;
		});

		const totalSpent = monthExpenses.reduce((sum, tx) => sum + tx.amount, 0);

		if (totalSpent === 0) {
			return { data: [], icons: [] };
		}

		const categoryMap: Record<string, { name: string; value: number; fill: string, icon: string }> = {};

		monthExpenses.forEach(tx => {
			const catName = tx.category.name;
			if (!categoryMap[catName]) {
				categoryMap[catName] = {
					name: catName,
					value: 0,
					fill: tx.category.color || '#2b8dae',
					icon: tx.category.icon || 'box',
				};
			}
			categoryMap[catName].value += tx.amount;
		});

		const sorted = Object.values(categoryMap).sort((a, b) => b.value - a.value);

		// Group top 4 categories, merging remainder into "Other"
		let finalCategories = sorted;
		if (sorted.length > 4) {
			const top4 = sorted.slice(0, 4);
			const otherAmount = sorted.slice(4).reduce((sum, item) => sum + item.value, 0);

			finalCategories = [
				...top4,
				{
					name: 'Other',
					value: otherAmount,
					fill: '#01E19A',
					icon: 'circle'
				},
			];
		}

		const formatted = finalCategories.map(item => {
			const percentage = Math.round(item.value / totalSpent * 100);
			return {
				name: item.name,
				value: percentage,
				fill: item.fill,
			};
		});

		const icons = finalCategories.map(item => item.icon);

		return {
			data: formatted,
			icons,
		};
	}, [transactions]);

	return (
		<div className='lg:col-span-1 p-6 bg-white rounded-xl border border-gray-100 shadow-sm'>
			<h2 className='mb-4 text-lg font-semibold text-gray-800'>Category Breakdown</h2>
			<div className='h-50 mb-4'>
				<PieChart data={data} />
			</div>
			<div className='grid grid-cols-2 gap-x-16 gap-y-3 text-sm'>
				{data.map((d, index) => (
					<div key={index} className='text-gray-700 font-medium'>
						<div className='flex items-center justify-between'>
							<div><DynamicIcon name={icons[index] as IconName} width='22px' height='22px' strokeWidth='1.5' color={d.fill} fill={d.name === 'Other' ? d.fill : 'transparent'} /></div>
							<div>{d.value}%</div>
						</div>
					<div>{d.name}</div>
					</div>
				))}
			</div>
		</div>
	);
};

const RecentTransactions = ({ transactions }: { transactions: Transaction[] }) => {
	const data = React.useMemo(() => transactions.slice(0, 4), [transactions]);

	const getTransactionDate = (d: string | number | Date): string => {
		const now = new Date();
		const currentYear = now.getFullYear();
		const currentMonth = now.getMonth();
		const currentDay = now.getDate();

		const date = new Date(d);
		if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
			if (date.getDate() === currentDay) {
				return 'Today';
			}
			if (date.getDate() === currentDay - 1) {
				return 'Yesterday';
			}
		}
		return date.toLocaleString('en-US', { month: 'short', day: '2-digit' });
	};

	return (
		<div className='lg:col-span-2 p-6 bg-white border border-gray-100 rounded-xl shadow-sm'>
			<div className='flex items-center justify-between mb-4'>
				<h2 className='text-lg font-semibold text-gray-800'>Recent Transactions</h2>
				<Link to='/transactions' className='text-xs font-semibold text-emerald-600 hover:underline'>
					View All
				</Link>
			</div>

			<div className='divide-y divide-gray-100'>
				{data.length > 0 ? data.map(tx => (
					<div key={tx.id} className='py-3 flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<div>
								<DynamicIcon name={tx.category.icon ? tx.category.icon as IconName : 'box'} width='26px' height='26px' strokeWidth='1.5' color={tx.category.color || '#2b8dae'} />
							</div>
							<div>
								<p className='text-sm font-medium text-gray-900'>{tx.category.name}</p>
								<p className='text-xs text-gray-400'>
									{tx.category.type[0].toUpperCase() + tx.category.type.substring(1).toLowerCase()} • {getTransactionDate(tx.date)}
								</p>
							</div>
						</div>
						<div className={`text-sm font-semibold ${tx.category.type === 'INCOME' ? 'text-emerald-600' : 'text-red-500'}`}>
							{tx.category.type === 'INCOME' ? '+' : '-'}{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
						</div>
					</div>
				)) : (
					<div>Empty</div>
				)}
			</div>
		</div>
	);
};

const TopBudgets = ({ budgets }: { budgets: Budget[] }) => {
	const data = React.useMemo(() => (
		budgets.sort((a, b) => b.spentAmount! / b.limitAmount - a.spentAmount! / a.limitAmount).slice(0, 4)
	), [budgets]);
	
	return (
		<div className='lg:col-span-1 p-6 flex flex-col bg-white border border-gray-100 rounded-xl shadow-sm'>
			<h2 className='mb-4 text-lg font-semibold text-gray-800'>Top Budgets To Watch</h2>
			<div className='flex-1 flex flex-col justify-between text-gray-800'>
				{data.length > 0 ? data.map(budget => (
					<div key={budget.id}>
						<div className='mb-1 flex justify-between'>
							<h4 className='flex items-center gap-1'>
								<DynamicIcon name={budget.category.icon ? budget.category.icon as IconName : 'box'} width='24px' height='24px' strokeWidth='1.5' color={budget.category.color || '#2b8dae'} />
								<span>{budget.category.name}</span>
							</h4>
							<span>
								<span className={budget.isOverBudget! ? 'text-red-500' : ''}>${budget.spentAmount!.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
								/{budget.limitAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}
								</span>
						</div>
						<div className='w-full h-2.5 bg-bluish-cyan/15 border border-navy-blue/30 rounded-full'>
							<div style={{ width: `${budget.isOverBudget! ? '100' : (budget.spentAmount! / budget.limitAmount * 100).toFixed()}%`, backgroundColor: budget.isOverBudget! ? 'var(--color-red-400)' : budget.category.color || '#2b8dae' }} className='h-[8.4px] rounded-full' />
						</div>
					</div>
				)) : (
					<div>Empty</div>
				)}
			</div>
		</div>
	);
}