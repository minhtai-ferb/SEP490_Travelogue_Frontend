"use client";

import useApiService from "@/hooks/useApi";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { userAtom, isLoadingAtom, type User } from "@/store/auth";

export function useExperienceController() {
  const { callApi, loading, setIsLoading } = useApiService();
  const router = useRouter();
  const [isLoading, setLoading] = useAtom(isLoadingAtom);

  const getAllExperience = useCallback(async () => {
    setLoading(true);
    try {
      const response = await callApi("get", "experience");
      return response?.data;
    } catch (e: any) {
      throw e;
    } finally {
      setLoading(false);
    }
  }, [callApi, setLoading]);

  const searchExperience = useCallback(
    async ({
      title,
      typeExperienceId,
      districtId,
      locationId,
      eventId,
      pageNumber,
      pageSize,
    }: {
      title?: string;
      typeExperienceId?: string;
      districtId?: string;
      locationId?: string;
      eventId?: string;
      pageNumber?: number;
      pageSize?: number;
    }) => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (title) queryParams.append("title", title);
        if (typeExperienceId) queryParams.append("typeExperienceId", typeExperienceId);
        if (districtId) queryParams.append("districtId", districtId);
        if (locationId) queryParams.append("locationId", locationId);
        if (eventId) queryParams.append("eventId", eventId);
        if (pageNumber) queryParams.append("pageNumber", pageNumber.toString());
        if (pageSize) queryParams.append("pageSize", pageSize.toString());

        const response = await callApi(
          "get",
          `experience/search-paged?${queryParams.toString()}`
        );
        return response;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const getAllTypeExperience = useCallback(async () => {
    setLoading(true);
    try {
      const response = await callApi("get", "type-experience");
      return response?.data;
    } catch (e: any) {
      throw e;
    } finally {
      setLoading(false);
    }
  }, [callApi, setLoading]);

  const createTypeExperience = useCallback(
    async (data: Partial<{ typeName: string }>) => {
      setLoading(true);
      try {
        const response = await callApi("post", "type-experience", data);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const deleteTypeExperience = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const response = await callApi("delete", `type-experience/${id}`);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const updateTypeExperience = useCallback(
    async (id: string, data: Partial<{ typeName: string }>) => {
      setLoading(true);
      try {
        const response = await callApi("put", `type-experience/${id}`, data);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const getTypeExperienceById = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const response = await callApi("get", `type-experience/${id}`);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const createExperience = useCallback(
    async (data: {
      title: string;
      description?: string;
      content?: string;
      locationId?: string;
      typeExperienceId?: string;
      districtId?: string;
      eventId?: string;
    }) => {
      setLoading(true);
      try {
        const response = await callApi("post", "experience", data);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const updateExperience = useCallback(
    async (
      id: string,
      data: {
        title: string;
        description?: string;
        content?: string;
        locationId?: string;
        eventId?: string;
        districtId?: string;
        typeExperienceId?: string;
      }
    ) => {
      setLoading(true);
      try {
        const response = await callApi("put", `experience/${id}`, data);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const uploadExperienceMedia = useCallback(
    async (id: string, files: File[]) => {
      setLoading(true);
      try {
        const formData = new FormData();
        files.forEach((file) => formData.append("imageUploads", file));
        const response = await callApi(
          "post",
          `experience/upload-media?id=${id}`,
          formData
        );
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const uploadThumbnail = useCallback(
    async (id: string, thumbnailFile: File) => {
      const formData = new FormData();
      formData.append("imageUploads", thumbnailFile);
      try {
        const response = await callApi(
          "post",
          `/experience/upload-media?id=${id}&thumbnailFileName=${thumbnailFile.name}`,
          formData
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

  const deleteExperience = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const response = await callApi("delete", `experience/${id}`);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const getExperienceById = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const response = await callApi("get", `experience/${id}`);
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
    searchExperience,
    getExperienceById,
    getAllExperience,
    getAllTypeExperience,
    createTypeExperience,
    deleteTypeExperience,
    updateTypeExperience,
    getTypeExperienceById,
    createExperience,
    uploadExperienceMedia,
    updateExperience,
    deleteExperience,
    uploadThumbnail,
    loading: isLoading || loading,
  };
}
