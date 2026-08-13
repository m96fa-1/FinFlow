import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import UserNoImageAvatar from '../components/UserNoImageAvatar'

interface Transaction {
	id: string;
	title: string;
	category: string;
	amount: number;
	type: 'INCOME' | 'EXPENSE';
	date: string;
}

export default function DashboardPage() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [recentTransactions, setRecentTransactions] = React.useState<Transaction[]>([]);
	const [accountDropdownOpen, setAccountDropdownOpen] = React.useState<boolean>(false);
	const accountButtonRef = React.useRef<HTMLButtonElement>(null);
	const accountDropdownRef = React.useRef<HTMLDivElement>(null);

	// Simulated metrics data (replace with API hook)
	const metrics = [
		{ title: 'Total Balance', amount: '$12,450.80', change: '+12.5% from last month', isPositive: true, icon: '💳' },
		{ title: 'Monthly Income', amount: '$4,200.00', change: '+3.2%', isPositive: true, icon: '📈' },
		{ title: 'Monthly Expenses', amount: '$1,850.35', change: '-5.4%', isPositive: true, icon: '📉' },
		{ title: 'Savings Rate', amount: '55.9%', change: '+4.1%', isPositive: true, icon: '🎯' },
	];

	React.useEffect(() => {
		setRecentTransactions([
			{ id: '1', title: 'Grocery Supermarket', category: 'Food & Dining', amount: -84.50, type: 'EXPENSE', date: 'Today' },
			{ id: '2', title: 'Freelance Design Client', category: 'Income', amount: 850.00, type: 'INCOME', date: 'Yesterday' },
			{ id: '3', title: 'Electric & Power Bill', category: 'Utilities', amount: -112.30, type: 'EXPENSE', date: 'Aug 10' },
			{ id: '4', title: 'Streaming Services', category: 'Entertainment', amount: -15.99, type: 'EXPENSE', date: 'Aug 08' },
		]);
		
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
	}, []);

	return (
		<>
			<header className='py-2 flex items-center justify-between gap-4 border-b border-light-gray-border'>
				<Link to='/dashboard' className='ml-4'>
					<svg width='157' height='56' viewBox='0 0 759.35413 270.93331' className='select-none drag-none' version='1.1' id='svg1' xmlnsXlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg'>
						<defs id='defs1'>
							<linearGradient id='linearGradient71'>
								<stop stopColor='#274fa5' stopOpacity='1' offset='0' id='stop70' />
								<stop stopColor='#33ffbf' stopOpacity='1' offset='1' id='stop71' />
							</linearGradient>
							<linearGradient
								id='linearGradient68'>
								<stop stopColor='#2159a1' stopOpacity='1' offset='0' id='stop67' />
								<stop stopColor='#00d68d' stopOpacity='1' offset='1' id='stop68' />
							</linearGradient>
							<linearGradient id='linearGradient16'>
								<stop stopColor='#2b4dab' stopOpacity='1' offset='0' id='stop16' />
								<stop stopColor='#00e59a' stopOpacity='1' offset='1' id='stop17' />
							</linearGradient>
							<linearGradient id='linearGradient13'>
								<stop stopColor='#1363a4' stopOpacity='1' offset='0' id='stop13' />
								<stop stopColor='#00e59a' stopOpacity='1' offset='1' id='stop14' />
							</linearGradient>
							<linearGradient
								xlinkHref='#linearGradient13'
								id='linearGradient14'
								x1='231.25627'
								y1='95.998657'
								x2='230.5464'
								y2='-130.32961'
								gradientUnits='userSpaceOnUse'
								spreadMethod='pad' />
							<linearGradient
								xlinkHref='#linearGradient71'
								id='linearGradient17'
								x1='44.245495'
								y1='217.82524'
								x2='263.00009'
								y2='12.12948'
								gradientUnits='userSpaceOnUse' />
							<linearGradient
								xlinkHref='#linearGradient16'
								id='linearGradient65'
								gradientUnits='userSpaceOnUse'
								x1='45.827385'
								y1='217.7953'
								x2='236.05885'
								y2='52.172436' />
							<linearGradient
								xlinkHref='#linearGradient68'
								id='linearGradient66'
								gradientUnits='userSpaceOnUse'
								x1='242.79987'
								y1='98.350914'
								x2='230.5464'
								y2='-130.32961'
								spreadMethod='pad'
								gradientTransform='rotate(45,-2.3486328e-6,-1.082248e-6)' />
						</defs>
						<g
							id='g71'
							transform='matrix(1.196825,0,0,1.1962616,-22.799516,-25.32087)'>
							<path
								id='path56'
								fill='url(#linearGradient17)' stroke='none' strokeWidth='0.383126' strokeLinecap='round' strokeLinejoin='round'
								d='M 129.11667,21.166666 A 110.06667,113.24166 0 0 0 19.05,134.40833 110.06667,113.24166 0 0 0 129.11667,247.65 110.06667,113.24166 0 0 0 239.18333,134.40833 110.06667,113.24166 0 0 0 237.8108,116.57945 l -8.8656,-6.03064 c -0.51361,0.69438 -1.04033,1.39964 -1.58027,2.11511 l 4.09277,2.78433 a 100.80578,103.71363 0 0 1 1.25729,16.32872 A 100.80578,103.71363 0 0 1 131.90926,235.49053 100.80578,103.71363 0 0 1 31.103527,131.77697 100.80578,103.71363 0 0 1 131.90926,28.063403 100.80578,103.71363 0 0 1 217.12473,76.371048 l 5.22965,-2.142505 A 110.06667,113.24166 0 0 0 129.11667,21.166666 Z' />
							<path
								id='path22'
								fill='url(#linearGradient65)' stroke='none' strokeWidth='0.383126' strokeLinecap='round' strokeLinejoin='round'
								d='M 131.90926,28.063403 A 100.80578,103.71363 0 0 0 31.103527,131.77697 100.80578,103.71363 0 0 0 131.90926,235.49053 100.80578,103.71363 0 0 0 232.71499,131.77697 100.80578,103.71363 0 0 0 231.4577,115.44825 l -4.09277,-2.78433 c -3.5847,4.75004 -7.74881,9.95183 -12.47779,15.43369 a 85.989583,88.470047 0 0 1 0.21911,6.31072 85.989583,88.470047 0 0 1 -21.96042,59.05324 v -10.73526 -31.76033 c -10.60067,10.12568 -22.79583,20.40479 -36.5125,29.97905 v 27.76161 9.51983 a 85.989583,88.470047 0 0 1 -9.26042,2.63498 v -9.63559 -24.08121 c -11.2597,7.22094 -23.44221,13.89423 -36.51249,19.6081 v 3.10266 11.00604 A 85.989583,88.470047 0 0 1 101.6,218.22647 v -11.6644 -66.59749 c 0,-5.13027 -4.130147,-9.26041 -9.260418,-9.26041 H 74.347916 c -5.130271,0 -9.260417,4.13014 -9.260417,9.26041 v 34.69349 18.8035 A 85.989583,88.470047 0 0 1 43.127083,134.40833 85.989583,88.470047 0 0 1 129.11667,45.938281 85.989583,88.470047 0 0 1 199.50513,83.590762 l 17.6196,-7.219714 A 100.80578,103.71363 0 0 0 131.90926,28.063403 Z m 33.98449,49.724096 c -5.13027,0 -9.26042,4.130146 -9.26042,9.260417 v 68.704334 c 13.71995,-11.35891 25.82853,-23.4876 36.5125,-36.75796 V 87.047916 c 0,-5.130271 -4.13014,-9.260417 -9.26042,-9.260417 z m -45.77292,26.458331 c -5.13027,0 -9.26041,4.13015 -9.26041,9.26042 v 74.14224 c 13.21499,-7.88022 25.35711,-16.00011 36.51249,-24.5308 v -49.61144 c 0,-5.13027 -4.13014,-9.26042 -9.26041,-9.26042 z' />
							<path
								id='path48'
								fill='#000000' fillOpacity='0.188235' stroke='none' strokeWidth='0.383126' strokeLinecap='round' strokeLinejoin='round'
								d='m 228.94515,112.18333 c -3.92345,5.30443 -8.61678,11.24125 -14.05805,17.5488 0.14601,2.10022 0.21909,4.20514 0.21911,6.31073 -2e-5,2.8896 -0.13765,5.77747 -0.41238,8.65322 7.14732,-8.04513 13.13272,-15.5868 17.91259,-22.1139 l 6.32933,4.22454 c -0.19554,-2.87525 -0.46965,-5.73292 -0.88729,-8.59274 z M 193.1458,152.6005 c -10.60067,10.12568 -22.79582,20.40479 -36.51249,29.97905 v 13.42398 c 13.64973,-9.28066 25.84344,-19.29562 36.51249,-29.23801 z m -45.77291,36.17868 c -11.25969,7.22094 -23.4422,13.89423 -36.51247,19.6081 v 12.47365 c 13.04667,-5.5047 25.22878,-11.78073 36.51247,-18.82158 z' />
							<path
								id='path65'
								mix-blend-mode='normal' fill='url(#linearGradient66)' fillRule='nonzero' strokeWidth='1.5875' strokeLinecap='round' strokeLinejoin='round'
								d='m 253.88941,68.220644 c -0.0213,0.03493 -58.00246,94.999056 -143.02899,136.022186 v 9.31623 c 59.89206,-25.26984 101.56415,-70.91494 121.74605,-98.4741 l 16.05484,10.9213 z' />
							<path
								id='rect8'
								mix-blend-mode='normal' fill='url(#linearGradient14)' fillRule='nonzero' strokeWidth='1.5875' strokeLinecap='round' strokeLinejoin='round'
								d='m 227.7662,-131.28764 -23.48913,56.100286 17.70254,-3.369058 c 10.08559,43.806043 7.39898,87.4876625 -5.7559,137.999816 l 6.58793,6.587933 c 31.11511,-89.130568 4.96418,-197.279197 4.95456,-197.318977 z'
								transform='rotate(45)' />
						</g>
						<text
							xmlSpace='preserve'
							fontStyle='normal' fontVariant='normal' fontWeight='normal' fontStretch='normal' fontSize='121.708px' line-height='0' fontFamily='Sans' text-align='center' writingMode='lr-tb' direction='ltr' textAnchor='middle' fill='#07ce9d' fillOpacity='1' strokeWidth='1.5875' strokeLinecap='round' strokeLinejoin='round'
							x='534.91016'
							y='160.16891'
							id='text2'><tspan
								fontStyle='normal' fontVariant='normal' fontWeight='bold' fontStretch='normal' fontSize='132.292px' line-height='0.7' fontFamily='DM Sans' fill='#2b8dae' fillOpacity='1' strokeWidth='1.5875'
								id='tspan3'
								x='534.91016'
								y='160.16891'>FinFlow</tspan><tspan
								fontStyle='normal' fontVariant='normal' fontWeight='600' fontStretch='normal' fontSize='43.6562px' line-height='0.7' fontFamily='DM Sans' fill='#303741' fillOpacity='1' strokeWidth='1.5875'
								x='534.91016'
								y='206.79361'
								id='tspan13'>Your wealth, visualized.</tspan></text>
					</svg>
				</Link>
				<div>
					<button ref={accountButtonRef} onClick={() => setAccountDropdownOpen((prev) => !prev)} className='mr-6'>
						<UserNoImageAvatar user={user!} size='sm' />
					</button>
					{accountDropdownOpen && (
						<div ref={accountDropdownRef} className='fixed top-14 right-6 py-3 flex flex-col items-center bg-white border border-light-gray-border rounded-lg'>
							<UserNoImageAvatar user={user!} size='md' />
							<div className='mt-2 text-dark-gray-text font-bold'>{user?.fullName}</div>
							<div className='text-gray-text text-xs'>{user?.email}</div>
							<Link to='/account' className='mt-3 mb-4 px-3 py-1 bg-[#00000008] text-[#888] text-sm border border-[#888] rounded-md hover:bg-[#0000000f]'>Manage your account</Link>
							<div className='w-64 py-2 border-y border-light-gray-border'>
								<Link to='/transactions' className='w-full px-3 py-2.5 inline-block text-[#888] text-sm font-medium hover:bg-[#0000000b]'>Transactions</Link>
								<Link to='/budgets' className='w-full px-3 py-2.5 inline-block text-[#888] text-sm font-medium hover:bg-[#0000000b]'>Budgets</Link>
								<Link to='/support' className='w-full px-3 py-2.5 inline-block text-[#888] text-sm font-medium hover:bg-[#0000000b]'>Support</Link>
							</div>
							<button onClick={() => { logout(); navigate('/login') }} className='w-full mt-2 px-3 py-2.5 inline-block text-[#888] text-sm text-left font-medium hover:bg-[#0000000b]'>Log out</button>
						</div>
					)}

				</div>
			</header>

			<div>
				<nav></nav>
				<div className='space-y-8 bg-bgcolor'>
					<button onClick={() => navigate('/transactions/new')} className='inline-flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow transition-colors duration-150'>
						+ Add Transaction
					</button>

					{/* 2. Key Metrics Summary Grid */}
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
						{metrics.map((m, index) => (
							<div key={index} className='bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow'>
								<div className='flex items-center justify-between mb-2'>
									<span className='text-sm font-medium text-gray-500'>{m.title}</span>
									<span className='text-xl'>{m.icon}</span>
								</div>
								<div className='text-2xl font-bold text-gray-900'>{m.amount}</div>
								<div className={`text-xs mt-2 font-medium ${m.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
									{m.change}
								</div>
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
				</div>
			</div>
		</>
	);
};