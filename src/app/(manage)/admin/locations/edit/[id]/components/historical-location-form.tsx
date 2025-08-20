"use client"

import { useState } from "react"
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

  const [errors, setErrors] = useState<{ heritageRank?: string; establishedDate?: string; typeHistoricalLocation?: string }>({})

  const handleChange = (field: keyof HistoricalLocationData, value: any) => {
    if (field === "heritageRank") {
      const parsed = Number.isNaN(Number.parseInt(String(value))) ? 0 : Number.parseInt(String(value))
      const clamped = Math.min(5, Math.max(0, parsed))
      setErrors((prev) => ({ ...prev, heritageRank: clamped < 0 || clamped > 5 ? "Xếp hạng phải từ 0 đến 5" : undefined }))
      onChange({ ...formData, heritageRank: clamped })
      return
    }

    if (field === "establishedDate") {
      const hasValue = Boolean(value)
      setErrors((prev) => ({ ...prev, establishedDate: hasValue ? undefined : "Vui lòng chọn ngày" }))
    }

    if (field === "typeHistoricalLocation") {
      const hasValue = value !== undefined && value !== null && value !== ""
      setErrors((prev) => ({ ...prev, typeHistoricalLocation: hasValue ? undefined : "Vui lòng chọn loại di tích" }))
    }

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
              value={formData.typeHistoricalLocation?.toString()}
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
            {errors.typeHistoricalLocation ? (
              <p className="text-[0.8rem] font-medium text-destructive">{errors.typeHistoricalLocation}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="heritageRank">Xếp hạng di sản</Label>
            <Input
              id="heritageRank"
              type="number"
              value={formData.heritageRank}
              onChange={(e) => handleChange("heritageRank", e.target.value)}
              placeholder="Nhập xếp hạng (0-5)"
              min="0"
              max="5"
            />
            {errors.heritageRank ? (
              <p className="text-[0.8rem] font-medium text-destructive">{errors.heritageRank}</p>
            ) : null}
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="establishedDate">Ngày thành lập/công nhận</Label>
            <Input
              id="establishedDate"
              type="date"
              required
              value={formData.establishedDate.split("T")[0]}
              onChange={(e) => handleChange("establishedDate", e.target.value + "T00:00:00.000Z")}
            />
            {errors.establishedDate ? (
              <p className="text-[0.8rem] font-medium text-destructive">{errors.establishedDate}</p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
