
'use client'
import { cn, HeroUIProvider, ToastProvider } from '@heroui/react'
import toast, { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<HeroUIProvider>
			{children}
			<Toaster
				position="top-right"
				toastOptions={{
					className: cn(
						'bg-white text-gray-800 dark:bg-gray-800 dark:text-white',
						'border border-gray-200 dark:border-gray-700',
						'rounded-lg shadow-lg',
						'px-4 py-2'
					),
					style: {
						fontSize: '14px',
					},
				}}
			/>
		</HeroUIProvider>
	)
}