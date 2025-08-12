"use client"

import React from "react"

type MoneyTextProps = {
	amount: number
	className?: string
	locale?: string
}

export default function MoneyText({ amount, className, locale = "vi-VN" }: MoneyTextProps) {
	const isPositive = amount >= 0
	const color = isPositive ? "text-green-600" : "text-red-600"
	return (
		<span className={["font-semibold", color, className].filter(Boolean).join(" ")}>
			{isPositive ? "+" : ""}
			{Math.abs(amount).toLocaleString(locale)}
		</span>
	)
}


