import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function LoginPage() {
	const { login } = useAuth();
	const navigate = useNavigate();

	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [error, setError] = React.useState('');
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	const handleSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault();
		setError('');
		setIsSubmitting(true);

		try {
			await login({ email, password });
			navigate('/dashboard');
		} catch (err: any) {
			setError(err.response?.data?.message || 'Invalid email or password');
		} finally {
			setIsSubmitting(false);
		}
	};
	
	return (
		<div className='min-h-screen flex items-center justify-center bg-bgcolor'>
			<div className='w-full max-w-100 p-8 rounded-lg bg-white shadow'>
				<h2 className='mb-6 text-2xl text-center font-semibold'>Log In</h2>
				{error && <div className='mb-4 p-3 text-sm rounded-md'>{error}</div>}

				<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
					<div className='flex flex-col gap-1'>
						<label className='text-[#374151] text-sm font-medium'>Email Address</label>
						<input
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							placeholder='name@example.com'
							className='form-input'
						/>
					</div>
					<div className='flex flex-col gap-1'>
						<label className='text-[#374151] text-sm font-medium'>Password</label>
						<input
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							placeholder='••••••••'
							className='form-input'
						/>
					</div>

					<button type='submit' disabled={isSubmitting} className='mt-2 gradient-blue-button button-hover-shadow'>
						{isSubmitting ? 'Signing in...' : 'Log In'}
					</button>
				</form>

				<p className='mt-6 text-[#6b7280] text-center text-sm'>
					Don't have an account? <Link to='/register' className='text-blue font-medium hover:underline'>Register</Link>
				</p>
			</div>
		</div>
	);
};