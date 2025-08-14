"use client"

import React from "react"
import MoneyText from "../atoms/MoneyText"
import { ChevronRight } from "lucide-react"

type TransactionRowProps = {
	txn: any
	onClick?: (txn: any) => void
}

export default function TransactionRow({ txn, onClick }: TransactionRowProps) {
	const title = txn?.typeText || txn?.type || txn?.title || "Giao dịch"
	const dateText = txn?.transactionDateTime || txn?.createdAt || txn?.date || ""
	const amount = Number(txn?.paidAmount ?? txn?.amount ?? 0)
	const statusText = txn?.paymentStatusText || txn?.statusText || ""

	return (
		<button
			type="button"
			onClick={() => onClick?.(txn)}
			className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
		>
			<div className="flex items-center justify-between gap-3">
				<div className="min-w-0">
					<div className="font-medium truncate">{title}</div>
					<div className="text-xs text-gray-500 truncate">{dateText}</div>
				</div>
				<div className="text-right">
					<MoneyText amount={amount} />
					<div className="text-xs text-gray-500">{statusText}</div>
				</div>
				<ChevronRight className="w-4 h-4 text-gray-400" />
			</div>
		</button>
	)
}


