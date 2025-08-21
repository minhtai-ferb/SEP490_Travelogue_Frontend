"use client"

import React from "react"

type MoneyTextProps = {
	amount: number
	className?: string
	locale?: string
	isPositive?: boolean
}

export default function MoneyText({ amount, className, locale = "vi-VN", isPositive }: MoneyTextProps) {
	const color = !isPositive ? "text-green-600" : "text-red-600"
	return (
		<span className={["font-semibold", color, className].filter(Boolean).join(" ")}>
			{Math.abs(amount).toLocaleString(locale)}
		</span>
	)
}


