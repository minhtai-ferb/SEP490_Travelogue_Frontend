"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, MapPin } from "lucide-react";

interface LocationInfoProps {
  openTime: string;
  closeTime: string;
  latitude: number;
  longitude: number;
  districtName: string;
}

export function LocationInfo({
  openTime,
  closeTime,
  latitude,
  longitude,
  districtName,
}: LocationInfoProps) {
  const formatTime = (time?: string) => {
    if (!time) return "Không rõ";
    return time.slice(0, 5); 
  };

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, "_blank");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Thông tin địa điểm
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Operating Hours */}
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-gray-500" />
          <div>
            <p className="font-medium">Giờ mở cửa</p>
            <p className="text-sm text-gray-600">
              {formatTime(openTime)} - {formatTime(closeTime)}
            </p>
          </div>
        </div>

        <Separator />

        {/* Coordinates */}
        <div className="space-y-2">
          <p className="font-medium">Tọa độ</p>
          <p className="text-sm text-gray-600">Lat: {latitude.toFixed(6)}</p>
          <p className="text-sm text-gray-600">Lng: {longitude.toFixed(6)}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={openGoogleMaps}
            className="w-full bg-transparent"
          >
            Xem trên Google Maps
          </Button>
        </div>

        <Separator />

        {/* District Info */}
        <div>
          <p className="font-medium">Khu vực</p>
          <p className="text-sm text-gray-600">{districtName}</p>
        </div>
      </CardContent>
    </Card>
  );
}
