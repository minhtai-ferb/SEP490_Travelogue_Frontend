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
