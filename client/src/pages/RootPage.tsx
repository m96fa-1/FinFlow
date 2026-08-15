import React from 'react'
import { Link } from 'react-router-dom'
import LogoTitle from '../components/LogoTitle'
import { ChevronDown, Globe } from 'lucide-react'
import clsx from 'clsx';

export default function RootPage() {
	const langButtonRef = React.useRef<HTMLButtonElement>(null);
	const langDropdownRef = React.useRef<HTMLUListElement>(null);
	const [langDropdownOpen, setLangDropdownOpen] = React.useState<boolean>(false);

	// Overflow applied only to the root page
	React.useEffect(() => {
		document.querySelector('html')!.style.overflowY = 'auto';
		document.querySelector('body')!.style.overflowY = 'auto';

		return () => {
			document.querySelector('html')!.style.overflowY = 'hidden';
			document.querySelector('body')!.style.overflowY = 'hidden';
		}
	}, []);

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
		<>
			<header className='fixed top-0 left-0 right-0 px-8 h-22 bg-white'>
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
			<main className='mt-22 h-1000'>
				<div style={{ backgroundImage: 'linear-gradient(to right, #eaeaea 1px, transparent 1px), linear-gradient(to bottom, #eaeaea 1px, transparent 1px)', backgroundSize: '64px 64px', backgroundPosition: '0 0' }} className='px-10 flex flex-col bg-[#fafafa] rounded-b-[10rem]'>
					<h1 className='mt-25 mb-4 text-6xl text-gray-800 font-prata-serif font-black'>Master Your Cash Flow</h1>
					<p className='mb-6 text-gray-800'>Track transactions, set budgets, and take total control of your financial future in real time.</p>
					<div className='w-120 mb-25 flex gap-2'>
						<a href='/login' className='flex-1 px-6 py-2.5 bg-bluish-cyan text-white rounded-sm text-center font-medium transition-all duration-300 hover:rounded-4xl'>Sign In</a>
						<a href='/register' className='flex-1 px-6 py-2.5 text-gray-800 border border-gray-800 rounded-sm text-center font-medium transition-all duration-300 hover:rounded-4xl'>Create a new account</a>
					</div>
				</div>
			</main>
		</>
	);
}