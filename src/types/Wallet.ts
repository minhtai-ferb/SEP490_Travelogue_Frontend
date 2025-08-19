export type WalletTxnType = "deposit" | "withdrawal" | "earning" | "refund"
export type WalletTxnStatus = "completed" | "pending" | "failed"

export interface WalletTransaction {
	id: string
	userId: string
	type: WalletTxnType
	amount: number
	balanceAfter: number
	note?: string
	status: WalletTxnStatus
	createdAt: string
}

export interface Wallet {
	userId: string
	balance: number
	currency: "VND"
	transactions: WalletTransaction[]
	updatedAt: string
}


export interface WalletTransaction {
	id: string
	userId: string
	type: WalletTxnType
	balanceAfter: number
	createdAt: string
	direction: "credit" | "debit"
	amount: number
	netAmount: number
	feeAmount: number
	reasonText: string
	referenceCode: string
	processedAt: string
	method: string
	status: WalletTxnStatus
	statusText: string
	typeText: string
}
