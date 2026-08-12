import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { validateFullName, validateEmail, validatePassword } from '../utils'
import clsx from 'clsx'
import background from '../assets/register-background.jpg'

export default function RegisterPage() {
	const { isAuthenticated, logout, register } = useAuth();
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
			logout();
		}
	}, []);

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
				<img src={background} alt="A Happy Girl Working On Her Laptop" className='absolute w-full h-full object-cover select-none drag-none opacity-90' />
			</div>
			<div className='w-180 h-full p-10 bg-white'>
				<svg width="179" height="64" viewBox="0 0 759.35413 270.93331" className='select-none drag-none' version="1.1" id="svg1" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
					<defs id="defs1">
						<linearGradient id="linearGradient71">
							<stop stopColor='#274fa5' stopOpacity='1' offset="0" id="stop70" />
							<stop stopColor='#33ffbf' stopOpacity='1' offset="1" id="stop71" />
						</linearGradient>
						<linearGradient
							id="linearGradient68">
							<stop stopColor='#2159a1' stopOpacity='1' offset="0" id="stop67" />
							<stop stopColor='#00d68d' stopOpacity='1' offset="1" id="stop68" />
						</linearGradient>
						<linearGradient id="linearGradient16">
							<stop stopColor='#2b4dab' stopOpacity='1' offset="0" id="stop16" />
							<stop stopColor='#00e59a' stopOpacity='1' offset="1" id="stop17" />
						</linearGradient>
						<linearGradient id="linearGradient13">
							<stop stopColor='#1363a4' stopOpacity='1' offset="0" id="stop13" />
							<stop stopColor='#00e59a' stopOpacity='1' offset="1" id="stop14" />
						</linearGradient>
						<linearGradient
							xlinkHref="#linearGradient13"
							id="linearGradient14"
							x1="231.25627"
							y1="95.998657"
							x2="230.5464"
							y2="-130.32961"
							gradientUnits="userSpaceOnUse"
							spreadMethod="pad" />
						<linearGradient
							xlinkHref="#linearGradient71"
							id="linearGradient17"
							x1="44.245495"
							y1="217.82524"
							x2="263.00009"
							y2="12.12948"
							gradientUnits="userSpaceOnUse" />
						<linearGradient
							xlinkHref="#linearGradient16"
							id="linearGradient65"
							gradientUnits="userSpaceOnUse"
							x1="45.827385"
							y1="217.7953"
							x2="236.05885"
							y2="52.172436" />
						<linearGradient
							xlinkHref="#linearGradient68"
							id="linearGradient66"
							gradientUnits="userSpaceOnUse"
							x1="242.79987"
							y1="98.350914"
							x2="230.5464"
							y2="-130.32961"
							spreadMethod="pad"
							gradientTransform="rotate(45,-2.3486328e-6,-1.082248e-6)" />
					</defs>
					<g
						id="g71"
						transform="matrix(1.196825,0,0,1.1962616,-22.799516,-25.32087)">
						<path
							id="path56"
							fill='url(#linearGradient17)' stroke='none' strokeWidth='0.383126' strokeLinecap='round' strokeLinejoin='round'
							d="M 129.11667,21.166666 A 110.06667,113.24166 0 0 0 19.05,134.40833 110.06667,113.24166 0 0 0 129.11667,247.65 110.06667,113.24166 0 0 0 239.18333,134.40833 110.06667,113.24166 0 0 0 237.8108,116.57945 l -8.8656,-6.03064 c -0.51361,0.69438 -1.04033,1.39964 -1.58027,2.11511 l 4.09277,2.78433 a 100.80578,103.71363 0 0 1 1.25729,16.32872 A 100.80578,103.71363 0 0 1 131.90926,235.49053 100.80578,103.71363 0 0 1 31.103527,131.77697 100.80578,103.71363 0 0 1 131.90926,28.063403 100.80578,103.71363 0 0 1 217.12473,76.371048 l 5.22965,-2.142505 A 110.06667,113.24166 0 0 0 129.11667,21.166666 Z" />
						<path
							id="path22"
							fill='url(#linearGradient65)' stroke='none' strokeWidth='0.383126' strokeLinecap='round' strokeLinejoin='round'
							d="M 131.90926,28.063403 A 100.80578,103.71363 0 0 0 31.103527,131.77697 100.80578,103.71363 0 0 0 131.90926,235.49053 100.80578,103.71363 0 0 0 232.71499,131.77697 100.80578,103.71363 0 0 0 231.4577,115.44825 l -4.09277,-2.78433 c -3.5847,4.75004 -7.74881,9.95183 -12.47779,15.43369 a 85.989583,88.470047 0 0 1 0.21911,6.31072 85.989583,88.470047 0 0 1 -21.96042,59.05324 v -10.73526 -31.76033 c -10.60067,10.12568 -22.79583,20.40479 -36.5125,29.97905 v 27.76161 9.51983 a 85.989583,88.470047 0 0 1 -9.26042,2.63498 v -9.63559 -24.08121 c -11.2597,7.22094 -23.44221,13.89423 -36.51249,19.6081 v 3.10266 11.00604 A 85.989583,88.470047 0 0 1 101.6,218.22647 v -11.6644 -66.59749 c 0,-5.13027 -4.130147,-9.26041 -9.260418,-9.26041 H 74.347916 c -5.130271,0 -9.260417,4.13014 -9.260417,9.26041 v 34.69349 18.8035 A 85.989583,88.470047 0 0 1 43.127083,134.40833 85.989583,88.470047 0 0 1 129.11667,45.938281 85.989583,88.470047 0 0 1 199.50513,83.590762 l 17.6196,-7.219714 A 100.80578,103.71363 0 0 0 131.90926,28.063403 Z m 33.98449,49.724096 c -5.13027,0 -9.26042,4.130146 -9.26042,9.260417 v 68.704334 c 13.71995,-11.35891 25.82853,-23.4876 36.5125,-36.75796 V 87.047916 c 0,-5.130271 -4.13014,-9.260417 -9.26042,-9.260417 z m -45.77292,26.458331 c -5.13027,0 -9.26041,4.13015 -9.26041,9.26042 v 74.14224 c 13.21499,-7.88022 25.35711,-16.00011 36.51249,-24.5308 v -49.61144 c 0,-5.13027 -4.13014,-9.26042 -9.26041,-9.26042 z" />
						<path
							id="path48"
							fill='#000000' fillOpacity='0.188235' stroke='none' strokeWidth='0.383126' strokeLinecap='round' strokeLinejoin='round'
							d="m 228.94515,112.18333 c -3.92345,5.30443 -8.61678,11.24125 -14.05805,17.5488 0.14601,2.10022 0.21909,4.20514 0.21911,6.31073 -2e-5,2.8896 -0.13765,5.77747 -0.41238,8.65322 7.14732,-8.04513 13.13272,-15.5868 17.91259,-22.1139 l 6.32933,4.22454 c -0.19554,-2.87525 -0.46965,-5.73292 -0.88729,-8.59274 z M 193.1458,152.6005 c -10.60067,10.12568 -22.79582,20.40479 -36.51249,29.97905 v 13.42398 c 13.64973,-9.28066 25.84344,-19.29562 36.51249,-29.23801 z m -45.77291,36.17868 c -11.25969,7.22094 -23.4422,13.89423 -36.51247,19.6081 v 12.47365 c 13.04667,-5.5047 25.22878,-11.78073 36.51247,-18.82158 z" />
						<path
							id="path65"
							mix-blend-mode='normal' fill='url(#linearGradient66)' fillRule='nonzero' strokeWidth='1.5875' strokeLinecap='round' strokeLinejoin='round'
							d="m 253.88941,68.220644 c -0.0213,0.03493 -58.00246,94.999056 -143.02899,136.022186 v 9.31623 c 59.89206,-25.26984 101.56415,-70.91494 121.74605,-98.4741 l 16.05484,10.9213 z" />
						<path
							id="rect8"
							mix-blend-mode='normal' fill='url(#linearGradient14)' fillRule='nonzero' strokeWidth='1.5875' strokeLinecap='round' strokeLinejoin='round'
							d="m 227.7662,-131.28764 -23.48913,56.100286 17.70254,-3.369058 c 10.08559,43.806043 7.39898,87.4876625 -5.7559,137.999816 l 6.58793,6.587933 c 31.11511,-89.130568 4.96418,-197.279197 4.95456,-197.318977 z"
							transform="rotate(45)" />
					</g>
					<text
						xmlSpace="preserve"
						fontStyle='normal' fontVariant='normal' fontWeight='normal' fontStretch='normal' fontSize='121.708px' line-height='0' fontFamily='Sans' text-align='center' writingMode='lr-tb' direction='ltr' textAnchor='middle' fill='#07ce9d' fillOpacity='1' strokeWidth='1.5875' strokeLinecap='round' strokeLinejoin='round'
						x="534.91016"
						y="160.16891"
						id="text2"><tspan
							fontStyle='normal' fontVariant='normal' fontWeight='bold' fontStretch='normal' fontSize='132.292px' line-height='0.7' fontFamily='DM Sans' fill='#2b8dae' fillOpacity='1' strokeWidth='1.5875'
							id="tspan3"
							x="534.91016"
							y="160.16891">FinFlow</tspan><tspan
							fontStyle='normal' fontVariant='normal' fontWeight='600' fontStretch='normal' fontSize='43.6562px' line-height='0.7' fontFamily='DM Sans' fill='#303741' fillOpacity='1' strokeWidth='1.5875'
							x="534.91016"
							y="206.79361"
							id="tspan13">Your wealth, visualized.</tspan></text>
				</svg>
				<h2 className='mt-8 mb-6 text-darkest-text text-3xl font-prata-serif font-semibold'>Register</h2>
				{error && <div className='mb-6 text-red-500 text-sm'>* {error}</div>}

				<form onSubmit={handleSubmit} className='w-110 flex flex-col gap-4'>
					<div className='flex flex-col gap-1'>
						<label htmlFor='name' className='text-darker-gray-text text-sm font-semibold'>Full Name</label>
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
						<label htmlFor='email' className='text-darker-gray-text text-sm font-semibold'>Email Address</label>
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
						<label htmlFor='password' className='text-darker-gray-text text-sm font-semibold'>Password</label>
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
						<label htmlFor='passwordRepeat' className='text-darker-gray-text text-sm font-semibold'>Password Repeat</label>
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

				<p className='mt-2 text-gray-text text-sm'>
					Already have an account? <Link to='/login' className='text-bluish-cyan font-medium hover:underline'>Log in</Link>
				</p>
			</div>
		</div>
	);
};