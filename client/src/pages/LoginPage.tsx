import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { validateEmail } from '../lib/utils'
import background from '../assets/login-background.jpg'
import LogoTitle from '../components/LogoTitle'

export default function LoginPage() {
	const { isAuthenticated, login } = useAuth();
	const navigate = useNavigate();

	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [error, setError] = React.useState('');
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [invalidEmail, setIsInvalidEmail] = React.useState(false);

	React.useEffect(() => {
		if (isAuthenticated) {
			navigate('/dashboard', { replace: true });
		}
	}, [isAuthenticated]);

	const handleSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault();

		if (!validateEmail(email)) {
			setIsInvalidEmail(true);
			return;
		}
		
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
		<div className='min-h-screen flex'>
			<div className='w-110 h-full p-10 bg-white'>
				<LogoTitle height={64} />
				<h2 className='mt-8 mb-6 text-gray-800 text-3xl font-prata-serif font-semibold'>Log in</h2>
				{error && <div className='mb-6 text-red-500 text-sm'>* {error}</div>}

				<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
					<div className='flex flex-col gap-1'>
						<label htmlFor='email' className='text-gray-700 text-sm font-semibold'>Email Address</label>
						<input
							id='email'
							type='email'
							name='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							placeholder='name@example.com'
							autoComplete='email'
							className='form-input'
						/>
						{invalidEmail && <div className='relative pl-3.5 text-red-500 text-xs'><span className='absolute left-px text-md'>*</span> Please enter a valid email before submitting</div>}
					</div>
					<div className='flex flex-col gap-1'>
						<label htmlFor='password' className='text-gray-700 text-sm font-semibold'>Password</label>
						<input
							id='password'
							type='password'
							name='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							placeholder='••••••••'
							className='form-input'
						/>
					</div>

					<button type='submit' disabled={isSubmitting} className='w-fit mt-4 gradient-button px-8 py-2.5 hover-shadow'>
						{isSubmitting ? 'Signing in...' : 'Log in'}
					</button>
				</form>

				<p className='mt-2 text-gray-500 text-sm'>
					Don't have an account? <Link to='/register' className='text-bluish-cyan font-medium hover:underline'>Register</Link>
				</p>
			</div>
			<div className='relative flex-1 min-h-screen bg-black'>
				<img src={background} alt='A Happy Girl Working On Her Laptop' className='absolute w-full h-full object-cover select-none drag-none opacity-90' />
			</div>
		</div>
	);
};