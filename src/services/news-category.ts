"use client"

import useApiService from "@/hooks/useApi"
import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { userAtom, isLoadingAtom, type User } from "@/store/auth"

export function useNewsCategory() {

	const { callApi, loading, setIsLoading } = useApiService()
	const router = useRouter()
	const [isLoading, setLoading] = useAtom(isLoadingAtom)

	// Lấy danh sách page phân trang theo tiêu đề
	const getNewsCategory = useCallback(async () => {
		try {
			setLoading(true);

			const response = await callApi("get", `/news-category`);
			return response;
		} catch (e: any) {
			throw e;
		} finally {
			setLoading(false);
		}
	}, [callApi, setLoading]);

	const getCategoryById = useCallback(async (id: string) => {
		try {
			setLoading(true);
			const response = await callApi("get", `/news-category/${id}`);
			return response;
		} catch (e: any) {
			throw e;
		} finally {
			setLoading(false);
		}
	}, [callApi, setLoading]);

	return {
		getNewsCategory,
		getCategoryById,
		loading: isLoading || loading,
	}
}