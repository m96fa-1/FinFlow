import React from 'react'

import { useCategoriesData } from '../hooks/useData'

import { X, Loader2, ChevronDown } from 'lucide-react'

export interface AddTransactionOnConfirmProps {
	categoryId: string;
	amount: number;
	date: string;
	description: string;
}

interface AddTransactionModalProps {
	isOpen: boolean;
	onConfirm: ({ categoryId, amount, date, description }: AddTransactionOnConfirmProps) => Promise<void>;
	onClose: () => void;
}

export default function AddTransactionModal({
	isOpen,
	onConfirm,
	onClose
}: AddTransactionModalProps) {
	if (!isOpen) return null;

	const categoriesData = useCategoriesData();
	
	const containerRef = React.useRef<HTMLDivElement>(null);
	const modalRef = React.useRef<HTMLDivElement>(null);

	const [type, setType] = React.useState<'EXPENSE' | 'INCOME'>('EXPENSE');
	const [categoryId, setCategoryId] = React.useState('');
	const [amount, setAmount] = React.useState('');
	const [date, setDate] = React.useState(() => new Date().toISOString().split('T')[0]);
	const [description, setDescription] = React.useState('');

	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	
	const handleClose = () => {
		containerRef.current!.classList.add('animate-[fade-out_500ms_forwards]');
		modalRef.current!.classList.add('animate-[zoom-fade-out_500ms_forwards]');

		setTimeout(() => {
			onClose();
		}, 500);
	};

	const filteredCategories = React.useMemo(() => {
		return categoriesData.categories.filter((cat) => cat.type === type);
	}, [categoriesData, type]);
	
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
			setError('Please enter a valid amount greater than $0.00.');
			return;
		}

		if (!categoryId) {
			setError('Please select a category.');
			return;
		}

		setLoading(true);

		try {
			const [year, month, day] = date.split('-').map(Number);
			const utcDate = new Date(Date.UTC(year, month - 1, day)).toISOString();

			await onConfirm({
				amount: numericAmount,
				categoryId,
				description: description.trim(),
				date: utcDate,
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
					<h2 className='text-lg font-bold text-gray-800'>Add Transaction</h2>
					<button type='button' onClick={handleClose} className='p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500'>
						<X width='20' height='20' />
					</button>
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
									? 'bg-white text-gray-800 shadow-xs'
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
					<div className='relative'>
						<label className='block text-xs font-semibold text-gray-600 mb-1'>
							Category
						</label>
						<select
							value={categoryId}
							onChange={(e) => setCategoryId(e.target.value)}
							required
							className='relative w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 text-sm font-medium appearance-none z-1'
						>
							{filteredCategories.length > 0 ? filteredCategories.map((cat) => (
								<option key={cat.id} value={cat.id}>
									{cat.name}
								</option>
							)) : (
								<option value='' disabled>
									No {type.toLowerCase()} categories found
								</option>
							)}
						</select>
						<ChevronDown size='20' className='absolute top-7.5 right-3' />
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
						<button type='button' onClick={handleClose} className='px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'>
							Cancel
						</button>
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