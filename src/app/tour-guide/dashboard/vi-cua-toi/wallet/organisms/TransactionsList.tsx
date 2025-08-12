"use client"

import React from "react"
import TransactionRow from "../molecules/TransactionRow"

type Props = {
	transactions: any[]
	onSelect: (txn: any) => void
}

export default function TransactionsList({ transactions, onSelect }: Props) {
	if (!transactions?.length) return <div className="text-sm text-gray-500">Không có giao dịch nào.</div>
	return (
		<div className="space-y-3">
			{transactions.map((t) => (
				<TransactionRow key={t.id} txn={t} onClick={onSelect} />
			))}
		</div>
	)
}


