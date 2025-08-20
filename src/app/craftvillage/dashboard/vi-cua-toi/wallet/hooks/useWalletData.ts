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
	const [status, setStatus] = useState<any | undefined>(undefined)
	const [fromDate, setFromDate] = useState<string | undefined>(undefined)
	const [toDate, setToDate] = useState<string | undefined>(undefined)

	const fetchedRef = useRef<string | null>(null)
	const requestSeqRef = useRef(0)

	const fetchAll = useCallback(
		async (
			uid: string,
			filters: { status?: any; fromDate?: string; toDate?: string } = {},
		) => {
			const currentSeq = ++requestSeqRef.current
			const statusParam = (filters.status === "all" || filters.status === "") ? undefined : filters.status
			setLoading(true)
			try {
				const [bal, acc, txns, wr] = await Promise.all([
					getWalletBalance(),
					getBankAccount(uid),
					getWalletTransactions(),
					getMyWithdrawalRequests(statusParam, filters.fromDate, filters.toDate),
				])
				if (currentSeq !== requestSeqRef.current) return
				setBalance(typeof bal === "number" ? bal : Number(bal ?? 0))
				setAccounts(Array.isArray(acc) ? acc : acc ? [acc] : [])
				setTransactions(Array.isArray(txns) ? txns : [])
				setWithdrawalRequests(Array.isArray(wr) ? wr : wr ? [wr] : [])
			} finally {
				if (currentSeq === requestSeqRef.current) setLoading(false)
			}
		},
		[getWalletBalance, getBankAccount, getWalletTransactions, getMyWithdrawalRequests],
	)

	useEffect(() => {
		if (!userId) return
		if (fetchedRef.current === userId) return
		fetchedRef.current = userId
		fetchAll(userId, { status, fromDate, toDate })
	}, [userId])

	// Auto refetch when filters change (avoid depending on fetchAll identity)
	useEffect(() => {
		if (!userId) return
		fetchAll(userId, { status, fromDate, toDate })
	}, [status, fromDate, toDate, userId])

	const refetchAll = useCallback(async () => {
		if (!userId) return
		await fetchAll(userId, { status, fromDate, toDate })
	}, [fetchAll, userId, status, fromDate, toDate])

	const createWithdrawal = useCallback(async (payload: WithdrawalPayload) => {
		const res = await createWithdrawalRequest(payload)
		if (res) await refetchAll()
		return !!res
	}, [createWithdrawalRequest, refetchAll])


	return { balance, accounts, transactions, withdrawalRequests, loading, createWithdrawal, refetchAll, status, setStatus, fromDate, setFromDate, toDate, setToDate }
}


