"use client";

import { useCallback } from "react";
import useApiService from "@/hooks/useApi";

export type MediaDto = {
  mediaUrl: string;
  isThumbnail: boolean;
};

export type NewsCreateModel = {
  title: string;
  description: string;
  content: string;
  newsCategory: number;
  locationId?: string;
  startDate?: string; // ISO string nếu là Event
  endDate?: string;   // ISO string nếu là Event
  isHighlighted?: boolean;
  typeExperience?: number; // bắt buộc nếu category = Experience
  mediaDtos?: MediaDto[];
};

export type NewsUpdateModel = Partial<NewsCreateModel>;

export function useNews() {
  const { callApi, loading, setIsLoading } = useApiService();

  const createNews = useCallback(
    async (data: NewsCreateModel) => {
      setIsLoading(true);
      try {
        const res = await callApi("post", "news", data);
        return res?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [callApi, setIsLoading]
  );

  const getAllNews = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await callApi("get", "news");
      return res?.data;
    } catch (e: any) {
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, setIsLoading]);

  const getByCategory = useCallback(
    async (category?: number) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (category !== undefined && category !== null) {
          params.append("category", String(category));
        }
        const res = await callApi("get", `news/by-category?${params.toString()}`);
        return res?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [callApi, setIsLoading]
  );

  const getPagedEvents = useCallback(
    async ({
      title,
      locationId,
      isHighlighted,
      month,
      year,
      pageNumber = 1,
      pageSize = 10,
    }: {
      title?: string;
      locationId?: string;
      isHighlighted?: boolean;
      month?: number;
      year?: number;
      pageNumber?: number;
      pageSize?: number;
    }) => {
      setIsLoading(true);
      try {
        const qs = new URLSearchParams();
        if (title) qs.append("title", title);
        if (locationId) qs.append("locationId", locationId);
        if (isHighlighted !== undefined) qs.append("isHighlighted", String(isHighlighted));
        if (month !== undefined) qs.append("month", String(month));
        if (year !== undefined) qs.append("year", String(year));
        qs.append("pageNumber", String(pageNumber));
        qs.append("pageSize", String(pageSize));
        const res = await callApi("get", `news/event/search-paged?${qs.toString()}`);
        return res;
      } catch (e: any) {
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [callApi, setIsLoading]
  );

  const getPagedNewsFiltered = useCallback(
    async ({
      title,
      locationId,
      isHighlighted,
      pageNumber = 1,
      pageSize = 10,
    }: {
      title?: string;
      locationId?: string;
      isHighlighted?: boolean;
      pageNumber?: number;
      pageSize?: number;
    }) => {
      setIsLoading(true);
      try {
        const qs = new URLSearchParams();
        if (title) qs.append("title", title);
        if (locationId) qs.append("locationId", locationId);
        if (isHighlighted !== undefined) qs.append("isHighlighted", String(isHighlighted));
        qs.append("pageNumber", String(pageNumber));
        qs.append("pageSize", String(pageSize));
        const res = await callApi("get", `news/new/search-paged?${qs.toString()}`);
        return res;
      } catch (e: any) {
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [callApi, setIsLoading]
  );

  const getPagedExperiences = useCallback(
    async ({
      title,
      locationId,
      isHighlighted,
      typeExperience,
      pageNumber = 1,
      pageSize = 10,
    }: {
      title?: string;
      locationId?: string;
      isHighlighted?: boolean;
      typeExperience?: number;
      pageNumber?: number;
      pageSize?: number;
    }) => {
      setIsLoading(true);
      try {
        const qs = new URLSearchParams();
        if (title) qs.append("title", title);
        if (locationId) qs.append("locationId", locationId);
        if (typeof typeExperience === "number" && Number.isFinite(typeExperience)) {
          qs.append("typeExperience", String(typeExperience));
        }
        if (isHighlighted !== undefined) qs.append("isHighlighted", String(isHighlighted));
        qs.append("pageNumber", String(pageNumber));
        qs.append("pageSize", String(pageSize));
        const res = await callApi("get", `news/experience/search-paged?${qs.toString()}`);
        return res;
      } catch (e: any) {
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [callApi, setIsLoading]
  );

  // Lấy chi tiết theo id
  const getNewsById = useCallback(
    async (id: string) => {
      setIsLoading(true);
      try {
        const res = await callApi("get", `news/${id}`);
        return res?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [callApi, setIsLoading]
  );

  const searchPagedByTitle = useCallback(
    async ({
      title,
      pageNumber = 1,
      pageSize = 10,
    }: {
      title?: string;
      pageNumber?: number;
      pageSize?: number;
    }) => {
      setIsLoading(true);
      try {
        const qs = new URLSearchParams();
        if (title) qs.append("title", title);
        qs.append("pageNumber", String(pageNumber));
        qs.append("pageSize", String(pageSize));
        const res = await callApi("get", `news/search-paged?${qs.toString()}`);
        return res;
      } catch (e: any) {
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [callApi, setIsLoading]
  );

  const updateNews = useCallback(
    async (id: string, data: NewsUpdateModel) => {
      setIsLoading(true);
      try {
        const res = await callApi("put", `news/${id}`, data);
        return res?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [callApi, setIsLoading]
  );

  // Xoá news
  const deleteNews = useCallback(
    async (id: string) => {
      setIsLoading(true);
      try {
        const res = await callApi("delete", `news/${id}`);
        return res?.data; // ResponseModel<object> (data: true)
      } catch (e: any) {
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [callApi, setIsLoading]
  );

  return {
    createNews,
    getAllNews,
    getByCategory,
    getPagedEvents,
    getPagedNewsFiltered,
    getPagedExperiences,
    getNewsById,
    searchPagedByTitle,
    updateNews,
    deleteNews,
    loading: loading,
    setIsLoading: setIsLoading,
  };
}
