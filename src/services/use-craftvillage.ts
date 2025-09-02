'use client'

import { useCallback } from "react"
import useApiService from "@/hooks/useApi"
import { CRAFT_VILLAGE_API_URL } from "@/constants/api"


export function useCraftVillage() {
	const { callApi, loading, setIsLoading } = useApiService()
	// nguoi dung tu lay yeu cau cua nguoi dung tro thanh role lang nghe
	const transformUserToCraftVillageRole = useCallback(async ({ status, pageNumber, pageSize }: { status?: number | null, pageNumber: number, pageSize: number }) => {
		const payload = {
			status,
			pageNumber,
			pageSize
		}
		setIsLoading(true)
		try {
			const response = await callApi("get", CRAFT_VILLAGE_API_URL.TRANSFORM_USER_TO_CRAFT_VILLAGE_ROLE, payload)
			return response?.data
		} catch (error) {
			throw error
		} finally {
			setIsLoading(false)
		}
	}, [callApi, setIsLoading])

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


	const getLastestCraftVillageRequest = useCallback(async (userId: string) => {
		setIsLoading(true)
		try {
			const response = await callApi("get", `${CRAFT_VILLAGE_API_URL.LASTEST_CRAFT_VILLAGE_REQUEST}${userId}`)
			return response?.data
		}
		catch (error) {
			throw error
		}
		finally {
			setIsLoading(false)
		}
	}, [callApi, setIsLoading])

	return {
		getCraftVillageRequest,
		getCraftVillageRequestById,
		createCraftVillageRequest,
		reviewCraftVillageRequest,
		patchCraftVillageRequest,
		getLastestCraftVillageRequest,
		transformUserToCraftVillageRole,
		loading
	}
}
