import type { User } from '../types/api'
import clsx from 'clsx'

export default function UserNoImageAvatar({ user, size }: { user: User; size: 'sm' | 'md' | 'lg'; }) {
	return (
		<div className={clsx(size === 'sm' ? 'w-8 h-8 text-sm' : size === 'md' ? 'w-10 h-10 text-md' : 'w-12 h-12 text-lg', 'flex items-center justify-center bg-linear-45 from-bluish-cyan to-greenish-cyan text-white font-semibold rounded-full select-none drag-none')}>{user.fullName[0] + user.fullName[user.fullName.lastIndexOf(' ') + 1]}</div>
	);
}