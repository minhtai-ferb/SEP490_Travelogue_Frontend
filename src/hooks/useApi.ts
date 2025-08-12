/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import api from "@/config/axiosInstance";
import { addToast } from "@heroui/react";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

const useApiService = () => {
  const [loading, setIsLoading] = useState<boolean>(false);

  const callApi = useCallback(
    async (
      method: "get" | "post" | "put" | "delete" | "patch",
      url: string,
      data?: any,
      params?: Record<string, any> // optional & typed
    ) => {
      try {
        setIsLoading(true);
        const response = await api[method](url, data, params);
        return response.data;
      } catch (e: any) {
        // console.log ("Unauthorized access detected.", e?.response?.data);
        console.error(e);
        toast.error(e?.response?.data?.Message || "Error");
        // toast.error(e?.response?.data || "Operation failed");
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { loading, callApi, setIsLoading };
};

export default useApiService;
