"use client";

import useApiService from "@/hooks/useApi";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { userAtom, isLoadingAtom, type User } from "@/store/auth";
import { District, DistrictCreate } from "@/types/District";
import { SeccretKey } from "@/secret/secret";
import axios from "axios";

export function useLocationController() {
  const { callApi, loading, setIsLoading } = useApiService();
  const router = useRouter();
  const [isLoading, setLoading] = useAtom(isLoadingAtom);

  const getAllLocation = useCallback(async () => {
    setLoading(true);
    try {
      const response = await callApi("get", "location");
      return response?.data;
    } catch (e: any) {
      throw e;
    } finally {
      setLoading(false);
    }
  }, [callApi, setLoading]);

  const searchLocation = useCallback(
    async ({
      title,
      typeId,
      districtId,
      heritageRank,
      pageNumber,
      pageSize,
    }: {
      title?: string;
      typeId?: string;
      districtId?: string;
      heritageRank?: number;
      pageNumber?: number;
      pageSize?: number;
    }) => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (title) queryParams.append("title", title);
        if (typeId) queryParams.append("typeId", typeId);
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
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const searchLocationNew = useCallback(
    async ({
      title,
      typeId,
      districtId,
      heritageRank,
      pageNumber,
      pageSize,
    }: {
      title?: string;
      typeId?: string;
      districtId?: string;
      heritageRank?: number;
      pageNumber?: number;
      pageSize?: number;
    }) => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (title) queryParams.append("title", title);
        if (typeId) queryParams.append("typeId", typeId);
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
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const getAllTypeLocation = useCallback(async () => {
    setLoading(true);
    try {
      const response = await callApi("get", "type-location");
      return response?.data;
    } catch (e: any) {
      throw e;
    } finally {
      setLoading(false);
    }
  }, [callApi, setLoading]);

  const createTypeLocation = useCallback(
    async (data: Partial<{ name: string }>) => {
      setLoading(true);
      try {
        const response = await callApi("post", "type-location", data);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const deleteTypeLocation = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const response = await callApi("delete", `type-location/${id}`);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const updateTypeLocation = useCallback(
    async (id: string, data: Partial<{ name: string }>) => {
      setLoading(true);
      try {
        const response = await callApi("put", `type-location/${id}`, data);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const getTypeLocationById = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const response = await callApi("get", `type-location/${id}`);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const getAllTypeLocationsPaginated = useCallback(
    async (pageNumber: number, pageSize: number) => {
      setLoading(true);
      try {
        const response = await callApi(
          "get",
          `type-location/paginated?pageNumber=${pageNumber}&pageSize=${pageSize}`
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

  const createLocation = useCallback(
    async (data: {
      name: string;
      description: string;
      content: string;
      latitude: number;
      longitude: number;
      rating: number;
      typeLocationId: string;
      districtId: string;
      heritageRank: number;
    }) => {
      setLoading(true);
      try {
        const response = await callApi("post", "location", data);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const updateLocation = useCallback(
    async (
      id: string,
      data: {
        name: string;
        description: string;
        content: string;
        latitude: number;
        longitude: number;
        rating: number;
        typeLocationId: string;
        districtId: string;
        heritageRank: number;
      }
    ) => {
      setLoading(true);
      try {
        const response = await callApi("put", `location/${id}`, data);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const uploadLocationMedia = useCallback(
    async (id: string, files: File[]) => {
      setLoading(true);
      try {
        const formData = new FormData();
        files.forEach((file) => formData.append("imageUploads", file));
        const response = await callApi(
          "post",
          `location/upload-media-2?id=${id}`,
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
          `https://maps.vietmap.vn/api/autocomplete/v3?apikey=${SeccretKey.VIET_MAP_KEY
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

  const deleteLocation = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const response = await callApi("delete", `location/${id}`);
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
          `/location/upload-media-2?id=${id}&thumbnailFileName=${thumbnailFile.name}`,
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

  const getLocationById = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const response = await callApi("get", `location/${id}`);
        return response?.data;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [callApi, setLoading]
  );

  const deleteLocationMedia = useCallback(
    async (id: string, mediaURL: string[]) => {
      setLoading(true);
      try {
        const response = await callApi(
          "delete",
          `location/delete-media?id=${id}`,
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

  const getAllRank = useCallback(async () => {
    setLoading(true);
    try {
      const response = await callApi("get", "/location/heritage-rank");
      return response?.data;
    } catch (e: any) {
      throw e;
    } finally {
      setLoading(false);
    }
  }, [callApi, setLoading]);

  return {
    searchLocation,
    getAllLocation,
    getAllTypeLocation,
    createTypeLocation,
    deleteTypeLocation,
    updateTypeLocation,
    getTypeLocationById,
    getAllTypeLocationsPaginated,
    createLocation,
    uploadLocationMedia,
    getCoordinatesByName,
    deleteLocation,
    uploadThumbnail,
    getLocationById,
    updateLocation,
    deleteLocationMedia,
    getAllRank,
    searchLocationNew,
    loading: isLoading || loading,
  };
}
