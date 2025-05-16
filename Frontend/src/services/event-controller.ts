"use client";

import useApiService from "@/hooks/useApi";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { userAtom, isLoadingAtom, type User } from "@/store/auth";
import { District, DistrictCreate } from "@/types/District";
import { SeccretKey } from "@/secret/secret";
import axios from "axios";
import { addToast } from "@heroui/react";

export function useEventController() {
  const { callApi, loading, setIsLoading } = useApiService();
  const router = useRouter();
  const [isLoading, setLoading] = useAtom(isLoadingAtom);

  const getAllEvent = useCallback(async () => {
    setLoading(true);
    try {
      const response = await callApi("get", "event");
      return response?.data;
    } catch (e: any) {
      throw e;
    } finally {
      setLoading(false);
    }
  }, [callApi, setLoading]);

  const searchEvent = useCallback(
    async ({
      title,
      typeId,
      locationId,
      districtId,
      month,
      year,
      pageNumber,
      pageSize,
    }: {
      title?: string;
      typeId?: string;
      locationId?: string;
      districtId?: string;
      month?: number;
      year?: number;
      pageNumber?: number;
      pageSize?: number;
    }) => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();

        if (title) queryParams.append("title", title);
        if (typeId) queryParams.append("typeId", typeId);
        if (locationId) queryParams.append("locationId", locationId);
        if (districtId) queryParams.append("districtId", districtId);
        if (month !== undefined) queryParams.append("month", month.toString());
        if (year !== undefined) queryParams.append("year", year.toString());
        if (pageNumber !== undefined)
          queryParams.append("pageNumber", pageNumber.toString());
        if (pageSize !== undefined)
          queryParams.append("pageSize", pageSize.toString());

        const response = await callApi(
          "get",
          `event/filter-paged?${queryParams.toString()}`
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

  const getAllTypeEvent = useCallback(async () => {
    setLoading(true);
    try {
      const response = await callApi("get", "type-event");
      return response?.data;
    } catch (e: any) {
      throw e;
    } finally {
      setLoading(false);
    }
  }, [callApi, setLoading]);

  const createTypeEvent = useCallback(
    async (data: Partial<{ typeName: string }>) => {
      setLoading(true);
      try {
        const response = await callApi("post", "type-event", data);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const deleteTypeEvent = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const response = await callApi("delete", `type-event/${id}`);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const updateTypeEvent = useCallback(
    async (id: string, data: Partial<{ typeName: string }>) => {
      setLoading(true);
      try {
        const response = await callApi("put", `type-event/${id}`, data);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const getTypeEventById = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const response = await callApi("get", `type-event/${id}`);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const getAllTypeEventsPaginated = useCallback(
    async (pageNumber: number, pageSize: number) => {
      setLoading(true);
      try {
        const response = await callApi(
          "get",
          `type-event/paginated?pageNumber=${pageNumber}&pageSize=${pageSize}`
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

  const createEvent = useCallback(
    async (data: {
      name: string;
      description: string;
      content: string;
      typeEventId: string;
      locationId: string;
      districtId: string;
      lunarStartDate?: string;
      lunarEndDate?: string;
      startTime: string; // e.g., "12:30:00"
      endTime: string; // e.g., "14:30:00"
      startDate: string; // e.g., "2025-04-06T15:30:43.625Z"
      endDate: string; // e.g., "2025-04-06T17:30:43.625Z"
      isRecurring: boolean;
      recurrencePattern: string;
      isHighlighted: boolean;
    }) => {
      setLoading(true);
      try {
        const response = await callApi("post", "event", data);
        return response?.data;
      } catch (e: any) {
        console.error(e);
        addToast({
          title: "Có lỗi xảy ra",
          description: e.response.data.Message || "Không thể tạo sự kiện.",
          color: "danger",
        });
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const updateEvent = useCallback(
    async (
      id: string,
      data: {
        name: string;
        description?: string;
        content?: string;
        typeEventId: string;
        locationId?: string;
        districtId?: string;
        lunarStartDate?: string;
        lunarEndDate?: string;
        startTime?: string;
        endTime?: string;
        startDate?: string;
        endDate?: string;
        isRecurring: boolean;
        recurrencePattern?: string;
        isHighlighted: boolean;
      }
    ) => {
      setLoading(true);
      try {
        const response = await callApi("put", `event/${id}`, {
          name: data.name,
          description: data.description,
          content: data.content,
          typeEventId: data.typeEventId,
          locationId: data.locationId,
          districtId: data.districtId,
          lunarStartDate: data.lunarStartDate,
          lunarEndDate: data.lunarEndDate,
          startTime: data.startTime,
          endTime: data.endTime,
          startDate: data.startDate,
          endDate: data.endDate,
          isRecurring: data.isRecurring,
          recurrencePattern: data.recurrencePattern,
          isHighlighted: data.isHighlighted,
          ticks: { start: 0, end: 0 }, // Add default ticks if necessary
        });
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const uploadEventMedia = useCallback(
    async (id: string, files: File[]) => {
      setLoading(true);
      try {
        const formData = new FormData();
        files.forEach((file) => formData.append("imageUploads", file));
        const response = await callApi(
          "post",
          `event/upload-media?id=${id}`,
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

  const getCoordinatesByName = useCallback(
    async (text: string) => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://maps.vietmap.vn/api/autocomplete/v3?apikey=${
            SeccretKey.VIET_MAP_KEY
          }&text=${encodeURIComponent(text)}`
        );
        const features = response?.data?.data?.features || [];
        return features.map((feature: any) => ({
          label: feature.properties.label,
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0],
        }));
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  const deleteEvent = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const response = await callApi("delete", `event/${id}`);
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
          `/event/upload-media?id=${id}&thumbnailFileName=${thumbnailFile.name}`,
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

  const getEventById = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const response = await callApi("get", `event/${id}`);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const deleteEventMedia = useCallback(
    async (id: string, mediaURL?: string[]) => {
      setLoading(true);
      try {
        const response = await callApi(
          "delete",
          `event/delete-media?id=${id}`,
          {
            data: mediaURL,
          }
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
    searchEvent,
    getAllEvent,
    getAllTypeEvent,
    createTypeEvent,
    deleteTypeEvent,
    updateTypeEvent,
    getTypeEventById,
    getAllTypeEventsPaginated,
    createEvent,
    uploadEventMedia,
    getCoordinatesByName,
    deleteEvent,
    uploadThumbnail,
    getEventById,
    updateEvent,
    deleteEventMedia,
    loading: isLoading || loading,
  };
}
