"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, TrendingUp } from "lucide-react";

interface PriceRangeProps {
  minPrice: number;
  maxPrice: number;
  onChange: (minPrice: number, maxPrice: number) => void;
  className?: string;
  errors?: {
    minPrice?: string;
    maxPrice?: string;
  };
}

export function PriceRange({ minPrice, maxPrice, onChange, className, errors }: PriceRangeProps) {
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onChange(value, maxPrice);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onChange(minPrice, value);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Khoảng giá
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minPrice" className="text-sm font-medium">
              Giá thấp nhất (VNĐ)
            </Label>
            <Input
              id="minPrice"
              type="number"
              value={minPrice}
              onChange={handleMinPriceChange}
              placeholder="0"
              min="0"
              step="1000"
              className={`text-right ${errors?.minPrice ? "border-red-500" : ""}`}
            />
            {errors?.minPrice ? (
              <div className="text-xs text-red-500">{errors.minPrice}</div>
            ) : null}
            <p className="text-xs text-muted-foreground">
              {minPrice > 0 ? formatPrice(minPrice) : "Miễn phí"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxPrice" className="text-sm font-medium">
              Giá cao nhất (VNĐ)
            </Label>
            <Input
              id="maxPrice"
              type="number"
              value={maxPrice}
              onChange={handleMaxPriceChange}
              placeholder="0"
              min="0"
              step="1000"
              className={`text-right ${errors?.maxPrice ? "border-red-500" : ""}`}
            />
            {errors?.maxPrice ? (
              <div className="text-xs text-red-500">{errors.maxPrice}</div>
            ) : null}
            <p className="text-xs text-muted-foreground">
              {maxPrice > 0 ? formatPrice(maxPrice) : "Miễn phí"}
            </p>
          </div>
        </div>

        {/* Price Range Display */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Khoảng giá dự kiến</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {minPrice === 0 && maxPrice === 0 ? (
              <span className="text-green-600">Miễn phí</span>
            ) : minPrice === maxPrice ? (
              <span>{formatPrice(minPrice)}</span>
            ) : (
              <span>
                {formatPrice(minPrice)} - {formatPrice(maxPrice)}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Giá có thể thay đổi tùy theo thời điểm và dịch vụ
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
