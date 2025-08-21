"use client"

import React from "react"
import TransactionRow from "../molecules/TransactionRow"
import { WalletTransaction } from "@/types/Wallet"

type Props = {
	transactions: WalletTransaction[]
	onSelect: (txn: any) => void
}

export default function TransactionsList({ transactions, onSelect }: Props) {
	const demoTransactions: WalletTransaction[] = [
		{
			id: "txn_demo_01",
			userId: "user_demo_01",
			type: "deposit",
			balanceAfter: 150000,
			createdAt: "2025-08-12 10:42",
			direction: "credit",
			amount: 150000,
			netAmount: 148500,
			feeAmount: 1500,
			reasonText: "Nhận tiền đặt chỗ",
			referenceCode: "BKG-1024",
			processedAt: "2025-08-12 10:42",
			method: "MoMo",
			status: "completed",
			statusText: "Hoàn tất",
			typeText: "BookingPayment",
		},
		{
			id: "txn_demo_02",
			userId: "user_demo_02",
			type: "withdrawal",
			balanceAfter: 100000,
			createdAt: "2025-08-11 18:05",
			direction: "debit",
			amount: -50000,
			netAmount: 49000,
			feeAmount: 1000,
			reasonText: "Thanh toán phí dịch vụ",
			referenceCode: "FEE-2025-08",
			processedAt: "2025-08-11 18:05",
			method: "Wallet",
			status: "completed",
			statusText: "Đã trừ",
			typeText: "Fee",
		},
		{
			id: "txn_demo_03",
			userId: "user_demo_03",
			type: "earning",
			balanceAfter: 70000,
			createdAt: "2025-08-10 14:20",
			direction: "credit",
			amount: 70000,
			netAmount: 69000,
			feeAmount: 1000,
			reasonText: "Tiền tip từ khách hàng",
			referenceCode: "TIP-7731",
			processedAt: "2025-08-10 14:20",
			method: "VNPay",
			status: "pending",
			statusText: "Đang chờ",
			typeText: "Tip",
		},
		{
			id: "txn_demo_04",
			userId: "user_demo_04",
			type: "withdrawal",
			balanceAfter: -200000,
			createdAt: "2025-08-09 09:02",
			direction: "debit",
			amount: -200000,
			netAmount: 198000,
			feeAmount: 2000,
			reasonText: "Rút tiền về ngân hàng",
			referenceCode: "WD-5552",
			processedAt: "2025-08-09 09:02",
			method: "Techcombank",
			status: "failed",
			statusText: "Thất bại",
			typeText: "Withdrawal",
		},
	]

	const list = transactions?.length ? transactions : demoTransactions
	return (
		<div className="space-y-3">
			{list.map((t) => (
				<TransactionRow key={t.id} txn={t} onClick={onSelect} />
			))}
		</div>
	)
}


