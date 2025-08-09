'use client'

import Loading from '@/components/common/loading'
import Footer from '@/components/footer'
import ScrollToTop from '@/components/scrollToTop/ScrollToTop'
import React, { useEffect, useState } from 'react'

function Layout({ children }: { children: React.ReactNode }) {
	const [showContent, setShowContent] = useState(false)

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowContent(true)
		}, 3500) // delay in ms

		return () => clearTimeout(timer)
	}, [])

	if (!showContent) return <Loading />

	return (
		<main className="flex min-h-screen flex-col">
			<div className="flex-1">
				{children}
			</div>
			<Footer />
			<ScrollToTop />
		</main>
	)
}

export default Layout
