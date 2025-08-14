'use client'

import { WALLET_API_URL } from "@/constants/api";
import useApiService from "@/hooks/useApi";
import { useCallback } from "react"

export const useWallet = () => {

	const { callApi, loading, setIsLoading } = useApiService();

	const getWallet = useCallback(async () => {
		try {
			setIsLoading(true)
			const res = await callApi("get", WALLET_API_URL.GET_WALLET)
			return res?.data
		} catch (error) {
			console.error(error)
			return null
		} finally {
			setIsLoading(false)
		}
	}, [callApi, loading, setIsLoading])

	const getWalletBalance = useCallback(async () => {
		try {
			setIsLoading(true)
			const res = await callApi("get", WALLET_API_URL.GET_WALLET_BALANCE)
			return res?.data
		} catch (error) {
			console.error(error)
			return null
		} finally {
			setIsLoading(false)
		}
	}, [callApi, loading, setIsLoading])

	const createWithdrawalRequest = useCallback(async (data: any) => {
		try {
			setIsLoading(true)
			const res = await callApi("post", WALLET_API_URL.WITHDRAWAL_REQUEST, data)
			return res?.data
		} catch (error) {
			console.error(error)
			throw error
		} finally {
			setIsLoading(false)
		}
	}, [callApi, loading, setIsLoading])

	const getWithdrawalRequests = useCallback(async (userId: string, status?: number, fromDate?: string, toDate?: string) => {
		const params = { userId, status, FromDate: fromDate, ToDate: toDate }
		try {
			setIsLoading(true)
			const res = await callApi("get", WALLET_API_URL.WITHDRAWAL_REQUESTS_FILTER, params)
			return res?.data
		} catch (error) {
			console.error(error)
		} finally {
			setIsLoading(false)
		}
	}, [callApi, loading, setIsLoading])

	// const postWithRequestId = useCallback(
	// 	async <TBody extends object, TResp = any>(urlTemplate: string, requestId: string, body: TBody): Promise<TResp | null> => {
	// 		try {
	// 			setIsLoading(true)
	// 			const url = urlTemplate.replace(":requestId", requestId)
	// 			const res = await callApi("post", url, body)
	// 			return res?.data as TResp
	// 		} catch (error) {
	// 			console.error(error)
	// 		} finally {
	// 			setIsLoading(false)
	// 		}
	// 	},
	// 	[callApi, setIsLoading],
	// )

	const getWalletTransactions = useCallback(async () => {
		try {
			setIsLoading(true)
			const res = await callApi("get", WALLET_API_URL.GET_WALLET_TRANSACTIONS)
			return res?.data
		} catch (error) {
			console.error(error)
		} finally {
			setIsLoading(false)
		}
	}, [callApi, loading, setIsLoading])

	type ApproveWithdrawalPayload = {
		proofImageUrl: string
		adminNote: string
	}

	const approveWithdrawalRequest = useCallback(async (requestId: string, data: ApproveWithdrawalPayload) => {

		try {
			setIsLoading(true)
			const res = await callApi("post", WALLET_API_URL.APPROVE_WITHDRAWAL_REQUEST, { requestId, ...data })
			return res
		} catch (error) {
			console.error(error)
			throw error
		} finally {
			setIsLoading(false)
		}
	}, [callApi, setIsLoading])

	const rejectWithdrawalRequest = useCallback(async (requestId: string) => {
		try {
			setIsLoading(true)
			const res = await callApi("post", WALLET_API_URL.REJECT_WITHDRAWAL_REQUEST, { requestId })
			return res
		} catch (error) {
			console.error(error)
			throw error
		} finally {
			setIsLoading(false)
		}
	}, [callApi, setIsLoading])

	const getMyWithdrawalRequests = useCallback(async (status?: number, fromDate?: string, toDate?: string) => {
		const params = { status, FromDate: fromDate, ToDate: toDate }
		console.log("params", params)
		try {
			setIsLoading(true)
			console.log("callApi", WALLET_API_URL.MY_WITHDRAWAL_REQUESTS, params)
			const res = await callApi("get", WALLET_API_URL.MY_WITHDRAWAL_REQUESTS, params)
			console.log("res", res)
			return res?.data
		} catch (error) {
			console.error(error)
			return null
		} finally {
			setIsLoading(false)
		}
	}, [callApi, loading, setIsLoading])

	return {
		getWallet,
		getWalletBalance,
		createWithdrawalRequest,
		getWithdrawalRequests,
		approveWithdrawalRequest,
		rejectWithdrawalRequest,
		getWalletTransactions,
		getMyWithdrawalRequests,
		loading,
	}
}
