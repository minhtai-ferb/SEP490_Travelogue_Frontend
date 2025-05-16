import Footer from '@/components/footer'
import ScrollToTop from '@/components/scrollToTop/ScrollToTop'
import React from 'react'

function Layout({ children }: { children: React.ReactNode }) {


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
