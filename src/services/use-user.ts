'use client'

import { USER_API_URL, WALLET_API_URL } from "@/constants/api";
import useApiService from "@/hooks/useApi";
import { useCallback } from "react"

export const useUser = () => {

	const { callApi, loading, setIsLoading } = useApiService();

	const getUserDetail = useCallback(async (userId: string) => {
		try {
			setIsLoading(true)
			const res = await callApi("get", `${USER_API_URL.GET_USER_DETAIL}?userId=${userId}`)
			return res?.data
		} catch (error) {
			console.error(error)
			return null
		} finally {
			setIsLoading(false)
		}
	}, [callApi, loading, setIsLoading])

	return {
		getUserDetail,
		loading,
	}
}
