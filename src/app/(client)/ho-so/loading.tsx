import React from 'react'

function loading() {
	return (
		<div>
			<div className="flex items-center justify-center h-screen">
				<div className="w-16 h-16 border-t-4 border-b-4 border-yellow-500 rounded-full animate-spin"></div>
			</div>
		</div>
	)
}

export default loading