"use client";

import { TOUR_API_URL } from "@/constants/api";
import useApiService from "@/hooks/useApi";
import { isLoadingAtom } from "@/store/auth";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useTourguideAssign() {
	const { callApi, loading, setIsLoading } = useApiService();
	const router = useRouter();
	const [isLoading, setLoading] = useAtom(isLoadingAtom);

	const getTourAssign = useCallback(
		async () => {
			setLoading(true);
			try {
				const response = await callApi("get", TOUR_API_URL.TOUR_ASSIGNED);
				return response?.data;
			} catch (e: any) {
				throw e;
			} finally {
				setLoading(false);
			}
		}, [callApi, setLoading]
	);


	const getTourAssignSearch = useCallback(
		async ({
			title = '',
			pageNumber = 1,
			pageSize = 10,
		}) => {
			setLoading(true);
			try {
				const response = await callApi('get', TOUR_API_URL.TOUR_ASSIGNED_SEARCH, {
					params: {
						title,
						pageNumber,
						pageSize,
					},
				});
				return response?.data;
			} catch (e: any) {
				throw e;
			} finally {
				setLoading(false);
			}
		},
		[callApi, setLoading]
	);

	return {
		getTourAssign,
		getTourAssignSearch,
		loading: isLoading || loading,
	};
}
