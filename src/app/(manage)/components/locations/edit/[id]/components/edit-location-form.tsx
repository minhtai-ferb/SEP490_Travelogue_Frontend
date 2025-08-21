"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
  CraftVillageData,
  CuisineData,
  HistoricalLocationData,
  LocationType,
  MediaDto,
  Category,
  TypeHistoricalLocation,
} from "../types/EditLocation";
import { ContentEditorRich } from "./content-editor-rich";
import { BasicInfoSection } from "./basic-info-section";
import { MapSelector } from "./map-selector";
import { TimeSelector } from "./time-selector";
import { LocationTypeDisplay } from "./location-type-display";
import { ImageUpload } from "./image-upload";
import { HistoricalLocationForm } from "./historical-location-form";
import { CraftVillageForm } from "./craft-village-form";
import { CuisineForm } from "./cuisine-form";
import { ActionButtons } from "./action-buttons";
import { useLocations } from "@/services/use-locations";
import toast from "react-hot-toast";

interface LocationData {
  id: string;
  name: string;
  description: string;
  content: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  openTime: string;
  closeTime: string;
  category: string;
  districtId: string;
  districtName: string;
  locationType: LocationType;
  medias: MediaDto[];
  cuisine?: CuisineData;
  craftVillage?: CraftVillageData;
  historicalLocation?: HistoricalLocationData;
}

interface EditLocationFormProps {
  locationData: LocationData;
  backUrl: string;
}

