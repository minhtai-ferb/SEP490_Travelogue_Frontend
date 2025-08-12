'use client'

import { useCallback } from "react"
import useApiService from "@/hooks/useApi"
import { CRAFT_VILLAGE_API_URL } from "@/constants/api"

export function useCraftVillage() {
	const { callApi, loading, setIsLoading } = useApiService()

	const getCraftVillageRequest = useCallback(async () => {
		setIsLoading(true)
		try {
			const response = await callApi("get", CRAFT_VILLAGE_API_URL.GET_CRAFT_VILLAGE_REQUEST)
			return response?.data
		} catch (error) {
			throw error
		} finally {
			setIsLoading(false)
		}
	}, [callApi, setIsLoading])

	const getCraftVillageRequestById = useCallback(async (id: string) => {
		setIsLoading(true)
		try {
			const response = await callApi("get", `${CRAFT_VILLAGE_API_URL.CRAFT_VILLAGE_REQUEST_BY_ID.replace(':id', id)}`)
			return response?.data
		} catch (error) {
			throw error
		} finally {
			setIsLoading(false)
		}
	}, [callApi, setIsLoading])

	const createCraftVillageRequest = useCallback(async (data: any) => {
		setIsLoading(true)
		try {
			const response = await callApi("post", CRAFT_VILLAGE_API_URL.CREATE_CRAFT_VILLAGE_REQUEST, data)
			return response?.data
		} catch (error) {
			throw error
		} finally {
			setIsLoading(false)
		}
	}, [callApi, setIsLoading])

	const reviewCraftVillageRequest = useCallback(async (id: string, data: any) => {
		setIsLoading(true)
		try {
			const response = await callApi("put", `${CRAFT_VILLAGE_API_URL.UPDATE_CRAFT_VILLAGE_REQUEST.replace(':id', id)}`, data)
			return response?.data
		} catch (error) {
			throw error
		} finally {
			setIsLoading(false)
		}
	}, [callApi, setIsLoading])

	const patchCraftVillageRequest = useCallback(async (id: string, data: any) => {
		setIsLoading(true)
		try {
			const response = await callApi("patch", `${CRAFT_VILLAGE_API_URL.CRAFT_VILLAGE_REQUEST_BY_ID.replace(':id', id)}`, data)
			return response?.data
		} catch (error) {
			throw error
		} finally {
			setIsLoading(false)
		}
	}, [callApi, setIsLoading])

	return {
		getCraftVillageRequest,
		getCraftVillageRequestById,
		createCraftVillageRequest,
		reviewCraftVillageRequest,
		patchCraftVillageRequest,
		loading
	}
}
