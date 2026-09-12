import React from 'react'

import { AlertTriangle, Loader2, X } from 'lucide-react'

interface ConfirmDialogProps {
	isOpen: boolean;
	title: string;
	description: React.ReactNode;
	errorMessage?: string;
	confirmText?: string;
	cancelText?: string;
	isDanger?: boolean;
	isLoading?: boolean;
	onConfirm: () => Promise<void>;
	onClose: () => void;
}

export default function ConfirmDialog({
	isOpen,
	title,
	description,
	errorMessage,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	isDanger = true,
	isLoading = false,
	onConfirm,
	onClose,
}: ConfirmDialogProps) {
	if (!isOpen) return null;

	const containerRef = React.useRef<HTMLDivElement>(null);
	const modalRef = React.useRef<HTMLDivElement>(null);

	const handleClose = () => {
		containerRef.current!.classList.add('animate-[fade-out_500ms_forwards]');
		modalRef.current!.classList.add('animate-[zoom-fade-out_500ms_forwards]');

		setTimeout(() => {
			onClose();
		}, 500);
	};

	React.useEffect(() => {
		if (!containerRef.current) return;

		const handleContainerOnClick = (ev: PointerEvent) => {
			if (ev.target === containerRef.current) {
				handleClose();
			}
		};

		if (isLoading) {
			containerRef.current.removeEventListener('click', handleContainerOnClick)
		} else {
			containerRef.current.addEventListener('click', handleContainerOnClick);
		}
		return () => {
			if (containerRef.current) containerRef.current.removeEventListener('click', handleContainerOnClick);
		};
	}, [containerRef, isLoading]);

	return (
		<div ref={containerRef} className='fixed inset-0 p-4 flex items-center justify-center bg-black/20 backdrop-blur-xs z-50 animate-[fade-in_0.15s_ease-out]'>
			<div ref={modalRef} className='w-full max-w-sm bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-[zoom-fade-in_0.5s_ease-out]'>
				{/* Header */}
				<div className='flex items-center justify-between p-5 border-b border-gray-100'>
					<div className='flex items-center gap-3'>
						<div
							className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
								isDanger
									? 'bg-red-50 text-red-600 border border-red-100'
									: 'bg-amber-50 text-amber-600 border border-amber-100'
							}`}
						>
							<AlertTriangle className='w-5 h-5' />
						</div>
						<div>
							<h2 className='text-base font-bold text-gray-800'>{title}</h2>
						</div>
					</div>

					<button
						onClick={handleClose}
						disabled={isLoading}
						className='p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50'
					>
						<X size='20' />
					</button>
				</div>

				{/* Error Message */}
				{errorMessage && (
					<div className='mx-5 mt-3 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-semibold'>
						{errorMessage}
					</div>
				)}

				{/* Description */}
				<div className='m-5 text-sm text-gray-600 leading-relaxed'>
					{description}
				</div>

				{/* Action Buttons */}
				<div className='flex items-center justify-end gap-2 p-4 bg-gray-50/50 border-t border-gray-100'>
					<button
						type='button'
						onClick={handleClose}
						disabled={isLoading}
						className='px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50'
					>
						{cancelText}
					</button>

					<button
						type='button'
						onClick={onConfirm}
						disabled={isLoading}
						className={`flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors disabled:opacity-50 ${
							isDanger
								? 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500'
								: 'bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500'
						}`}
					>
						<span>{confirmText}</span>
						{isLoading && <Loader2 className='w-3.5 h-3.5 animate-spin' />}
					</button>
				</div>
			</div>
		</div>
	);
}