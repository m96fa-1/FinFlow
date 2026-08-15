import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import UserNoImageAvatar from '../components/UserNoImageAvatar'
import LogoTitle from '../components/LogoTitle'
import { LinkIcon, ArrowRightLeft, ChartLine, ChartPie, LayoutDashboard, Settings } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Header className='fixed top-0 left-0 right-0 py-2 flex items-center justify-between gap-4 bg-white border-b border-gray-300' />
			<div className='h-screen pt-18 flex overflow-hidden'>
				<NavSection className='h-full min-w-64 shrink-0 overflow-y-auto border-r border-gray-300 scrollbar-thumb-[#808080]' />
				<main className='h-full flex-1 p-8 space-y-8 overflow-auto bg-linear-to-r from-bluish-cyan/15 to-greenish-cyan/15 scrollbar-thumb-[#808080]'>
					{children}
				</main>
			</div>
		</>
	);
}

const Header = ({ className }: { className: string }) => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const accountButtonRef = React.useRef<HTMLButtonElement>(null);
	const accountDropdownRef = React.useRef<HTMLDivElement>(null);
	const [accountDropdownOpen, setAccountDropdownOpen] = React.useState<boolean>(false);

	// Account button and dropdown handling
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
		<header className={className}>
			<Link to='/dashboard' className='ml-4'>
				<LogoTitle height={56} />
			</Link>
			<div className='flex items-center'>
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

const NavSection = ({ className }: { className: string }) => {
	const location = useLocation();

	const navElements = [
		{
			title: 'MAIN',
			items: [
				{
					name: 'Dashboard',
					icon: <LayoutDashboard width='20' height='20' strokeWidth='1.3' className='text-bluish-cyan' />,
					destination: '/dashboard',
				},
				{
					name: 'Transactions',
					icon: <ArrowRightLeft width='20' height='20' strokeWidth='1.3' className='text-bluish-cyan' />,
					destination: '/transactions',
				},
				{
					name: 'Budgets',
					icon: <ChartPie width='20' height='20' strokeWidth='1.3' className='text-bluish-cyan' />,
					destination: '/budgets',
				},
				{
					name: 'Analytics',
					icon: <ChartLine width='20' height='20' strokeWidth='1.3' className='text-bluish-cyan' />,
					destination: '/analytics',
				},
			],
		},
		{
			title: 'ACCOUNT',
			items: [
				{
					name: 'Bank Links',
					icon: <LinkIcon width='20' height='20' strokeWidth='1.3' className='text-bluish-cyan' />,
					destination: '/bank-links',
				},
				{
					name: 'Settings',
					icon: <Settings width='20' height='20' strokeWidth='1.3' className='text-bluish-cyan' />,
					destination: '/settings',
				},
			],
		}
	];

	return (
		<nav className={className}>
			{navElements.map((section, index) => (
				<div key={index}>
					<h3 className='mt-4 mx-4 text-gray-500 text-xs'>{section.title}</h3>
					<ul>
						{section.items.map((item, index) => (
							<li key={index}><Link to={item.destination} className={`${location.pathname === item.destination ? 'bg-gray-100' : ''} font-medium px-4 py-2.5 flex items-center gap-1 text-sm hover:bg-gray-100`}>
								{item.icon}
								<h4 className='text-gray-700 font-medium'>{item.name}</h4>
							</Link></li>
						))}
					</ul>
				</div>
			))}
		</nav>
	);
};