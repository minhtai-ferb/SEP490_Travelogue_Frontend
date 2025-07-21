// app/providers.tsx
'use client'
import { cn, HeroUIProvider, ToastProvider } from '@heroui/react'

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<HeroUIProvider>
			{children}
			<ToastProvider toastProps={{
				classNames: {
					base: cn("z-100"),

				}
			}} />
		</HeroUIProvider>
	)
}