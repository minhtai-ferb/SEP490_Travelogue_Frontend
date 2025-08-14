"use client";

import useApiService from "@/hooks/useApi";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { userAtom, isLoadingAtom, type User } from "@/store/auth";
import { useCallback } from "react";
export function useMediaUpload() {
  const { callApi, loading, setIsLoading } = useApiService();
  const router = useRouter();
  const [isLoading, setLoading] = useAtom(isLoadingAtom);

  const deleteMediaByFileName = useCallback(
    async (fileName: string) => {
      setIsLoading(true);
      try {
        const response = await callApi("delete", `media/delete/${fileName}`);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [callApi, setIsLoading]
  );

  
    const uploadMediaMultiple = useCallback(
      async (files: File[]) => {
        setIsLoading(true);
        try {
          const formData = new FormData();
          files.forEach((file) => {
            formData.append("images", file);
          });
  
          const response = await callApi(
            "post",
            "media/upload-multiple-images",
            formData
          );
          return response?.data;
        } catch (e: any) {
          throw e;
        } finally {
          setIsLoading(false);
        }
      },
      [callApi, setIsLoading]
    );
  

  return {
    deleteMediaByFileName,
    uploadMediaMultiple,
    loading: isLoading || loading,
  };
}
