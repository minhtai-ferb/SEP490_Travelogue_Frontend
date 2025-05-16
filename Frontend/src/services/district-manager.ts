"use client";

import useApiService from "@/hooks/useApi";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { userAtom, isLoadingAtom, type User } from "@/store/auth";
import { District, DistrictCreate } from "@/types/District";

export function useDistrictManager() {
  const { callApi, loading, setIsLoading } = useApiService();
  const router = useRouter();
  const [isLoading, setLoading] = useAtom(isLoadingAtom);

  const getAllDistrict = useCallback(async () => {
    setLoading(true);
    try {
      const response = await callApi("get", "district");
      return response?.data;
    } catch (e: any) {
      throw e;
    } finally {
      setLoading(false);
    }
  }, [callApi, setLoading]);

  const getDistrictById = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const response = await callApi("get", `district/${id}`);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const updateDistrict = useCallback(
    async (id: string, data: Partial<District>) => {
      try {
        setLoading(true);
        const response = await callApi("put", `district/${id}`, data);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const updateDistrictImage = useCallback(
    async (data: FormData) => {
      setLoading(true);
      try {
        const response = await callApi("put", `district/update?id=${data.get("DistrictId")}`, data);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const createDistrict = useCallback(
    async (data: FormData) => {
      setLoading(true);
      try {
        const response = await callApi("post", "district/create", data);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  return {
    createDistrict,
    getAllDistrict,
    getDistrictById,
    updateDistrict,
    updateDistrictImage,
    loading: isLoading || loading,
  };
}
