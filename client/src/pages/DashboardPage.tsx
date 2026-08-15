import React from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import { ContextPill } from '../components/ContextPill'
import { BanknoteArrowDown, Car, ChartPie, Circle, Hamburger, House, Landmark, PiggyBank, ShoppingBasket } from 'lucide-react'
import { LineChart, PieChart } from '../components/Charts'

interface Transaction {
	id: string;
	title: string;
	category: string;
	amount: number;
	type: 'INCOME' | 'EXPENSE';
	date: string;
}

export default function DashboardPage() {
	return (
		<DashboardLayout>
			<div className='flex items-center justify-between'>
				<Link to='/transactions/new' className='inline-flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow transition-colors duration-150'>
					+ Add Transaction
				</Link>
				<ContextPill />
			</div>

			<KeyMetricsSummary className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' />

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				<MonthlySpending className='lg:col-span-2 min-h-80 p-6 flex flex-col justify-between bg-white rounded-xl border border-gray-100 shadow-sm' />
				<CategoryBreakdown className='lg:col-span-1 p-6 bg-white rounded-xl border border-gray-100 shadow-sm' />
			</div>

			{/* Recent Transactions + Top Budgets */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				<RecentTransactions className='lg:col-span-2 p-6 bg-white border border-gray-100 rounded-xl shadow-sm' />
				<TopBudgets className='lg:col-span-1 p-6 flex flex-col bg-white border border-gray-100 rounded-xl shadow-sm' />
			</div>
		</DashboardLayout>
	);
}

const KeyMetricsSummary = ({ className }: { className?: string }) => {
	const metrics = [
		{ title: 'Total Balance', 		amount: '$12,450.80',	changeValue: '', 			changeText: 'Across all Accounts',	changeStatus: 'positive', 	note: 'Active Accounts', 	noteStatus: 'positive', lucideElement: <Landmark strokeWidth='1.5' className='text-bluish-cyan' /> },
		{ title: 'Monthly Spending', 	amount: '$4,200.00', 	changeValue: '+$336', changeText: 'vs last month', 				changeStatus: 'negative', 	note: 'Manual & Linked', 	noteStatus: 'negative', lucideElement: <BanknoteArrowDown strokeWidth='1.5' className='text-bluish-cyan' /> },
		{ title: 'Budget Used', 			amount: '68%', 				changeValue: '$769', 	changeText: 'remaining', 						changeStatus: 'neutral', 		note: 'Target < 80%', 		noteStatus: 'positive', lucideElement: <ChartPie strokeWidth='1.5' className='text-bluish-cyan' /> },
		{ title: 'Savings Rate', 			amount: '19%', 				changeValue: '+3%', 	changeText: 'vs last month', 				changeStatus: 'positive', 	note: 'Goal 25%', 				noteStatus: 'positive', lucideElement: <PiggyBank strokeWidth='1.5' className='text-bluish-cyan' /> },
	];

	return (
		<div className={className}>
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

const MonthlySpending = ({ className }: { className?: string }) => {
	const data = [
		{ xv: 'JAN', yv: 1000 },
		{ xv: 'FEB', yv: 900 },
		{ xv: 'MAR', yv: 400 },
		{ xv: 'APR', yv: 1300 },
		{ xv: 'MAY', yv: 600 },
	];

	return (
		<div className={className}>
			<div className='flex items-center justify-between mb-4'>
				<h2 className='text-lg font-semibold text-gray-800'>Monthly Spending History</h2>
				<span className='text-xs font-medium text-gray-400'>Last 30 Days</span>
			</div>
			<div className='flex-1'>
				<LineChart data={data} />
			</div>
		</div>
	);
};

const CategoryBreakdown = ({ className }: { className?: string }) => {
	const budgets = {
		data: [
			{ name: 'Grocery', value: 20, fill: '#2b8dae' },
			{ name: 'Transport', value: 15, fill: '#20a2a9' },
			{ name: 'Housing', value: 18, fill: '#16b7a4' },
			{ name: 'Food', value: 17, fill: '#0ccc9f' },
			{ name: 'Other', value: 30, fill: '#01e19a' },
		],
		icons: [
			<ShoppingBasket width='18px' height='18px' strokeWidth='1.5' color='#2b8dae' />,
			<Car width='18px' height='18px' strokeWidth='1.5' color='#20a2a9' />,
			<House width='18px' height='18px' strokeWidth='1.5' color='#16b7a4' />,
			<Hamburger width='18px' height='18px' strokeWidth='1.5' color='#0ccc9f' />,
			<Circle width='18px' height='18px' strokeWidth='1.5' color='#01e19a' fill='#01e19a' />,
		],
	};

	// colors = ['#2b8dae', '#20a2a9', '#16b7a4', '#0ccc9f', '#01e19a'];

	return (
		<div className={className}>
			<h2 className='mb-4 text-lg font-semibold text-gray-800'>Category Breakdown</h2>
			<div className='h-50 mb-4'>
				<PieChart data={budgets.data} />
			</div>
			<div className='grid grid-cols-2 gap-x-14 gap-y-2 text-sm'>
				{budgets.data.map((budget, index) => (
					<div key={index} className='flex justify-between text-gray-700 font-medium'>
						<div className='flex items-center gap-1'>{budgets.icons[index]}{budget.name}</div>
						<div>{budget.value}%</div>
					</div>
				))}
			</div>
		</div>
	);
};

const RecentTransactions = ({ className }: { className?: string }) => {
	const [recentTransactions, setRecentTransactions] = React.useState<Transaction[]>([]);

	React.useEffect(() => {
		setRecentTransactions([
			{ id: '1', title: 'Grocery Supermarket', category: 'Food & Dining', amount: -84.50, type: 'EXPENSE', date: 'Today' },
			{ id: '2', title: 'Freelance Design Client', category: 'Income', amount: 850.00, type: 'INCOME', date: 'Yesterday' },
			{ id: '3', title: 'Electric & Power Bill', category: 'Utilities', amount: -112.30, type: 'EXPENSE', date: 'Aug 10' },
			{ id: '4', title: 'Streaming Services', category: 'Entertainment', amount: -15.99, type: 'EXPENSE', date: 'Aug 08' },
		]);
	}, []);

	return (
		<div className={className}>
			<div className='flex items-center justify-between mb-4'>
				<h2 className='text-lg font-semibold text-gray-800'>Recent Transactions ({new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})</h2>
				<Link to='/transactions' className='text-xs font-semibold text-emerald-600 hover:underline'>
					View All
				</Link>
			</div>

			<div className='divide-y divide-gray-100'>
				{recentTransactions.map((tx) => (
					<div key={tx.id} className='py-3 flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-gray-900'>{tx.title}</p>
							<p className='text-xs text-gray-400'>{tx.category} • {tx.date}</p>
						</div>
						<span className={`text-sm font-semibold ${tx.amount > 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
							{tx.amount > 0 ? `+${tx.amount.toFixed(2)}` : tx.amount.toFixed(2)}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

const TopBudgets = ({ className }: { className?: string }) => {
	const budgets = [
		{
			name: 'Food',
			used: 90,
			total: 300,
			color: '#0ccc9f',
			icon: <Hamburger width='24px' height='24px' strokeWidth='1.5' color='#0ccc9f' />
		},
		{
			name: 'Grocery',
			used: 769,
			total: 1130,
			color: '#2b8dae',
			icon: <ShoppingBasket width='24px' height='24px' strokeWidth='1.5' color='#2b8dae' />
		},
		{
			name: 'Transport',
			used: 180,
			total: 400,
			color: '#20a2a9',
			icon: <Car width='24px' height='24px' strokeWidth='1.5' color='#20a2a9' />
		},
		{
			name: 'Housing',
			used: 304,
			total: 910,
			color: '#16b7a4',
			icon: <House width='24px' height='24px' strokeWidth='1.5' color='#16b7a4' />
		},
	];
	
	return (
		<div className={className}>
			<h2 className='mb-4 text-lg font-semibold text-gray-800'>Top Budgets To Watch</h2>
			<div className='flex-1 flex flex-col justify-between'>
				{budgets.map((budget, index) => (
					<div key={index}>
						<div className='mb-1 flex justify-between'>
							<h4 className='flex items-center gap-1'>
								{budget.icon}
								<span>{budget.name}</span>
							</h4>
							<span>(${budget.used}/{budget.total})</span>
						</div>
						<div className='w-full h-2.5 bg-bluish-cyan/15 border border-navy-blue/30 rounded-full'>
							<div style={{ width: `${(budget.used / budget.total * 100).toFixed()}%`, backgroundColor: budget.color }} className='h-[8.4px] rounded-full' />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}