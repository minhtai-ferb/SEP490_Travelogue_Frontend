"use client"

import React, { ReactNode } from "react"

export default function WalletTwoColumn({ left, right }: { left: ReactNode; right: ReactNode }) {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
			<div className="lg:col-span-2 space-y-6">{left}</div>
			<div className="lg:col-span-1 space-y-6">{right}</div>
		</div>
	)
}


