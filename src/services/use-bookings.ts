"use client";

import useApiService from "@/hooks/useApi";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { userAtom, isLoadingAtom, type User } from "@/store/auth";
import { BookingPagedFilter, toIso } from "@/types/Booking";

export function useBookings() {
  const { callApi, loading, setIsLoading } = useApiService();
  const router = useRouter();
  const [isLoading, setLoading] = useAtom(isLoadingAtom);

  const getBookingsPaged = useCallback(
    async (filter: BookingPagedFilter = {}) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();

        if (filter.status !== undefined)
          params.append("status", String(filter.status));
        if (filter.bookingType !== undefined)
          params.append("bookingType", String(filter.bookingType));

        const start = toIso(filter.startDate);
        const end = toIso(filter.endDate);
        if (start) params.append("startDate", start);
        if (end) params.append("endDate", end);

        params.append("pageNumber", String(filter.pageNumber ?? 1));
        params.append("pageSize", String(filter.pageSize ?? 10));

        const qs = params.toString();
        const url = qs
          ? `booking/bookings/paged?${qs}`
          : `booking/bookings/paged`;

        const res = await callApi("get", url);
        return res?.data; 
      } catch (e: any) {
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [callApi, setIsLoading]
  );

  return {
    getBookingsPaged,
    loading: isLoading || loading,
  };
}
