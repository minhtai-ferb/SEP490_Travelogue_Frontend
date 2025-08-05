"use client";

import { useCallback } from "react";
import useApiService from "@/hooks/useApi";
import { MediaDto } from "@/app/(admin)/locations/create/types/CreateLocation";

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
      openTime: { ticks: number };
      closeTime: { ticks: number };
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
          "media/upload-multiple",
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

  return {
    addHistoricalLocation,
    addCraftVillage,
    addCuisine,
    createLocation,
    uploadMediaMultiple,
    deleteMediaByFileName,
    loading: setIsLoading || loading,
  };
}
