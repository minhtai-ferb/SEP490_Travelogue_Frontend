"use client";

import { REFUND_API_URL, WALLET_API_URL } from "@/constants/api";
import useApiService from "@/hooks/useApi";
import { isLoadingAtom } from "@/store/auth";
import { set } from "date-fns";
import { se } from "date-fns/locale";
import { useAtom } from "jotai";
import { useCallback } from "react";

type Isoish = string | Date | undefined;

export interface RefundFilters {
  userId?: string;
  status?: number;
  fromDate?: Isoish;
  toDate?: Isoish;
}

function toIsoString(v: Isoish) {
  if (!v) return undefined;
  if (v instanceof Date) return v.toISOString();
  return v;
}

export function useRefundRequests() {
  const { callApi, loading: apiLoading } = useApiService();
  const [isGlobalLoading, setGlobalLoading] = useAtom(isLoadingAtom);

  const filterRefundRequests = useCallback(
    async (filters: RefundFilters) => {
      setGlobalLoading(true);
      try {
        const params = {
          UserId: filters.userId,
          Status: filters.status,
          FromDate: toIsoString(filters.fromDate),
          ToDate: toIsoString(filters.toDate),
        };

        const res = await callApi("get", REFUND_API_URL.GET_REFUND_REQUESTS, {
          params,
        });

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

  const getRefundRequestById = useCallback(
    async (requestId: string) => {
      setGlobalLoading(true);
      try {
        const res = await callApi(
          "get",
          `${REFUND_API_URL.GET_REFUND_REQUEST_BY_ID.replace(
            ":refundRequestId",
            requestId
          )}`
        );
        return res?.data ?? res;
      } catch (err) {
        console.error("Error fetching refund request:", err);
        throw err;
      } finally {
        setGlobalLoading(false);
      }
    },
    [callApi, setGlobalLoading]
  );

  const approveRefundRequest = useCallback(
    async (requestId: string) => {
      setGlobalLoading(true);
      try {
        const res = await callApi(
          "put",
          `${REFUND_API_URL.APPROVE_REFUND_REQUEST.replace(
            ":refundRequestId",
            requestId
          )}`
        );

        return res?.data ?? res;
      } finally {
        setGlobalLoading(false);
      }
    },
    [callApi, setGlobalLoading]
  );

  const rejectRefundRequest = useCallback(
    async (requestId: string, reason: string) => {
      setGlobalLoading(true);
      const query = new URLSearchParams();
      if (reason) query.set("rejectionReason", reason);
      try {
        const res = await callApi(
          "put",
          `${REFUND_API_URL.REJECT_REFUND_REQUEST.replace(
            ":refundRequestId",
            requestId
          )}?${query.toString()}`
        );
        return res?.data;
      } finally {
        setGlobalLoading(false);
      }
    },
    [callApi, setGlobalLoading]
  );

  return {
    loading: apiLoading || isGlobalLoading,
    filterRefundRequests,
    getRefundRequestById,
    approveRefundRequest,
    rejectRefundRequest,
  };
}
