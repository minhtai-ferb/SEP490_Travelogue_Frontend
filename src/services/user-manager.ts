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

  const getListUser = useCallback(async () => {
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

  const getAllRoles = useCallback(async () => {
    try {
      const response = await callApi("get", "role/search-paged");
      return response?.data;
    } catch (error: any) {
      throw error;
    }
  }, [callApi, setLoading]);

  const assignRoleToUser = useCallback(
    async (userId: string, roleId: string) => {
      setLoading(true);
      try {
        const response = await callApi("post", `user/assign-role-to-user?userId=${userId}&roleId=${roleId}`, {
          data: {},
        });
        return response?.data;
      } catch (error: any) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  return {
    getListUser,
    getUserById,
    updateUser,
    getAllRoles,
    assignRoleToUser,
    loading: isLoading || loading,
  };
}
