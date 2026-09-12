import React from 'react'

import { useCategoriesData } from '../hooks/useData'
import type { CreateBudgetInput } from '../api/budgets'

import { X, Loader2, Layers } from 'lucide-react'

const monthNames = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

interface NewBudgetModalProps {
	isOpen: boolean;
	onConfirm: (data: CreateBudgetInput) => Promise<void>;
	onClose: () => void;
}

export default function NewBudgetModal({
	isOpen,
	onConfirm,
	onClose,
}: NewBudgetModalProps) {
	if (!isOpen) return null;

	const categoriesData = useCategoriesData();

	const now = new Date();
	const currentUtcMonth = now.getUTCMonth() + 1;
	const currentUtcYear = now.getUTCFullYear();
	
	const containerRef = React.useRef<HTMLDivElement>(null);
	const modalRef = React.useRef<HTMLDivElement>(null);

	const [categoryId, setCategoryId] = React.useState('');
	const [limitAmount, setLimitAmount] = React.useState('');
	const [period, setPeriod] = React.useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
	const [month, setMonth] = React.useState<number>(currentUtcMonth);
	const [year, setYear] = React.useState<number>(currentUtcYear);

	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	const handleClose = () => {
		containerRef.current!.classList.add('animate-[fade-out_500ms_forwards]');
		modalRef.current!.classList.add('animate-[zoom-fade-out_500ms_forwards]');

		setTimeout(() => {
			onClose();
		}, 500);
	};

	const expenseCategories = categoriesData.categories.filter((cat) => cat.type === 'EXPENSE');

	React.useEffect(() => {
		if (!containerRef.current) return;

		const handleContainerOnClick = (ev: PointerEvent) => {
			if (ev.target === containerRef.current) {
				handleClose();
			}
		};

		if (loading) {
			console.log('removing');
			containerRef.current.removeEventListener('click', handleContainerOnClick)
		} else {
			containerRef.current.addEventListener('click', handleContainerOnClick);
		}
		return () => {
			if (containerRef.current) containerRef.current.removeEventListener('click', handleContainerOnClick);
		};
	}, [containerRef, loading]);

	React.useEffect(() => {
		if (expenseCategories.length > 0 && !categoryId) {
			setCategoryId(expenseCategories[0].id);
		}
	}, [expenseCategories, categoryId]);

	const yearOptions = Array.from({ length: 5 }, (_, i) => currentUtcYear - 1 + i);

	const handleSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault();
		setError(null);

		const numericLimit = parseFloat(limitAmount);
		if (isNaN(numericLimit) || numericLimit <= 0) {
			setError('Please enter a valid spending limit greater than $0.00.');
			return;
		}	

		if (!categoryId) {
			setError('Please select an expense category for this budget.');
			return;
		}

		setLoading(true);

		try {
			await onConfirm({
				categoryId,
				limitAmount: numericLimit,
				period,
				month,
				year,
			});
		} catch (error: any) {
			setError(String(error.response.data.message));
			console.error('Add error: ', error.response.data.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div ref={containerRef} className='fixed inset-0 p-4 flex items-center justify-center bg-black/20 backdrop-blur-xs animate-[fade-in_0.15s_ease-out] z-50'>
			<div ref={modalRef} className='w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-[zoom-fade-in_0.5s_ease-out]'>
				{/* Header */}
				<div className='flex items-center justify-between p-5 border-b border-gray-100'>
					<div className='flex items-center gap-3'>
						<div className='w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center'>
							<Layers className='w-5 h-5' />
						</div>
						<div>
							<h2 className='text-lg font-bold text-gray-800'>New Spending Limit</h2>
							<p className='text-xs text-gray-500'>Set a budget cap for a category</p>
						</div>
					</div>

					<button type='button' onClick={handleClose} className='p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500'>
						<X className='w-5 h-5' />
					</button>
				</div>

				{/* Form Body */}
				<form onSubmit={handleSubmit} className='p-5 space-y-4'>
					{error && (
						<div className='p-3 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg'>
							{error}
						</div>
					)}

					{/* Period Toggle (Monthly vs Yearly) */}
					<div className='grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl'>
						<button
							type='button'
							onClick={() => setPeriod('MONTHLY')}
							className={`py-2 text-xs font-semibold rounded-lg transition-all ${
								period === 'MONTHLY'
									? 'bg-white text-gray-800 shadow-xs'
									: 'text-gray-500 hover:text-gray-700'
							}`}
						>
							Monthly Budget
						</button>
						<button
							type='button'
							onClick={() => setPeriod('YEARLY')}
							className={`py-2 text-xs font-semibold rounded-lg transition-all ${
								period === 'YEARLY'
									? 'bg-white text-emerald-700 shadow-xs'
									: 'text-gray-500 hover:text-gray-700'
							}`}
						>
							Yearly Budget
						</button>
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
							{expenseCategories.length === 0 ? (
								<option value='' disabled>
									No expense categories found
								</option>
							) : (
								expenseCategories.map((cat) => (
									<option key={cat.id} value={cat.id}>
										{cat.name}
									</option>
								))
							)}
						</select>
					</div>

					{/* Budget Limit Amount */}
					<div>
						<label className='block text-xs font-semibold text-gray-600 mb-1'>
							Budget Limit Amount
						</label>
						<div className='relative'>
							<span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold'>
								$
							</span>
							<input
								type='number'
								step='0.01'
								placeholder='e.g. 500.00'
								value={limitAmount}
								onChange={(e) => setLimitAmount(e.target.value)}
								className='w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 text-sm font-semibold'
							/>
						</div>
					</div>

					{/* Date & Period Controls */}
					<div className='grid grid-cols-2 gap-3'>
						{/* Month Select (Disabled if Yearly) */}
						<div>
							<label className='block text-xs font-semibold text-gray-600 mb-1'>
								Month
							</label>
							<div className='relative'>
								<select
									value={month}
									onChange={(e) => setMonth(Number(e.target.value))}
									className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 text-sm font-medium bg-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
								>
									{monthNames.map((name, index) => (
										<option key={name} value={index + 1}>
											{name}
										</option>
									))}
								</select>
							</div>
						</div>

						{/* Year Select */}
						<div>
							<label className='block text-xs font-semibold text-gray-600 mb-1'>
								Year
							</label>
							<select
								value={year}
								onChange={(e) => setYear(Number(e.target.value))}
								className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 text-sm font-medium bg-white'
							>
								{yearOptions.map((y) => (
									<option key={y} value={y}>
										{y}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Action Footer */}
					<div className='flex items-center justify-end gap-2 pt-3'>
						<button type='button' onClick={handleClose} className='px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'>
							Cancel
						</button>
						<button
							type='submit'
							disabled={loading}
							className='flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50'
						>
							{loading && <Loader2 className='w-3.5 h-3.5 animate-spin' />}
							<span>Set Budget</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};