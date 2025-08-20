"use client";

import { useCallback } from "react";
import useApiService from "@/hooks/useApi";
import { MediaDto } from "./use-news";

export function useLocations() {
  const { callApi, loading, setIsLoading } = useApiService();

  const addHistoricalLocation = useCallback(
    async (
      locationId: string,
      data: {
        heritageRank: number;
        establishedDate: string;
        typeHistoricalLocation: number;
      }
    ) => {
      setIsLoading(true);
      try {
        const response = await callApi(
          "post",
          `location/${locationId}/historical-location`,
          { ...data, locationId }
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

  const addCraftVillage = useCallback(
    async (
      locationId: string,
      data: {
        phoneNumber: string;
        email: string;
        website: string;
        workshopsAvailable: boolean;
        signatureProduct: string;
        yearsOfHistory: number;
        isRecognizedByUnesco: boolean;
      }
    ) => {
      setIsLoading(true);
      try {
        const response = await callApi(
          "post",
          `location/${locationId}/craft-village`,
          data
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

  const addCuisine = useCallback(
    async (
      locationId: string,
      data: {
        signatureProduct: string;
        cookingMethod: string;
        cuisineType: string;
        phoneNumber: string;
        email: string;
        website: string;
      }
    ) => {
      setIsLoading(true);
      try {
        const response = await callApi(
          "post",
          `location/${locationId}/cuisine`,
          data
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

  const createLocation = useCallback(
    async (data: {
      name: string;
      description: string;
      content: string;
      address: string;
      latitude: number;
      longitude: number;
      openTime: string;
      closeTime: string;
      districtId: string;
      locationType: number;
      mediaDtos: MediaDto[];
    }) => {
      setIsLoading(true);
      try {
        const response = await callApi("post", "location", data);
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

  const deleteLocation = useCallback(
    async (id: string) => {
      setIsLoading(true);
      try {
        const response = await callApi("delete", `location/${id}`);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [callApi, setIsLoading]
  );

  const searchAllLocations = useCallback(
    async ({
      title,
      type,
      districtId,
      heritageRank,
      pageNumber,
      pageSize,
    }: {
      title?: string;
      type?: number;
      districtId?: string;
      heritageRank?: number;
      pageNumber?: number;
      pageSize?: number;
    }) => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (title) queryParams.append("title", title);
        if (type !== undefined) queryParams.append("type", type.toString());
        if (districtId) queryParams.append("districtId", districtId);
        if (heritageRank !== undefined)
          queryParams.append("heritageRank", heritageRank.toString());
        if (pageNumber) queryParams.append("pageNumber", pageNumber.toString());
        if (pageSize) queryParams.append("pageSize", pageSize.toString());

        const response = await callApi(
          "get",
          `location/filter-paged?${queryParams.toString()}`
        );
        return response;
      } catch (e: any) {
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [callApi, setIsLoading]
  );

  const getLocationById = useCallback(
    async (id: string) => {
      setIsLoading(true);
      try {
        const response = await callApi("get", `location/${id}`);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [callApi, setIsLoading]
  );

  const updateCuisineInfo = useCallback(
    async (locationId: string, data: any) => {
      setIsLoading(true);
      try {
        const response = await callApi(
          "put",
          `location/${locationId}/cuisine`,
          data
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

  const updateCraftVillageInfo = useCallback(
    async (locationId: string, data: any) => {
      setIsLoading(true);
      try {
        const response = await callApi(
          "put",
          `location/${locationId}/craft-village`,
          data
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

  const updateHistoricalLocationInfo = useCallback(
    async (locationId: string, data: any) => {
      setIsLoading(true);
      try {
        const response = await callApi(
          "put",
          `location/${locationId}/historical-location`,
          data
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

  const updateScenicSpotInfo = useCallback(
    async (locationId: string, data: any) => {
      setIsLoading(true);
      try {
        const response = await callApi(
          "put",
          `location/${locationId}/scenic-spot`,
          data
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
    addHistoricalLocation,
    addCraftVillage,
    addCuisine,
    createLocation,
    uploadMediaMultiple,
    deleteMediaByFileName,
    deleteLocation,
    searchAllLocations,
    getLocationById,
    updateCuisineInfo,
    updateCraftVillageInfo,
    updateHistoricalLocationInfo,
    updateScenicSpotInfo,
    loading: loading,
    setIsLoading: setIsLoading,
  };
}
