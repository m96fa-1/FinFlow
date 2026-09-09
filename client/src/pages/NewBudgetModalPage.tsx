import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useCategoriesData } from '../hooks/useData'
import { budgetsApi } from '../api/budgets'

import { X, Loader2, PiggyBank, Calendar } from 'lucide-react'

const MONTH_NAMES = [
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

export default function NewBudgetModalPage() {
	const categoriesData = useCategoriesData();
	const navigate = useNavigate();

	const now = new Date();
	const currentUtcMonth = now.getUTCMonth() + 1; // 1-12
	const currentUtcYear = now.getUTCFullYear();

	const [categoryId, setCategoryId] = React.useState('');
	const [limitAmount, setLimitAmount] = React.useState('');
	const [period, setPeriod] = React.useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
	const [month, setMonth] = React.useState<number>(currentUtcMonth);
	const [year, setYear] = React.useState<number>(currentUtcYear);

	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	const expenseCategories = categoriesData.categories.filter((cat) => cat.type === 'EXPENSE');

	// Pre-select first expense category when list loads or changes
	React.useEffect(() => {
		if (expenseCategories.length > 0 && !categoryId) {
			setCategoryId(expenseCategories[0].id);
		}
	}, [expenseCategories, categoryId]);

	// Generate a range of years (previous year, current year, next 3 years)
	const yearOptions = Array.from({ length: 5 }, (_, i) => currentUtcYear - 1 + i);

	const handleSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault();
		setError(null);

		const numericLimit = parseFloat(limitAmount);
		if (isNaN(numericLimit) || numericLimit <= 0) {
			setError('Please enter a valid spending limit greater than $0.');
			return;
		}

		if (!categoryId) {
			setError('Please select an expense category for this budget.');
			return;
		}

		setLoading(true);

		try {
			const res = await budgetsApi.create({
				categoryId,
				limitAmount: numericLimit,
				period,
				month,
				year,
			});

			if (!res.success) {
				throw new Error(res.message);
			}

			setLimitAmount('');
			setError(null);
			navigate('/budgets', { replace: true });
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
			<div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
				{/* Header */}
				<div className="flex items-center justify-between p-5 border-b border-gray-100">
					<div className="flex items-center gap-3">
						<div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
							<PiggyBank className="w-5 h-5" />
						</div>
						<div>
							<h2 className="text-lg font-bold text-gray-900">New Spending Limit</h2>
							<p className="text-xs text-gray-500">Set a budget cap for a category</p>
						</div>
					</div>

					<Link to='/budgets' replace className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
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

					{/* Period Toggle (Monthly vs Yearly) */}
					<div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
						<button
							type="button"
							onClick={() => setPeriod('MONTHLY')}
							className={`py-2 text-xs font-semibold rounded-lg transition-all ${
								period === 'MONTHLY'
									? 'bg-white text-gray-900 shadow-xs'
									: 'text-gray-500 hover:text-gray-700'
							}`}
						>
							Monthly Budget
						</button>
						<button
							type="button"
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
						<label className="block text-xs font-semibold text-gray-600 mb-1">
							Category
						</label>
						<select
							value={categoryId}
							onChange={(e) => setCategoryId(e.target.value)}
							required
							className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 text-sm font-medium bg-white"
						>
							{expenseCategories.length === 0 ? (
								<option value="" disabled>
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
						<label className="block text-xs font-semibold text-gray-600 mb-1">
							Budget Limit Amount
						</label>
						<div className="relative">
							<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
								$
							</span>
							<input
								type="number"
								step="0.01"
								placeholder="e.g. 500.00"
								value={limitAmount}
								onChange={(e) => setLimitAmount(e.target.value)}
								required
								className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 text-sm font-semibold"
							/>
						</div>
					</div>

					{/* Date & Period Controls */}
					<div className="grid grid-cols-2 gap-3">
						{/* Month Select (Disabled if Yearly) */}
						<div>
							<label className="block text-xs font-semibold text-gray-600 mb-1">
								Month
							</label>
							<div className="relative">
								<select
									value={month}
									onChange={(e) => setMonth(Number(e.target.value))}
									className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 text-sm font-medium bg-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
								>
									{MONTH_NAMES.map((name, index) => (
										<option key={name} value={index + 1}>
											{name}
										</option>
									))}
								</select>
							</div>
						</div>

						{/* Year Select */}
						<div>
							<label className="block text-xs font-semibold text-gray-600 mb-1">
								Year
							</label>
							<select
								value={year}
								onChange={(e) => setYear(Number(e.target.value))}
								className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 text-sm font-medium bg-white"
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
					<div className="flex items-center justify-end gap-2 pt-3">
						<Link to='/budgets' replace className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
							Cancel
						</Link>
						<button
							type="submit"
							disabled={loading}
							className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50"
						>
							{loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
							<span>Set Budget</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};