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
      params?: Record<string, any>
    ) => {
      try {
        setIsLoading(true);
        const isGetLike = method === "get" || method === "delete";

        if (isGetLike) {
          // Axios.get/delete signature: (url, config)
          // Back-compat: allow callers to pass either a plain query object (data)
          // or a full axios config containing { params } as the third arg.
          let config: any = undefined;
          if (params) {
            config = { params };
          } else if (data) {
            if (typeof data === "object" && data !== null && Object.prototype.hasOwnProperty.call(data, "params")) {
              config = data; // already an axios config
            } else {
              config = { params: data };
            }
          }
          const response = await api[method](url, config);
          return response.data;
        }

        // Axios post/put/patch signature: (url, data, config)
        const config = params ? { params } : undefined;
        const response = await api[method](url, data, config);
        return response.data;
      } catch (e: any) {
        console.error(e);
        toast.error(e?.response?.data?.Message || "Error");
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
