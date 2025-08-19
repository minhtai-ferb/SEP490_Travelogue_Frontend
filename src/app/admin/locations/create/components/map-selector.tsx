"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Navigation } from "lucide-react";
import VietmapGL from "@/components/vietmap-gl";
import { SeccretKey } from "@/secret/secret";
import { AddressSearchInput } from "./address-search-input";

interface MapSelectorProps {
  address: string;
  latitude: number;
  longitude: number;
  center: [latitude: number, longitude: number];
  onChange: (lat: number, lng: number) => void;
}

export function MapSelector({
  address,
  latitude,
  longitude,
  center,
  onChange,
}: MapSelectorProps) {
  const [searchAddress, setSearchAddress] = useState(address);
  const [manualMode, setManualMode] = useState(false);
  const [error, setError] = useState<string | null>(null)
  const provinceBounds: [[number, number], [number, number]] = [
    [105.811944, 10.952222],
    [106.38, 11.776667],
  ];

  // Create markers array with current location
  const markers =
    latitude && longitude
      ? [
        {
          lngLat: [longitude, latitude] as [number, number],
          popupHTML: `
        <div class="p-3 max-w-xs">
          <div class="flex items-start gap-2 mb-2">
            <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div class="flex-1">
              <div class="font-semibold text-sm text-gray-900 mb-1">
                ${searchAddress || "Vị trí đã chọn"}
              </div>
              <div class="text-xs text-gray-600 mb-2">
                📍 ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
              </div>
              <div class="text-xs text-blue-600">
                <span class="inline-flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Địa điểm được chọn
                </span>
              </div>
            </div>
          </div>
        </div>
      `,
          popupOptions: {
            anchor: "bottom" as const,
            closeButton: true,
            closeOnClick: false,
            maxWidth: "300px",
            className: "custom-popup",
          },
        },
      ]
      : [];

  const handleAddressChange = (address: string, lat: number, lng: number) => {
    console.log("Address changed:", { address, lat, lng });
    setSearchAddress(address);
    onChange(lat, lng);
  };

  // Update search address when prop changes
  useEffect(() => {
    setSearchAddress(address);
  }, [address]);

  return (
    <div className="space-y-6">
      {/* Manual Mode Toggle */}
      <div className="flex items-center space-x-2">
        {/* <Checkbox
          id="manualMode"
          checked={manualMode}
          onCheckedChange={(checked) => setManualMode(!!checked)}
        /> */}
        <Label
          htmlFor="manualMode"
          className="text-sm font-medium cursor-pointer"
        >
          Tự nhập tọa độ thủ công
        </Label>
      </div>

      {/* Address Search */}
      {!manualMode && (
        <div className="space-y-2">
          {/* <Label className="text-sm font-medium flex items-center gap-2">
            <Navigation className="h-4 w-4 text-blue-500" />
            Tìm kiếm địa chỉ
          </Label> */}
          <AddressSearchInput
            value={searchAddress}
            latitude={latitude}
            longitude={longitude}
            onChange={handleAddressChange}
            onError={(msg) => setError(msg)}
            placeholder="Nhập địa chỉ để tìm kiếm trên bản đồ (ví dụ: Tây Ninh, Núi Bà Đen...)"
          />
          {error && <div className="text-xs text-red-500">{error}</div>}
          {/* <p className="text-xs text-gray-500 flex items-center gap-1">
            <span>💡</span>
            Nhập ít nhất 2 ký tự để bắt đầu tìm kiếm và chọn từ danh sách gợi ý
          </p> */}
        </div>
      )}

      {/* Manual Address Input */}
      {manualMode && (
        // <div className="space-y-2">
        //   <Label htmlFor="manual-address" className="text-sm font-medium">
        //     Địa chỉ thủ công
        //   </Label>
        //   <Input
        //     id="manual-address"
        //     value={searchAddress}
        //     onChange={(e) => setSearchAddress(e.target.value)}
        //     placeholder="Nhập địa chỉ thủ công"
        //     className="border-2 border-gray-200 focus:border-blue-500"
        //   />
        // </div>
        <></>
      )}

      {/* Manual Coordinates Input */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude" className="text-sm font-medium">
            Vĩ độ (Latitude)
          </Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={latitude || ""}
            onChange={(e) =>
              onChange(Number.parseFloat(e.target.value) || 0, longitude)
            }
            placeholder="VD: 11.314528"
            disabled={!manualMode}
            className={`border-2 transition-colors ${!manualMode
              ? "bg-gray-50 border-gray-200 text-gray-500"
              : "border-gray-200 focus:border-blue-500"
              }`}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude" className="text-sm font-medium">
            Kinh độ (Longitude)
          </Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={longitude || ""}
            onChange={(e) =>
              onChange(latitude, Number.parseFloat(e.target.value) || 0)
            }
            placeholder="VD: 106.086614"
            disabled={!manualMode}
            className={`border-2 transition-colors ${!manualMode
              ? "bg-gray-50 border-gray-200 text-gray-500"
              : "border-gray-200 focus:border-blue-500"
              }`}
          />
        </div>
      </div> */}

      {/* Empty state when no coordinates */}
      {/* {(
        latitude === null ||
        latitude === undefined ||
        longitude === null ||
        longitude === undefined ||
        latitude === 0 ||
        longitude === 0
      ) && (
          <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
            <div className="text-sm text-amber-800">
              Không tìm thấy tọa độ phù hợp từ VietMap cho địa chỉ đã nhập.
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={() => setManualMode(true)}>
                Bật chế độ thủ công
              </Button>
              <Button variant="outline" size="sm" onClick={handleUseCurrentLocation}>
                Dùng vị trí hiện tại
              </Button>   
            </div>
          </div>
        )} */}

      {/* Current Location Display */}
      {latitude !== null &&
        latitude !== undefined &&
        longitude !== null &&
        longitude !== undefined &&
        latitude !== 0 &&
        longitude !== 0 && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-blue-800 mb-1">
                  📍 Vị trí hiện tại
                </div>
                <div className="text-sm text-blue-700 mb-2">
                  <strong>Tọa độ:</strong> {latitude.toFixed(6)},{" "}
                  {longitude.toFixed(6)}
                </div>
                {searchAddress && (
                  <div className="text-sm text-green-700 bg-white/50 rounded px-2 py-1">
                    <strong>Địa chỉ:</strong> {searchAddress}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      {/* Map Display */}
      <Card className="overflow-hidden shadow-lg">
        <div className="h-80 bg-gray-100 relative">
          <VietmapGL
            center={[longitude || 106.086614, latitude || 11.314528]}
            zoom={latitude && longitude ? 16 : 10}
            apiKey={SeccretKey.VIET_MAP_KEY || ""}
            markers={markers}
            height="100%"
            bounds={latitude && longitude ? undefined : provinceBounds}
            onMapClick={(e) => {
              if (manualMode) {
                const { lng, lat } = e.lngLat;
                onChange(lat, lng);
                console.log("Map clicked:", { lat, lng });
              }
            }}
          />

          {/* Map overlay info */}
          {latitude && longitude && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
              <div className="text-xs font-medium text-gray-700">
                🎯 Zoom: {latitude && longitude ? "16x" : "10x"}
              </div>
            </div>
          )}

          {manualMode && (
            <div className="absolute bottom-3 left-3 bg-blue-500/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
              <div className="text-xs font-medium text-white">
                👆 Click trên bản đồ để chọn vị trí
              </div>
            </div>
          )}

          {(!latitude || !longitude || latitude === 0 || longitude === 0) && !manualMode && (
            <div className="absolute bottom-3 left-3 bg-amber-500/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
              <div className="text-xs font-medium text-white">
                Không có tọa độ. Bật chế độ thủ công hoặc dùng vị trí hiện tại.
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Usage Instructions */}
      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-4 space-y-2">
        <p className="font-semibold text-gray-700 flex items-center gap-2">
          <span>💡</span>
          Hướng dẫn sử dụng:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-6">
          <li>
            <strong>Tìm kiếm thông minh:</strong> Nhập địa chỉ để xem gợi ý từ
            VietMap API
          </li>
          <li>
            <strong>Chọn từ gợi ý:</strong> Click vào địa chỉ để tự động cập
            nhật tọa độ
          </li>
          <li>
            <strong>Xem trên bản đồ:</strong> Marker sẽ hiển thị vị trí với
            popup thông tin chi tiết
          </li>
        </ul>
      </div>
    </div>
  );
}
