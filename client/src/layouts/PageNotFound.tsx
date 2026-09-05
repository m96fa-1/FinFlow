import { Link, useLocation } from 'react-router-dom'

import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTranslation } from '../context/TranslationContext'
import { useAuth } from '../context/AuthContext'

import Header from '../components/Header'

export default function PageNotFound() {
	useDocumentTitle('404 Not Found');
	
	const { text } = useTranslation();
	const { isLoading, isAuthenticated } = useAuth();
	const location = useLocation();

	const secondLink = isAuthenticated ? '/dashboard' : '/login';

	return (
		<>
		<Header text={text} />
		<div className='min-h-screen p-4 flex items-center justify-center'>
			<div className='max-w-120 text-center'>
				<h1 className='text-bluish-cyan text-8xl font-sans font-black'>404</h1>
				<h2 className='mt-3 mb-2 text-gray-800 text-3xl font-bold'>Page Not Found</h2>
				<code className='mt-3 mb-2 px-2 py-1.5 code'><pre className='pre'>{location.pathname}</pre></code>
				<p className='mt-2 mb-8 text-gray-500'>
					Oops! The page you are looking for doesn't exist or has been moved.
				</p>
				<div className='w-120 flex gap-2'>
					<Link to='/' className='flex-1 px-6 py-2.5 bg-bluish-cyan text-white rounded-sm text-center font-medium transition-all duration-300 hover:rounded-4xl'>
						FinFlow Homepage
					</Link>
					<Link to={secondLink} className='flex-1 px-6 py-2.5 text-gray-700 border border-gray-700 rounded-sm text-center font-medium transition-all duration-300 hover:rounded-4xl'>
						{isLoading ? 'Loading...' : isAuthenticated ? 'FinFlow Dashboard' : 'Login Page'}
					</Link>
				</div>
			</div>
		</div>
		</>
	);
};