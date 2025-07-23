"use client";

import useApiService from "@/hooks/useApi";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { userAtom, isLoadingAtom, type User } from "@/store/auth";
import { ListMedia } from "@/types/New";

export function useNewsController() {
  const { callApi, loading, setIsLoading } = useApiService();
  const router = useRouter();
  const [isLoading, setLoading] = useAtom(isLoadingAtom);

  const getAllNewcategory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await callApi("get", "news-category");
      return response?.data;
    } catch (e: any) {
      throw e;
    } finally {
      setLoading(false);
    }
  }, [callApi, setLoading]);

  const searchNewcategory = useCallback(
    async ({
      name,
      pageNumber,
      pageSize,
    }: {
      name?: string;
      pageNumber?: number;
      pageSize?: number;
    }) => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (name) queryParams.append("name", name);
        if (pageNumber) queryParams.append("pageNumber", pageNumber.toString());
        if (pageSize) queryParams.append("pageSize", pageSize.toString());

        const response = await callApi(
          "get",
          `news-category/search-paged?${queryParams.toString()}`
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

  const createNewcategory = useCallback(
    async (data: Partial<{ category: string }>) => {
      setLoading(true);
      try {
        const response = await callApi("post", "news-category", data);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const deleteNewcategory = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const response = await callApi("delete", `news-category/${id}`);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const updateNewcategory = useCallback(
    async (id: string, data: Partial<{ category: string }>) => {
      setLoading(true);
      try {
        const response = await callApi("put", `news-category/${id}`, data);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const getNewcategoryById = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const response = await callApi("get", `news-category/${id}`);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  // Hàm gọi API lấy danh sách News với phân trang
  const searchNews = useCallback(
    async ({
      title,
      categoryName,
      categoryId,
      pageNumber,
      pageSize,
    }: {
      title?: string;
      categoryName?: string;
      categoryId?: string;
      pageNumber?: number;
      pageSize?: number;
    }) => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (title) queryParams.append("title", title);
        if (categoryName) queryParams.append("categoryName", categoryName);
        if (categoryId) queryParams.append("categoryId", categoryId);
        if (pageNumber) queryParams.append("pageNumber", pageNumber.toString());
        if (pageSize) queryParams.append("pageSize", pageSize.toString());

        const response = await callApi(
          "get",
          `news/search-paged?${queryParams.toString()}`
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

  // Hàm gọi API tạo mới News
  const createNews = useCallback(
    async (data: {
      title: string;
      description: string;
      content: string;
      locationId: string;
      eventId: string;
      newsCategoryId: string;
      isHighlighted: boolean;
      medias?: ListMedia[];
    }) => {
      setLoading(true);
      try {
        const response = await callApi("post", "news", data);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  // Hàm gọi API cập nhật thông tin News
  const updateNews = useCallback(
    async (
      id: string,
      data: {
        title: string;
        description: string;
        content: string;
        locationId: string;
        eventId: string;
        newsCategoryId: string;
        isHighlighted: boolean;
        medias?: ListMedia[];
      }
    ) => {
      setLoading(true);
      try {
        const response = await callApi("put", `news/${id}`, data);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  // Hàm gọi API xóa News theo id
  const deleteNews = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const response = await callApi("delete", `news/${id}`);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  // Hàm gọi API lấy thông tin một News theo id
  const getNewsById = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const response = await callApi("get", `news/${id}`);
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
          `/news/upload-media?id=${id}&thumbnailFileName=${thumbnailFile.name}`,
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

  const uploadNewsMedia = useCallback(
    async (id: string, files: File[]) => {
      setLoading(true);
      try {
        const formData = new FormData();
        files.forEach((file) => formData.append("imageUploads", file));
        const response = await callApi(
          "post",
          `news/upload-media?id=${id}`,
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

  return {
    searchNewcategory,
    getNewcategoryById,
    getAllNewcategory,
    createNewcategory,
    deleteNewcategory,
    updateNewcategory,
    searchNews,
    createNews,
    updateNews,
    deleteNews,
    getNewsById,
    uploadNewsMedia,
    uploadThumbnail,
    loading: isLoading || loading,
  };
}
