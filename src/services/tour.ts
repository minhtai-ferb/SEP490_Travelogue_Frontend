import { TOUR_API_URL } from "@/constants/api";
import useApiService from "@/hooks/useApi";
import { isLoadingAtom } from "@/store/auth";
import type { CreateTourRequest, ScheduleFormData, TourLocationBulkRequest } from "@/types/Tour";
import { useAtom } from "jotai";
import { useCallback } from "react";

export function useTour() {
	const { callApi, loading } = useApiService();
	const [isLoading, setLoading] = useAtom(isLoadingAtom);

	// Validate schedule with tourId query parameter
	// data: {
	//   "departureDate": "2025-08-31T13:19:14.587Z",
	//   "maxParticipant": 2147483647,
	//   "adultPrice": 0,
	//   "childrenPrice": 0,
	//   "tourGuideId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
	// }
	const validateSchedule = useCallback(async (data: any, tourId: string) => {
		setLoading(true);
		try {
			const url = `${TOUR_API_URL.TOUR_SCHEDULE_VALIDATE}?tourId=${tourId}`;
			const response = await callApi("post", url, data);
			return response?.data;
		} catch (e: any) {
			throw e;
		} finally {
			setLoading(false);
		}
	}, [callApi, setLoading]);

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

	const createTour = useCallback(async (data: CreateTourRequest) => {
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

	const updateTourInfo = useCallback(async (id: string, data: Partial<CreateTourRequest>) => {
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

	const updateTourSchedule = useCallback(async (tourId: string, scheduleId: string, data: ScheduleFormData) => {
		setLoading(true);
		try {
			const response = await callApi("put", `${TOUR_API_URL.TOUR_UPDATE_SCHEDULE}${scheduleId}`, data, { tourId });
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
			// patch  /tour/{id}
			const response = await callApi("patch", `${TOUR_API_URL.TOUR_UPDATE.replace(':id', id)}`);
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


	const createTourBulk = useCallback(async (tourId: string, data: TourLocationBulkRequest[]) => {
		setLoading(true);
		try {
			const response = await callApi(
				"put",
				`${TOUR_API_URL.ALL_TOURS}/bulk`,
				data,
				{ tourId }
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
		validateSchedule,
		loading: isLoading || loading,
	};
}