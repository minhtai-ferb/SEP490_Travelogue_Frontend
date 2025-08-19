"use client";

import useApiService from "@/hooks/useApi";
import { useAtom } from "jotai";
import { isLoadingAtom } from "@/store/auth";
import { useCallback } from "react";
import exp from "constants";
export interface BookingStatsItem {
  day: string; 
  bookingSchedule: number;
  bookingTourGuide: number;
  bookingWorkshop: number;
}

export interface BookingStatsResponse {
  fromDate: string; 
  toDate: string;  
  data: BookingStatsItem[];
}

export interface RevenueStatsResponse {
  fromDate: string;
  toDate: string;
  totalRevenue: string;
  data: {
    day: string;
    revenue: number;
  }[];
}

const STATISTICS_API_URL = {
  BOOKING_STATS: "/dashboard/booking-statistics",
  REVENUE_STATISTICS: "/dashboard/revenue-statistics"
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
        return response.data as BookingStatsResponse;
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
