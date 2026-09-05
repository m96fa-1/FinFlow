import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

export default function AddTransactionButton() {
	return (
		<Link to='/transactions/new' className='flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow transition-colors duration-150'>
			<Plus width={16} height={16} strokeWidth={2.5} className='mr-1' />
			<span>Add Transaction</span>
		</Link>
	);
}