"use client"

import { useState, useEffect } from "react"
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

  // Function to validate all required fields
  const validateForm = (): boolean => {
    const newErrors: { heritageRank?: string; establishedDate?: string; typeHistoricalLocation?: string } = {}
    let isValid = true
    
    // Validate heritage rank
    if (formData.heritageRank === undefined || formData.heritageRank === null) {
      newErrors.heritageRank = "Vui lòng nhập xếp hạng di sản"
      isValid = false
    } else if (formData.heritageRank < 0 || formData.heritageRank > 5) {
      newErrors.heritageRank = "Xếp hạng phải từ 0 đến 5"
      isValid = false
    }
    
    // Validate established date
    if (!formData.establishedDate || formData.establishedDate.trim() === "") {
      newErrors.establishedDate = "Vui lòng chọn ngày thành lập/công nhận"
      isValid = false
    }
    
    // Validate historical type
    if (formData.typeHistoricalLocation === undefined || formData.typeHistoricalLocation === null) {
      newErrors.typeHistoricalLocation = "Vui lòng chọn loại di tích"
      isValid = false
    }
    
    setErrors(newErrors)
    return isValid
  }

  // Validate required fields on component mount and data change
  useEffect(() => {
    validateForm()
  }, [formData])

  const handleChange = (field: keyof HistoricalLocationData, value: any) => {
    if (field === "heritageRank") {
      const parsed = Number.isNaN(Number.parseInt(String(value))) ? 0 : Number.parseInt(String(value))
      const clamped = Math.min(5, Math.max(0, parsed))
      // Validate heritage rank is required and within range
      if (value === "" || value === null || value === undefined) {
        setErrors((prev) => ({ ...prev, heritageRank: "Vui lòng nhập xếp hạng di sản" }))
      } else if (clamped < 0 || clamped > 5) {
        setErrors((prev) => ({ ...prev, heritageRank: "Xếp hạng phải từ 0 đến 5" }))
      } else {
        setErrors((prev) => ({ ...prev, heritageRank: undefined }))
      }
      onChange({ ...formData, heritageRank: clamped })
      return
    }

    if (field === "establishedDate") {
      const hasValue = Boolean(value) && value.trim() !== ""
      setErrors((prev) => ({ ...prev, establishedDate: hasValue ? undefined : "Vui lòng chọn ngày thành lập/công nhận" }))
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
            <Label htmlFor="typeHistoricalLocation">Loại di tích *</Label>
            <Select
              value={formData.typeHistoricalLocation?.toString()}
              onValueChange={(value) => handleChange("typeHistoricalLocation", Number.parseInt(value))}
              required
            >
              <SelectTrigger className={errors.typeHistoricalLocation ? "border-red-500" : ""}>
                <SelectValue placeholder="Chọn loại di tích (bắt buộc)" />
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
            <Label htmlFor="heritageRank">Xếp hạng di sản *</Label>
            <Input
              id="heritageRank"
              type="number"
              value={formData.heritageRank}
              onChange={(e) => handleChange("heritageRank", e.target.value)}
              placeholder="Nhập xếp hạng (0-5) - bắt buộc"
              min="0"
              max="5"
              required
              className={errors.heritageRank ? "border-red-500" : ""}
            />
            {errors.heritageRank ? (
              <p className="text-[0.8rem] font-medium text-destructive">{errors.heritageRank}</p>
            ) : null}
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="establishedDate">Ngày thành lập/công nhận *</Label>
            <Input
              id="establishedDate"
              type="date"
              required
              value={formData.establishedDate.split("T")[0]}
              onChange={(e) => handleChange("establishedDate", e.target.value + "T00:00:00.000Z")}
              className={errors.establishedDate ? "border-red-500" : ""}
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
