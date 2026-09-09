import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useCategoriesData } from '../hooks/useData'

import { X, Loader2 } from 'lucide-react'
import { transactionsApi } from '../api/transactions'

export default function AddTransactionModalPage() {
	const categoriesData = useCategoriesData();
	const navigate = useNavigate();

	const [type, setType] = React.useState<'EXPENSE' | 'INCOME'>('EXPENSE');
	const [amount, setAmount] = React.useState('');
	const [categoryId, setCategoryId] = React.useState('');
	const [description, setDescription] = React.useState('');
	const [date, setDate] = React.useState(() => new Date().toISOString().split('T')[0]);

	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	const filteredCategories = categoriesData.categories.filter((cat) => cat.type === type);

	React.useEffect(() => {
		if (filteredCategories.length > 0) {
			setCategoryId(filteredCategories[0].id);
		} else {
			setCategoryId('');
		}
	}, [type]);

	const handleSubmit = async (ev: React.SubmitEvent) => {
		ev.preventDefault();
		setError(null);

		const numericAmount = parseFloat(amount);
		if (isNaN(numericAmount) || numericAmount <= 0) {
			setError('Please enter a valid amount greater than 0.');
			return;
		}

		if (!categoryId) {
			setError('Please select a category.');
			return;
		}

		setLoading(true);

		try {
			// Parse YYYY-MM-DD into exact UTC midnight timestamp
			const [year, month, day] = date.split('-').map(Number);
			const utcDate = new Date(Date.UTC(year, month - 1, day)).toISOString();

			const res = await transactionsApi.create({
				amount: numericAmount,
				categoryId,
				description: description.trim(),
				date: utcDate,
			});

			if (!res.success) {
				throw new Error(res.message);
			}

			// Reset form state and trigger parent refresh
			setAmount('');
			setDescription('');
			navigate('/transactions', { replace: true });
		} catch (err: any) {
			setError(err.message || 'Something went wrong');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4'>
			<div className='bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150'>
				{/* Header */}
				<div className='flex items-center justify-between p-5 border-b border-gray-100'>
					<h2 className='text-lg font-bold text-gray-900'>Add Transaction</h2>
					<Link to='/transactions' replace className='p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500'>
						<X width='20' height='20' />
					</Link>
				</div>

				{/* Form Body */}
				<form onSubmit={handleSubmit} className='p-5 space-y-4'>
					{error && (
						<div className='p-3 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg'>
							{error}
						</div>
					)}

					{/* Type Toggle */}
					<div className='grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl'>
						<button
							type='button'
							onClick={() => setType('EXPENSE')}
							className={`py-2 text-xs font-semibold rounded-lg transition-all ${
								type === 'EXPENSE'
									? 'bg-white text-gray-900 shadow-xs'
									: 'text-gray-500 hover:text-gray-700'
							}`}
						>
							Expense
						</button>
						<button
							type='button'
							onClick={() => setType('INCOME')}
							className={`py-2 text-xs font-semibold rounded-lg transition-all ${
								type === 'INCOME'
									? 'bg-white text-emerald-700 shadow-xs'
									: 'text-gray-500 hover:text-gray-700'
							}`}
						>
							Income
						</button>
					</div>

					{/* Amount Input */}
					<div>
						<label className='block text-xs font-semibold text-gray-600 mb-1'>
							Amount
						</label>
						<div className='relative'>
							<span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold'>
								$
							</span>
							<input
								type='number'
								step='0.01'
								placeholder='0.00'
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								required
								className='w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 text-sm font-semibold'
							/>
						</div>
					</div>

					{/* Category Dropdown */}
					<div>
						<label className='block text-xs font-semibold text-gray-600 mb-1'>
							Category
						</label>
						<select
							value={categoryId}
							onChange={(e) => setCategoryId(e.target.value)}
							required
							className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 text-sm font-medium bg-white'
						>
							{filteredCategories.length === 0 ? (
								<option value='' disabled>
									No {type.toLowerCase()} categories found
								</option>
							) : (
								filteredCategories.map((cat) => (
									<option key={cat.id} value={cat.id}>
										{cat.name}
									</option>
								))
							)}
						</select>
					</div>

					{/* Date Picker */}
					<div>
						<label className='block text-xs font-semibold text-gray-600 mb-1'>
							Date
						</label>
						<input
							type='date'
							value={date}
							onChange={(e) => setDate(e.target.value)}
							required
							className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 text-sm font-medium'
						/>
					</div>

					{/* Description / Note */}
					<div>
						<label className='block text-xs font-semibold text-gray-600 mb-1'>
							Description (Optional)
						</label>
						<input
							type='text'
							placeholder='e.g. Grocery store purchase'
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 text-sm font-medium'
						/>
					</div>

					{/* Submit Actions */}
					<div className='flex items-center justify-end gap-2 pt-3'>
						<Link to='/transactions' replace className='px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'>
							Cancel
						</Link>
						<button
							type='submit'
							disabled={loading}
							className='flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50'
						>
							{loading && <Loader2 className='w-3.5 h-3.5 animate-spin' />}
							<span>Save Transaction</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}