"use client";

import { TOUR_API_URL, TOUR_GUIDE_API_URL } from "@/constants/api";
import useApiService from "@/hooks/useApi";
import { isLoadingAtom } from "@/store/auth";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useTourguideAssign() {
	const { callApi, loading, setIsLoading } = useApiService();
	const router = useRouter();
	const [isLoading, setLoading] = useAtom(isLoadingAtom);

	const getTourguideProfile = useCallback(
		async (id: string) => {
			setLoading(true);
			try {
				const response = await callApi("get", TOUR_API_URL.TOURGUIDE_PROFILE + id);
				return response?.data;
			} catch (e: any) {
				console.log('====================================');
				console.log(`Error fetching tour guide profile: ${e.message}`);
				console.log('====================================');
			} finally {
				setLoading(false);
			}
		}, [callApi, router, setLoading]
	)

	const getTourGuideSchedule = useCallback(
		async (filterType: 1 | 2 | 3, startDate: string, endDate: string, pageNumber: number, pageSize: number) => {
			const params = {
				FilterType: filterType,
				StartDate: startDate,
				EndDate: endDate,
				pageNumber: pageNumber,
				pageSize: pageSize,
			}
			setLoading(true);
			try {
				const response = await callApi("get", TOUR_GUIDE_API_URL.TOUR_GUIDE_SCHEDULE, { params });
				return response?.data;
			} catch (e: any) {
				console.log('====================================');
				console.log(`Error fetching tour guide schedule: ${e.message}`);
				console.log('====================================');
				throw e;
			} finally {
				setLoading(false);
			}
		}, [callApi, setLoading]
	)

	const getTourAssign = useCallback(
		async (email: string) => {
			setLoading(true);
			const params = {
				email,
			};
			try {
				const response = await callApi("get", TOUR_API_URL.TOUR_ASSIGNED, { params });
				return response?.data;
			} catch (e: any) {
				throw e;
			} finally {
				setLoading(false);
			}
		}, [callApi, setLoading]
	);

	return {
		getTourguideProfile,
		getTourAssign,
		getTourGuideSchedule,
		loading: isLoading || loading,
	};
}
