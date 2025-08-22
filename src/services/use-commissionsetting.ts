"use client";

import { COMMISSION_SETTING_API_URL } from "@/constants/api";
import useApiService from "@/hooks/useApi";
import { CommissionGroup, CommissionRate } from "@/types/CommissionSetting";
import { useCallback } from "react";

export const useCommissionSetting = () => {
  const { callApi, loading, setIsLoading } = useApiService();

  const getCommissionSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await callApi(
        "get",
        COMMISSION_SETTING_API_URL.GET_COMMISSION_SETTINGS
      );
      return response?.data as CommissionGroup[] | null;
    } catch (error) {
      console.error("Error fetching commission settings:", error);
    } finally {
      setIsLoading(false);
    }
  }, [callApi, setIsLoading]);

  const getCommissionSettingById = useCallback(
    async (id: string) => {
      setIsLoading(true);
      try {
        const response = await callApi(
          "get",
          COMMISSION_SETTING_API_URL.GET_COMMISSION_SETTING_BY_ID.replace(
            ":id",
            id
          )
        );
        return response?.data as CommissionRate | null;
      } catch (error) {
        console.error("Error fetching commission setting by ID:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [callApi, setIsLoading]
  );

  const createCommissionSetting = useCallback(
    async (data: CommissionRate) => {
      setIsLoading(true);
      try {
        const response = await callApi(
          "post",
          COMMISSION_SETTING_API_URL.CREATE_COMMISSION_SETTING,
          data
        );
        return response?.data as CommissionRate | null;
      } catch (error) {
        console.error("Error creating commission setting:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [callApi, setIsLoading]
  );

  return {
    loading,
    getCommissionSettings,
    getCommissionSettingById,
    createCommissionSetting
  };
};
