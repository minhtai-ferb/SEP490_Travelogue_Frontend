"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarInset } from "@/components/ui/sidebar";
import { Spin, message } from "antd";
import {
  CraftVillageData,
  CuisineData,
  HistoricalLocationData,
  LocationType,
  MediaDto,
  Category,
} from "./types/EditLocation";
import { EditFormHeader } from "./components/edit-form-header";
import { ContentEditorRich } from "./components/content-editor-rich";
import { BasicInfoSection } from "./components/basic-info-section";
import { MapSelector } from "./components/map-selector";
import { TimeSelector } from "./components/time-selector";
import { LocationTypeDisplay } from "./components/location-type-display";
import { ImageUpload } from "./components/image-upload";
import { HistoricalLocationForm } from "./components/historical-location-form";
import { CraftVillageForm } from "./components/craft-village-form";
import { CuisineForm } from "./components/cuisine-form";
import { useLocations } from "@/services/use-locations";

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

export default function EditLocationPage() {
  const params = useParams();
  const router = useRouter();
  const locationId = params.id as string;

  const {
    getLocationById,
    updateCuisineInfo,
    updateCraftVillageInfo,
    updateHistoricalLocationInfo,
    updateScenicSpotInfo,
  } = useLocations();

  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load location data
  useEffect(() => {
    if (locationId) {
      loadLocationData();
    }
  }, [locationId]);

  const loadLocationData = async () => {
    try {
      setLoading(true);
      const data = await getLocationById(locationId);
      setLocationData(data);
    } catch (err) {
      setError("Không thể tải thông tin địa điểm");
      console.error("Error loading location:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form updates
  const handleBasicInfoChange = (data: any) => {
    if (!locationData) return;
    setLocationData((prev) => ({ ...prev!, ...data }));
  };

  const handleTimeChange = (openTime: string, closeTime: string) => {
    if (!locationData) return;
    setLocationData((prev) => ({ ...prev!, openTime, closeTime }));
  };

  const handleCoordinatesChange = (lat: number, lng: number) => {
    if (!locationData) return;
    setLocationData((prev) => ({ ...prev!, latitude: lat, longitude: lng }));
  };

  const handleMediaChange = (medias: MediaDto[]) => {
    if (!locationData) return;
    setLocationData((prev) => ({ ...prev!, medias }));
  };

  const handleContentChange = (content: string) => {
    if (!locationData) return;
    setLocationData((prev) => ({ ...prev!, content }));
  };

  const handleLocationTypeDataChange = (field: string, data: any) => {
    if (!locationData) return;
    setLocationData((prev) => ({ ...prev!, [field]: data }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!locationData) return;

    setIsSubmitting(true);
    try {
      // Update main location data
      await updateScenicSpotInfo(locationId, {
        name: locationData.name,
        description: locationData.description,
        content: locationData.content,
        address: locationData.address,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        openTime: locationData.openTime,
        closeTime: locationData.closeTime,
        districtId: locationData.districtId,
        medias: locationData.medias,
      });

      // Update location type specific data
      switch (locationData.category) {
        case Category.Cuisine:
          if (locationData.cuisine) {
            await updateCuisineInfo(locationId, locationData.cuisine);
          }
          break;
        case Category.CraftVillage:
          if (locationData.craftVillage) {
            await updateCraftVillageInfo(locationId, locationData.craftVillage);
          }
          break;
        case Category.HistoricalSite:
          if (locationData.historicalLocation) {
            await updateHistoricalLocationInfo(
              locationId,
              locationData.historicalLocation
            );
          }
          break;
      }

      message.success("Cập nhật địa điểm thành công!");
      router.push("/locations/table");
    } catch (error) {
      console.error("Error updating location:", error);
      message.error("Có lỗi xảy ra khi cập nhật địa điểm");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render location type specific form
  const renderLocationTypeForm = () => {
    if (!locationData) return null;

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

  if (loading) {
    return (
      <SidebarInset>
        <EditFormHeader />
        <div className="flex justify-center items-center min-h-[400px]">
          <Spin size="large" />
        </div>
      </SidebarInset>
    );
  }

  if (error || !locationData) {
    return (
      <SidebarInset>
        <EditFormHeader />
        <div className="container mx-auto py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <p className="text-red-500">
                {error || "Không tìm thấy địa điểm"}
              </p>
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="mt-4"
              >
                Quay lại
              </Button>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset>
      <EditFormHeader locationName={locationData.name} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
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
            openTime={locationData.openTime}
            closeTime={locationData.closeTime}
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
          <div className="flex justify-end space-x-4">
            <Button variant="outline" size="lg" onClick={() => router.back()}>
              Hủy
            </Button>
            <Button size="lg" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật địa điểm"}
            </Button>
          </div>
        </div>
      </main>
    </SidebarInset>
  );
}
