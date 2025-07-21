"use client";

import useApiService from "@/hooks/useApi";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { userAtom, isLoadingAtom, type User } from "@/store/auth";

export function useUserManager() {
  const { callApi, loading, setIsLoading } = useApiService();
  const router = useRouter();
  const [isLoading, setLoading] = useAtom(isLoadingAtom);

  const getCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await callApi("get", "user");
      return response?.data;
    } catch (e: any) {
      throw e;
    } finally {
      setLoading(false);
    }
  }, [callApi, setLoading]);

  const updateUser = useCallback(
    async (
      id: string,
      userData: {
        phoneNumber: string;
        fullName: string;
        address: string;
      }
    ) => {
      setLoading(true);
      try {
        const response = await callApi("put", `user/${id}`, userData);
        console.log("Update user response:", response);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const getUserById = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const response = await callApi("get", `user/${id}`);
        console.log("Get user response:", response);
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
    getCurrentUser,
    getUserById,
    updateUser,
    loading: isLoading || loading,
  };
}
