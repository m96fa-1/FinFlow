import React from 'react'
import { useLocation } from 'react-router-dom'
import textContent from '../i18n/textContent.json'

export type LanguageCode = keyof typeof textContent;
export type TranslationText = typeof textContent[LanguageCode];

export interface LanguageOption {
	code: LanguageCode;
	name: string;
}

// Get all the languages as { code, name } pairs
const ALL_LANGUAGES: LanguageOption[] = (
	Object.keys(textContent) as LanguageCode[]
).map((code) => ({
	code,
	name: textContent[code].name,
}));

interface TranslationContextType {
	text: TranslationText;
	currentLangCode: LanguageCode;
	currentLangName: string;
	setLanguage: React.Dispatch<React.SetStateAction<LanguageCode>>;
	allLanguages: LanguageOption[];
}

const TranslationContext = React.createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: React.ReactNode }) => {
	const location = useLocation();

	// Get the current language from the URL
	let pathnameLanguage;
	const nextSlashPos = location.pathname.indexOf('/', 2);
	if (nextSlashPos === -1)
		pathnameLanguage = location.pathname.substring(1);
	else
		pathnameLanguage = location.pathname.substring(1, nextSlashPos);
	if (!Object.keys(textContent).includes(pathnameLanguage))
		pathnameLanguage = 'en';

	const [currentLangCode, setLanguage] = React.useState<LanguageCode>(pathnameLanguage as LanguageCode);
	
	const text = (textContent[currentLangCode]);

	return (
		<TranslationContext.Provider
			value={{
				text,
				currentLangCode,
				currentLangName: text.name,
				setLanguage,
				allLanguages: ALL_LANGUAGES,
			}}
		>
			{children}
		</TranslationContext.Provider>
	);
};

// Custom hook for consuming text context safely
export const useTranslation = () => {
	const context = React.useContext(TranslationContext);
	if (!context) {
		throw new Error('useTranslation must be used within an AuthProvider');
	}
	return context;
};