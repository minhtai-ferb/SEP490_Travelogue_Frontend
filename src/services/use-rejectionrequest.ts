"use client";

import { TOUR_GUIDE_API_URL } from "@/constants/api";
import useApiService from "@/hooks/useApi";
import { isLoadingAtom } from "@/store/auth";
import { RejectionRequestFilters } from "@/types/Tourguide";
import { useAtom } from "jotai";
import { useCallback } from "react";

export function useRejectionRequest() {
	const { callApi, loading: apiLoading } = useApiService();
	const [isGlobalLoading, setGlobalLoading] = useAtom(isLoadingAtom);

	const filterRejectionRequests = useCallback(
		async (filters: RejectionRequestFilters) => {
			setGlobalLoading(true);
			try {
				const params = {
					TourguideId: filters.TourguideId,
					Status: filters.Status,
					FromDate: filters.FromDate,
					ToDate: filters.ToDate,
					PageNumber: filters.pageNumber,
					PageSize: filters.pageSize,
				};

				const res = await callApi(
					"get",
					TOUR_GUIDE_API_URL.TOUR_GUIDE_REJECTION_REQUEST_FILTER,
					{ params }
				);

				return res?.data ?? res;
			} catch (err) {
				console.error("Error filtering rejection requests:", err);
				throw err;
			} finally {
				setGlobalLoading(false);
			}
		},
		[callApi, setGlobalLoading]
	);

	const getRejectionRequestDetail = useCallback(
		async (id: string) => {
			setGlobalLoading(true);
			try {
				const res = await callApi("get", TOUR_GUIDE_API_URL.TOUR_GUIDE_REJECTION_REQUEST_DETAIL.replace(":id", id));
				return res?.data ?? res;
			} catch (err) {
				console.error("Error getting rejection request detail:", err);
				throw err;
			} finally {
				setGlobalLoading(false);
			}
		},
		[callApi, setGlobalLoading]
	);

	const approveRejectionRequest = useCallback(
		async (requestId: string, payload: { newTourGuideId: string }) => {
			setGlobalLoading(true);
			try {
				const res = await callApi("put", TOUR_GUIDE_API_URL.TOUR_GUIDE_REJECTION_REQUEST_APPROVE.replace(":requestId", requestId), payload);
				return res?.data ?? res;
			} catch (err) {
				console.error("Error approving rejection request:", err);
				throw err;
			} finally {
				setGlobalLoading(false);
			}
		},
		[callApi, setGlobalLoading]
	);

	const rejectRejectionRequest = useCallback(
		async (requestId: string, body: { moderatorComment: string }) => {
			setGlobalLoading(true);
			try {
				const res = await callApi("put", TOUR_GUIDE_API_URL.TOUR_GUIDE_REJECTION_REQUEST_REJECT.replace(":requestId", requestId), body);
				return res?.data ?? res;
			} catch (err) {
				console.error("Error rejecting rejection request:", err);
				throw err;
			} finally {
				setGlobalLoading(false);
			}
		},
		[callApi, setGlobalLoading]
	);

	return {
		filterRejectionRequests,
		getRejectionRequestDetail,
		approveRejectionRequest,
		rejectRejectionRequest,
	};
}
