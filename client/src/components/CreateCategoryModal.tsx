import React from 'react'

import colorPalette from '../lib/colorPalette'
import categoryIcons from '../lib/categoryIcons'
import type { CreateCategoryInput } from '../api/categories'

import { X, Loader2 } from 'lucide-react'

interface CreateCategoryModalProps {
	isOpen: boolean;
	onConfirm: (data: CreateCategoryInput) => Promise<void>;
	onClose: () => void;
}

export default function CreateCategoryModal({
	isOpen,
	onConfirm,
	onClose,
}: CreateCategoryModalProps) {
	if (!isOpen) return null;

	const containerRef = React.useRef<HTMLDivElement>(null);
	const modalRef = React.useRef<HTMLDivElement>(null);

	const [name, setName] = React.useState('');
	const [type, setType] = React.useState<'INCOME' | 'EXPENSE'>('EXPENSE');
	const [selectedColor, setSelectedColor] = React.useState(colorPalette[0]);
	const [selectedIcon, setSelectedIcon] = React.useState('box');

	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	const handleClose = () => {
		containerRef.current!.classList.add('animate-[fade-out_500ms_forwards]');
		modalRef.current!.classList.add('animate-[zoom-fade-out_500ms_forwards]');

		setTimeout(() => {
			onClose();
		}, 500);
	};

	React.useEffect(() => {
		if (!containerRef.current) return;

		const handleContainerOnClick = (ev: PointerEvent) => {
			if (ev.target === containerRef.current) {
				handleClose();
			}
		};

		if (loading) {
			containerRef.current.removeEventListener('click', handleContainerOnClick)
		} else {
			containerRef.current.addEventListener('click', handleContainerOnClick);
		}
		return () => {
			if (containerRef.current) containerRef.current.removeEventListener('click', handleContainerOnClick);
		};
	}, [containerRef, loading]);

	const handleSubmit = async (ev: React.SubmitEvent) => {
		ev.preventDefault();
		setError(null);

		if (!name.trim()) {
			setError('Category name is required.');
			return;
		}

		setLoading(true);

		try {
			await onConfirm({
				name: name.trim(),
				icon: selectedIcon,
				color: selectedColor,
				type,
			});
		} catch (error: any) {
			setError(String(error.response.data.message));
			console.error('Create error: ', error.response.data.message);
		} finally {
			setLoading(false);
		}
	};

	const SelectedIconComponent = categoryIcons.find(item => item.name === selectedIcon)!.icon;

	return (
		<div ref={containerRef} className='fixed inset-0 p-4 flex items-center justify-center bg-black/20 backdrop-blur-xs z-50 animate-[fade-in_0.15s_ease-out]'>
			<div ref={modalRef} className='w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-[zoom-fade-in_0.5s_ease-out]'>
				{/* Header */}
				<div className='flex items-center justify-between p-5 border-b border-gray-100'>
					<div className='flex items-center gap-3'>
						<div
							className='w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs transition-colors'
							style={{ backgroundColor: selectedColor }}
						>
							<SelectedIconComponent className='w-5 h-5' />
						</div>
						<h2 className='text-lg font-bold text-gray-800'>New Category</h2>
					</div>

					<button onClick={handleClose} className='p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500'>
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
							Expense Category
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
							Income Category
						</button>
					</div>

					{/* Category Name */}
					<div>
						<label className='block text-xs font-semibold text-gray-600 mb-1'>
							Category Name
						</label>
						<input
							type='text'
							placeholder='e.g. Groceries, Subscriptions, Salary'
							value={name}
							onChange={(e) => setName(e.target.value)}
							className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 text-sm font-semibold'
						/>
					</div>

					{/* Color Picker Swatches + Custom Hex */}
					<div>
						<label className='block text-xs font-semibold text-gray-600 mb-2'>
							Color Theme
						</label>
						<div className='flex items-center gap-2 flex-wrap'>
							{colorPalette.map((colorHex) => (
								<button
									key={colorHex}
									type='button'
									onClick={() => setSelectedColor(colorHex)}
									className={`w-7 h-7 rounded-full transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
										selectedColor === colorHex ? 'scale-110 ring-2 ring-offset-2 ring-gray-400' : 'hover:scale-105'
									}`}
									style={{ backgroundColor: colorHex }}
									aria-label={`Select color ${colorHex}`}
								/>
							))}

							{/* Custom native color input fallback */}
							<label className='w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 text-xs font-bold text-gray-500 relative overflow-hidden'>
								+
								<input
									type='color'
									value={selectedColor}
									onChange={(e) => setSelectedColor(e.target.value)}
									className='absolute inset-0 opacity-0 cursor-pointer w-full h-full'
								/>
							</label>
						</div>
					</div>

					{/* Icon Selector Grid */}
					<div>
						<label className='block text-xs font-semibold text-gray-600 mb-2'>
							Select Icon
						</label>
						<div className='grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-1 border border-gray-100 rounded-xl bg-gray-50/50'>
							{categoryIcons.map(({ name: iconName, icon: IconComponent }) => {
								const isSelected = selectedIcon === iconName;
								return (
									<button
										key={iconName}
										type='button'
										onClick={() => setSelectedIcon(iconName)}
										className={`p-2.5 rounded-xl flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
											isSelected
												? 'bg-white text-emerald-600 shadow-xs border border-emerald-200'
												: 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
										}`}
									>
										<IconComponent className='w-5 h-5' />
									</button>
								);
							})}
						</div>
					</div>

					{/* Submit Actions */}
					<div className='flex items-center justify-end gap-2 pt-3'>
						<button
							type='button'
							onClick={handleClose}
							className='px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'
						>
							Cancel
						</button>
						<button
							type='submit'
							disabled={loading}
							className='px-4 py-2 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50'
						>
							<span>Create Category</span>
							{loading && <Loader2 className='size-3.5 animate-spin' />}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};