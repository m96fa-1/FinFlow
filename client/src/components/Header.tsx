import { Link } from 'react-router-dom'

import type { TranslationText } from '../context/TranslationContext'

import { LogoTitle } from './Logos'
import LanguageSwitcher from './LanguageSwither'

export default function Header({ text }: { text: TranslationText; }) {
	return (
		<header className='fixed top-0 left-0 right-0 px-12 h-22 bg-white z-10'>
			<nav className='h-full flex items-center justify-between'>
				<Link to='/' className='flex items-center'>
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
}