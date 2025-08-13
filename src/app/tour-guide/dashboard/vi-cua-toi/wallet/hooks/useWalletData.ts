"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useWallet } from "@/services/use-wallet"
import { useBankAccount } from "@/services/use-bankaccount"

export type WithdrawalPayload = { amount: number; bankAccountId: string; note?: string }

export function useWalletData(userId?: string) {
	const { getWalletBalance, getWalletTransactions, createWithdrawalRequest, getMyWithdrawalRequests } = useWallet()
	const { getBankAccount } = useBankAccount()

	const [balance, setBalance] = useState<number>(0)
	const [accounts, setAccounts] = useState<any[]>([])
	const [transactions, setTransactions] = useState<any[]>([])
	const [withdrawalRequests, setWithdrawalRequests] = useState<any[]>([])
	const [loading, setLoading] = useState<boolean>(false)

	// PROPS FOR MY WITHDRAWAL REQUESTS
	const [status, setStatus] = useState<number | undefined>(undefined)
	const [fromDate, setFromDate] = useState<string | undefined>(undefined)
	const [toDate, setToDate] = useState<string | undefined>(undefined)

	const fetchedRef = useRef<string | null>(null)

	const fetchAll = useCallback(async (uid: string) => {
		console.log("fetchAll", status, fromDate, toDate)
		setLoading(true)
		try {
			const [bal, acc, txns, wr] = await Promise.all([
				getWalletBalance(),
				getBankAccount(uid),
				getWalletTransactions(),
				getMyWithdrawalRequests(status, fromDate, toDate),
			])
			console.log("bal", bal)
			console.log("acc", acc)
			console.log("txns", txns)
			console.log("wr", wr)
			setBalance(typeof bal === "number" ? bal : Number(bal ?? 0))
			setAccounts(Array.isArray(acc) ? acc : acc ? [acc] : [])
			setTransactions(Array.isArray(txns) ? txns : [])
			setWithdrawalRequests(Array.isArray(wr) ? wr : wr ? [wr] : [])
		} finally {
			setLoading(false)
		}
	}, [getWalletBalance, getBankAccount, getWalletTransactions, getMyWithdrawalRequests, status, fromDate, toDate])

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


	return { balance, accounts, transactions, withdrawalRequests, loading, createWithdrawal, refetchAll, status, setStatus, fromDate, setFromDate, toDate, setToDate }
}


