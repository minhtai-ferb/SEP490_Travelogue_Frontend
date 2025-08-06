"use client"

import { Badge } from "@/components/ui/badge"
import { MapPin, Utensils, Hammer, Building } from "lucide-react"
import { Category } from "../types/EditLocation"

interface CategoryDisplayProps {
  category: Category
}

const locationTypeConfig = {
  [Category.ScenicSpot]: {
    name: "Danh lam thắng cảnh",
    icon: MapPin,
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  [Category.CraftVillage]: {
    name: "Làng nghề",
    icon: Hammer,
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  [Category.HistoricalSite]: {
    name: "Địa điểm lịch sử",
    icon: Building,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  [Category.Cuisine]: {
    name: "Ẩm thực",
    icon: Utensils,
    color: "bg-green-100 text-green-800 border-green-200",
  },
  [Category.Other]: {
    name: "Khác",
    icon: MapPin,
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
}

export function LocationTypeDisplay({ category }: CategoryDisplayProps) {
  const config = locationTypeConfig[category] || locationTypeConfig[Category.Other]
  const Icon = config.icon

  return (
    <Badge variant="outline" className={`${config.color} flex items-center gap-1 w-fit`}>
      <Icon className="h-3 w-3" />
      {config.name}
    </Badge>
  )
}
