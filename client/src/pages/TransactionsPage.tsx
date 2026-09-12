import React from 'react'
import { useSearchParams } from 'react-router-dom'

import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTransactionsData } from '../hooks/useData'
import { transactionsApi } from '../api/transactions'
import type { Transaction } from '../types/api'

import DashboardLayout from '../layouts/DashboardLayout'
import ContextPill from '../components/ContextPill'
import AddTransactionModal, { type AddTransactionOnConfirmProps } from '../components/AddTransactionModal'

import { Plus } from 'lucide-react'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'

type TimeRange = '1M' | '6M' | '1Y';

export default function TransactionsPage() {
	useDocumentTitle('Transactions');
	const data = useTransactionsData();

	const [searchParams] = useSearchParams();

	const [transactions, setTransactions] = React.useState<Transaction[]>([]);
	const [timeRange, setTimeRange] = React.useState<TimeRange>('1M');
	const [addModalOpen, setAddModalOpen] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (searchParams.get('action') === 'add') {
			setAddModalOpen(true);
		}
	}, [searchParams]);

	React.useEffect(() => {
		if (data.transactions.length === 0) {
			setTransactions(data.transactions);
			return;
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

		setTransactions(cutoffIndex === -1 ? data.transactions : data.transactions.slice(0, cutoffIndex));
	}, [data, timeRange]);

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
				<div className='py-4 flex items-center justify-between animate-pulse'>
					<div className='w-40 h-2 rounded bg-gray-300' />
					<div className='w-90 h-2 rounded bg-gray-300' />
				</div>

				<div className='space-y-8 mt-8 p-4 bg-white border border-gray-100 rounded-xl shadow-md'>
					<div className='w-50 h-2 mt-4 mb-8 rounded bg-gray-300 animate-pulse' />
					{[1, 2, 3, 4, 5, 6, 7].map(item => (
						<div key={item} className='flex items-center justify-between animate-pulse'>
							<div className='flex items-center'>
								<div className='size-8 rounded-full bg-gray-300' />
								<div className='ml-2'>
									<div className='w-50 h-2 rounded bg-gray-300' />
									<div className='w-10 h-2 mt-3 rounded bg-gray-300' />
								</div>
							</div>
							<div className='flex items-center gap-1'>
								<div className='size-4 rounded-full bg-gray-300' />
								<div className='size-4 rounded-full bg-gray-300' />
							</div>
						</div>
					))}
				</div>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout>
			<div className='flex items-center justify-between'>
				<button onClick={() => { setAddModalOpen(true); }} className='flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow transition-colors duration-150'>
					<Plus size='16' strokeWidth='2.5' />
					<span className='ml-1'>Add Transaction</span>
				</button>
				<ContextPill />
			</div>

			<div className='space-y-5 p-4 bg-white border border-gray-100 rounded-xl shadow-md'>
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
					<div key={tx.id} className='flex items-center justify-between'>
						<div className='flex items-center'>
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

			<AddTransactionModal
				isOpen={addModalOpen}
				onConfirm={async (data: AddTransactionOnConfirmProps) => {
					const res = await transactionsApi.create(data);
					setTransactions(prev => [res.data, ...prev]);
					setAddModalOpen(false);
				}}
				onClose={() => { setAddModalOpen(false); }}
			/>
		</DashboardLayout>
	);
}