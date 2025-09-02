"use client";

import useApiService from "@/hooks/useApi";
import { isLoadingAtom } from "@/store/auth";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useTripPlan() {
	const { callApi, loading, setIsLoading } = useApiService();
	const router = useRouter();
	const [isLoading, setLoading] = useAtom(isLoadingAtom);

	const getAllTripPlanSearch = useCallback(
		async ({
			title = '',
		}) => {
			setLoading(true);
			try {
				const response = await callApi('get', 'trip-plans/page', {
					params: {
						title,
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


	const getTripPlanSearch = useCallback(
		async ({
			title = '',
			pageNumber = 1,
			pageSize = 10,
		}) => {
			setLoading(true);
			try {
				const response = await callApi('get', 'trip-plans', {
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

	const getTripPlanById = useCallback(
		async (id: string) => {
			setLoading(true);
			try {
				const response = await callApi("get", `trip-plans/${id}`);
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
		getTripPlanSearch,
		getTripPlanById,
		getAllTripPlanSearch,
		loading: isLoading || loading,
	};
}
