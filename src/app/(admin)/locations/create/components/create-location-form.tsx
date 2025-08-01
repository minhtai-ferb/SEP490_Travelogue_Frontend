"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BasicLocationInfo } from "./basic-location-info";
import { LocationTypeSelector } from "./location-type-selector";
import { CuisineForm } from "./cuisine-form";
import { CraftVillageForm } from "./craft-village-form";
import { HistoricalLocationForm } from "./historical-location-form";
import { ContentEditor } from "./content-editor";
import { MapSelector } from "./map-selector";
import { TimeSelector } from "./time-selector";
import {
  LocationType,
  type TypeHistoricalLocation,
} from "../types/CreateLocation";
import { useLocations } from "@/services/use-locations";

interface LocationFormData {
  name: string;
  description: string;
  content: string;
  address: string;
  latitude: number;
  longitude: number;
  openTime: { ticks: number };
  closeTime: { ticks: number };
  districtId: string;
  locationType: LocationType;
}

interface LocationTypeData {
  cuisine?: {
    signatureProduct: string;
    cookingMethod: string;
    cuisineType: string;
    phoneNumber: string;
    email: string;
    website: string;
  };
  craftVillage?: {
    phoneNumber: string;
    email: string;
    website: string;
    workshopsAvailable: boolean;
    signatureProduct: string;
    yearsOfHistory: number;
    isRecognizedByUnesco: boolean;
  };
  historicalLocation?: {
    heritageRank: number;
    establishedDate: string;
    typeHistoricalLocation: TypeHistoricalLocation;
  };
}

export function CreateLocationForm() {
  const [formData, setFormData] = useState<LocationFormData>({
    name: "",
    description: "",
    content: "",
    address: "",
    latitude: 0,
    longitude: 0,
    openTime: { ticks: 0 },
    closeTime: { ticks: 0 },
    districtId: "",
    locationType: LocationType.ScenicSpot,
  });

  const [locationTypeData, setLocationTypeData] = useState<LocationTypeData>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addHistoricalLocation, addCraftVillage, addCuisine, createLocation } =
    useLocations();

  const handleBasicInfoChange = (data: Partial<LocationFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleLocationTypeChange = (type: LocationType) => {
    setFormData((prev) => ({ ...prev, locationType: type }));
    // Reset location type specific data when type changes
    setLocationTypeData({});
  };

  const handleLocationTypeDataChange = (data: Partial<LocationTypeData>) => {
    setLocationTypeData((prev) => ({ ...prev, ...data }));
  };

  const handleCoordinatesChange = (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleTimeChange = (
    openTime: { ticks: number },
    closeTime: { ticks: number }
  ) => {
    setFormData((prev) => ({ ...prev, openTime, closeTime }));
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Create main location
      const locationResponse = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!locationResponse.ok) throw new Error("Failed to create location");

      const location = await locationResponse.json();
      const locationId = location.id;

      // Create location type specific data
      if (
        formData.locationType === LocationType.Cuisine &&
        locationTypeData.cuisine
      ) {
        await fetch(`/api/locations/${locationId}/cuisine`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(locationTypeData.cuisine),
        });
      } else if (
        formData.locationType === LocationType.CraftVillage &&
        locationTypeData.craftVillage
      ) {
        await fetch(`/api/locations/${locationId}/craft-village`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(locationTypeData.craftVillage),
        });
      } else if (
        formData.locationType === LocationType.HistoricalSite &&
        locationTypeData.historicalLocation
      ) {
        await fetch(`/api/locations/${locationId}/historical-location`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...locationTypeData.historicalLocation,
            locationId,
          }),
        });
      }

      // Success notification
      alert("Tạo địa điểm thành công!");
    } catch (error) {
      console.error("Error creating location:", error);
      alert("Có lỗi xảy ra khi tạo địa điểm");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderLocationTypeForm = () => {
    switch (formData.locationType) {
      case LocationType.Cuisine:
        return (
          <CuisineForm
            data={locationTypeData.cuisine}
            onChange={(data) => handleLocationTypeDataChange({ cuisine: data })}
          />
        );
      case LocationType.CraftVillage:
        return (
          <CraftVillageForm
            data={locationTypeData.craftVillage}
            onChange={(data) =>
              handleLocationTypeDataChange({ craftVillage: data })
            }
          />
        );
      case LocationType.HistoricalSite:
        return (
          <HistoricalLocationForm
            data={locationTypeData.historicalLocation}
            onChange={(data) =>
              handleLocationTypeDataChange({ historicalLocation: data })
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent>
          <BasicLocationInfo data={formData} onChange={handleBasicInfoChange} />
        </CardContent>
      </Card>

      {/* Location Type */}
      <Card>
        <CardHeader>
          <CardTitle>Loại địa điểm</CardTitle>
        </CardHeader>
        <CardContent>
          <LocationTypeSelector
            selectedType={formData.locationType}
            onChange={handleLocationTypeChange}
          />
        </CardContent>
      </Card>

      {/* Location Type Specific Form */}
      {renderLocationTypeForm()}

      {/* Map Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Vị trí trên bản đồ</CardTitle>
        </CardHeader>
        <CardContent>
          <MapSelector
            address={formData.address}
            latitude={formData.latitude}
            longitude={formData.longitude}
            onChange={handleCoordinatesChange}
          />
        </CardContent>
      </Card>

      {/* Time Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Giờ hoạt động</CardTitle>
        </CardHeader>
        <CardContent>
          <TimeSelector
            openTime={formData.openTime}
            closeTime={formData.closeTime}
            onChange={handleTimeChange}
          />
        </CardContent>
      </Card>

      {/* Content Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Nội dung chi tiết</CardTitle>
        </CardHeader>
        <CardContent>
          <ContentEditor
            content={formData.content}
            onChange={handleContentChange}
          />
        </CardContent>
      </Card>

      <Separator />

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" size="lg">
          Hủy
        </Button>
        <Button size="lg" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Đang tạo..." : "Tạo địa điểm"}
        </Button>
      </div>
    </div>
  );
}
