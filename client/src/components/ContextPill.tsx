import React from 'react'
import { useLocation } from 'react-router-dom'
import { CalendarDays } from 'lucide-react'

export const ContextPill: React.FC = () => {
	const location = useLocation();

	// Getting page name from URL
	const currentPage = location.pathname
		.replace(/^\/+|\/+$/g, '')
		.replace(/[-_]+/g, ' ')
		.replace(/\b\w/g, (char) => char.toUpperCase());

	// Formatted Month
	const currentMonth = new Date().toLocaleDateString('en-US', {
		month: 'long',
		year: 'numeric',
	});

	// Account Name
	const accountName = 'Personal Acc.';

	return (
		<div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-gray-100 rounded-lg shadow-sm text-sm">
			<span className="text-gray-800 font-semibold">{currentPage}</span>
			<span className="text-gray-500">- {currentMonth}</span>
			<span className="text-gray-400">•</span>
			<span className="text-gray-700 font-medium">{accountName}</span>
			<CalendarDays width='1rem' height='1rem' className='text-gray-700' />
		</div>
	);
}