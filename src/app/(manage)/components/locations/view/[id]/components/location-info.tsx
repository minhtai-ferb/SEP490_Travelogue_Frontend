"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, DollarSign } from "lucide-react";

interface LocationInfoProps {
  openTime: string;
  closeTime: string;
  latitude: number;
  longitude: number;
  districtName: string;
  minPrice?: number;
  maxPrice?: number;
}

export function LocationInfo({
  openTime,
  closeTime,
  latitude,
  longitude,
  districtName,
  minPrice = 0,
  maxPrice = 0,
}: LocationInfoProps) {
  const formatTime = (time?: string) => {
    if (!time) return "Không rõ";
    return time.slice(0, 5); 
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getPriceDisplay = () => {
    if (minPrice === 0 && maxPrice === 0) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <DollarSign className="w-3 h-3 mr-1" />
          Miễn phí
        </Badge>
      );
    } else if (minPrice === maxPrice) {
      return (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="font-semibold text-green-700">{formatPrice(minPrice)}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="font-semibold text-green-700">
            {formatPrice(minPrice)} - {formatPrice(maxPrice)}
          </span>
        </div>
      );
    }
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
        {/* Price Range */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <p className="font-medium text-gray-900">Khoảng giá tham khảo</p>
          </div>
          <div className="mb-2">
            {getPriceDisplay()}
          </div>
          <p className="text-xs text-muted-foreground">
            💡 Giá có thể thay đổi theo thời điểm và dịch vụ
          </p>
        </div>

        <Separator />

        {/* Operating Hours */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <p className="font-medium text-gray-900">Giờ hoạt động</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Mở cửa:</span>
            <span className="font-medium text-blue-700">{formatTime(openTime)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Đóng cửa:</span>
            <span className="font-medium text-blue-700">{formatTime(closeTime)}</span>
          </div>
        </div>

        <Separator />

        {/* Coordinates */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-purple-600" />
            <p className="font-medium text-gray-900">Tọa độ & Vị trí</p>
          </div>
          
          <div className="space-y-2 mb-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Vĩ độ:</span>
              <span className="text-sm font-mono font-medium">{latitude.toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Kinh độ:</span>
              <span className="text-sm font-mono font-medium">{longitude.toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Khu vực:</span>
              <span className="text-sm font-medium text-purple-700">{districtName}</span>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={openGoogleMaps}
            className="w-full bg-white hover:bg-purple-50 border-purple-200"
          >
            📍 Xem trên Google Maps
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
