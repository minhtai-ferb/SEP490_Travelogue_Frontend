import { TOUR_API_URL } from "@/constants/api";
import useApiService from "@/hooks/useApi";
import { isLoadingAtom } from "@/store/auth";
import { ScheduleFormData } from "@/types/Tour";
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

	const createTour = useCallback(async (data: any) => {
		setLoading(true);
		try {
			const response = await callApi("post", TOUR_API_URL.ALL_TOURS, data);
			return response?.data;
		} catch (e: any) {
			throw e;
		} finally {
			setLoading(false);
		}
	}, [callApi, setLoading]);

	const updateTourInfo = useCallback(async (id: string, data: any) => {
		setLoading(true);
		try {
			const response = await callApi("put", `${TOUR_API_URL.ALL_TOURS}/${id}`, data);
			return response?.data;
		} catch (e: any) {
			throw e;
		} finally {
			setLoading(false);
		}
	}, [callApi, setLoading]);

	const updateTourSchedule = useCallback(async (tourId: string, scheduleId: string, data: any) => {
		setLoading(true);
		try {
			const response = await callApi("put", `${TOUR_API_URL.TOUR_UPDATE_SCHEDULE}${scheduleId}`, data, { params: { tourId } });
			return response?.data;
		} catch (e: any) {
			throw e;
		} finally {
			setLoading(false);
		}
	}, [callApi, setLoading]);

	const deleteTour = useCallback(async (id: string) => {
		setLoading(true);
		try {
			const response = await callApi("delete", `${TOUR_API_URL.ALL_TOURS}`, { params: { id } });
			return response?.data;
		} catch (e: any) {
			throw e;
		} finally {
			setLoading(false);
		}
	}, [callApi, setLoading]);

	// tao moi danh sach lich trinh cho tour
	const createTourSchedule = useCallback(async (tourId: string, data: ScheduleFormData[]) => {
		setLoading(true);
		try {
			const response = await callApi("post", `${TOUR_API_URL.ALL_TOURS}/` + tourId + "/schedules", data);
			return response?.data;
		} catch (e: any) {
			throw e;
		} finally {
			setLoading(false);
		}
	}, [callApi, setLoading]);


	const createTourBulk = useCallback(async (tourId: string, data: any) => {
		setLoading(true);
		try {
			const response = await callApi(
				"put",
				`${TOUR_API_URL.ALL_TOURS}/bulk`,
				data,
				{
					params: { tourId }
				}
			);
			return response?.data;
		} catch (e: any) {
			throw e;
		} finally {
			setLoading(false);
		}
	}, [callApi, setLoading]);

	const deleteTourSchedule = useCallback(async (scheduleId: string, tourId: string) => {
		setLoading(true)
		try {
			const response = await callApi("delete", `${TOUR_API_URL.ALL_TOURS}/` + scheduleId,
				{ params: { tourId } }
			);
			return response?.data
		} catch (error) {
			throw error
		} finally {
			setLoading(false)

		}
	}, [callApi, setLoading]);

	return {
		getAllTour,
		getTourDetail,
		createTour,
		updateTourInfo,
		updateTourSchedule,
		createTourSchedule,
		createTourBulk,
		deleteTour,
		deleteTourSchedule,
		loading: isLoading || loading,
	};
}