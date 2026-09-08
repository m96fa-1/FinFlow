import React from 'react'

import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useBudgetsData } from '../hooks/useData'

import DashboardLayout from '../layouts/DashboardLayout'
import NewBudgetButton from '../components/NewBudgetButton'
import ContextPill from '../components/ContextPill'

import { SquarePen, Trash2 } from 'lucide-react'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'

export default function BudgetsPage() {
	useDocumentTitle('Budgets');
	const data = useBudgetsData();

	const budgets = React.useMemo(() => data.budgets, [data.budgets]);

	if (data.loading) {
		return (
			<DashboardLayout>
				<div className='h-full flex items-center justify-center'>
					<div className='loading-circle' />
				</div>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout>
			<div className='flex items-center justify-between'>
				<NewBudgetButton />
				<ContextPill />
			</div>

			<div className='p-4 bg-white border border-gray-100 rounded-xl shadow-md'>
				<table className='w-full'>
					<thead>
						<tr className='text-gray-400 text-sm'>
							<th scope='col' className='px-2 py-1 border-b border-r border-gray-400 font-normal'>Category</th>
							<th scope='col' className='px-2 py-1 border-b border-r border-gray-400 font-normal'>Starts</th>
							<th scope='col' className='px-2 py-1 border-b border-r border-gray-400 font-normal'>Ends</th>
							<th scope='col' className='px-2 py-1 border-b border-r border-gray-400 font-normal'>Usage Bar</th>
							<th scope='col' className='px-2 py-1 border-b border-r border-gray-400 font-normal'>Spent Amount</th>
							<th scope='col' className='px-2 py-1 border-b border-r border-gray-400 font-normal'>Limit Amount</th>
							<th scope='col' className='px-2 py-1 border-b font-normal'>Options</th>
						</tr>
					</thead>
					<tbody className='text-gray-700'>
						{budgets.length > 0 ? budgets.map(budget => (
							<tr key={budget.id}>
								<td className='p-2 border-r border-gray-400'>
									<h4 className='flex items-center gap-1'>
										<DynamicIcon name={budget.category.icon ? budget.category.icon as IconName : 'box'} width='24px' height='24px' strokeWidth='1.5' color={budget.category.color || '#2b8dae'} />
										<span>{budget.category.name}</span>
									</h4>
								</td>
								<td className='p-2 border-r border-gray-400'>
									{budget.year}-{String(budget.month).padStart(2, '0')}-{'01'}
								</td>
								<td className='p-2 border-r border-gray-400'>
									{budget.period === 'MONTHLY' ? (
										`${budget.year}-${String(budget.month).padStart(2, '0')}-${new Date(budget.year, budget.month, 0).getDate()}`
									) : (
										`${budget.year + 1}-${String(budget.month).padStart(2, '0')}-01`
									)}
								</td>
								<td className='w-120 py-2 border-r border-gray-400'>
									<div className='mx-4 h-2.5 bg-bluish-cyan/15 border border-navy-blue/30 rounded-full'>
										<div style={{ width: `${budget.isOverBudget! ? '100' : (budget.spentAmount! / budget.limitAmount * 100).toFixed()}%`, backgroundColor: budget.category.color || '#2b8dae' }} className='h-[8.4px] rounded-full' />
									</div>
								</td>
								<td className='p-2 border-r border-gray-400'>
									<span className={budget.isOverBudget! ? 'text-red-500' : ''}>${budget.spentAmount!.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
								</td>
								<td className='p-2 border-r border-gray-400'>
									${budget.limitAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}
								</td>
								<td className='p-2 flex items-center gap-1'>
									<button className='-mb-px text-gray-400 hover:text-gray-500'><SquarePen width='1rem' height='1rem' strokeWidth='1.65' /></button>
									<button className='text-gray-400 hover:text-gray-500'><Trash2 width='1rem' height='1rem' strokeWidth='1.65' /></button>
								</td>
							</tr>
						)) : (
							<div>Empty</div>
						)}
					</tbody>
				</table>
			</div>
		</DashboardLayout>
	);
}