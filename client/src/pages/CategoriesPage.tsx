import React from 'react'

import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useCategoriesData } from '../hooks/useData'
import { categoriesApi, type CreateCategoryInput } from '../api/categories'
import type { Category } from '../types/api'

import DashboardLayout from '../layouts/DashboardLayout'
import ContextPill from '../components/ContextPill'
import CreateCategoryModal from '../components/CreateCategoryModal'
import ConfirmDialog from '../components/ConfirmDialog'

import { SquarePen, Trash2 } from 'lucide-react'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'

export default function CategoriesPage() {
	useDocumentTitle('Categories');
	const data = useCategoriesData();

	const [categories, setCategories] = React.useState<Category[]>([]);
	const [createModalOpen, setCreateModalOpen] = React.useState<boolean>(false);
	const [categoryToDelete, setCategoryToDelete] = React.useState<Category | null>(null);
	const [isDeleting, setIsDeleting] = React.useState<boolean>(false);
	const [deleteErrorMessage, setDeleteErrorMessage] = React.useState<string | undefined>(undefined);

	React.useEffect(() => {
		setCategories(data.categories);
	}, [data]);

	const handleDeleteConfirm = async () => {
		if (!categoryToDelete) return;

		setIsDeleting(true);

		try {
			await categoriesApi.delete(categoryToDelete.id);

			setCategories((prev) => prev.filter(cat => cat.id !== categoryToDelete.id));
			setCategoryToDelete(null);
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
				<div className='py-4 flex items-center justify-between animate-pulse'>
					<div className='w-40 h-2 rounded bg-gray-300' />
					<div className='w-90 h-2 rounded bg-gray-300' />
				</div>

				<div className='space-y-8 mt-8 p-4 bg-white border border-gray-100 rounded-xl shadow-md'>
					<div className='w-50 h-2 mt-4 mb-8 rounded bg-gray-300 animate-pulse' />
					{[1, 2, 3, 4, 5, 6, 7].map(item => (
						<div key={item} className='flex items-center justify-between animate-pulse'>
							<div className='flex items-center'>
								<div className='size-8 rounded-full bg-gray-300' />
								<div className='ml-2'>
									<div className='w-50 h-2 rounded bg-gray-300' />
									<div className='w-10 h-2 mt-3 rounded bg-gray-300' />
								</div>
							</div>
							<div className='flex items-center gap-1'>
								<div className='size-4 rounded-full bg-gray-300' />
								<div className='size-4 rounded-full bg-gray-300' />
							</div>
						</div>
					))}
				</div>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout>
			<div className='flex items-center justify-between'>
				<button onClick={() => { setCreateModalOpen(true); }} className='flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow transition-colors duration-150'>
					Create Category
				</button>
				<ContextPill />
			</div>

			<div className='space-y-5 p-4 bg-white border border-gray-100 rounded-xl shadow-md'>
				<h2 className='text-gray-800 text-lg font-semibold'>Categories List</h2>
				{categories.length > 0 ? categories.map(cat => (
					<div key={cat.id} className='flex items-center justify-between'>
						<div className='flex items-center'>
							<DynamicIcon name={cat.icon ? cat.icon as IconName : 'box'} width='26px' height='26px' strokeWidth='1.5' color={cat.color ?? '#2b8dae'} />
							<div className='ml-2'>
								<h3 className='text-gray-800 text-sm font-medium'>{cat.name}</h3>
								<div className='text-gray-400 text-xs'>
									{cat.type[0] + cat.type.substring(1).toLowerCase()} • {cat._count.transactions} {cat._count.transactions === 1 ? 'Transaction' : 'Transactions'} • {cat._count.budgets} {cat._count.budgets === 1 ? 'Budget' : 'Budgets'}
								</div>
							</div>
						</div>
						<div className='flex items-center gap-1'>
							<button aria-label={`Edit ${cat.name}`} className='-mb-px text-gray-400 hover:text-gray-500'><SquarePen size='1rem' strokeWidth='1.65' /></button>
							<button onClick={() => setCategoryToDelete(cat)} aria-label={`Delete ${cat.name}`} className='text-gray-400 hover:text-gray-500'><Trash2 size='1rem' strokeWidth='1.65' /></button>
						</div>
					</div>
				)) : (
					<div>Empty</div>
				)}
			</div>

			<CreateCategoryModal
				isOpen={createModalOpen}
				onConfirm={async (data: CreateCategoryInput) => {
					const res = await categoriesApi.create(data);
					setCategories(prev => [...prev, res.data]);
					setCreateModalOpen(false);
				}}
				onClose={() => { setCreateModalOpen(false); }}
			/>
			
			<ConfirmDialog
				isOpen={Boolean(categoryToDelete)}
				title='Delete Category'
				description={
					<>
						Are you sure you want to delete{' '}
						<span className='font-bold text-gray-800'>{categoryToDelete?.name}</span>
						?
					</>
				}
				errorMessage={deleteErrorMessage}
				confirmText='Delete'
				isDanger={true}
				isLoading={isDeleting}
				onConfirm={handleDeleteConfirm}
				onClose={() => { setDeleteErrorMessage(undefined); setCategoryToDelete(null); }}
			/>
		</DashboardLayout>
	);
}