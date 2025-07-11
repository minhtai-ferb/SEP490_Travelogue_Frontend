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

	const getAllTripPlan = useCallback(
		async () => {
			setLoading(true);
			try {
				const response = await callApi("get", "TripPlan");
				return response?.data;
			} catch (e: any) {
				throw e;
			} finally {
				setLoading(false);
			}
		}, [callApi, setLoading]
	);


	const geTripPlanSearch = useCallback(
		async ({
			title = '',
			pageNumber = 1,
			pageSize = 10,
		}) => {
			setLoading(true);
			try {
				const response = await callApi('get', '/tours', {
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
				const response = await callApi("get", `TripPlan/${id}`);
				return response?.data;
			} catch (e: any) {
				throw e;
			} finally {
				setLoading(false);
			}
		},
		[callApi, setLoading]
	);

	const getDistrictById = useCallback(
		async (id: string) => {
			setLoading(true);
			try {
				const response = await callApi("get", `district/${id}`);
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
		getAllTripPlan,
		geTripPlanSearch,
		getDistrictById,
		getTripPlanById,
		loading: isLoading || loading,
	};
}
