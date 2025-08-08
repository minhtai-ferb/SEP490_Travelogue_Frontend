"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LocationType } from "../types/CreateLocation";
import { MapPin, Utensils, Hammer, Building } from "lucide-react";

interface LocationTypeSelectorProps {
  selectedType: LocationType;
  onChange: (type: LocationType) => void;
}

const locationTypes = [
  {
    type: LocationType.ScenicSpot,
    name: "Danh lam thắng cảnh",
    description: "Cảnh đẹp, điểm tham quan",
    icon: MapPin,
    color: "border-purple-200 bg-purple-50 hover:bg-purple-100",
  },
  {
    type: LocationType.CraftVillage,
    name: "Làng nghề",
    description: "Làng nghề truyền thống",
    icon: Hammer,
    color: "border-orange-200 bg-orange-50 hover:bg-orange-100",
  },
  {
    type: LocationType.HistoricalSite,
    name: "Địa điểm lịch sử",
    description: "Di tích, danh thắng lịch sử",
    icon: Building,
    color: "border-blue-200 bg-blue-50 hover:bg-blue-100",
  },
  {
    type: LocationType.Cuisine,
    name: "Ẩm thực",
    description: "Nhà hàng, quán ăn đặc sản",
    icon: Utensils,
    color: "border-green-200 bg-green-50 hover:bg-green-100",
  },
];

export function LocationTypeSelector({
  selectedType,
  onChange,
}: LocationTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {locationTypes.map((type) => {
        const Icon = type.icon;
        const isSelected = selectedType === type.type;

        return (
          <Card
            key={type.type}
            className={`cursor-pointer transition-all ${
              isSelected
                ? `ring-2 ring-primary ${type.color}`
                : `border-2 hover:shadow-md ${type.color}`
            }`}
            onClick={() => onChange(type.type)}
          >
            <CardContent className="p-4 text-center">
              <Icon className="h-8 w-8 mx-auto mb-2 text-gray-600" />
              <h3 className="font-semibold text-sm mb-1">{type.name}</h3>
              <p className="text-xs text-muted-foreground">
                {type.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
