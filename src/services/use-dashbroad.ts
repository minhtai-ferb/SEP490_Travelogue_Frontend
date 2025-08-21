"use client";

import useApiService from "@/hooks/useApi";
import { useAtom } from "jotai";
import { isLoadingAtom } from "@/store/auth";
import { useCallback } from "react";


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

//Revenue Admin
export interface DailyStat {
  date: string; 
  total: number;
  tour: number;
  commissionTourGuide: number;
  commissionWorkshop: number;
}
export interface RevenueDetail {
  total: number;
  byCategory: {
    tour: number;
    commissionTourGuide: number;
    commissionWorkshop: number;
  };
  dailyStats: DailyStat[];
}
export interface RevenueStatisticResponse {
  data: {
    grossRevenue: RevenueDetail;
    netRevenue: RevenueDetail;
    fromDate: string; 
    toDate: string;  
  };
  message: string;
  succeeded: boolean;
  statusCode: number;
}

//Revenue System
export interface RevenueSystemStatistic {
  grossRevenue: RevenueSystemDetail;
  netRevenue: RevenueSystemDetail;
  fromDate: string; 
  toDate: string;  
}

export interface RevenueSystemDetail {
  total: number;
  byCategory: RevenueSystemByCategory;
  dailyStats: DailyRevenueSystem[];
}

export interface RevenueSystemByCategory {
  tour: number;
  bookingTourGuide: number;
  bookingWorkshop: number;
}

export interface DailyRevenueSystem {
  date: string; 
  total: number;
  tour: number;
  bookingTourGuide: number;
  bookingWorkshop: number;
}

const STATISTICS_API_URL = {
  BOOKING_STATS: "/dashboard/booking-statistics",
  REVENUE_ADMIN_STATISTICS: "/dashboard/admin-revenue-statistics",
  REVENUE_SYSTEM_STATISTICS: "/dashboard/system-revenue-statistics"
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

  const getRevenueAdminStatistics = useCallback(
    async (fromDate: string, toDate: string): Promise<RevenueStatisticResponse> => {
      setLoading(true);
      try {
        const params = { fromDate, toDate };
        const response = await callApi(
          "get",
          STATISTICS_API_URL.REVENUE_ADMIN_STATISTICS,
          { params }
        );
        return response as RevenueStatisticResponse;
      } catch (e: any) {
        console.error("Error fetching revenue admin stats:", e.message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const getRevenueSystemStatistics = useCallback(
    async (fromDate: string, toDate: string): Promise<RevenueSystemStatistic> => {
      setLoading(true);
      try {
        const params = { fromDate, toDate };
        const response = await callApi(
          "get",
          STATISTICS_API_URL.REVENUE_SYSTEM_STATISTICS,
          { params }
        );
        return response?.data as RevenueSystemStatistic;
      } catch (e: any) {
        console.error("Error fetching revenue system stats:", e.message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  return {
    getBookingStats,
    getRevenueAdminStatistics,
    getRevenueSystemStatistics,
    loading: isLoading || loading,
  };
}
