import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import UserNoImageAvatar from '../components/UserNoImageAvatar'
import LogoTitle from '../components/LogoTitle'
import { LinkIcon, ArrowRightLeft, BanknoteArrowDown, ChartLine, ChartPie, Landmark, LayoutDashboard, PiggyBank, Settings } from 'lucide-react'

interface Transaction {
	id: string;
	title: string;
	category: string;
	amount: number;
	type: 'INCOME' | 'EXPENSE';
	date: string;
}

export default function DashboardPage() {
	const navigate = useNavigate();
	const [recentTransactions, setRecentTransactions] = React.useState<Transaction[]>([]);

	// Simulated metrics data (replace with API hook)
	const metrics = [
		{ title: 'Total Balance', 		amount: '$12,450.80',	changeValue: '', 			changeText: 'Across all Accounts',	changeStatus: 'positive', 	note: 'Active Accounts', 	noteStatus: 'positive', lucideElement: <Landmark strokeWidth='1.5' className='text-bluish-cyan' /> },
		{ title: 'Monthly Spending', 	amount: '$4,200.00', 	changeValue: '-$336', changeText: 'vs last month', 				changeStatus: 'negative', 	note: 'Manual & Linked', 	noteStatus: 'negative', lucideElement: <BanknoteArrowDown strokeWidth='1.5' className='text-bluish-cyan' /> },
		{ title: 'Budget Used', 			amount: '68%', 				changeValue: '$769', 	changeText: 'remaining', 						changeStatus: 'neutral', 		note: 'Target < 80%', 		noteStatus: 'positive', lucideElement: <ChartPie strokeWidth='1.5' className='text-bluish-cyan' /> },
		{ title: 'Savings Rate', 			amount: '19%', 				changeValue: '+3%', 	changeText: 'vs last month', 				changeStatus: 'positive', 	note: 'Goal 25%', 				noteStatus: 'positive', lucideElement: <PiggyBank strokeWidth='1.5' className='text-bluish-cyan' /> },
	];

	React.useEffect(() => {
		setRecentTransactions([
			{ id: '1', title: 'Grocery Supermarket', category: 'Food & Dining', amount: -84.50, type: 'EXPENSE', date: 'Today' },
			{ id: '2', title: 'Freelance Design Client', category: 'Income', amount: 850.00, type: 'INCOME', date: 'Yesterday' },
			{ id: '3', title: 'Electric & Power Bill', category: 'Utilities', amount: -112.30, type: 'EXPENSE', date: 'Aug 10' },
			{ id: '4', title: 'Streaming Services', category: 'Entertainment', amount: -15.99, type: 'EXPENSE', date: 'Aug 08' },
		]);
	}, []);

	return (
		<>
			<Header />
			<div className='h-screen pt-18 flex overflow-hidden'>
				<NavSection />
				<main className='h-full flex-1 p-8 space-y-8 overflow-auto bg-gray-100'>
					<button onClick={() => navigate('/transactions/new')} className='inline-flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow transition-colors duration-150'>
						+ Add Transaction
					</button>

					{/* 2. Key Metrics Summary Grid */}
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
						{metrics.map((m, index) => (
							<div key={index} className='rounded-xl shadow-sm transition-shadow hover:shadow-md'>
								<div className='bg-white p-4 rounded-t-xl border-x border-t border-gray-100'>
									<div className='flex items-center justify-between mb-2'>
										<span className='text-sm font-medium text-gray-500'>{m.title}</span>
										{m.lucideElement}
									</div>
									<div className='text-2xl font-bold text-gray-900'>{m.amount}</div>
									<div className='text-xs mt-2 text-gray-600 font-medium'>
										<span className={m.changeStatus === 'positive' ? 'text-emerald-600' : m.changeStatus === 'negative' ? 'text-red-500' : 'text-black'}>
											{m.changeValue}
										</span>
										{' ' + m.changeText}
									</div>
								</div>
								<div className={`p-2.5 ${m.noteStatus === 'positive' ? 'bg-green-200' : 'bg-[#ffc0c0]'} text-sm text-center rounded-b-xl`}>{m.note}</div>
							</div>
						))}
					</div>

					{/* 3. Main Dashboard Body: Chart + Recent Transactions */}
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				
						{/* Analytics / Visual Placeholder (2 Columns wide) */}
						<div className='lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-80'>
							<div className='flex items-center justify-between mb-4'>
								<h2 className='text-lg font-semibold text-gray-800'>Financial Overview</h2>
								<span className='text-xs font-medium text-gray-400'>Last 30 Days</span>
							</div>
							
							{/* Chart Container Placeholder */}
							<div className='flex-1 bg-slate-50 rounded-lg border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 p-6'>
								<span className='text-3xl mb-2'>📊</span>
								<p className='text-sm font-medium'>Chart visualization component goes here</p>
								<p className='text-xs text-gray-400 mt-1'>(Recharts / Chart.js integration)</p>
							</div>
						</div>

						{/* Recent Activity List (1 Column wide) */}
						<div className='bg-white p-6 rounded-xl border border-gray-100 shadow-sm'>
							<div className='flex items-center justify-between mb-4'>
								<h2 className='text-lg font-semibold text-gray-800'>Recent Activity</h2>
								<button 
									onClick={() => navigate('/transactions')}
									className='text-xs font-semibold text-emerald-600 hover:underline'
								>
									View All
								</button>
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
					</div>

					<div className='lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-80'>
							<div className='flex items-center justify-between mb-4'>
								<h2 className='text-lg font-semibold text-gray-800'>Financial Overview</h2>
								<span className='text-xs font-medium text-gray-400'>Last 30 Days</span>
							</div>
							
							{/* Chart Container Placeholder */}
							<div className='flex-1 bg-slate-50 rounded-lg border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 p-6'>
								<span className='text-3xl mb-2'>📊</span>
								<p className='text-sm font-medium'>Chart visualization component goes here</p>
								<p className='text-xs text-gray-400 mt-1'>(Recharts / Chart.js integration)</p>
							</div>
						</div>
				</main>
			</div>
		</>
	);
}

