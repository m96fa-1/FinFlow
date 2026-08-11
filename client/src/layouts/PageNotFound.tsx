import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PageNotFound() {
	const { isAuthenticated } = useAuth();
	const location = useLocation();

	const homeLink = isAuthenticated ? '/dashboard' : '/login';

	return (
		<div className='min-h-screen p-4 flex items-center justify-center bg-bgcolor'>
			<div className='max-w-120 text-center'>
				<h1 className='text-blue text-8xl font-extrabold'>404</h1>
				<h2 className='mt-3 mb-2 text-[#1e293b] text-3xl font-bold'>Page Not Found</h2>
				<code className='mt-3 mb-2 code'><pre className='pre'>{location.pathname}</pre></code>
				<p className='mt-2 mb-8 text-[hsl(215,16%,40%)]'>
					Oops! The page you are looking for doesn't exist or has been moved.
				</p>
				<Link to={homeLink} className='inline-block gradient-blue-button button-hover-extend'>
					{isAuthenticated ? 'Go to Dashboard' : 'Go to Login'}
				</Link>
			</div>
		</div>
	);
};