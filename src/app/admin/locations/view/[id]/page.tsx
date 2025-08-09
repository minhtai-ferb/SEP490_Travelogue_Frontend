"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLocations } from "@/services/use-locations";
import LoadingContent from "@/components/common/loading-content";
import { ErrorDisplay } from "./components/error-display";
import { LocationHeader } from "./components/location-header";
import { ImageGallery } from "./components/image-gallery";
import { LocationContent } from "./components/location-content";
import { LocationInfo } from "./components/location-info";
import { LocationDetails } from "./components/location-details";
import HeaderViewLocation from "./components/header";
import { SidebarInset } from "@/components/ui/sidebar";

interface MediaItem {
  mediaUrl: string;
  fileName: string;
  fileType: string | null;
  isThumbnail: boolean;
  sizeInBytes: number;
  createdTime: string;
}

interface LocationData {
  id: string;
  name: string;
  description: string;
  content: string;
  latitude: number;
  longitude: number;
  rating: number;
  openTime: string;
  closeTime: string;
  category: string;
  districtId: string;
  districtName: string;
  medias: MediaItem[];
  cuisine: any;
  craftVillage: any;
  historicalLocation: any;
}

export default function LocationView() {
  const params = useParams();
  const { getLocationById, loading } = useLocations();
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      getLocationById(params.id as string)
        .then((data) => {
          setLocationData(data);
        })
        .catch((err) => {
          setError(err.message || "Failed to load location data");
        });
    }
  }, [params.id, getLocationById]);

  if (typeof loading === "boolean" && loading) {
    return <LoadingContent />;
  }

  if (error || !locationData) {
    return <ErrorDisplay error={error || "Location not found"} />;
  }

  return (
    <SidebarInset>
      <HeaderViewLocation />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <LocationHeader
          name={locationData.name}
          districtName={locationData.districtName}
          category={locationData.category}
          rating={locationData.rating}
          description={locationData.description}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <ImageGallery
              medias={locationData.medias}
              locationName={locationData.name}
            />

            {/* Content Section */}
            <LocationContent content={locationData.content} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Location Info */}
            <LocationInfo
              openTime={locationData.openTime}
              closeTime={locationData.closeTime}
              latitude={locationData.latitude}
              longitude={locationData.longitude}
              districtName={locationData.districtName}
            />

            {/* Additional Details */}
            <LocationDetails
              cuisine={locationData.cuisine}
              craftVillage={locationData.craftVillage}
              historicalLocation={locationData.historicalLocation}
            />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
