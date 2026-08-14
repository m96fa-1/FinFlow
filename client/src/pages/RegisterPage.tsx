import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { validateFullName, validateEmail, validatePassword } from '../utils'
import LogoTitle from '../components/LogoTitle'
import clsx from 'clsx'
import background from '../assets/register-background.jpg'

export default function RegisterPage() {
	const { isAuthenticated, register } = useAuth();
	const navigate = useNavigate();

	const [fullName, setFullName] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [passwordRepeat, setPasswordRepeat] = React.useState('');
	
	const [error, setError] = React.useState('');
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [disableSubmit, setDisableSubmit] = React.useState(true);

	const [invalidFullName, setInvalidFullName] = React.useState(false);
	const [invalidEmail, setInvalidEmail] = React.useState(false);
	const [invalidPassword, setInvalidPassword] = React.useState(false);
	const [invalidPasswordRepeat, setInvalidPasswordRepeat] = React.useState(false);

	React.useEffect(() => {
		if (isAuthenticated) {
			navigate('/dashboard', { replace: true });
		}
	}, [isAuthenticated]);

	React.useEffect(() => {
		if (validateFullName(fullName)) {
			setInvalidFullName(false);
		} else {
			setInvalidFullName(true);
		}
		if (validateEmail(email)) {
			setInvalidEmail(false);
		} else {
			setInvalidEmail(true);
		}
		if (validatePassword(password)) {
			setInvalidPassword(false);
		} else {
			setInvalidPassword(true);
		}
		if (password === passwordRepeat) {
			setInvalidPasswordRepeat(false);
		} else {
			setInvalidPasswordRepeat(true);
		}

		if (
			validateFullName(fullName) &&
			validateEmail(email) &&
			validatePassword(password) &&
			(password === passwordRepeat)
		) {
			setDisableSubmit(false);
		} else {
			setDisableSubmit(true);
		}
	}, [fullName, email, password, passwordRepeat]);

	const handleSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault();
		setError('');
		setIsSubmitting(true);

		// to be extra safe
		if (
			!validateFullName(fullName) ||
			!validateEmail(email) ||
			!validatePassword(password) ||
			(password !== passwordRepeat)
		) return;

		const fullNameCapitalized = fullName.replace(/\b\w/g, (char) => char.toUpperCase());
		const emailLowercased = email.toLowerCase();

		try {
			await register({ fullName: fullNameCapitalized, email: emailLowercased, password });
			navigate('/dashboard');
		} catch (err: any) {
			setError(err.response?.data?.message || 'Server error');
		} finally {
			setIsSubmitting(false);
		}
	};
	
	return (
		<div className='min-h-screen flex'>
			<div className='relative flex-1 min-h-screen bg-black'>
				<img src={background} alt='A Happy Girl Working On Her Laptop' className='absolute w-full h-full object-cover select-none drag-none opacity-90' />
			</div>
			<div className='w-180 h-full p-10 bg-white'>
				<LogoTitle height={64} />
				<h2 className='mt-8 mb-6 text-gray-800 text-3xl font-prata-serif font-semibold'>Register</h2>
				{error && <div className='mb-6 text-red-500 text-sm'>* {error}</div>}

				<form onSubmit={handleSubmit} className='w-110 flex flex-col gap-4'>
					<div className='flex flex-col gap-1'>
						<label htmlFor='name' className='text-gray-700 text-sm font-semibold'>Full Name</label>
						<input
							id='name'
							type='text'
							name='name'
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							required
							placeholder='Alex Adams'
							autoComplete='name'
							className='form-input'
						/>
						{invalidFullName && fullName && <div className='relative pl-3.5 text-red-500 text-xs'><span className='absolute left-px text-md'>*</span> Invalid full name, please enter your real full name</div>}
					</div>
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
						{invalidEmail && email && <div className='relative pl-3.5 text-red-500 text-xs'><span className='absolute left-px text-md'>*</span> Invalid email address</div>}
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
							autoComplete='new-password'
							className='form-input'
						/>
						{invalidPassword && password && <div className='relative pl-3.5 text-red-500 text-xs'><span className='absolute left-px text-md'>*</span> Invalid password, your password should contain at least 1 uppercase, 1 lowercase and 1 number and must be at least 8 characters long. It can contain the following symbols; @.#$!%*?&</div>}
					</div>
					<div className='flex flex-col gap-1'>
						<label htmlFor='passwordRepeat' className='text-gray-700 text-sm font-semibold'>Password Repeat</label>
						<input
							id='passwordRepeat'
							type='password'
							name='passwordRepeat'
							value={passwordRepeat}
							onChange={(e) => setPasswordRepeat(e.target.value)}
							required
							placeholder='••••••••'
							autoComplete='new-password'
							className='form-input'
						/>
						{invalidPasswordRepeat && passwordRepeat && <div className='relative pl-3.5 text-red-500 text-xs'><span className='absolute left-px text-md'>*</span> This should match your password</div>}
					</div>

					<button type='submit' disabled={disableSubmit || isSubmitting} className={clsx('w-fit mt-4 gradient-button px-8 py-2.5', disableSubmit ? 'opacity-60 cursor-not-allowed!' : 'hover-shadow')}>
						{isSubmitting ? 'Signing In...' : 'Register'}
					</button>
				</form>

				<p className='mt-2 text-gray-500 text-sm'>
					Already have an account? <Link to='/login' className='text-bluish-cyan font-medium hover:underline'>Log in</Link>
				</p>
			</div>
		</div>
	);
};