export function EditLocationForm({
  locationData: initialData,
  backUrl,
}: EditLocationFormProps) {
  const router = useRouter();
  const [locationData, setLocationData] = useState<LocationData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [newMediaUrls, setNewMediaUrls] = useState<string[]>([]); // Track new uploaded images

  const {
    updateCuisineInfo,
    updateCraftVillageInfo,
    updateHistoricalLocationInfo,
    updateScenicSpotInfo,
    deleteMediaByFileName,
  } = useLocations();

  // Handle form updates
  const handleBasicInfoChange = (data: any) => {
    setLocationData((prev) => ({ ...prev, ...data }));
  };

  const handleTimeChange = (openTime: string, closeTime: string) => {
    setLocationData((prev) => ({
      ...prev!,
      openTime: normalizeTime(openTime),
      closeTime: normalizeTime(closeTime),
    }));
  };

  const handleCoordinatesChange = (lat: number, lng: number) => {
    setLocationData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleMediaChange = (medias: MediaDto[]) => {
    // Track newly added images
    const originalUrls = initialData.medias.map((m) => m.mediaUrl);
    const currentUrls = medias.map((m) => m.mediaUrl);
    const newUrls = currentUrls.filter((url) => !originalUrls.includes(url));
    setNewMediaUrls(newUrls);

    setLocationData((prev) => ({ ...prev, medias }));
  };

  const handleContentChange = (content: string) => {
    setLocationData((prev) => ({ ...prev, content }));
  };

  const handleLocationTypeDataChange = (field: string, data: any) => {
    setLocationData((prev) => ({ ...prev, [field]: data }));
  };

  // Function to cleanup newly uploaded images
  const cleanupNewImages = async () => {
    if (newMediaUrls.length === 0 || isSuccess) return;

    try {
      const deletePromises = newMediaUrls.map(async (mediaUrl) => {
        const fileName = mediaUrl.split("/").pop() || mediaUrl;
        return deleteMediaByFileName(fileName);
      });
      await Promise.all(deletePromises);
      console.log("Cleaned up newly uploaded images");
    } catch (error) {
      console.error("Error cleaning up images:", error);
    }
  };

  // Function to handle cancel with cleanup
  const handleCancel = async () => {
    await cleanupNewImages();
    if (newMediaUrls.length > 0) {
      toast.success("Đã xóa các hình ảnh mới đã tải lên!");
    }
    router.push(backUrl);
  };

  // Cleanup on component unmount or page navigation
  useEffect(() => {
    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      if (newMediaUrls.length > 0 && !isSuccess) {
        await cleanupNewImages();
      }
    };

    const handlePopState = async () => {
      if (newMediaUrls.length > 0 && !isSuccess) {
        await cleanupNewImages();
      }
    };

    // Intercept link clicks to cleanup before navigation
    const handleLinkClick = async (event: Event) => {
      const target = event.target as HTMLElement;
      const link = target.closest("a[href]") as HTMLAnchorElement;

      if (link && newMediaUrls.length > 0 && !isSuccess) {
        const href = link.getAttribute("href");
        // Check if navigating to locations management page
        if (
          href &&
          (href.includes("/admin/locations") ||
            href.includes("/moderator/locations")) &&
          !href.includes("/edit/")
        ) {
          event.preventDefault();
          await cleanupNewImages();
          toast.success("Đã xóa các hình ảnh mới đã tải lên!");
          window.location.href = href;
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleLinkClick);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleLinkClick);
    };
  }, [newMediaUrls, isSuccess]);

  const normalizeTime = (t: string) => {
    if (!t) return t;
    if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t;
    if (/^\d{2}:\d{2}$/.test(t)) return `${t}:00`;
    return t;
  };

  const toHHmm = (t: string) => {
    if (!t) return "";
    const match = t.match(/^(\d{2}:\d{2})/);
    return match ? match[1] : t;
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Validate type-specific required fields before submitting
      if (locationData.category === Category.HistoricalSite) {
        const hist = locationData.historicalLocation;

        // Check if all required fields are present and valid
        const missingFields: string[] = [];

        if (!hist) {
          toast.error("Vui lòng điền đầy đủ thông tin di tích lịch sử");
          setIsSubmitting(false);
          return;
        }

        if (!hist.establishedDate || hist.establishedDate.trim() === "") {
          missingFields.push("Ngày thành lập/công nhận");
        }

        if (
          hist.typeHistoricalLocation === undefined ||
          hist.typeHistoricalLocation === null
        ) {
          missingFields.push("Loại di tích");
        }

        if (hist.heritageRank === undefined || hist.heritageRank === null) {
          missingFields.push("Xếp hạng di sản");
        } else if (hist.heritageRank < 0 || hist.heritageRank > 5) {
          missingFields.push("Xếp hạng di sản (phải từ 0-5)");
        }

        if (missingFields.length > 0) {
          toast.error(
            `Vui lòng điền đầy đủ thông tin: ${missingFields.join(", ")}`
          );
          setIsSubmitting(false);
          return;
        }
      }
      // Update location type specific data
      switch (locationData.category) {
        case Category.ScenicSpot:
          if (locationData) {
            console.log(locationData);
            await updateScenicSpotInfo(locationData.id, {
              name: locationData.name,
              description: locationData.description,
              districtId: locationData.districtId,
              locationId: locationData.id,
              content: locationData.content,
              address: locationData.address,
              latitude: locationData.latitude,
              longitude: locationData.longitude,
              openTime: normalizeTime(locationData.openTime),
              closeTime: normalizeTime(locationData.closeTime),
              mediaDtos: locationData.medias,
            });
          }
          break;
        case Category.Cuisine:
          if (locationData) {
            await updateCuisineInfo(locationData.id, {
              name: locationData.name,
              description: locationData.description,
              districtId: locationData.districtId,
              locationId: locationData.id,
              content: locationData.content,
              address: locationData.address,
              latitude: locationData.latitude,
              longitude: locationData.longitude,
              openTime: normalizeTime(locationData.openTime),
              closeTime: normalizeTime(locationData.closeTime),
              mediaDtos: locationData.medias,
              cuisineType: locationData.cuisine?.cuisineType || "",
              phoneNumber: locationData.cuisine?.phoneNumber || "",
              email: locationData.cuisine?.email || "",
              website: locationData.cuisine?.website || "",
              signatureProduct: locationData.cuisine?.signatureProduct || "",
              cookingMethod: locationData.cuisine?.cookingMethod || "",
            });
          }
          break;
        case Category.CraftVillage:
          if (locationData) {
            await updateCraftVillageInfo(locationData.id, {
              name: locationData.name,
              description: locationData.description,
              districtId: locationData.districtId,
              locationId: locationData.id,
              content: locationData.content,
              address: locationData.address,
              latitude: locationData.latitude,
              longitude: locationData.longitude,
              openTime: normalizeTime(locationData.openTime),
              closeTime: normalizeTime(locationData.closeTime),
              mediaDtos: locationData.medias,
              phoneNumber: locationData.craftVillage?.phoneNumber || "",
              email: locationData.craftVillage?.email || "",
              website: locationData.craftVillage?.website || "",
              workshopsAvailable:
                locationData.craftVillage?.workshopsAvailable || 0,
              signatureProduct:
                locationData.craftVillage?.signatureProduct || "",
              yearsOfHistory: locationData.craftVillage?.yearsOfHistory || 0,
              isRecognizedByUnesco:
                locationData.craftVillage?.isRecognizedByUnesco || false,
            });
          }
          break;
        case Category.HistoricalSite:
          if (locationData) {
            await updateHistoricalLocationInfo(locationData.id, {
              name: locationData.name,
              description: locationData.description,
              districtId: locationData.districtId,
              locationId: locationData.id,
              content: locationData.content,
              address: locationData.address,
              latitude: locationData.latitude,
              longitude: locationData.longitude,
              openTime: normalizeTime(locationData.openTime),
              closeTime: normalizeTime(locationData.closeTime),
              mediaDtos: locationData.medias,
              heritageRank: locationData.historicalLocation?.heritageRank || 0,
              establishedDate:
                locationData.historicalLocation?.establishedDate || "",
              typeHistoricalLocation:
                locationData.historicalLocation?.typeHistoricalLocation ||
                TypeHistoricalLocation.ProvincialMonument,
            });
          }
          break;
      }

      setIsSuccess(true); // Đánh dấu cập nhật thành công để không xóa ảnh
      toast.success("Cập nhật địa điểm thành công!");
      router.push(backUrl);
    } catch (error) {
      console.error("Error updating location:", error);
      toast.error("Có lỗi xảy ra khi cập nhật địa điểm");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render location type specific form
  const renderLocationTypeForm = () => {
    switch (locationData.category) {
      case Category.Cuisine:
        return (
          <CuisineForm
            data={locationData.cuisine}
            onChange={(data) => handleLocationTypeDataChange("cuisine", data)}
          />
        );
      case Category.CraftVillage:
        return (
          <CraftVillageForm
            data={locationData.craftVillage}
            onChange={(data) =>
              handleLocationTypeDataChange("craftVillage", data)
            }
          />
        );
      case Category.HistoricalSite:
        return (
          <HistoricalLocationForm
            data={locationData.historicalLocation}
            onChange={(data) =>
              handleLocationTypeDataChange("historicalLocation", data)
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Chỉnh sửa địa điểm</h1>
            <p className="text-muted-foreground mt-2">
              Cập nhật thông tin chi tiết về địa điểm
            </p>
          </div>
          <LocationTypeDisplay category={locationData.category as Category} />
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Info and Time */}
        <BasicInfoSection
          data={{
            name: locationData.name,
            description: locationData.description,
            address: locationData.address,
            districtId: locationData.districtId,
          }}
          onChange={handleBasicInfoChange}
        />

        <TimeSelector
          openTime={toHHmm(locationData.openTime)}
          closeTime={toHHmm(locationData.closeTime)}
          onChange={handleTimeChange}
        />

        {/* Image Upload */}
        <ImageUpload
          mediaDtos={locationData.medias}
          onChange={handleMediaChange}
          isLoading={isSubmitting}
        />

        {/* Location Type Specific Form - Only show if data exists */}
        {renderLocationTypeForm()}

        {/* Map Selection */}
        <MapSelector
          address={locationData.address}
          latitude={locationData.latitude}
          longitude={locationData.longitude}
          center={[locationData.latitude, locationData.longitude]}
          onChange={handleCoordinatesChange}
        />

        {/* Content Editor */}
        <ContentEditorRich
          content={locationData.content}
          onChange={handleContentChange}
        />

        <Separator />

        {/* Action Buttons */}
        <ActionButtons
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          backUrl={backUrl}
        />
      </div>
    </div>
  );
}
