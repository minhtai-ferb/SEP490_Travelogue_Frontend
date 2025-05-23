import React from 'react'
import Header from './component/header'

function layout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<Header />
			{children}
		</div>
	)
}

export default layout