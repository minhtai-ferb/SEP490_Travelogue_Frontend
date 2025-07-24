"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { SeccretKey } from "@/secret/secret";
import { useLocationController } from "@/services/location-controller";
import type { Location } from "@/types/Location";
import VietmapGL from "@vietmap/vietmap-gl-js/dist/vietmap-gl";
import "@vietmap/vietmap-gl-js/dist/vietmap-gl.css";
import { Image as AntImage, Spin } from "antd";
import { ArrowLeft, Edit, MapPin } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function ViewLocation() {
  const params = useParams();
  const router = useRouter();
  const locationId = params.id as string;

  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);

  const { getLocationById } = useLocationController();

  // Add map and marker refs to maintain references
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Fetch location data
  useEffect(() => {
    setLoading(false);
    const fetchLocationData = async () => {
      if (!locationId) return;
      try {
        const locationData = await getLocationById(locationId);
        setLocation(locationData);
      } catch (error) {
        console.error("Error fetching location data:", error);
      } finally {
        setLoading(true);
      }
    };

    fetchLocationData();
  }, []);

  // Safe map removal function
  const safeRemoveMap = () => {
    try {
      if (mapRef.current) {
        // Remove all event listeners first
        if (mapRef.current.off) {
          mapRef.current.off("load");
          mapRef.current.off("error");
        }

        // Remove all controls
        if (mapRef.current._controls) {
          const controls = [...mapRef.current._controls];
          controls.forEach((control) => {
            try {
              mapRef.current.removeControl(control);
            } catch (e) {
              console.warn("Error removing control:", e);
            }
          });
        }

        // Remove marker if it exists
        if (markerRef.current) {
          try {
            markerRef.current.remove();
          } catch (e) {
            console.warn("Error removing marker:", e);
          }
          markerRef.current = null;
        }

        // Use a try-catch block for the map removal
        try {
          mapRef.current.remove();
        } catch (e) {
          console.warn("Error during map removal:", e);
          // If remove fails, try to at least clean up the DOM
          const container = document.getElementById("map");
          if (container) {
            container.innerHTML = "";
          }
        }

        mapRef.current = null;
      }
    } catch (error) {
      console.warn("Error in safeRemoveMap:", error);
    }
  };

  // Initialize map
  useEffect(() => {
    if (!location) return;

    // Delay map initialization to ensure DOM is ready
    const initializeMap = () => {
      const mapContainer = document.getElementById("map");
      if (!mapContainer) {
        console.error("Map container not found");
        return;
      }

      // Cleanup previous map instance safely
      safeRemoveMap();

      // Create map with error handling
      try {
        // Set explicit dimensions on the container
        mapContainer.style.width = "100%";
        mapContainer.style.height = "400px";

        mapRef.current = new VietmapGL.Map({
          container: "map",
          style: `https://maps.vietmap.vn/mt/tm/style.json?apikey=${SeccretKey.VIET_MAP_KEY}`,
          center: [location.longitude, location.latitude],
          zoom: 14,
          minZoom: 5,
          maxZoom: 18,
          pitch: 0,
          bearing: 0,
          interactive: false, // Disable user interactions
        });

        // Add navigation control
        mapRef.current.addControl(
          new VietmapGL.NavigationControl(),
          "top-right"
        );

        // Wait for map to load before adding marker
        mapRef.current.on("load", () => {
          setMapInitialized(true);

          // Create marker
          markerRef.current = new VietmapGL.Marker()
            .setLngLat([location.longitude, location.latitude])
            .addTo(mapRef.current);
        });

        // Handle error events
        mapRef.current.on("error", (e: any) => {
          console.error("Map error:", e);
        });
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    // Delay initialization slightly to ensure DOM is ready
    const timeoutId = setTimeout(initializeMap, 500);

    return () => {
      clearTimeout(timeoutId);
      safeRemoveMap();
    };
  }, [location]);

  // Helper function to render heritage rank
  const renderHeritageRank = (rank?: number) => {
    switch (rank) {
      case 1:
        return "Di tích cấp tỉnh";
      case 2:
        return "Di tích cấp quốc gia";
      case 3:
        return "Di tích Quốc gia Đặc biệt";
      default:
        return "Không xác định";
    }
  };

  // Find thumbnail image
  const thumbnailImage =
    location?.medias?.find((media) => media.isThumbnail)?.mediaUrl ||
    location?.medias?.[0]?.mediaUrl ||
    "/placeholder_image.jpg";

  if (!loading) {
    return (
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Quản lý địa điểm</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/locations/list">
                  Danh sách địa điểm
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Chi tiết địa điểm</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Spin size="large" />
          <span className="ml-2">Đang tải thông tin địa điểm...</span>
        </div>
      </SidebarInset>
    );
  } else if (location) {
    return (
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Quản lý địa điểm</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/locations/list">
                  Danh sách địa điểm
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Chi tiết địa điểm</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/locations/edit/${locationId}`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          </div>
        </header>
        <div className="p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Main content */}
              <div className="flex-1">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold mb-2">
                    {location?.name || "Tên địa điểm không xác định"}
                  </h1>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>
                      {location?.districtName || "Chưa có thông tin quận/huyện"}
                    </span>
                  </div>
                </div>

                {/* Main image */}
                <div
                  className="mb-6 rounded-lg border"
                >
                  <AntImage
                    src={thumbnailImage || "/placeholder_image.png"}
                    alt={location?.name}
                    width={800}
                    height={400}
                    className="object-contain w-full h-64 rounded-lg"
                  />
                </div>

                {/* Image gallery */}
                {location?.medias && location.medias.length > 1 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Hình ảnh</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {location.medias.map((media, index) => (
                        <AntImage
                          key={media.mediaUrl || index} // Ensure each child has a unique key
                          src={media.mediaUrl}
                          alt={`${location.name} - ${index + 1}`}
                          className="rounded-md object-cover aspect-square"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Mô tả</h2>
                  <div className="prose max-w-none">
                    <p>{location?.description}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">
                    Nội dung chi tiết
                  </h2>
                  <div className="prose max-w-none">
                    <p>{location?.content}</p>
                  </div>
                </div>

                {/* Map */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Vị trí</h2>
                  <div
                    className="relative rounded-lg overflow-hidden border border-gray-300"
                    style={{ width: "100%", height: "400px" }}
                  >
                    <div
                      id="map"
                      className="absolute inset-0"
                      style={{ width: "100%", height: "100%" }}
                    ></div>
                    {!mapInitialized && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70">
                        <Spin />
                        <span className="ml-2">Đang tải bản đồ...</span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Vĩ độ: {location?.latitude}, Kinh độ: {location?.longitude}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="w-full md:w-80">
                <Card className="sticky top-20 ">
                  <CardContent className="p-4">
                    <h2 className="text-xl font-semibold mb-4">Thông tin</h2>

                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Loại địa điểm
                        </div>
                        <div className="font-medium">
                          {location?.typeLocationName || "Chưa phân loại"}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground">
                          Xếp hạng di tích
                        </div>
                        <div className="font-medium">
                          {renderHeritageRank(location?.heritageRank)}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground">
                          Quận/Huyện
                        </div>
                        <div className="font-medium">
                          {location?.districtName || "Chưa có thông tin"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button
                        className="w-full"
                        onClick={() =>
                          router.push(`/admin/locations/edit/${locationId}`)
                        }
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa địa điểm
                      </Button>
                    </div>

                    <div className="mt-4">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => router.push("/admin/locations/list")}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại danh sách
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    );
  }
}
export default ViewLocation;
