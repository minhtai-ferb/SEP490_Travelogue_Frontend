"use client";

import useApiService from "@/hooks/useApi";
import { useAtom } from "jotai";
import { isLoadingAtom } from "@/store/auth";
import { useCallback } from "react";


export interface BookingStatsItem {
  day: string; // ISO date string
  bookingSchedule: number;
  bookingTourGuide: number;
  bookingWorkshop: number;
}

export interface BookingStatsResponse {
  fromDate: string; // ISO date string
  toDate: string;   // ISO date string
  data: BookingStatsItem[];
}

// Giả sử API URL backend là "/statistics/booking"
const STATISTICS_API_URL = {
  BOOKING_STATS: "/dashboard/booking-statistics",
};

export function useBookingStats() {
  const { callApi, loading } = useApiService();
  const [isLoading, setLoading] = useAtom(isLoadingAtom);

  const getBookingStats = useCallback(
    async (fromDate: string, toDate: string): Promise<BookingStatsResponse> => {
      setLoading(true);
      try {
        const params = { fromDate, toDate };
        const response = await callApi(
          "get",
          STATISTICS_API_URL.BOOKING_STATS,
          { params }
        );
        return response as BookingStatsResponse;
      } catch (e: any) {
        console.error("Error fetching booking stats:", e.message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  return {
    getBookingStats,
    loading: isLoading || loading,
  };
}
