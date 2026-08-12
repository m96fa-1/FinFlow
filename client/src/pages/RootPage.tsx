import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'

export default function RootPage() {
	const { isLoading, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	React.useEffect(() => {
		if (isAuthenticated) {
			navigate('/dashboard');
		}
	}, [isLoading]);

	return (
		<>
			<Header />
			<main className='bg-bgcolor'>
				<a href="/register">Create a new account</a>
				<a href='/login'>Login</a>
			</main>
		</>
	);
}