"use client";

import { useState, useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import { useLocations } from "@/services/use-locations";
import { Location } from "@/types/Tour";

interface LocationSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  onLocationChange?: (location: Location | null) => void;
  showSearch?: boolean;
}

export function LocationSelect({
  value,
  onValueChange,
  placeholder = "Chọn địa điểm",
  label = "Địa điểm",
  required = false,
  disabled = false,
  onLocationChange,
  showSearch = true,
}: LocationSelectProps) {
  const { searchAllLocations, getLocationById } = useLocations();

  const [locations, setLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debounced = useDebounce(searchTerm, 500);

  // loading cục bộ để không ảnh hưởng trigger
  const [loadingList, setLoadingList] = useState(false);

  // chống race-condition
  const reqIdRef = useRef(0);

  useEffect(() => {
    let mounted = true;
    const doFetch = async () => {
      setLoadingList(true);
      const myReqId = ++reqIdRef.current;
      try {
        const res = await searchAllLocations({
          title: debounced || undefined,
          pageNumber: 1,
          pageSize: 5,
        });

        // chỉ set nếu response là mới nhất & component còn mounted
        if (mounted && myReqId === reqIdRef.current) {
          // nếu API trả undefined, giữ nguyên list cũ để tránh nhấp nháy
          if (res?.data) setLocations(res.data);
        }
      } catch (e) {
        if (mounted) toast.error("Không thể tải danh sách địa điểm");
        console.error(e);
      } finally {
        if (mounted && myReqId === reqIdRef.current) setLoadingList(false);
      }
    };
    doFetch();
    return () => {
      mounted = false;
    };
  }, [debounced, searchAllLocations]);

  const handleValueChange = (selectedValue: string) => {
    onValueChange(selectedValue);
    if (onLocationChange) {
      const selectedLocation =
        locations.find((loc) => loc.id === selectedValue) || null;
      onLocationChange(selectedLocation);
    }
  };

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    const fetchSelectedLocation = async (id: string) => {
      try {
        const location = await getLocationById(id);
        setSelectedLocation(location);
      } catch (error) {
        console.error("Error fetching location:", error);
        setSelectedLocation(null);
      }
    };
    
    if (value) {
      // Kiểm tra xem location đã có trong danh sách chưa
      const existingLocation = locations.find((loc) => loc.id === value);
      if (existingLocation) {
        setSelectedLocation(existingLocation);
      } else {
        // Nếu chưa có, fetch từ API
        fetchSelectedLocation(value as string);
      }
    } else {
      setSelectedLocation(null);
    }
  }, [value, locations, getLocationById]);

  return (
    <div className="space-y-2">
      <Label htmlFor="location">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      <Select
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger className="min-w-[280px]">
          {/* Trigger luôn ổn định, không render spinner ở đây */}
          <SelectValue placeholder={placeholder}>
            {selectedLocation ? (
              <div className="flex flex-col items-start">
                <span className="font-medium">{selectedLocation.name}</span>
                {selectedLocation.category && (
                  <span className="text-xs text-muted-foreground">
                    Loại địa điểm du lịch: {selectedLocation.category}
                  </span>
                )}
              </div>
            ) : null}
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          {showSearch && (
            <div className="flex items-center border-b px-3 pb-2 mb-2">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input
                placeholder="Tìm kiếm địa điểm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 border-0 p-0 focus-visible:ring-0"
              />
            </div>
          )}

          {loadingList && locations.length === 0 ? (
            <div className="px-4 py-2 text-sm text-muted-foreground flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Đang tải địa điểm...
            </div>
          ) : locations.length === 0 ? (
            <div className="px-4 py-2 text-sm text-muted-foreground text-center">
              Không có địa điểm nào
            </div>
          ) : (
            <>
              {loadingList && (
                <div className="px-4 py-1 text-xs text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Đang cập nhật kết quả...
                </div>
              )}
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{location.name}</span>
                    {location.category && (
                      <span className="text-xs text-muted-foreground">
                        Loại địa điểm du lịch: {location.category}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
