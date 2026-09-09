import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { categoriesApi } from '../api/categories'

import {
	Box,
	X,
	Loader2,
	Utensils,
	ShoppingBag,
	Car,
	Home,
	Briefcase,
	HeartPulse,
	Film,
	Zap,
	GraduationCap,
	Plane,
	Gift,
	PiggyBank,
	TrendingUp,
	Wallet,
	CreditCard,
	Coins,
	Building,
	Receipt,
	Wrench,
	type LucideIcon,
} from 'lucide-react'

const AVAILABLE_ICONS: { name: string; icon: LucideIcon }[] = [
	{ name: 'Box',						icon: Box },
	{ name: 'Utensils',				icon: Utensils },
	{ name: 'ShoppingBag',		icon: ShoppingBag },
	{ name: 'Car',						icon: Car },
	{ name: 'Home',						icon: Home },
	{ name: 'Briefcase',			icon: Briefcase },
	{ name: 'HeartPulse',			icon: HeartPulse },
	{ name: 'Film',						icon: Film },
	{ name: 'Zap',						icon: Zap },
	{ name: 'GraduationCap',	icon: GraduationCap },
	{ name: 'Plane',					icon: Plane },
	{ name: 'Gift',						icon: Gift },
	{ name: 'PiggyBank',			icon: PiggyBank },
	{ name: 'TrendingUp',			icon: TrendingUp },
	{ name: 'Wallet',					icon: Wallet },
	{ name: 'CreditCard',			icon: CreditCard },
	{ name: 'Coins',					icon: Coins },
	{ name: 'Building',				icon: Building },
	{ name: 'Receipt',				icon: Receipt },
	{ name: 'Wrench',					icon: Wrench },
];

const COLOR_PALETTE = [
	'#2B8DAE', // Bluish Cyan
	'#06B6D4', // Cyan
	'#3B82F6', // Blue
	'#6366F1', // Indigo
	'#8B5CF6', // Purple
	'#EC4899', // Pink
	'#F43F5E', // Rose
	'#EF4444', // Red
	'#F59E0B', // Amber
	'#84CC16', // Lime
	'#10B981', // Emerald
	'#64748B', // Slate
	'#1E293B', // Dark Navy
];

export default function CreateCategoryModalPage() {
	const navigate = useNavigate();

	const [name, setName] = React.useState('');
	const [type, setType] = React.useState<'EXPENSE' | 'INCOME'>('EXPENSE');
	const [selectedIcon, setSelectedIcon] = React.useState('Box');
	const [selectedColor, setSelectedColor] = React.useState(COLOR_PALETTE[0]);

	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	const handleSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault();
		setError(null);

		if (!name.trim()) {
			setError('Category name is required.');
			return;
		}

		setLoading(true);

		try {
			const res = await categoriesApi.create({
				name: name.trim(),
				type,
				icon: selectedIcon,
				color: selectedColor,
			});

			if (!res.success) {
				throw new Error(res.message || 'Failed to create category');
			}

			// Reset form state
			setName('');
			setSelectedIcon('Utensils');
			setSelectedColor(COLOR_PALETTE[0]);
			navigate('/categories', { replace: true });
		} catch (err: any) {
			setError(err.message || 'Something went wrong');
		} finally {
			setLoading(false);
		}
	};

	// Dynamically render selected icon for the live preview badge
	const SelectedIconComponent =
		AVAILABLE_ICONS.find((item) => item.name === selectedIcon)?.icon || Utensils;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
			<div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
				{/* Header */}
				<div className="flex items-center justify-between p-5 border-b border-gray-100">
					<div className="flex items-center gap-3">
						<div
							className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs transition-colors"
							style={{ backgroundColor: selectedColor }}
						>
							<SelectedIconComponent className="w-5 h-5" />
						</div>
						<h2 className="text-lg font-bold text-gray-900">New Category</h2>
					</div>

					<Link to='/categories' replace className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
						<X className="w-5 h-5" />
					</Link>
				</div>

				{/* Form Body */}
				<form onSubmit={handleSubmit} className="p-5 space-y-4">
					{error && (
						<div className="p-3 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg">
							{error}
						</div>
					)}

					{/* Type Toggle */}
					<div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
						<button
							type="button"
							onClick={() => setType('EXPENSE')}
							className={`py-2 text-xs font-semibold rounded-lg transition-all ${
								type === 'EXPENSE'
									? 'bg-white text-gray-900 shadow-xs'
									: 'text-gray-500 hover:text-gray-700'
							}`}
						>
							Expense Category
						</button>
						<button
							type="button"
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
						<label className="block text-xs font-semibold text-gray-600 mb-1">
							Category Name
						</label>
						<input
							type="text"
							placeholder="e.g. Groceries, Subscriptions, Salary"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 text-sm font-semibold"
						/>
					</div>

					{/* Color Picker Swatches + Custom Hex */}
					<div>
						<label className="block text-xs font-semibold text-gray-600 mb-2">
							Color Theme
						</label>
						<div className="flex items-center gap-2 flex-wrap">
							{COLOR_PALETTE.map((colorHex) => (
								<button
									key={colorHex}
									type="button"
									onClick={() => setSelectedColor(colorHex)}
									className={`w-7 h-7 rounded-full transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
										selectedColor === colorHex ? 'scale-110 ring-2 ring-offset-2 ring-gray-400' : 'hover:scale-105'
									}`}
									style={{ backgroundColor: colorHex }}
									aria-label={`Select color ${colorHex}`}
								/>
							))}

							{/* Custom native color input fallback */}
							<label className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 text-xs font-bold text-gray-500 relative overflow-hidden">
								+
								<input
									type="color"
									value={selectedColor}
									onChange={(e) => setSelectedColor(e.target.value)}
									className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
								/>
							</label>
						</div>
					</div>

					{/* Icon Selector Grid */}
					<div>
						<label className="block text-xs font-semibold text-gray-600 mb-2">
							Select Icon
						</label>
						<div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-1 border border-gray-100 rounded-xl bg-gray-50/50">
							{AVAILABLE_ICONS.map(({ name: iconName, icon: IconComponent }) => {
								const isSelected = selectedIcon === iconName;
								return (
									<button
										key={iconName}
										type="button"
										onClick={() => setSelectedIcon(iconName)}
										className={`p-2.5 rounded-xl flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
											isSelected
												? 'bg-white text-emerald-600 shadow-xs border border-emerald-200'
												: 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
										}`}
									>
										<IconComponent className="w-5 h-5" />
									</button>
								);
							})}
						</div>
					</div>

					{/* Submit Actions */}
					<div className="flex items-center justify-end gap-2 pt-3">
						<Link to='/categories' replace className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
							Cancel
						</Link>
						<button
							type="submit"
							disabled={loading}
							className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50"
						>
							{loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
							<span>Create Category</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};