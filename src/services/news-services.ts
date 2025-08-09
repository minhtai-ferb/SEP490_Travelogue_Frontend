"use client"

import useApiService from "@/hooks/useApi"
import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { userAtom, isLoadingAtom, type User } from "@/store/auth"

export function useNewsManager() {

	const { callApi, loading, setIsLoading } = useApiService()
	const router = useRouter()
	const [isLoading, setLoading] = useAtom(isLoadingAtom)

	// Lấy danh sách page phân trang theo tiêu đề
	const getNewsSearchPaged = useCallback(async (
		{
			title,
			categoryId,
			pageNumber = 0,    // Default value
			pageSize = 10,     // Default value
		}: {
			title?: string;
			categoryId?: string;
			pageNumber?: number;
			pageSize?: number;
		}
	) => {
		try {
			setLoading(true);

			// Create URLSearchParams
			const params = new URLSearchParams();
			if (title) params.append('title', encodeURIComponent(title));
			if (categoryId) params.append('categoryId', encodeURIComponent(categoryId));
			params.append('pageNumber', pageNumber.toString());
			params.append('pageSize', pageSize.toString());

			const response = await callApi("get", `/news/search-paged?${params.toString()}`);
			return response;
		} catch (e: any) {
			throw e;
		} finally {
			setLoading(false);
		}
	}, [callApi, setLoading]);

	const getDetailNews = useCallback(async (id: string) => {
		try {
			setLoading(true);
			const response = await callApi("get", `/news/${id}`);
			return response;
		} catch (e: any) {
			throw e;
		} finally {
			setLoading(false);
		}
	}, [callApi, setLoading]);

	return {
		getNewsSearchPaged,
		getDetailNews,
		loading: isLoading || loading,
	}
}