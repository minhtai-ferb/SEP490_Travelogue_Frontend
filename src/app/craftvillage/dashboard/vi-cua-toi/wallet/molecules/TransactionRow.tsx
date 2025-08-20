"use client"

import React from "react"
import MoneyText from "../atoms/MoneyText"
import { ChevronRight, ArrowUpRight, ArrowDownRight } from "lucide-react"

type TransactionRowProps = {
	txn: any
	onClick?: (txn: any) => void
}

export default function TransactionRow({ txn, onClick }: TransactionRowProps) {
	const amount = Number(txn?.paidAmount ?? txn?.amount ?? 0)
	const rawDirection = String(txn?.direction || "").toLowerCase()
	const typeLower = String(txn?.type || "").toLowerCase()
	const isOutboundByType = ["withdrawal", "fee", "charge", "transfer_out", "payout_to_bank"].includes(typeLower)
	const isOutboundByDirection = ["debit", "out", "outbound", "withdrawal", "decrease"].includes(rawDirection)
	const inferredOutbound = Number.isFinite(amount) ? amount < 0 : false
	const isOutbound = isOutboundByDirection || isOutboundByType || inferredOutbound
	const absAmount = Math.abs(amount)

	const ref = txn?.referenceCode || txn?.bookingId || txn?.orderId || txn?.ref || ""
	const reasonText: string | undefined = txn?.reasonText || txn?.note
	const baseTitle = reasonText || txn?.typeText || txn?.type || txn?.title || "Giao dịch"
	const title = ref ? `${baseTitle} #${ref}` : baseTitle

	const dateIso = txn?.processedAt || txn?.transactionDateTime || txn?.createdAt || txn?.date || ""
	const dateText = String(dateIso)

	const method = txn?.method || txn?.paymentMethod || ""
	const statusRaw = txn?.status || txn?.paymentStatus || txn?.statusText || ""
	const statusText = String(txn?.paymentStatusText || txn?.statusText || statusRaw)

	const feeAmount = Number(txn?.feeAmount ?? 0)
	const taxAmount = Number(txn?.taxAmount ?? 0)
	const netAmount = Number(txn?.netAmount ?? absAmount - feeAmount - taxAmount)
	const showNet = Number.isFinite(netAmount) && netAmount > 0 && Math.abs(netAmount - absAmount) >= 1

	const statusClass = (() => {
		const s = String(statusRaw).toLowerCase()
		if (s.includes("pending")) return "bg-amber-100 text-amber-800"
		if (s.includes("success") || s.includes("succeeded") || s.includes("completed") || s.includes("settled")) return "bg-emerald-100 text-emerald-800"
		if (s.includes("fail") || s.includes("error") || s.includes("cancel") || s.includes("reject")) return "bg-rose-100 text-rose-800"
		return "bg-gray-100 text-gray-700"
	})()

	const sign = isOutbound ? "-" : "+"
	const amountClass = isOutbound ? "text-rose-700" : "text-emerald-700"
	const iconBgClass = isOutbound ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"

	return (
		<button
			type="button"
			onClick={() => onClick?.(txn)}
			className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
		>
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center gap-3 min-w-0">
					<span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${iconBgClass}`}>
						{isOutbound ? (
							<ArrowDownRight className="w-4 h-4" />
						) : (
							<ArrowUpRight className="w-4 h-4" />
						)}
					</span>
					<div className="min-w-0">
						<div className="font-medium truncate">{title}</div>
						{(reasonText || method) && (
							<div className="text-[11px] text-gray-500 truncate">
								{reasonText}
								{reasonText && method ? " · " : ""}
								{method ? `Phương thức: ${method}` : ""}
							</div>
						)}
						<div className="text-xs text-gray-500 truncate" title={dateText}>{dateText}</div>
					</div>
				</div>
				<div className="text-right">
					<div className={`font-medium ${amountClass}`}>
						{sign} <MoneyText isPositive={isOutbound} amount={absAmount} />
					</div>
					{showNet && (
						<div className="text-[11px] text-gray-500">Sau phí: <MoneyText isPositive={isOutbound} amount={netAmount} /></div>
					)}
					{statusText && (
						<div className="mt-0.5">
							<span className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium ${statusClass}`}>{statusText}</span>
						</div>
					)}
				</div>
				<ChevronRight className="w-4 h-4 text-gray-400" />
			</div>
		</button>
	)
}


