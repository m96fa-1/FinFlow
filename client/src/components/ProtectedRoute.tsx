import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<p className='text-[#666]'>Loading session...</p>
			</div>
		);
	}

	return isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />;
};