import React from 'react'

import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useBudgetsData } from '../hooks/useData'
import { budgetsApi, type CreateBudgetInput } from '../api/budgets'
import type { Budget } from '../types/api'

import DashboardLayout from '../layouts/DashboardLayout'
import ContextPill from '../components/ContextPill'
import NewBudgetModal from '../components/NewBudgetModal'
import ConfirmDialog from '../components/ConfirmDialog'

import { SquarePen, Trash2 } from 'lucide-react'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'

export default function BudgetsPage() {
	useDocumentTitle('Budgets');
	const data = useBudgetsData();

	const [budgets, setBudgets] = React.useState<Budget[]>([]);
	const [newBudgetModalOpen, setNewBudgetModalOpen] = React.useState<boolean>(false);
	const [budgetToDelete, setBudgetToDelete] = React.useState<Budget | null>(null);
	const [isDeleting, setIsDeleting] = React.useState<boolean>(false);
	const [deleteErrorMessage, setDeleteErrorMessage] = React.useState<string | undefined>(undefined);
	
	React.useEffect(() => {
		setBudgets(data.budgets);
	}, [data]);

	const handleDeleteConfirm = async () => {
			if (!budgetToDelete) return;
	
			setIsDeleting(true);
	
			try {
				await budgetsApi.delete(budgetToDelete.id);
	
				setBudgets((prev) => prev.filter(bud => bud.id !== budgetToDelete.id));
				setBudgetToDelete(null);
			} catch (error: any) {
				setDeleteErrorMessage(String(error.response.data.message));
				console.error('Delete error: ', error.response.data.message);
			} finally {
				setIsDeleting(false);
			}
		};

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
				<button onClick={() => { setNewBudgetModalOpen(true); }} className='flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow transition-colors duration-150'>
					New Budget
				</button>
				<ContextPill />
			</div>

			<div className='p-4 bg-white border border-gray-100 rounded-xl shadow-md'>
				<table className='w-full'>
					<thead>
						<tr className='text-gray-400 text-sm'>
							<th scope='col' className='px-2 py-1 border-b border-r border-gray-400 font-normal'>Category</th>
							<th scope='col' className='px-2 py-1 border-b border-r border-gray-400 font-normal'>Starting Date</th>
							<th scope='col' className='px-2 py-1 border-b border-r border-gray-400 font-normal'>Period</th>
							<th scope='col' className='px-2 py-1 border-b border-r border-gray-400 font-normal'>Usage Bar</th>
							<th scope='col' className='px-2 py-1 border-b border-r border-gray-400 font-normal'>Spent Amount</th>
							<th scope='col' className='px-2 py-1 border-b border-r border-gray-400 font-normal'>Limit Amount</th>
							<th scope='col' className='px-2 py-1 border-b font-normal'>Options</th>
						</tr>
					</thead>
					<tbody className='text-gray-700'>
						{budgets.map(budget => (
							<tr key={budget.id}>
								<td className='p-2 border-r border-gray-400'>
									<h4 className='flex items-center gap-1'>
										<DynamicIcon name={budget.category.icon ? budget.category.icon as IconName : 'box'} width='24px' height='24px' strokeWidth='1.5' color={budget.category.color || '#2b8dae'} />
										<span>{budget.category.name}</span>
									</h4>
								</td>
								<td className='p-2 border-r border-gray-400'>
									{new Date(budget.year, budget.month - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
								</td>
								<td className='p-2 border-r border-gray-400'>
									{budget.period === 'MONTHLY' ? 'Monthly' : 'Yearly'}
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
									<button aria-label={`Edit ${budget.category.name} Budget`} className='-mb-px text-gray-400 hover:text-gray-500'><SquarePen width='1rem' height='1rem' strokeWidth='1.65' /></button>
									<button onClick={() => setBudgetToDelete(budget)} aria-label={`Delete ${budget.category.name} Budget`} className='text-gray-400 hover:text-gray-500'><Trash2 width='1rem' height='1rem' strokeWidth='1.65' /></button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<NewBudgetModal
				isOpen={newBudgetModalOpen}
				onConfirm={async (data: CreateBudgetInput) => {
					const res = await budgetsApi.create(data);
					setBudgets(prev => [...prev, res.data]);
					setNewBudgetModalOpen(false);
				}}
				onClose={() => { setNewBudgetModalOpen(false); }}
			/>
			
			<ConfirmDialog
				isOpen={Boolean(budgetToDelete)}
				title='Delete Budget'
				description={
					<>
						Are you sure you want to delete{' '}
						<span className='font-bold text-gray-800'>{budgetToDelete?.category.name} Budget</span>
						?
					</>
				}
				errorMessage={deleteErrorMessage}
				confirmText='Delete'
				isDanger={true}
				isLoading={isDeleting}
				onConfirm={handleDeleteConfirm}
				onClose={() => { setDeleteErrorMessage(undefined); setBudgetToDelete(null); }}
			/>
		</DashboardLayout>
	);
}