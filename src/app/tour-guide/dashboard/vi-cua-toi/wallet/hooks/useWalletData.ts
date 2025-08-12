"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useWallet } from "@/services/use-wallet"
import { useBankAccount } from "@/services/use-bankaccount"

export type WithdrawalPayload = { amount: number; bankAccountId: string; note?: string }

export function useWalletData(userId?: string) {
	const { getWalletBalance, getWalletTransactions, getWithdrawalRequests, createWithdrawalRequest } = useWallet()
	const { getBankAccount } = useBankAccount()

	const [balance, setBalance] = useState<number>(0)
	const [accounts, setAccounts] = useState<any[]>([])
	const [transactions, setTransactions] = useState<any[]>([])
	const [withdrawalRequests, setWithdrawalRequests] = useState<any[]>([])
	const [loading, setLoading] = useState<boolean>(false)

	const fetchedRef = useRef<string | null>(null)

	const fetchAll = useCallback(async (uid: string) => {
		setLoading(true)
		try {
			const [bal, acc, txns, wr] = await Promise.all([
				getWalletBalance(),
				getBankAccount(uid),
				getWalletTransactions(),
				getWithdrawalRequests(uid),
			])
			setBalance(typeof bal === "number" ? bal : Number(bal ?? 0))
			setAccounts(Array.isArray(acc) ? acc : acc ? [acc] : [])
			setTransactions(Array.isArray(txns) ? txns : [])
			setWithdrawalRequests(Array.isArray(wr) ? wr : wr ? [wr] : [])
		} finally {
			setLoading(false)
		}
	}, [getWalletBalance, getBankAccount, getWalletTransactions, getWithdrawalRequests])

	useEffect(() => {
		if (!userId) return
		if (fetchedRef.current === userId) return
		fetchedRef.current = userId
		fetchAll(userId)
	}, [userId, fetchAll])

	const refetchAll = useCallback(async () => {
		if (!userId) return
		await fetchAll(userId)
	}, [fetchAll, userId])

	const createWithdrawal = useCallback(async (payload: WithdrawalPayload) => {
		const res = await createWithdrawalRequest(payload)
		if (res) await refetchAll()
		return !!res
	}, [createWithdrawalRequest, refetchAll])

	return { balance, accounts, transactions, withdrawalRequests, loading, createWithdrawal, refetchAll }
}


