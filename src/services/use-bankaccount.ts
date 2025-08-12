'use client'

import { BANK_ACCOUNT_API_URL } from "@/constants/api";
import useApiService from "@/hooks/useApi";
import { useCallback } from "react"

export const useBankAccount = () => {

	const { callApi, loading, setIsLoading } = useApiService();

	const safeApiCall = useCallback(
		async <TResp = any>(executor: () => Promise<any>): Promise<TResp | null> => {
			try {
				setIsLoading(true)
				const res = await executor()
				return res?.data as TResp
			} catch (error) {
				console.error(error)
				throw error
			} finally {
				setIsLoading(false)
			}
		},
		[setIsLoading],
	)

	type BankAccountPayload = {
		bankName: string
		bankAccountNumber: string
		bankOwnerName: string
		isDefault: boolean
	}

	const getBankAccount = useCallback(async (userId: string) => {
		return safeApiCall(() => callApi("get", BANK_ACCOUNT_API_URL.GET_BANK_ACCOUNT, { params: { userId } }))
	}, [callApi, safeApiCall])

	const createBankAccount = useCallback(async (data: BankAccountPayload) => {
		return safeApiCall(() => callApi("post", BANK_ACCOUNT_API_URL.CREATE_BANK_ACCOUNT, data))
	}, [callApi, safeApiCall])

	const updateBankAccount = useCallback(async (bankAccountId: string, data: BankAccountPayload) => {
		const url = BANK_ACCOUNT_API_URL.UPDATE_BANK_ACCOUNT.replace(":id", bankAccountId)
		return safeApiCall(() => callApi("put", url, data))
	}, [callApi, safeApiCall])

	const deleteBankAccount = useCallback(async (bankAccountId: string) => {
		const url = BANK_ACCOUNT_API_URL.DELETE_BANK_ACCOUNT.replace(":id", bankAccountId)
		return safeApiCall(() => callApi("delete", url))
	}, [callApi, safeApiCall])

	return {
		getBankAccount,
		createBankAccount,
		updateBankAccount,
		deleteBankAccount,
		loading,
	}
}
