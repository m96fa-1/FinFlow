import React from 'react'
import { useNavigate } from 'react-router-dom'
import { type LanguageCode, useTranslation } from '../context/TranslationContext'
import clsx from 'clsx'
import { Globe, ChevronDown } from 'lucide-react'

export default function LanguageSwitcher({ className }: { className?: string; }) {
	const navigate = useNavigate();
	const { currentLangCode, currentLangName, setLanguage, allLanguages } = useTranslation();

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

	const changeLanguageOnClick = (code: LanguageCode) => {
		setLanguage(code);
		setLangDropdownOpen(false);
		navigate(code === 'en' ? '/' : code);
	};

	return (
		<div className={clsx('relative w-fit h-fit', className)}>
			<button ref={langButtonRef} onClick={() => setLangDropdownOpen((prev) => !prev)} className='flex items-center gap-0.5 text-gray-800 font-medium'>
				<Globe width='1rem' className='mr-1' />
				<span>{currentLangCode === 'ar' ? currentLangName : currentLangName.substring(0, 3)}</span>
				<ChevronDown width='1rem' className={clsx('mt-0.5 transition-all', langDropdownOpen && 'rotate-90')} />
			</button>
			{langDropdownOpen && (
				<ul ref={langDropdownRef} className='absolute top-10 left-[calc(50%-100px/2)] w-25 p-4 space-y-2 bg-white text-gray-800 border border-gray-200 rounded-md transition-all'>
					{allLanguages.map((language) => (
						<li role='option'>
							<button onClick={() => changeLanguageOnClick(language.code)} className={clsx(currentLangCode === language.code && 'text-bluish-cyan', 'block hover:text-bluish-cyan')}>
								{language.name}
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}