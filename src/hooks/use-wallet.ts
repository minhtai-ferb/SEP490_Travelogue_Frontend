"use client"

import { useCallback, useEffect, useState } from "react"
import type { Wallet } from "@/types/Wallet"

export function useWallet(userId?: string) {
	const [wallet, setWallet] = useState<Wallet | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const fetchWallet = useCallback(async () => {
		if (!userId) return
		setLoading(true)
		setError(null)
		try {
			const res = await fetch(`/api/tour-guide/wallet?userId=${encodeURIComponent(userId)}`, { cache: "no-store" })
			if (!res.ok) throw new Error("Không thể tải ví")
			const data = await res.json()
			setWallet(data.wallet)
		} catch (e: any) {
			setError(e.message || "Có lỗi xảy ra")
		} finally {
			setLoading(false)
		}
	}, [userId])

	const deposit = useCallback(
		async (amount: number, note?: string) => {
			if (!userId) return
			setLoading(true)
			setError(null)
			try {
				const res = await fetch("/api/tour-guide/wallet", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ userId, action: "deposit", amount, note }),
				})
				if (!res.ok) {
					const err = await res.json()
					throw new Error(err.message || "Nạp tiền thất bại")
				}
				await fetchWallet()
				return true
			} catch (e: any) {
				setError(e.message || "Có lỗi xảy ra")
				return false
			} finally {
				setLoading(false)
			}
		},
		[userId, fetchWallet],
	)

	const withdraw = useCallback(
		async (amount: number, note?: string) => {
			if (!userId) return
			setLoading(true)
			setError(null)
			try {
				const res = await fetch("/api/tour-guide/wallet", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ userId, action: "withdraw", amount, note }),
				})
				if (!res.ok) {
					const err = await res.json()
					throw new Error(err.message || "Rút tiền thất bại")
				}
				await fetchWallet()
				return true
			} catch (e: any) {
				setError(e.message || "Có lỗi xảy ra")
				return false
			} finally {
				setLoading(false)
			}
		},
		[userId, fetchWallet],
	)

	useEffect(() => {
		fetchWallet()
	}, [fetchWallet])

	return { wallet, loading, error, fetchWallet, deposit, withdraw }
}
