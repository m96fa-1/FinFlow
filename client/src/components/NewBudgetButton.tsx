import { Link } from 'react-router-dom'

export default function NewBudgetButton() {
	return (
		<Link to='/budgets/new' className='flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow transition-colors duration-150'>
			New Budget
		</Link>
	);
}