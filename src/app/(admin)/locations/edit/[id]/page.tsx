"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Form, Input, InputNumber, Upload, message, Spin } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { useDistrictManager } from "@/services/district-manager";
import { useLocationController } from "@/services/location-controller";
import type { District } from "@/types/District";
import type { TypeLocation, Location } from "@/types/Location";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Select as SelectAntd } from "antd";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { SeccretKey } from "@/secret/secret";
import VietmapGL from "@vietmap/vietmap-gl-js/dist/vietmap-gl";
import "@vietmap/vietmap-gl-js/dist/vietmap-gl.css";
import debounce from "lodash.debounce";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { set } from "date-fns";

// Define interfaces for API responses
interface VietmapAutocompleteResult {
  ref_id: string;
  distance: number;
  address: string;
  name: string;
  display: string;
  boundaries: {
    type: number;
    id: number;
    name: string;
    prefix: string;
    full_name: string;
  }[];
  categories: any[];
  entry_points: any[];
}

interface VietmapPlaceResult {
  display: string;
  name: string;
  hs_num: string;
  street: string;
  address: string;
  city_id: number;
  city: string;
  district_id: number;
  district: string;
  ward_id: number;
  ward: string;
  lat: number;
  lng: number;
}

// Simple cache implementation
const apiCache = {
  autocomplete: new Map<string, any>(),
  place: new Map<string, any>(),
  // Set a maximum cache size to prevent memory issues
  maxSize: 100,

  // Add item to cache with expiration (30 minutes)
  set: function (type: "autocomplete" | "place", key: string, value: any) {
    const cache = this[type];

    // If cache is full, remove oldest entry
    if (cache.size >= this.maxSize) {
      const oldestKey = cache.keys().next().value;
      if (oldestKey !== undefined) {
        cache.delete(oldestKey);
      }
    }

    cache.set(key, {
      value,
      timestamp: Date.now(),
      expires: Date.now() + 30 * 60 * 1000, // 30 minutes
    });
  },

  // Get item from cache if not expired
  get: function (type: "autocomplete" | "place", key: string) {
    const cache = this[type];
    const item = cache.get(key);

    if (!item) return null;

    // Check if expired
    if (Date.now() > item.expires) {
      cache.delete(key);
      return null;
    }

    return item.value;
  },
};

