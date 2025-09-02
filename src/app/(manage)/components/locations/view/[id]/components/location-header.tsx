"use client"

import { Badge } from "@/components/ui/badge"
import { MapPin, DollarSign } from "lucide-react"
import { Rate } from "antd"

interface LocationHeaderProps {
  name: string
  districtName: string
  category: string
  rating: number
  description?: string
  minPrice?: number
  maxPrice?: number
}

export function LocationHeader({ name, districtName, category, rating, description, minPrice = 0, maxPrice = 0 }: LocationHeaderProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getPriceDisplay = () => {
    if (minPrice === 0 && maxPrice === 0) {
      return (
        <div className="flex items-center gap-2 text-green-600">
          <DollarSign className="w-4 h-4" />
          <span className="font-medium">Miễn phí</span>
        </div>
      );
    } else if (minPrice === maxPrice) {
      return (
        <div className="flex items-center gap-2 text-blue-600">
          <DollarSign className="w-4 h-4" />
          <span className="font-medium">{formatPrice(minPrice)}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 text-blue-600">
          <DollarSign className="w-4 h-4" />
          <span className="font-medium">{formatPrice(minPrice)} - {formatPrice(maxPrice)}</span>
        </div>
      );
    }
  };
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{name}</h1>
          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <MapPin className="w-4 h-4" />
            <span>{districtName}</span>
          </div>
          {/* Price Display */}
          <div className="mb-3">
            {getPriceDisplay()}
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {category}
          </Badge>
          {/* <div className="flex items-center gap-1 bg-white px-3 py-2 rounded-lg shadow-sm border">
            <Rate disabled defaultValue={rating} />
            <span className="text-sm text-gray-600 ml-1">({rating})</span>
          </div> */}
        </div>
      </div>

      {description && (
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-gray-700 text-lg leading-relaxed">{description}</p>
        </div>
      )}
    </div>
  )
}
