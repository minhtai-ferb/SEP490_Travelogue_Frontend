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
      method: "get" | "post" | "put" | "delete",
      url: string,
      data?: any
    ) => {
      try {
        setIsLoading(true);
        const response = await api[method](url, data);
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
