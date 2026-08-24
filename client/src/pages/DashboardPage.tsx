import React from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import { useDashboardData } from '../hooks/useDashboardData'
import type { Transaction, Budget } from '../types/api'
import { ContextPill } from '../components/ContextPill'
import { LineChart, PieChart } from '../components/Charts'
import { BanknoteArrowDown, ChartPie, Landmark, PiggyBank } from 'lucide-react'
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
				<Link to='/transactions/new' className='inline-flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow transition-colors duration-150'>
					+ Add Transaction
				</Link>
				<ContextPill />
			</div>

			<KeyMetricsSummary />

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				<MonthlySpendingChart transactions={data.transactions} />
				<CategoryBreakdown transactions={data.transactions} />
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				<RecentTransactions transactions={data.transactions} />
				<TopBudgets budgets={data.budgets} />
			</div>
		</DashboardLayout>
	);
}

const KeyMetricsSummary = () => {
	const metrics = [
		{ title: 'Total Balance', 		amount: '$12,450.80',	changeValue: '', 			changeText: 'Across all Accounts',	changeStatus: 'positive', 	note: 'Active Accounts', 	noteStatus: 'positive', lucideElement: <Landmark strokeWidth='1.5' className='text-bluish-cyan' /> },
		{ title: 'Monthly Spending', 	amount: '$4,200.00', 	changeValue: '+$336', changeText: 'vs last month', 				changeStatus: 'negative', 	note: 'Manual & Linked', 	noteStatus: 'negative', lucideElement: <BanknoteArrowDown strokeWidth='1.5' className='text-bluish-cyan' /> },
		{ title: 'Budget Used', 			amount: '68%', 				changeValue: '$769', 	changeText: 'remaining', 						changeStatus: 'neutral', 		note: 'Target < 80%', 		noteStatus: 'positive', lucideElement: <ChartPie strokeWidth='1.5' className='text-bluish-cyan' /> },
		{ title: 'Savings Rate', 			amount: '19%', 				changeValue: '+3%', 	changeText: 'vs last month', 				changeStatus: 'positive', 	note: 'Goal 25%', 				noteStatus: 'positive', lucideElement: <PiggyBank strokeWidth='1.5' className='text-bluish-cyan' /> },
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
		const expenseTransactions = transactions.filter(tx => tx.type === 'EXPENSE');
		if (expenseTransactions.length === 0) return [];

		const now = new Date();
		let monthCount = 6;

		if (timeRange === '1Y') {
			monthCount = 12;
		} else if (timeRange === 'All') {
			const oldestTimestamp = Math.min(
				...expenseTransactions.map((tx) => new Date(tx.date).getTime())
			);
			const oldestDate = new Date(oldestTimestamp);
			
			monthCount = (now.getFullYear() - oldestDate.getFullYear()) * 12 + (now.getMonth() - oldestDate.getMonth()) + 1;
			monthCount = Math.max(monthCount, 1);
		}

		const monthlyTotals: Record<string, { xv: string; yv: number }> = {};

		for (let i = monthCount - 1; i >= 0; i--) {
			const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
			const monthLabel = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
			
			monthlyTotals[key] = { xv: monthLabel, yv: 0 };
		}

		expenseTransactions.forEach((tx) => {
			const txDate = new Date(tx.date);
			const key = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`;

			if (monthlyTotals[key]) {
				monthlyTotals[key].yv += Number(tx.amount);
			}
		});

		return Object.values(monthlyTotals);
	}, [transactions, timeRange]);

	return (
		<div className='lg:col-span-2 min-h-80 p-6 flex flex-col justify-between bg-white rounded-xl border border-gray-100 shadow-sm'>
			<div className='flex items-center justify-between mb-4'>
				<h2 className='text-lg font-semibold text-gray-800'>Monthly Spending History</h2>
				<div className='flex gap-4 text-xs font-medium text-gray-400'>
					{(['6M', '1Y', 'All'] as ('6M' | '1Y' | 'All')[]).map((range) => (
						<button
							key={range}
							onClick={() => setTimeRange(range)}
							className={`rounded-md transition-all ${
								timeRange === range
									? 'bg-white text-bluish-cyan font-semibold'
									: 'hover:text-gray-600'
							}`}
						>
							{range === 'All' ? 'All' : range}
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
		const currentYear = now.getFullYear();
		const currentMonth = now.getMonth();

		const monthExpenses = transactions.filter((tx) => {
			if (tx.type !== 'EXPENSE') return false;
			const d = new Date(tx.date);
			return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
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
			const percentage = Math.round((item.value / totalSpent) * 100);
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
			<div className='grid grid-cols-2 gap-x-14 gap-y-2 text-sm'>
				{data.map((d, index) => (
					<div key={index} className='flex justify-between gap-1 text-gray-700 font-medium'>
						<div className='flex gap-1'>
							<span>
								<DynamicIcon name={icons[index] as IconName} width='18px' height='18px' strokeWidth='1.5' color={d.fill} fill={d.name === 'Other' ? d.fill : 'transparent'} />
							</span>
							<div>{d.name}</div>
						</div>
						<div>{d.value}%</div>
					</div>
				))}
			</div>
		</div>
	);
};

const RecentTransactions = ({ transactions }: { transactions: Transaction[] }) => {
	const now = new Date();
	const currentYear = now.getFullYear();
	const currentMonth = now.getMonth();
	const currentDay = now.getDate();

	const data = React.useMemo(() => {
		return transactions
			.filter(tx => {
				const d = new Date(tx.date);
				return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
			})
			.slice(0, 4)
	}, [transactions]);

	const getTransactionDate = (d: string | number | Date): string => {
		const date = new Date(d);
		if (date.getDate() === currentDay) {
			return 'Today';
		}
		if (date.getDate() === currentDay - 1) {
			return 'Yesterday';
		}
		return date.toLocaleString('en-US', { month: 'short', day: '2-digit' });
	};

	return (
		<div className='lg:col-span-2 p-6 bg-white border border-gray-100 rounded-xl shadow-sm'>
			<div className='flex items-center justify-between mb-4'>
				<h2 className='text-lg font-semibold text-gray-800'>Recent Transactions ({new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})</h2>
				<Link to='/transactions' className='text-xs font-semibold text-emerald-600 hover:underline'>
					View All
				</Link>
			</div>

			<div className='divide-y divide-gray-100'>
				{data.map(tx => (
					<div key={tx.id} className='py-3 flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-gray-900'>{tx.category.name}</p>
							<p className='text-xs text-gray-400'>
								{tx.type[0].toUpperCase() + tx.type.substring(1).toLowerCase()} • {getTransactionDate(tx.date)}
							</p>
						</div>
						<span className={`text-sm font-semibold ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-red-500'}`}>
							{tx.type === 'INCOME' ? `+$${tx.amount.toFixed(2)}` : `-$${tx.amount.toFixed(2)}`}
						</span>
					</div>
				))}
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
				{data.map(budget => (
					<div key={budget.id}>
						<div className='mb-1 flex justify-between'>
							<h4 className='flex items-center gap-1'>
								<DynamicIcon name={budget.category.icon ? budget.category.icon as IconName : 'box'} width='24px' height='24px' strokeWidth='1.5' color={budget.category.color || '#2b8dae'} />
								<span>{budget.category.name}</span>
							</h4>
							<span>
								<span className={budget.isOverBudget! ? 'text-red-500' : ''}>${budget.spentAmount}</span>
								/{budget.limitAmount}
								</span>
						</div>
						<div className='w-full h-2.5 bg-bluish-cyan/15 border border-navy-blue/30 rounded-full'>
							<div style={{ width: `${budget.isOverBudget! ? '100' : (budget.spentAmount! / budget.limitAmount * 100).toFixed()}%`, backgroundColor: budget.isOverBudget! ? 'var(--color-red-400)' : budget.category.color || '#2b8dae' }} className='h-[8.4px] rounded-full' />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}