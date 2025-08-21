"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SidebarInset } from "@/components/ui/sidebar";
import { useLocations } from "@/services/use-locations";
import { EditLocationForm } from "@/app/(manage)/components/locations/edit/[id]/components/edit-location-form";
import { CraftVillageData, CuisineData, HistoricalLocationData, LocationType, MediaDto } from "@/app/(manage)/components/locations/edit/[id]/types/EditLocation";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import LoadingContent from "@/components/common/loading-content";

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

const crumb: Crumb[] = [
  { label: "Quản lý địa điểm", href: "/moderator/locations" },
  { label: "Chỉnh sửa địa điểm" },
];

export default function EditLocationPage() {
  const params = useParams();
  const router = useRouter();
  const locationId = params.id as string;
  const { getLocationById } = useLocations();

  const [locationData, setLocationData] = useState<LocationData | null>(null);
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

  if (loading || error || !locationData) {
    return <LoadingContent />;
  }

  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumb} />
      <EditLocationForm 
        locationData={locationData}
        backUrl="/moderator/locations"
      />
    </SidebarInset>
  );
}
