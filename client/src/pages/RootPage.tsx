import React from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import LogoTitle from '../components/LogoTitle'
import { ArrowRight, ArrowRightLeft, ChartPie, ChevronDown, Globe, HandCoins, LineChart, LinkIcon, LockKeyhole, ShieldCheck, TrendingUp, UsersRound } from 'lucide-react'

export default function RootPage() {
	// Overflow applied only to the root page
	React.useEffect(() => {
		document.querySelector('html')!.style.overflowY = 'auto';
		document.querySelector('body')!.style.overflowY = 'auto';

		return () => {
			document.querySelector('html')!.style.overflowY = 'hidden';
			document.querySelector('body')!.style.overflowY = 'hidden';
		}
	}, []);

	return (
		<>
			<Header className='fixed top-0 left-0 right-0 px-12 h-22 bg-white' />
			<main className='mt-22'>
				<TopSection style={{ backgroundImage: 'linear-gradient(to right, #e5e5e5 1px, transparent 1px), linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)', backgroundSize: '64px 64px' }} className='mb-30 px-20 bg-[#f8f8f8] rounded-b-[10rem]' />
				<HowFinFlowWorks className='mb-30 mx-20' />
				<BankGradeSecurity className='px-20 py-20 flex gap-8 bg-gray-800 text-white' />
			</main>
			<Footer className='' />
		</>
	);
}

const Header = ({ className }: { className?: string; }) => {
	const langButtonRef = React.useRef<HTMLButtonElement>(null);
	const langDropdownRef = React.useRef<HTMLUListElement>(null);
	const [langDropdownOpen, setLangDropdownOpen] = React.useState<boolean>(false);

	React.useEffect(() => {
		const handleDropdownClick = (ev: PointerEvent) => {
			if (
				langDropdownRef.current && langButtonRef.current &&
				!langButtonRef.current.contains(ev.target as Node) &&
				!langDropdownRef.current.contains(ev.target as Node)
			) {
				setLangDropdownOpen(false);
			}
		};
		const handleDropdownKeyDown = (ev: KeyboardEvent) => {
			if (ev.key === 'Escape')
				setLangDropdownOpen(false);
		};

		document.addEventListener('click', handleDropdownClick);
		document.addEventListener('keydown', handleDropdownKeyDown);

		return () => {
			document.removeEventListener('click', handleDropdownClick);
			document.removeEventListener('keydown', handleDropdownKeyDown);
		};
	}, [langButtonRef, langDropdownRef]);

	return (
		<header className={className}>
			<nav className='h-full flex items-center justify-between'>
				<a href='/dashboard' className='flex items-center'>
					<LogoTitle height={56} />
				</a>
				<div className='relative flex items-center gap-8'>
					<button ref={langButtonRef} onClick={() => setLangDropdownOpen((prev) => !prev)} className='h-fit flex items-center gap-0.5 text-gray-800 font-medium'>
						<Globe width='1rem' className='mr-1' />
						<span>Eng</span>
						<ChevronDown width='1rem' className={clsx('mt-0.5 transition-all', langDropdownOpen && 'rotate-90')} />
					</button>
					{langDropdownOpen && <ul ref={langDropdownRef} className='absolute top-10 right-86 min-w-25 p-4 space-y-2 bg-white text-gray-800 border border-gray-200 rounded-md transition-all'>
						<li role='option'><Link to='/' className='block text-bluish-cyan hover:text-bluish-cyan'>English</Link></li>
						<li role='option'><Link to='/ar' className='block hover:text-bluish-cyan'>العربية</Link></li>
						<li role='option'><Link to='/tr' className='block hover:text-bluish-cyan'>Türkçe</Link></li>
						<li role='option'><Link to='/es' className='block hover:text-bluish-cyan'>Español</Link></li>
					</ul>}
					<Link to='/support' className='flex items-center text-gray-800 font-medium transition-colors duration-300 ease-out hover:text-bluish-cyan'>Support</Link>
					<Link to='/register' className='flex items-center text-gray-800 font-medium hover:text-bluish-cyan'>Get Started</Link>
					<Link to='/login' className='px-6 py-2.5 bg-bluish-cyan text-white rounded-sm font-medium transition-all duration-300 hover:rounded-4xl'>Sign In</Link>
				</div>
			</nav>
		</header>
	);
};

