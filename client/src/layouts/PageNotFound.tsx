import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PageNotFound() {
	const { isLoading, isAuthenticated } = useAuth();
	const location = useLocation();

	const homeLink = isAuthenticated ? '/dashboard' : '/login';

	return (
		<div className='min-h-screen p-4 flex items-center justify-center bg-gray-100'>
			<div className='max-w-120 text-center'>
				<h1 className='text-bluish-cyan text-8xl font-sans font-black'>404</h1>
				<h2 className='mt-3 mb-2 text-gray-800 text-3xl font-bold'>Page Not Found</h2>
				<code className='mt-3 mb-2 px-2 py-1.5 code'><pre className='pre'>{location.pathname}</pre></code>
				<p className='mt-2 mb-8 text-gray-500'>
					Oops! The page you are looking for doesn't exist or has been moved.
				</p>
				<Link to={homeLink} className='inline-block px-6 py-2.5 gradient-button hover-extend'>
					{isLoading ? 'Loading...' : isAuthenticated ? 'Go to Dashboard' : 'Go to Login'}
				</Link>
			</div>
		</div>
	);
};