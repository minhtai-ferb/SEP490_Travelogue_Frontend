"use client"

import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"
import { Rate } from "antd"

interface LocationHeaderProps {
  name: string
  districtName: string
  category: string
  rating: number
  description?: string
}

export function LocationHeader({ name, districtName, category, rating, description }: LocationHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{name}</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{districtName}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-sm">
            {category}
          </Badge>
          <div className="flex items-center gap-1">
            <Rate disabled defaultValue={rating} />
            <span className="text-sm text-gray-600">({rating})</span>
          </div>
        </div>
      </div>

      {description && <p className="text-gray-700 text-lg">{description}</p>}
    </div>
  )
}
