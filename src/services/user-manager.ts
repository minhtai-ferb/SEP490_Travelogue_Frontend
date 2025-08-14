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
        const response = await callApi(
          "post",
          `user/assign-role-to-user?userId=${userId}&roleId=${roleId}`,
          {
            data: {},
          }
        );
        return response?.data;
      } catch (error: any) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const removeRoleFromUser = useCallback(
    async (userId: string, roleId: string) => {
      setLoading(true);
      try {
        const response = await callApi(
          "delete",
          `user/remove-user-from-role?userId=${userId}&roleId=${roleId}`
        );
        return response?.data;
      } catch (error: any) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  // Upload & cập nhật avatar user
  const updateUserAvatar = useCallback(
    async (file: File) => {
      setIsLoading(true);
      try {
        if (!file) throw new Error("Vui lòng chọn ảnh.");
        const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
        if (!allowed.includes(file.type)) {
          throw new Error("Chỉ hỗ trợ PNG, JPG, JPEG, WEBP.");
        }
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
          throw new Error("Ảnh vượt quá 5MB.");
        }

        const formData = new FormData();
        formData.append("file", file);
        const res = await callApi("put", "user/update-avatar", formData);
        return res?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [callApi, setIsLoading]
  );

  return {
    getListUser,
    getUserById,
    updateUser,
    getAllRoles,
    assignRoleToUser,
    removeRoleFromUser,
    updateUserAvatar,
    loading: isLoading || loading,
  };
}
