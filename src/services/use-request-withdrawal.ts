"use client";

import { WALLET_API_URL } from "@/constants/api";
import useApiService from "@/hooks/useApi";
import { isLoadingAtom } from "@/store/auth";
import { useAtom } from "jotai";
import { useCallback } from "react";

type Isoish = string | Date | undefined;

export interface WithdrawalFilters {
  userId?: string;
  status?: number;
  fromDate?: Isoish;
  toDate?: Isoish;
}

export interface ApprovePayload {
  proofImageUrl?: string;
  adminNote?: string;
}

export interface RejectPayload {
  reason?: string;
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

  const approveWithdrawalRequest = useCallback(
    async (requestId: string, payload: ApprovePayload) => {
      console.log("Approving withdrawal request:", requestId, payload);
      const queryParams = new URLSearchParams();
      if (payload.proofImageUrl !== undefined) {
        queryParams.append("proofImageUrl", String(payload.proofImageUrl));
      }
      if (payload.adminNote !== undefined) {
        queryParams.append("adminNote", String(payload.adminNote));
      }
      const query = queryParams.toString();
      setGlobalLoading(true);
      try {
        const res = await callApi(
          "patch",
          `${WALLET_API_URL.APPROVE_WITHDRAWAL_REQUEST.replace(
            ":requestId",
            requestId
          )}?${query}`
        );

        return res?.data ?? res;
      } finally {
        setGlobalLoading(false);
      }
    },
    [callApi, setGlobalLoading]
  );

  const rejectWithdrawalRequest = useCallback(
    async (requestId: string, payload: RejectPayload) => {
      setGlobalLoading(true);
      console.log("Rejecting withdrawal request:", requestId, payload);
      try {
        const res = await callApi(
          "patch",
          `${WALLET_API_URL.REJECT_WITHDRAWAL_REQUEST.replace(
            ":requestId",
            requestId
          )}?reason=${encodeURIComponent(payload.reason ?? "")}`
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
    filterWithdrawalRequests,
    approveWithdrawalRequest,
    rejectWithdrawalRequest,
  };
}
