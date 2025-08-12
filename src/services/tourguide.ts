"use client";

import { TOUR_API_URL, TOUR_GUIDE_API_URL, USER_API_URL, MEDIA_API_URL } from "@/constants/api";
import useApiService from "@/hooks/useApi";
import { isLoadingAtom } from "@/store/auth";
import { TourguideRequestStatus } from "@/types/Tourguide";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useTourguideAssign() {
	const { callApi, loading, setIsLoading } = useApiService();
	const router = useRouter();
	const [isLoading, setLoading] = useAtom(isLoadingAtom);

	const getTourGuide = useCallback(
		async () => {
			setLoading(true);
			try {
				const response = await callApi("get", TOUR_GUIDE_API_URL.TOUR_GUIDE);
				return response?.data;
			} catch (e: any) {
				throw e;
			} finally {
				setLoading(false);
			}
		}, [callApi, setLoading]
	)

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

	const uploadCertifications = useCallback(
		async (files: File[]) => {
			const formData = new FormData();
			files.forEach((f) => formData.append("certifications", f));
			setLoading(true);
			try {
				const response = await callApi("post", MEDIA_API_URL.UPLOAD_MULTIPLE_CERTIFICATIONS, formData);
				return response?.data as string[]; // array of URLs
			} catch (e: any) {
				throw e;
			} finally {
				setLoading(false);
			}
		}, [callApi, setLoading]
	)

	const createCertification = useCallback(
		async (payload: { name: string; certificateUrl: string }) => {
			setLoading(true);
			try {
				const response = await callApi("post", TOUR_GUIDE_API_URL.TOUR_GUIDE_CERTIFICATION, payload);
				return response?.data;
			} catch (e: any) {
				throw e;
			} finally {
				setLoading(false);
			}
		}, [callApi, setLoading]
	)

	const deleteCertification = useCallback(
		async (fileName: string) => {
			setLoading(true);
			try {
				const response = await callApi("delete", MEDIA_API_URL.DELETE_CERTIFICATION.replace("{fileName}", fileName));
				return response?.data;
			} catch (e: any) {
				throw e;
			} finally {
				setLoading(false);
			}
		}, [callApi, setLoading]
	)

	const getTourguideRequest = useCallback(
		async (status: TourguideRequestStatus) => {
			const params = {
				status: status,
			}
			setLoading(true);
			try {
				const response = await callApi("get", USER_API_URL.GET_USER_REQUEST, { params });
				return response?.data;
			} catch (e: any) {
				throw e;
			} finally {
				setLoading(false);
			}
		}, [callApi, setLoading]
	)

	const requestReview = useCallback(
		async (id: string, data: any) => {
			try {
				setLoading(true);
				const response = await callApi("put", USER_API_URL.REQUEST_REVIEW.replace(":requestId", id), data);
				return response?.data;
			} catch (e: any) {
				throw e;
			} finally {
				setLoading(false);
			}
		}, [callApi, setLoading]
	)

	const createTourGuideRequest = useCallback(
		async (data: any) => {
			setLoading(true);
			try {
				const response = await callApi("post", TOUR_GUIDE_API_URL.CREATE_TOUR_GUIDE_REQUEST, data);
				return response?.data;
			} catch (e: any) {
				throw e;
			} finally {
				setLoading(false);
			}
		}, [callApi, setLoading]
	)

	return {
		getTourGuide,
		getTourguideProfile,
		getTourAssign,
		getTourGuideSchedule,
		getTourguideRequest,
		requestReview,
		uploadCertifications,
		createCertification,
		createTourGuideRequest,
		deleteCertification,
		loading: isLoading || loading,
	};
}
