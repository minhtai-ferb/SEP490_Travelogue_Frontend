"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HistoricalLocationData, TypeHistoricalLocation } from "../types/EditLocation"

interface HistoricalLocationFormProps {
  data?: HistoricalLocationData
  onChange: (data: HistoricalLocationData) => void
}

const historicalTypes = [
  { value: TypeHistoricalLocation.SpecialNationalMonument, label: "Di tích Quốc gia Đặc biệt" },
  { value: TypeHistoricalLocation.NationalMonument, label: "Di tích cấp quốc gia" },
  { value: TypeHistoricalLocation.ProvincialMonument, label: "Di tích cấp tỉnh" },
]

export function HistoricalLocationForm({ data, onChange }: HistoricalLocationFormProps) {
  const formData = data || {
    heritageRank: 0,
    establishedDate: "",
    locationId: "",
    typeHistoricalLocation: TypeHistoricalLocation.ProvincialMonument,
  }

  const handleChange = (field: keyof HistoricalLocationData, value: any) => {
    onChange({ ...formData, [field]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin di tích lịch sử</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="typeHistoricalLocation">Loại di tích</Label>
            <Select
              value={formData.typeHistoricalLocation.toString()}
              onValueChange={(value) => handleChange("typeHistoricalLocation", Number.parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại di tích" />
              </SelectTrigger>
              <SelectContent>
                {historicalTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value.toString()}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="heritageRank">Xếp hạng di sản</Label>
            <Input
              id="heritageRank"
              type="number"
              value={formData.heritageRank}
              onChange={(e) => handleChange("heritageRank", Number.parseInt(e.target.value) || 0)}
              placeholder="Nhập xếp hạng (0-5)"
              min="0"
              max="5"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="establishedDate">Ngày thành lập/công nhận</Label>
            <Input
              id="establishedDate"
              type="date"
              value={formData.establishedDate.split("T")[0]}
              onChange={(e) => handleChange("establishedDate", e.target.value + "T00:00:00.000Z")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
