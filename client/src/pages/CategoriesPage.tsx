import React from 'react'
import { Outlet } from 'react-router-dom'

import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useCategoriesData } from '../hooks/useData'

import DashboardLayout from '../layouts/DashboardLayout'
import CreateCategoryButton from '../components/CreateCategoryButton'
import ContextPill from '../components/ContextPill'

import { SquarePen } from 'lucide-react'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'

export default function CategoriesPage() {
	useDocumentTitle('Categories');
	const data = useCategoriesData();

	const categories = React.useMemo(() => data.categories, [data.categories]);

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
				<CreateCategoryButton />
				<ContextPill />
			</div>

			<div className='space-y-5 p-4 bg-white border border-gray-100 rounded-xl shadow-md'>
				<h2 className='text-gray-800 text-lg font-semibold'>Categories List</h2>
				{categories.length > 0 ? categories.map(cat => (
					<div className='flex items-center justify-between'>
						<div key={cat.id} className='flex items-center'>
							<DynamicIcon name={cat.icon ? cat.icon as IconName : 'box'} width='26px' height='26px' strokeWidth='1.5' color={cat.color ?? '#2b8dae'} />
							<div className='ml-2'>
								<h3 className='text-gray-800 text-sm font-medium'>{cat.name}</h3>
								<div className='text-gray-400 text-xs'>
									{cat.type[0] + cat.type.substring(1).toLowerCase()} • {cat._count.transactions} {cat._count.transactions === 1 ? 'Transaction' : 'Transactions'} • {cat._count.budgets} {cat._count.budgets === 1 ? 'Budget' : 'Budgets'}
								</div>
							</div>
						</div>
						<button className='-mb-px text-gray-400 hover:text-gray-500'><SquarePen width='1rem' height='1rem' strokeWidth='1.65' /></button>
					</div>
				)) : (
					<div>Empty</div>
				)}
			</div>
			
			{/* Renders child routes (e.g. /transactions/new) as an overlay */}
			<Outlet />
		</DashboardLayout>
	);
}