const TopSection = ({ style, className }: { style?: React.CSSProperties; className?: string; }) => {
	return (
		<div style={style} className={className}>
			<div className='pt-20 mb-10 flex items-center justify-between'>
				<div>
					<h1 className='mb-4 text-6xl text-gray-800 font-prata-serif font-black'>Master Your Cash Flow</h1>
					<p className='mb-6 text-gray-800'>Track transactions, set budgets, and take total control of your financial future in real time.</p>
					<div className='w-120 flex gap-2'>
						<a href='/login' className='flex-1 px-6 py-2.5 bg-bluish-cyan text-white rounded-sm text-center font-medium transition-all duration-300 hover:rounded-4xl'>Sign In</a>
						<a href='/register' className='flex-1 px-6 py-2.5 text-gray-800 border border-gray-800 rounded-sm text-center font-medium transition-all duration-300 hover:rounded-4xl'>Create a new account</a>
					</div>
				</div>
				<div className='w-100 h-50 bg-emerald-500 text-white'>Dashboard Showcase</div>
			</div>
			<div className='w-full pb-18 flex gap-2'>
				<div className='flex-1 h-20 p-3 flex items-center gap-2 bg-white border border-gray-200 rounded-xl'>
					<div className='h-full aspect-square'>
						<LineChart width='100%' height='100%' color='var(--color-bluish-cyan)' strokeWidth='1.5' />
					</div>
					<div>
						<h3 className='text-gray-800 text-lg font-semibold'>Real-Time Analytics</h3>
						<p className='text-gray-700 text-xs leading-[1.2]'>Visual trend lines, monthly burn rates, and income vs. expense breakdowns.</p>
					</div>
				</div>
				<div className='flex-1 h-20 p-3 flex items-center gap-2 bg-white border border-gray-200 rounded-xl'>
					<div className='h-full aspect-square'>
						<ChartPie width='100%' height='100%' color='var(--color-bluish-cyan)' strokeWidth='1.5' />
					</div>
					<div>
						<h3 className='text-gray-800 text-lg font-semibold'>Smart Budgeting</h3>
						<p className='text-gray-700 text-xs leading-[1.2]'>Custom spending limits with automated visual progress bars and alert thresholds.</p>
					</div>
				</div>
				<div className='flex-1 h-20 p-3 flex items-center gap-2 bg-white border border-gray-200 rounded-xl'>
					<div className='h-full aspect-square'>
						<UsersRound width='100%' height='100%' color='var(--color-bluish-cyan)' strokeWidth='1.5' />
					</div>
					<div>
						<h3 className='text-gray-800 text-lg font-semibold'>Multi-Account Management</h3>
						<p className='text-gray-700 text-xs leading-[1.2]'>Unified net worth view across checking, savings, credit cards, and investments.</p>
					</div>
				</div>
				<div className='flex-1 h-20 p-3 flex items-center gap-2 bg-white border border-gray-200 rounded-xl'>
					<div className='h-full aspect-square'>
						<ArrowRightLeft width='100%' height='100%' color='var(--color-bluish-cyan)' strokeWidth='1.5' />
					</div>
					<div>
						<h3 className='text-gray-800 text-lg font-semibold'>Transaction Categorization</h3>
						<p className='text-gray-700 text-xs leading-[1.2]'>Automatic tagging for recurring bills, dining, groceries, and custom tags.</p>
					</div>
				</div>
			</div>
		</div>
	);
};

const HowFinFlowWorks = ({ className }: { className?: string; }) => {
	return (
		<div className={className}>
			<h2 className='mb-8 text-gray-800 text-4xl text-center font-prata-serif font-bold'>How FinFlow Works</h2>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<div className='p-2 bg-bluish-cyan/10 rounded-[30%]'><LinkIcon width='2rem' height='2rem' color='var(--color-bluish-cyan)' /></div>
					<div>
						<h3 className='text-gray-800 text-xl font-semibold'>1. Connect Accounts</h3>
						<p className='text-gray-700 text-md'>Link your bank accounts securely.</p>
					</div>
				</div>
				<div><ArrowRight color='var(--color-gray-500)' /></div>
				<div className='flex items-center gap-2'>
					<div className='p-2 bg-bluish-cyan/10 rounded-[30%]'><TrendingUp width='2rem' height='2rem' color='var(--color-bluish-cyan)' /></div>
					<div>
						<h3 className='text-gray-800 text-xl font-semibold'>2. Visualize Flow</h3>
						<p className='text-gray-700 text-md'>Visualize your money grow.</p>
					</div>
				</div>
				<div><ArrowRight color='var(--color-gray-500)' /></div>
				<div className='flex items-center gap-2'>
					<div className='p-2 bg-bluish-cyan/10 rounded-[30%]'><HandCoins width='2rem' height='2rem' color='var(--color-bluish-cyan)' /></div>
					<div>
						<h3 className='text-gray-800 text-xl font-semibold'>3. Optimize Wealth</h3>
						<p className='text-gray-700 text-md'>Adjust budget allocations and save money.</p>
					</div>
				</div>
			</div>
		</div>
	);
};

const BankGradeSecurity = ({ className }: { className?: string; }) => {
	return (
		<div className={className}>
			<div className='flex-1'>
				<h2 className='mb-4 text-white text-5xl font-bold'>Bank-Grade Security</h2>
				<p className='mb-10 text-gray-300 text-lg'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi id dolore maiores neque, nisi doloremque.</p>
				<div className='flex'>
					<div className='flex'>
						<div className='p-2 bg-[#213D51] rounded-full'>
							<ShieldCheck width='2.5rem' height='2.5rem' color='var(--color-bluish-cyan)' />
						</div>
						<div className='-ml-3 p-2 bg-[#213D51] rounded-full'>
							<LockKeyhole width='2.5rem' height='2.5rem' color='var(--color-bluish-cyan)' />
						</div>
					</div>
					<ul className='list-disc ml-15 grid grid-cols-2 gap-x-20 text-lg'>
						<li>256-bit Encryption</li>
						<li>Read-Only Access</li>
						<li>Privacy Guarantee</li>
						<li>No Third-Parties</li>
					</ul>
				</div>
			</div>
			<div className='flex-1 p-6 flex flex-col items-center justify-between bg-linear-to-tr from-white/80 to-white rounded-2xl'>
				<h2 className='text-gray-800 text-4xl text-center font-semibold'>
					Ready to visualize your growth?<br />Unlock financial clarity today.
				</h2>
				<Link to='/register' className='px-6 py-2.5 bg-bluish-cyan text-white rounded-full font-medium hover-extend'>Get Started</Link>
			</div>
		</div>
	);
};

const Footer = ({ className }: { className?: string; }) => {
	return (
		<footer className={className}>
			<Link to='/'></Link>
		</footer>
	);
};