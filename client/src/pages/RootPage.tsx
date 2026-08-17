import React from 'react'
import { Link } from 'react-router-dom'
import { type TranslationText, useTranslation } from '../context/TranslationContext'
import LogoTitle from '../components/LogoTitle'
import LanguageSwitcher from '../components/LanguageSwither'
import { ArrowRight, ArrowRightLeft, ChartPie, HandCoins, LineChart, LinkIcon, LockKeyhole, ShieldCheck, TrendingUp, UsersRound } from 'lucide-react'

export default function RootPage() {
	const { text } = useTranslation();

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
			<Header text={text} />
			<main className='mt-22'>
				<TopSection />
				<HowFinFlowWorks />
				<BankGradeSecurity />
			</main>
			<Footer />
		</>
	);
}

const Header = ({ text }: { text: TranslationText }) => {
	return (
		<header className='fixed top-0 left-0 right-0 px-12 h-22 bg-white'>
			<nav className='h-full flex items-center justify-between'>
				<Link to='/dashboard' className='flex items-center'>
					<LogoTitle height={56} />
				</Link>
				<div className='relative flex items-center gap-8'>
					<LanguageSwitcher />
					<Link to='/support' className='flex items-center text-gray-800 font-medium transition-colors duration-300 ease-out hover:text-bluish-cyan'>
						{text.rootPage.header.supportPageLink}
					</Link>
					<Link to='/register' className='flex items-center text-gray-800 font-medium hover:text-bluish-cyan'>
						{text.rootPage.header.registerPageLink}
					</Link>
					<Link to='/login' className='px-6 py-2.5 bg-bluish-cyan text-white rounded-sm font-medium transition-all duration-300 hover:rounded-4xl'>
						{text.rootPage.header.loginPageLink}
					</Link>
				</div>
			</nav>
		</header>
	);
};

const TopSection = () => {
	const features = [
		{
			title: 'Real-Time Analytics',
			description: 'Visual trend lines, monthly burn rates, and income vs. expense breakdowns.',
			icon: <LineChart width='100%' height='100%' color='var(--color-bluish-cyan)' strokeWidth='1.5' />,
		},
		{
			title: 'Smart Budgeting',
			description: 'Custom spending limits with automated visual progress bars and alert thresholds.',
			icon: <ChartPie width='100%' height='100%' color='var(--color-bluish-cyan)' strokeWidth='1.5' />,
		},
		{
			title: 'Multi-Account Management',
			description: 'Unified net worth view across checking, savings, credit cards, and investments.',
			icon: <UsersRound width='100%' height='100%' color='var(--color-bluish-cyan)' strokeWidth='1.5' />,
		},
		{
			title: 'Transaction Categorization',
			description: 'Automatic tagging for recurring bills, dining, groceries, and custom tags.',
			icon: <ArrowRightLeft width='100%' height='100%' color='var(--color-bluish-cyan)' strokeWidth='1.5' />,
		},
	];

	return (
		<div style={{ backgroundImage: 'linear-gradient(to right, #e5e5e5 1px, transparent 1px), linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)', backgroundSize: '64px 64px' }} className='mb-30 px-20 bg-[#f8f8f8] rounded-b-[10rem]'>
			<div className='pt-20 mb-10 flex items-center justify-between'>
				<div>
					<h1 className='mb-4 text-6xl text-gray-800 font-prata-serif font-black'>Master Your Cash Flow</h1>
					<p className='mb-6 text-gray-800'>Track transactions, set budgets, and take total control of your financial future in real time.</p>
					<div className='w-120 flex gap-2'>
						<Link to='/login' className='flex-1 px-6 py-2.5 bg-bluish-cyan text-white rounded-sm text-center font-medium transition-all duration-300 hover:rounded-4xl'>Sign In</Link>
						<Link to='/register' className='flex-1 px-6 py-2.5 text-gray-800 border border-gray-800 rounded-sm text-center font-medium transition-all duration-300 hover:rounded-4xl'>Create a new account</Link>
					</div>
				</div>
				<div className='w-100 h-50 bg-emerald-500 text-white'>Dashboard Showcase</div>
			</div>
			<div className='w-full pb-18 flex gap-2'>
				{features.map((el, index) => (
					<div key={index} className='flex-1 h-20 p-3 flex items-center gap-2 bg-white border border-gray-200 rounded-xl'>
						<div className='h-full aspect-square'>
							{el.icon}
						</div>
						<div>
							<h3 className='text-gray-800 text-lg font-semibold'>
								{el.title}
							</h3>
							<p className='text-gray-700 text-xs leading-[1.2]'>
								{el.description}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

const HowFinFlowWorks = () => {
	return (
		<div className='mb-30 mx-20'>
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

const BankGradeSecurity = () => {
	return (
		<div className='mb-20 px-20 py-20 flex gap-8 bg-gray-800 text-white'>
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

const Footer = () => {
	const footerLinks = [
		{
			title: 'About',
			items: [
				{ name: 'Careers', link: '', },
				{ name: 'Careers', link: '/careers', },
				{ name: 'Investor Relations', link: '/investors', },
				{ name: 'Legal', link: '/legal', },
				{ name: 'Privacy Policy', link: '/privacy-policy', },
				{ name: 'Security Information', link: '/security-information', },
				{ name: 'Trust Center', link: '/trust-center', },
				{ name: 'Follow Us', link: '/follow-us', },
			],
		},
		{
			title: 'Support',
			items: [
				{ name: 'Contact Us', link: '/contact' },
				{ name: 'Support Portal', link: '/support' },
				{ name: 'Dashboard Status', link: '/status' },
				{ name: 'Product Updates', link: '/product-updates' },
				{ name: 'Manage Cookies', link: '/cookies' },
			],
		},
		{
			title: 'Subscriptions',
			items: [
				{ name: 'FinFlow Dashboard', link: '/register' },
				{ name: 'Enterprise Advanced', link: '/subscriptions/enterprise' },
				{ name: 'Community Edition', link: '/subscriptions/community' },
			],
		},
		{
			title: 'Data Basics',
			items: [
				{ name: 'Vector Databases', link: '/register' },
				{ name: 'NoSQL Databases', link: '/nosql-databases' },
				{ name: 'Document Databases', link: '/document-databases' },
				{ name: 'RAG Database', link: '/rag-database' },
				{ name: 'ACID Transactions', link: '/acid-transactions' },
				{ name: 'MERN Stack', link: '/mern-stack' },
				{ name: 'Agent Memory', link: '/agent-memory' },
				{ name: 'MEAN Stack', link: '/mean-stack' },
			],
		},
	];

	return (
		<footer className='py-15 px-20 flex justify-between border-t border-gray-800'>
			<div className='flex flex-col justify-between'>
				<div>
					<Link to='/'>
						<LogoTitle height={56} />
					</Link>
					<LanguageSwitcher className='mt-4' />
				</div>
				<div className='text-gray-700 text-sm'>&copy; 2026 FinFlow, Inc.</div>
			</div>
			{footerLinks.map((el, i) => (
				<div key={i} className='flex flex-col gap-4'>
					<h4 className='text-lg font-medium'>{el.title}</h4>
					{el.items.map((it, j) => (
						<Link key={j} to={it.link} className='hover:underline hover:text-bluish-cyan'>
							{it.name}
						</Link>
					))}
				</div>
			))}
		</footer>
	);
};