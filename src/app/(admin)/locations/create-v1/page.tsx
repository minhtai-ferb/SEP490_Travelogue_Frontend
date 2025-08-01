"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Form, Input, InputNumber, Upload, message, Spin } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { useDistrictManager } from "@/services/district-manager";
import { useLocationController } from "@/services/location-controller";
import type { District } from "@/types/District";
import type { TypeLocation } from "@/types/Location";
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
import { useRouter } from "next/navigation";
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

function CreateNewLocation() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [typeLocations, setTypeLocations] = useState<TypeLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const { getAllDistrict } = useDistrictManager();
  const {
    getAllTypeLocation,
    createLocation,
    uploadLocationMedia,
    uploadThumbnail,
  } = useLocationController();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
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

  // Add map and marker refs to maintain references
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const mapInitializedRef = useRef(false);

  const router = useRouter();
  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  //Lấy dữ liệu để tạo mới địa điểm
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

  //Tạo mới địa điểm
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      //Chỉnh sữa lại giá trị heritageRank thành number
      values.heritageRank = Number(values.heritageRank);
      const locationData = await createLocation(values);
      if (!locationData) {
        message.error("Failed to create location.");
        return;
      }
      if (uploadedFiles.length > 0) {
        await uploadLocationMedia(locationData.id, uploadedFiles);
      }
      if (thumbnailFile) {
        await uploadThumbnail(locationData.id, thumbnailFile);
      }
      router.push("/locations/table");
      message.success("Location created successfully!");
    } catch (error) {
      message.error("Failed to create location.");
    } finally {
      setLoading(false);
    }
  };

  //Kiểm soát file Upload
  const handleFileChange = (info: any) => {
    const files = info.fileList.map((file: any) => file.originFileObj);
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
        `https://maps.vietmap.vn/api/autocomplete/v3?apikey=${SeccretKey.VIET_MAP_KEY
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
        setSearchLoading(true);
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
          zoom: 8,
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
  }, []);

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

  // if () {
  //   <SidebarInset>
  //     <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
  //       <SidebarTrigger className="-ml-1" />
  //       <Separator orientation="vertical" className="mr-2 h-4" />
  //       <Breadcrumb>
  //         <BreadcrumbList>
  //           <BreadcrumbItem className="hidden md:block">
  //             <BreadcrumbLink href="#">Quản lý địa điểm</BreadcrumbLink>
  //           </BreadcrumbItem>
  //           <BreadcrumbSeparator className="hidden md:block" />
  //           <BreadcrumbItem>
  //             <BreadcrumbLink href="/locations/list">
  //               Danh sách địa điểm
  //             </BreadcrumbLink>
  //           </BreadcrumbItem>
  //           <BreadcrumbSeparator className="hidden md:block" />
  //           <BreadcrumbItem>
  //             <BreadcrumbPage>Tạo mới địa điểm</BreadcrumbPage>
  //           </BreadcrumbItem>
  //         </BreadcrumbList>
  //       </Breadcrumb>
  //     </header>
  //     <div className="flex items-center justify-center h-[calc(100vh-64px)]">
  //       <Spin size="large" />
  //       <span className="ml-2">Đang tải thông tin địa điểm...</span>
  //     </div>
  //   </SidebarInset>;
  // }
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
              <BreadcrumbPage>Tạo mới địa điểm</BreadcrumbPage>
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
                  {/* <Popover open={popoverOpen} onOpenChange={setPopoverOpen}> */}
                  <Popover open={popoverOpen}>
                    <PopoverTrigger asChild>
                      <div className="w-full">
                        <div className="relative w-full">
                          <Input
                            placeholder="Nhập tên địa điểm để tìm kiếm"
                            value={searchValue}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pr-10"
                          // onFocus={() => {
                          //   if (suggestions.length > 0) {
                          //     setPopoverOpen(true);
                          //   }
                          // }}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {searchLoading ?? (
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            )}
                            {/* // : (
                            //   <Search className="h-4 w-4 text-muted-foreground" />
                            // )} */}
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
                <Input placeholder="Nhập tên địa điểm" />
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
                  defaultValue={form.getFieldValue("typeLocationId")}
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
                  defaultValue={form.getFieldValue("districtId")}
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
                  value={form.getFieldValue("heritageRank")} // Gán giá trị hiện tại vào value
                  onValueChange={(value) =>
                    form.setFieldsValue({ heritageRank: value })
                  } // Khi thay đổi, cập nhật giá trị vào form
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn xếp hạng di tích" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key={1} value="1">
                      Di tích cấp tỉnh
                    </SelectItem>
                    <SelectItem key={2} value="2">
                      Di tích cấp quốc gia
                    </SelectItem>
                    <SelectItem key={3} value="3">
                      Di tích Quốc gia Đặc biệt
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Form.Item>

              <Form.Item
                label="Hình ảnh Thumbnail"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  accept="image/*"
                  listType="picture-card"
                  beforeUpload={() => false} // Ngừng upload ngay lập tức, chỉ cần lưu lại hình ảnh chọn
                  onChange={handleThumbnailChange}
                  showUploadList={{
                    showRemoveIcon: true,
                    showPreviewIcon: false,
                  }}
                  maxCount={1} // Giới hạn chỉ một hình ảnh
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
                    <div style={{ marginTop: 8 }}>Tải lên Thumbnail</div>
                  </button>
                </Upload>
              </Form.Item>

              <Form.Item
                label="Tải lên hình ảnh/video"
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

          <Form.Item>
            <Button
              variant="default"
              type="submit"
              className="w-full"
              disabled={loading}

            >
              Tạo mới
            </Button>
          </Form.Item>
        </Form>
      </div>
    </SidebarInset>
  );
}

export default CreateNewLocation;
