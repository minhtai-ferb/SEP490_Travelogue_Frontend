"use client";

import { WALLET_API_URL } from "@/constants/api";
import useApiService from "@/hooks/useApi";
import { isLoadingAtom } from "@/store/auth";
import { useAtom } from "jotai";
import { useCallback } from "react";

type Isoish = string | Date | undefined;

export interface WithdrawalFilters {
  userId?: string;   // uuid
  status?: number;   // int32
  fromDate?: Isoish; // string ISO hoặc Date
  toDate?: Isoish;   // string ISO hoặc Date
}

function toIsoString(v: Isoish) {
  if (!v) return undefined;
  if (v instanceof Date) return v.toISOString();
  return v;
}

export function useWithdrawalRequests() {
  const { callApi, loading: apiLoading } = useApiService();
  const [isGlobalLoading, setGlobalLoading] = useAtom(isLoadingAtom);

  const filterWithdrawalRequests = useCallback(
    async (filters: WithdrawalFilters) => {
      setGlobalLoading(true);
      try {
        const params = {
          UserId: filters.userId,
          Status: filters.status,
          FromDate: toIsoString(filters.fromDate),
          ToDate: toIsoString(filters.toDate),
        };

        const res = await callApi(
          "get",
          WALLET_API_URL.WITHDRAWAL_REQUESTS_FILTER,
          { params }
        );

        return res?.data ?? res;
      } catch (err) {
        console.error("Error filtering withdrawal requests:", err);
        throw err;
      } finally {
        setGlobalLoading(false);
      }
    },
    [callApi, setGlobalLoading]
  );

  return {
    loading: apiLoading || isGlobalLoading,
    filterWithdrawalRequests,
  };
}
