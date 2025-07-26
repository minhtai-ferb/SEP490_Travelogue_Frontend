import { TOUR_API_URL } from "@/constants/api";
import useApiService from "@/hooks/useApi";
import { isLoadingAtom } from "@/store/auth";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useTour() {
	const { callApi, loading, setIsLoading } = useApiService();
	const router = useRouter();
	const [isLoading, setLoading] = useAtom(isLoadingAtom);

	const getAllTour = useCallback(
		async () => {
			setLoading(true);
			try {
				const response = await callApi("get", TOUR_API_URL.ALL_TOURS);
				return response?.data;
			} catch (e: any) {
				throw e;
			} finally {
				setLoading(false);
			}
		}, [callApi, setLoading]
	);

	const getTourDetail = useCallback(
		async (id: string) => {
			setLoading(true);
			try {
				const response = await callApi("get", `${TOUR_API_URL.ALL_TOURS}/${id}`);
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
		getAllTour,
		getTourDetail,
		loading: isLoading || loading,
	};
}