import React from 'react'
import { Outlet } from 'react-router-dom'

import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTransactionsData } from '../hooks/useData'

import DashboardLayout from '../layouts/DashboardLayout'
import AddTransactionButton from '../components/AddTransactionButton'
import ContextPill from '../components/ContextPill'

import { DynamicIcon, type IconName } from 'lucide-react/dynamic'

type TimeRange = '1M' | '6M' | '1Y';

export default function TransactionsPage() {
	useDocumentTitle('Transactions');
	const data = useTransactionsData();

	const [timeRange, setTimeRange] = React.useState<TimeRange>('1M');

	const transactions = React.useMemo(() => {
		if (data.transactions.length === 0) {
			return data.transactions;
		}

		const now = new Date();
		const currentYear = now.getUTCFullYear();
		const currentMonth = now.getUTCMonth();
		const currentDay = now.getUTCDate();

		let cutoffTimestamp: number;

		if (timeRange === '1M') {
			cutoffTimestamp = Date.UTC(currentYear, currentMonth - 1, currentDay);
		} else if (timeRange === '6M') {
			cutoffTimestamp = Date.UTC(currentYear, currentMonth - 6, currentDay);
		} else {
			cutoffTimestamp = Date.UTC(currentYear - 1, currentMonth, currentDay);
		}

		const	cutoffIndex = data.transactions.findIndex(tx => {
			const txTimestamp = new Date(tx.date).getTime();
			return txTimestamp < cutoffTimestamp;
		});

		return cutoffIndex === -1 ? data.transactions : data.transactions.slice(0, cutoffIndex);
	}, [data.transactions, timeRange]);

	const getTransactionDate = (d: string | number | Date): string => {
		const now = new Date();
		const currentYear = now.getFullYear();
		const currentMonth = now.getMonth();
		const currentDay = now.getDate();

		const date = new Date(d);
		if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
			if (date.getDate() === currentDay) {
				return `Today, ${date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
			}
			if (date.getDate() === currentDay - 1) {
				return `Yesterday, ${date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
			}
		}
		return date.toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
	};

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

			<div className='p-4 pb-1 bg-white border border-gray-100 rounded-xl shadow-md'>
				<div className='flex items-center justify-between'>
					<h2 className='text-gray-800 text-lg font-semibold'>Transactions List</h2>
					<div className='flex gap-4 text-xs font-medium text-gray-400'>
						{(['1M', '6M', '1Y'] as TimeRange[]).map(range => (
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
				{transactions.length > 0 ? transactions.map(tx => (
					<div key={tx.id} className='py-3 flex items-center'>
						<div className='flex-1 flex items-center'>
							<div>
								<DynamicIcon name={tx.category.icon ? tx.category.icon as IconName : 'box'} width='26px' height='26px' strokeWidth='1.5' color={tx.category.color || '#2b8dae'} />
							</div>
							<div className='shrink-0 ml-2'>
								<p className='text-sm font-medium text-gray-800'>{tx.category.name}</p>
								<p className='text-xs text-gray-400'>
									{tx.category.type[0].toUpperCase() + tx.category.type.substring(1).toLowerCase()} • {getTransactionDate(tx.date)}
								</p>
							</div>
							<div className='self-start mx-4 text-gray-700 text-sm'>
								{tx.description}
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

			{/* Renders child routes (e.g. /transactions/new) as an overlay */}
			<Outlet />
		</DashboardLayout>
	);
}