function EditLocation() {
  const params = useParams();
  const router = useRouter();
  const locationId = params.id as string;

  const [districts, setDistricts] = useState<District[]>([]);
  const [typeLocations, setTypeLocations] = useState<TypeLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const { getAllDistrict } = useDistrictManager();
  const {
    getAllTypeLocation,
    updateLocation,
    uploadLocationMedia,
    uploadThumbnail,
    getLocationById,
    deleteLocationMedia,
  } = useLocationController();

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [existingMedia, setExistingMedia] = useState<any[]>([]);
  const [mediaToDelete, setMediaToDelete] = useState<string[]>([]);
  const [form] = Form.useForm();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [mapCoordinates, setMapCoordinates] = useState<{
    latitude: number;
    longitude: number;
  }>({ latitude: 10.762622, longitude: 106.660172 });
  const [searchError, setSearchError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [mapInitialized, setMapInitialized] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(
    null
  );

  // Add map and marker refs to maintain references
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const mapInitializedRef = useRef(false);

  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Fetch location data
  useEffect(() => {
    const fetchLocationData = async () => {
      setLocationLoading(true);
      try {
        const location = await getLocationById(locationId);
        setMapCoordinates({
          latitude: location.latitude,
          longitude: location.longitude,
        });

        // Set existing media
        if (location.medias && location.medias.length > 0) {
          setExistingMedia(location.medias);

          // Find thumbnail if exists
          const thumbnail = location.medias.find(
            (media: { isThumbnail: boolean; mediaUrl: string }) =>
              media.isThumbnail
          );
          if (thumbnail) {
            setExistingThumbnail(thumbnail.mediaUrl);
          }
        }

        // Set form values
        form.setFieldsValue({
          name: location.name,
          description: location.description,
          content: location.content,
          latitude: location.latitude,
          longitude: location.longitude,
          typeLocationId: location.typeLocationId?.toString(),
          districtId: location.districtId?.toString(),
          heritageRank: location.heritageRank?.toString(),
        });

        setSearchValue(location.name);
        setLocationLoading(false);
      } catch (error) {
        console.error("Error fetching location data:", error);
        message.error(
          "Không thể tải thông tin địa điểm. Vui lòng thử lại sau."
        );
      }
    };

    fetchLocationData();
  }, [locationId, getLocationById, form]);

  // Fetch districts and type locations
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const responseDistricts = await getAllDistrict();
        const responseTypeLocations = await getAllTypeLocation();
        setDistricts(responseDistricts);
        setTypeLocations(responseTypeLocations);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        if (isMounted.current) {
          message.error(
            "Không thể tải dữ liệu ban đầu. Vui lòng làm mới trang."
          );
        }
      }
    };
    fetchData();
  }, []);

  // Update location
  const onFinish = async (values: any) => {
    try {
      setLocationLoading(true);
      // Convert heritageRank to number
      values.heritageRank = Number(values.heritageRank);

      // Add location ID to values
      values.id = locationId;

      // Update location
      await updateLocation(values.id, values);

      // Handle media deletions
      if (mediaToDelete.length > 0) {
        await deleteLocationMedia(values.id, mediaToDelete);
      }

      // Upload new media
      if (uploadedFiles.length > 0) {
        await uploadLocationMedia(locationId, uploadedFiles);
      }

      // Upload new thumbnail
      if (thumbnailFile) {
        await uploadThumbnail(locationId, thumbnailFile);
      }

      message.success("Cập nhật địa điểm thành công!");

      // Navigate back to list
      router.push("/locations/table");
    } catch (error) {
      console.error("Error updating location:", error);
      message.error("Không thể cập nhật địa điểm. Vui lòng thử lại sau.");
    }
  };

  // Handle file uploads
  const handleFileChange = (info: any) => {
    const files = info.fileList
      .filter((file: any) => file.originFileObj)
      .map((file: any) => file.originFileObj);
    setUploadedFiles(files);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleThumbnailChange = (info: any) => {
    const file = info.fileList[0]?.originFileObj;
    setThumbnailFile(file);
  };

  // Handle media deletion
  const handleRemoveExistingMedia = (mediaUrl: string) => {
    setMediaToDelete((prev) => [...prev, mediaUrl]);
    setExistingMedia((prev) => prev.filter((media) => media.mediaUrl !== mediaUrl));
  };

  // Fetch with retry and exponential backoff
  const fetchWithRetry = async (
    url: string,
    options: RequestInit = {},
    maxRetries = 3
  ) => {
    let retries = 0;
    let delay = 1000; // Start with 1 second delay

    while (retries < maxRetries) {
      try {
        const response = await fetch(url, options);

        // If successful or not a rate limit error, return the response
        if (
          response.ok ||
          (response.status !== 429 && response.status !== 451)
        ) {
          return response;
        }

        // If we get here, it's a rate limit error
        retries++;

        if (retries >= maxRetries) {
          throw new Error(`Maximum retries reached (${maxRetries})`);
        }

        // Calculate exponential backoff delay (1s, 2s, 4s, etc.)
        delay = Math.min(delay * 2, 10000); // Cap at 10 seconds

        console.log(
          `Rate limit hit. Retrying in ${delay}ms (${retries}/${maxRetries})`
        );

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delay));
      } catch (error) {
        retries++;

        if (retries >= maxRetries) {
          throw error;
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = Math.min(delay * 2, 10000);
      }
    }

    throw new Error("Failed after maximum retries");
  };

  const performSearch = async (value: string) => {
    // Kiểm tra đầu vào: nếu chuỗi tìm kiếm quá ngắn, không thực hiện tìm kiếm
    if (!value || value.length <= 2) {
      console.log("Chuỗi tìm kiếm quá ngắn, không thực hiện tìm kiếm");
      setSuggestions([]); // Xóa các gợi ý hiện tại
      setPopoverOpen(false); // Đóng popover
      return;
    }

    // Cập nhật trạng thái UI
    setSearchLoading(true); // Bắt đầu hiển thị trạng thái đang tải
    setSearchError(null); // Xóa lỗi trước đó nếu có

    try {
      console.log("Bắt đầu tìm kiếm cho:", value);

      // Tạo khóa cache dựa trên chuỗi tìm kiếm và vị trí hiện tại
      const cacheKey = `${value}-${mapCoordinates.latitude.toFixed(
        4
      )},${mapCoordinates.longitude.toFixed(4)}`;

      // Kiểm tra xem có kết quả trong cache không
      const cachedResults = apiCache.get("autocomplete", cacheKey);

      // Nếu có kết quả trong cache, sử dụng nó
      if (cachedResults) {
        console.log("Sử dụng kết quả từ cache:", cachedResults);

        // Cập nhật state với kết quả từ cache
        setSuggestions(cachedResults);

        // Mở popover nếu có kết quả
        if (cachedResults.length > 0) {
          setPopoverOpen(true);
        }

        // Kết thúc trạng thái đang tải
        setSearchLoading(false);
        return;
      }

      // Không có kết quả trong cache, tiến hành gọi API

      // Sử dụng tọa độ hiện tại làm điểm tập trung để có kết quả tốt hơn
      const focusPoint = `${mapCoordinates.latitude},${mapCoordinates.longitude}`;

      console.log("Gọi API tìm kiếm với:", value, "và focus:", focusPoint);

      // Gọi API tự động hoàn thành của Vietmap
      const response = await fetch(
        `https://maps.vietmap.vn/api/autocomplete/v3?apikey=${
          SeccretKey.VIET_MAP_KEY
        }&text=${encodeURIComponent(value)}&focus=${focusPoint}`
      );

      // Kiểm tra phản hồi từ API
      if (!response.ok) {
        throw new Error(
          `Yêu cầu API thất bại với mã trạng thái ${response.status}`
        );
      }

      // Phân tích phản hồi JSON
      const results = await response.json();
      console.log("Phản hồi API:", results);

      // Kiểm tra xem có kết quả không
      if (!results || !Array.isArray(results) || results.length === 0) {
        console.log("Không có kết quả từ API");
        setSuggestions([]);
        setPopoverOpen(false);
        setSearchLoading(false);
        return;
      }

      // Chuyển đổi kết quả API thành định dạng phù hợp cho UI
      const formattedResults = results.map((item, index) => {
        // Đảm bảo các trường cần thiết tồn tại
        const name = item.name || "Không có tên";
        const address = item.address || "";
        const refId = item.ref_id || "";

        return {
          label: `${name}, ${address}`,
          value: `${name}, ${address}`,
          key: `suggestion-${index}`, // Sử dụng key duy nhất
          refId: refId,
        };
      });

      console.log("Kết quả đã định dạng:", formattedResults);

      // Lưu kết quả vào cache
      if (formattedResults.length > 0) {
        apiCache.set("autocomplete", cacheKey, formattedResults);
      }

      // Chỉ kiểm tra xem component còn được mount không, không kiểm tra query
      if (isMounted.current) {
        console.log("Cập nhật state với kết quả mới");

        // Cập nhật state với kết quả mới
        setSuggestions(formattedResults);

        // Mở popover nếu có kết quả
        if (formattedResults.length > 0) {
          setPopoverOpen(true);
        } else {
          setPopoverOpen(false);
        }
      }
    } catch (error) {
      // Xử lý lỗi
      console.error("Lỗi khi tìm kiếm địa điểm:", error);

      // Chỉ kiểm tra xem component còn được mount không
      if (isMounted.current) {
        setSearchError("Không thể tìm kiếm địa điểm. Vui lòng thử lại sau.");
        message.error("Không thể tìm kiếm địa điểm. Vui lòng thử lại sau.");
      }
    } finally {
      // Kết thúc trạng thái đang tải nếu component vẫn được mount
      if (isMounted.current) {
        setSearchLoading(false);
      }
    }
  };

  // Create a debounced version of the search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      performSearch(value);
    }, 500),
    [mapCoordinates] // Re-create when map coordinates change
  );

  const handleSearch = (value: string) => {
    console.log("Search input changed:", value);
    setSearchValue(value);

    // Call the debounced search function
    debouncedSearch(value);
  };

  // Get place details by ref_id and update coordinates
  const handleSelectLocation = async (value: string, option: any) => {
    try {
      console.log("Selected option:", option);
      setSearchLoading(true);
      setPopoverOpen(false);
      const refId = option.refId;

      // Check cache first
      const cachedPlace = apiCache.get("place", refId);
      let placeDetails: VietmapPlaceResult;

      if (cachedPlace) {
        console.log("Using cached place details");
        placeDetails = cachedPlace;
      } else {
        // Fetch place details using the ref_id
        const response = await fetchWithRetry(
          `https://maps.vietmap.vn/api/place/v3?apikey=${SeccretKey.VIET_MAP_KEY}&refid=${refId}`
        );

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        placeDetails = (await response.json()) as VietmapPlaceResult;

        // Cache the place details
        apiCache.set("place", refId, placeDetails);
      }

      // Update coordinates with the place details
      const newCoords = {
        latitude: placeDetails.lat,
        longitude: placeDetails.lng,
      };

      setMapCoordinates(newCoords);

      // Update form values
      form.setFieldsValue({
        latitude: placeDetails.lat,
        longitude: placeDetails.lng,
        name: placeDetails.name || value.split(",")[0].trim(),
        // Optionally set district if it matches your district data
        districtId: districts.find((d) => d.name === placeDetails.district)?.id,
      });

      // Update marker position if map is initialized
      if (mapRef.current && markerRef.current) {
        markerRef.current.setLngLat([placeDetails.lng, placeDetails.lat]);
        mapRef.current.flyTo({
          center: [placeDetails.lng, placeDetails.lat],
          zoom: 16,
          essential: true,
        });
      }

      message.success("Đã tìm thấy địa điểm");
    } catch (error) {
      console.error("Error fetching place details:", error);
      message.error("Không thể lấy thông tin địa điểm. Vui lòng thử lại sau.");
    } finally {
      if (isMounted.current) {
        setSearchLoading(false);
      }
    }
  };

  // Safe map removal function
  const safeRemoveMap = () => {
    try {
      if (mapRef.current) {
        // Remove all event listeners first
        if (mapRef.current.off) {
          mapRef.current.off("load");
          mapRef.current.off("click");
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

  // Tạo bản đồ
  useEffect(() => {
    // Only initialize map after location data is loaded
    if (locationLoading) return;

    // Delay map initialization to ensure DOM is ready
    const initializeMap = () => {
      const mapContainer = document.getElementById("map");
      if (!mapContainer) {
        console.error("Map container not found");
        return;
      }

      console.log("Initializing map with container:", mapContainer);

      // Cleanup previous map instance safely
      safeRemoveMap();

      // Create map with error handling
      try {
        // Set explicit dimensions on the container
        mapContainer.style.width = "100%";
        mapContainer.style.height = "400px";

        console.log("Creating map with coordinates:", mapCoordinates);
        mapRef.current = new VietmapGL.Map({
          container: "map",
          style: `https://maps.vietmap.vn/mt/tm/style.json?apikey=${SeccretKey.VIET_MAP_KEY}`,
          center: [mapCoordinates.longitude, mapCoordinates.latitude],
          zoom: 14,
          minZoom: 5,
          maxZoom: 18,
          pitch: 0,
          bearing: 0,
          interactive: false,
        });

        // Add navigation control
        mapRef.current.addControl(
          new VietmapGL.NavigationControl(),
          "top-right"
        );

        // Add geolocate control
        mapRef.current.addControl(
          new VietmapGL.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
          }),
          "top-right"
        );

        // Wait for map to load before adding marker
        mapRef.current.on("load", () => {
          console.log("Map loaded successfully");
          setMapInitialized(true);
          mapInitializedRef.current = true;

          // Create marker
          markerRef.current = new VietmapGL.Marker({
            draggable: true, // Allow dragging to set position
          })
            .setLngLat([mapCoordinates.longitude, mapCoordinates.latitude])
            .addTo(mapRef.current);

          // Update coordinates when marker is dragged
          markerRef.current.on("dragend", () => {
            const lngLat = markerRef.current.getLngLat();
            const newCoords = {
              latitude: lngLat.lat,
              longitude: lngLat.lng,
            };
            setMapCoordinates(newCoords);
            form.setFieldsValue({
              latitude: lngLat.lat,
              longitude: lngLat.lng,
            });
          });
        });

        // Handle click on map to set marker
        mapRef.current.on("click", (e: any) => {
          const { lng, lat } = e.lngLat;
          setMapCoordinates({ latitude: lat, longitude: lng });
          form.setFieldsValue({
            latitude: lat,
            longitude: lng,
          });
          if (markerRef.current) {
            markerRef.current.setLngLat([lng, lat]);
          }
        });

        // Handle error events
        mapRef.current.on("error", (e: any) => {
          console.error("Map error:", e);
        });
      } catch (error) {
        console.error("Error initializing map:", error);
        message.error("Không thể khởi tạo bản đồ. Vui lòng làm mới trang.");
      }
    };

    // Delay initialization slightly to ensure DOM is ready
    const timeoutId = setTimeout(initializeMap, 500);

    return () => {
      clearTimeout(timeoutId);
      safeRemoveMap();
    };
  }, [locationLoading, mapCoordinates.latitude, mapCoordinates.longitude]);

  // Ghi vị trí mới khi người dùng thay đổi tọa độ
  useEffect(() => {
    if (mapRef.current && markerRef.current && mapInitializedRef.current) {
      console.log("Updating map position to:", mapCoordinates);
      mapRef.current.flyTo({
        center: [mapCoordinates.longitude, mapCoordinates.latitude],
        zoom: 14,
        essential: true,
      });
      markerRef.current.setLngLat([
        mapCoordinates.longitude,
        mapCoordinates.latitude,
      ]);
    }
  }, [mapCoordinates]);

  // Cập nhật trạng thái popover khi có kết quả tìm kiếm
  useEffect(() => {
    if (suggestions.length > 0) {
      setPopoverOpen(true);
    }
  }, [suggestions]);

  if (locationLoading) {
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
                <BreadcrumbLink href="/locations/table">
                  Danh sách địa điểm
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Chỉnh sửa địa điểm</BreadcrumbPage>
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
  }

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
              <BreadcrumbLink href="/locations/list">
                Danh sách địa điểm
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Chỉnh sửa địa điểm</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="p-1 flex flex-1 flex-col gap-4 items-center w-full h-fit">
        <Form
          layout="vertical"
          form={form} // Ensure the form instance is passed here
          onFinish={onFinish}
          style={{ maxWidth: 1200 }}
          className="bg-white w-full p-6 rounded-lg shadow-md"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              <Form.Item
                label="Tìm kiếm địa điểm"
                extra={
                  searchError ||
                  "Nhập tên địa điểm để tìm kiếm và tự động điền tọa độ"
                }
                validateStatus={searchError ? "error" : undefined}
              >
                <div className="relative">
                  <Popover open={popoverOpen}>
                    <PopoverTrigger asChild>
                      <div className="w-full">
                        <div className="relative w-full">
                          <Input
                            placeholder="Nhập tên địa điểm để tìm kiếm"
                            value={searchValue}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pr-10"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {searchLoading && (
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[var(--radix-popover-trigger-width)] p-0"
                      align="start"
                    >
                      <Command>
                        <CommandEmpty>Không tìm thấy kết quả</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            {suggestions.map((suggestion) => (
                              <CommandItem
                                key={suggestion.key}
                                onSelect={() => {
                                  setSearchValue(suggestion.value);
                                  handleSelectLocation(
                                    suggestion.value,
                                    suggestion
                                  );
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    searchValue === suggestion.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {suggestion.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {!searchLoading && suggestions.length > 0 && !popoverOpen && (
                    <div className="py-2 px-3 text-center text-green-600">
                      Tìm thấy {suggestions.length} kết quả
                    </div>
                  )}
                </div>
              </Form.Item>

              <Form.Item
                label="Tên địa điểm"
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên địa điểm!" },
                ]}
              >
                <Input placeholder="Nhập tên địa điểm"/>
              </Form.Item>

              {/* Map */}
              <div className="mb-4">
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
                      <Spin
                        indicator={
                          <LoadingOutlined style={{ fontSize: 24 }} spin />
                        }
                      />
                      <span className="ml-2">Đang tải bản đồ...</span>
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Nhấp vào bản đồ hoặc kéo điểm đánh dấu để điều chỉnh vị trí
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  label="Vĩ độ"
                  name="latitude"
                  rules={[{ required: true, message: "Vui lòng nhập vĩ độ!" }]}
                >
                  <InputNumber
                    placeholder="Vĩ độ"
                    style={{ width: "100%" }}
                    onChange={(value) => {
                      if (value !== null) {
                        const newCoords = {
                          ...mapCoordinates,
                          latitude: Number(value),
                        };
                        setMapCoordinates(newCoords);
                      }
                    }}
                    precision={7}
                  />
                </Form.Item>

                <Form.Item
                  label="Kinh độ"
                  name="longitude"
                  rules={[
                    { required: true, message: "Vui lòng nhập kinh độ!" },
                  ]}
                >
                  <InputNumber
                    placeholder="Kinh độ"
                    style={{ width: "100%" }}
                    onChange={(value) => {
                      if (value !== null) {
                        if (typeof value === "number") {
                          const newCoords = {
                            ...mapCoordinates,
                            longitude: value,
                          };
                          setMapCoordinates(newCoords);
                        }
                      }
                    }}
                    precision={7} 
                  />
                </Form.Item>
              </div>
            </div>
            {/* Right Column */}
            <div>
              <Form.Item
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
              >
                <Input.TextArea placeholder="Nhập mô tả ngắn gọn" rows={4} />
              </Form.Item>

              <Form.Item
                label="Nội dung"
                name="content"
                rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
              >
                <Input.TextArea placeholder="Nhập nội dung chi tiết" rows={6} />
              </Form.Item>

              <Form.Item
                label="Loại địa điểm"
                name="typeLocationId"
                rules={[
                  { required: true, message: "Vui lòng chọn loại địa điểm!" },
                ]}
              >
                <Select
                  onValueChange={(value) =>
                    form.setFieldsValue({ typeLocationId: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn loại địa điểm" />
                  </SelectTrigger>
                  <SelectContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="ml-2">Đang tải...</span>
                      </div>
                    ) : (
                      typeLocations.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </Form.Item>

              <Form.Item
                label="Quận/Huyện"
                name="districtId"
                rules={[
                  { required: true, message: "Vui lòng chọn quận/huyện!" },
                ]}
              >
                <Select
                  onValueChange={(value) =>
                    form.setFieldsValue({ districtId: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn quận/huyện" />
                  </SelectTrigger>
                  <SelectContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="ml-2">Đang tải...</span>
                      </div>
                    ) : (
                      districts.map((district) => (
                        <SelectItem
                          key={district.id}
                          value={district.id.toString()}
                        >
                          {district.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </Form.Item>

              <Form.Item
                label="Xếp hạng di tích"
                name="heritageRank"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn xếp hạng di tích!",
                  },
                ]}
              >
                <Select
                  onValueChange={(value) =>
                    form.setFieldsValue({ heritageRank: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn xếp hạng di tích" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Di tích cấp tỉnh</SelectItem>
                    <SelectItem value="2">Di tích cấp quốc gia</SelectItem>
                    <SelectItem value="3">Di tích Quốc gia Đặc biệt</SelectItem>
                  </SelectContent>
                </Select>
              </Form.Item>

              {/* Existing Thumbnail */}
              {existingThumbnail && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Hình ảnh Thumbnail hiện tại
                  </label>
                  <div className="relative w-24 h-24 border rounded-md overflow-hidden">
                    <img
                      src={existingThumbnail || "/placeholder.svg"}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <Form.Item
                label="Cập nhật Thumbnail"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  accept="image/*"
                  listType="picture-card"
                  beforeUpload={() => false}
                  onChange={handleThumbnailChange}
                  showUploadList={{
                    showRemoveIcon: true,
                    showPreviewIcon: false,
                  }}
                  maxCount={1}
                >
                  <button
                    style={{
                      color: "inherit",
                      cursor: "inherit",
                      border: 0,
                      background: "none",
                    }}
                    type="button"
                  >
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Cập nhật Thumbnail</div>
                  </button>
                </Upload>
              </Form.Item>

              {/* Existing Media */}
              {existingMedia.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Hình ảnh hiện tại
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {existingMedia
                      .filter((media) => !media.isThumbnail)
                      .map((media) => (
                        <div
                          key={media.id || media.mediaUrl} // Ensure a unique key
                          className="relative group"
                        >
                          <img
                            src={media.mediaUrl || "/placeholder.svg"}
                            alt="Media"
                            className="w-full h-24 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingMedia(media.mediaUrl)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <span className="sr-only">Xóa</span>×
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <Form.Item
                label="Tải lên hình ảnh/video mới"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  multiple
                  listType="picture-card"
                  beforeUpload={() => false}
                  onChange={handleFileChange}
                >
                  <button
                    style={{
                      color: "inherit",
                      cursor: "inherit",
                      border: 0,
                      background: "none",
                    }}
                    type="button"
                  >
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Tải lên</div>
                  </button>
                </Upload>
              </Form.Item>
            </div>
          </div>

          <div className="flex gap-4 justify-end mt-6">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/locations/table")}
            >
              Hủy
            </Button>
            <Button
              variant="default"
              type="submit"
              className="bg-blue-500 text-white"
            >
              Cập nhật
            </Button>
          </div>
        </Form>
      </div>
    </SidebarInset>
  );
}

export default EditLocation;
