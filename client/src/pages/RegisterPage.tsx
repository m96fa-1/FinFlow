import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function RegisterPage() {
	const { register } = useAuth();
	const navigate = useNavigate();

	const [fullName, setFullName] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [passwordRepeat, setPasswordRepeat] = React.useState('');
	const [error, setError] = React.useState('');
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [disableSubmit, setDisableSubmit] = React.useState(true);

	const handleSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault();
		setError('');
		setIsSubmitting(true);

		try {
			await register({ fullName, email, password });
			navigate('/dashboard');
		} catch (err: any) {
			setError(err.response?.data?.message || 'Server error');
		} finally {
			setIsSubmitting(false);
		}
	};
	
	return (
		<div className='min-h-screen flex items-center justify-center bg-bgcolor'>
			<div className='w-full max-w-100 p-8 rounded-lg bg-white shadow'>
				<h2 className='mb-6 text-2xl text-center font-semibold'>Register</h2>
				{error && <div className='mb-4 p-3 text-sm rounded-md'>{error}</div>}

				<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
					<div className='flex flex-col gap-1'>
						<label className='text-[#374151] text-sm font-medium'>Full Name</label>
						<input
							type='text'
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							required
							placeholder='Alex Adams'
							className='form-input'
						/>
					</div>
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
					<div className='flex flex-col gap-1'>
						<label className='text-[#374151] text-sm font-medium'>Password Repeat</label>
						<input
							type='password'
							value={passwordRepeat}
							onChange={(e) => setPasswordRepeat(e.target.value)}
							required
							placeholder='••••••••'
							className='form-input'
						/>
					</div>

					<button type='submit' disabled={disableSubmit || isSubmitting} className='mt-2 gradient-blue-button button-hover-shadow'>
						{isSubmitting ? 'Registering...' : 'Register'}
					</button>
				</form>

				<p className='mt-6 text-[#6b7280] text-center text-sm'>
					Already have an account? <Link to='/login' className='text-blue font-medium hover:underline'>Log In</Link>
				</p>
			</div>
		</div>
	);
};