const Header: React.FC = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const accountButtonRef = React.useRef<HTMLButtonElement>(null);
	const accountDropdownRef = React.useRef<HTMLDivElement>(null);
	const [accountDropdownOpen, setAccountDropdownOpen] = React.useState<boolean>(false);

	React.useEffect(() => {
		const handleDropdownClick = (ev: PointerEvent) => {
			if (
				accountDropdownRef.current && accountButtonRef.current &&
				!accountButtonRef.current.contains(ev.target as Node) &&
				!accountDropdownRef.current.contains(ev.target as Node)
			) {
				setAccountDropdownOpen(false);
			}
		};
		const handleDropdownKeyDown = (ev: KeyboardEvent) => {
			if (ev.key === 'Escape')
				setAccountDropdownOpen(false);
		};

		document.addEventListener('click', handleDropdownClick);
		document.addEventListener('keydown', handleDropdownKeyDown);

		return () => {
			document.removeEventListener('click', handleDropdownClick);
			document.removeEventListener('keydown', handleDropdownKeyDown);
		};
	}, [accountButtonRef, accountDropdownRef]);

	return (
		<header className='fixed top-0 left-0 right-0 py-2 flex items-center justify-between gap-4 bg-white border-b border-gray-300'>
			<Link to='/dashboard' className='ml-4'>
				<LogoTitle height={56} />
			</Link>
			<div>
				<button ref={accountButtonRef} onClick={() => setAccountDropdownOpen((prev) => !prev)} className='mr-6'>
					<UserNoImageAvatar user={user!} size='sm' />
				</button>
				{accountDropdownOpen && (
					<div ref={accountDropdownRef} className='fixed top-14 right-6 py-3 flex flex-col items-center bg-white border border-gray-300 rounded-lg z-50'>
						<UserNoImageAvatar user={user!} size='md' />
						<div className='mt-2 text-gray-600 font-bold'>{user?.fullName}</div>
						<div className='text-gray-500 text-xs'>{user?.email}</div>
						<Link to='/account' className='mt-3 mb-4 px-3 py-1 bg-[#00000008] text-gray-500 text-sm border border-gray-500 rounded-md hover:bg-[#0000000f]'>Manage your account</Link>
						<div className='w-64 py-2 border-y border-gray-300'>
							<Link to='/transactions' className='w-full px-3 py-2.5 inline-block text-gray-500 text-sm font-medium hover:bg-[#0000000b]'>Transactions</Link>
							<Link to='/budgets' className='w-full px-3 py-2.5 inline-block text-gray-500 text-sm font-medium hover:bg-[#0000000b]'>Budgets</Link>
							<Link to='/support' className='w-full px-3 py-2.5 inline-block text-gray-500 text-sm font-medium hover:bg-[#0000000b]'>Support</Link>
						</div>
						<button onClick={() => { logout(); navigate('/login') }} className='w-full mt-2 px-3 py-2.5 inline-block text-gray-500 text-sm text-left font-medium hover:bg-[#0000000b]'>Log out</button>
					</div>
				)}
			</div>
		</header>
	);
};

const NavSection: React.FC = () => {
	return (
		<nav className='h-full min-w-64 shrink-0 overflow-y-auto border-r border-gray-300'>
			<h3 className='mt-4 mx-4 text-gray-500 text-xs'>MAIN</h3>
			<ul className='text-gray-700 font-medium'>
				<li><Link to='/dashboard' className='px-4 py-2.5 flex items-center gap-1 text-sm hover:bg-gray-100'>
					<LayoutDashboard width='20' height='20' strokeWidth='1.3' className='text-bluish-cyan' />
					<h4>Dashboard</h4>
				</Link></li>
				<li><Link to='/transactions' className='px-4 py-2.5 flex items-center gap-1 text-sm hover:bg-gray-100'>
					<ArrowRightLeft width='20' height='20' strokeWidth='1.3' className='text-bluish-cyan' />
					<h4>Transactions</h4>
				</Link></li>
				<li><Link to='/budgets' className='px-4 py-2.5 flex items-center gap-1 text-sm hover:bg-gray-100'>
					<ChartPie width='20' height='20' strokeWidth='1.3' className='text-bluish-cyan' />
					<h4>Budgets</h4>
				</Link></li>
				<li><Link to='/analytics' className='px-4 py-2.5 flex items-center gap-1 text-sm hover:bg-gray-100'>
					<ChartLine width='20' height='20' strokeWidth='1.3' className='text-bluish-cyan' />
					<h4>Analytics</h4>
				</Link></li>
			</ul>
			<h3 className='mt-4 mx-4 text-gray-500 text-xs'>ACCOUNT</h3>
			<ul className='text-gray-700 font-medium'>
				<li><Link to='/bank-links' className='px-4 py-2.5 flex items-center gap-1 text-sm hover:bg-gray-100'>
					<LinkIcon width='20' height='20' strokeWidth='1.3' className='text-bluish-cyan' />
					<h4>Bank Links</h4>
				</Link></li>
				<li><Link to='/settings' className='px-4 py-2.5 flex items-center gap-1 text-sm hover:bg-gray-100'>
					<Settings width='20' height='20' strokeWidth='1.3' className='text-bluish-cyan' />
					<h4>Settings</h4>
				</Link></li>
			</ul>
		</nav>
	);
};