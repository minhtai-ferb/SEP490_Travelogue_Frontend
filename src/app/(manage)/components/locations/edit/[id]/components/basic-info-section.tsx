"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { District } from "@/types/District"
import { useDistrictManager } from "@/services/district-manager"

interface BasicInfoSectionProps {
  data: {
    name: string
    description: string
    address: string
    districtId: string
  }
  onChange: (data: any) => void
  errors?: {
    name?: string;
    description?: string;
    address?: string;
    districtId?: string;
  }
}

export function BasicInfoSection({ data, onChange, errors }: BasicInfoSectionProps) {
  const [districts, setDistricts] = useState<District[]>([])
  const { getAllDistrict } = useDistrictManager();

  // Mock districts data - replace with your actual API call
  useEffect(() => {
    const fetchDistricts = async () => {
      const response: District[] = await getAllDistrict();
      if (response) {
        setDistricts(response);
      }
    };
    fetchDistricts();
  }, [getAllDistrict])

  const handleChange = (field: string, value: string) => {
    onChange({ [field]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cơ bản</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Tên địa điểm <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Nhập tên địa điểm (tối đa 200 ký tự)"
              maxLength={200}
              className={errors?.name ? "border-red-500" : ""}
            />
            {errors?.name ? (
              <div className="text-xs text-red-500">{errors.name}</div>
            ) : null}
            <div className="text-xs text-muted-foreground text-right">
              {data.name.length}/200
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="district">Quận/Huyện <span className="text-red-500">*</span></Label>
            <Select value={data.districtId} onValueChange={(value) => handleChange("districtId", value)}>
              <SelectTrigger className={errors?.districtId ? "border-red-500" : ""}>
                <SelectValue placeholder="Chọn quận/huyện" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district.id} value={district.id}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.districtId ? (
              <div className="text-xs text-red-500">{errors.districtId}</div>
            ) : null}
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="address">Địa chỉ <span className="text-red-500">*</span></Label>
            <Input
              id="address"
              value={data.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Nhập địa chỉ chi tiết (tối đa 300 ký tự)"
              maxLength={300}
              className={errors?.address ? "border-red-500" : ""}
            />
            {errors?.address ? (
              <div className="text-xs text-red-500">{errors.address}</div>
            ) : null}
            <div className="text-xs text-muted-foreground text-right">
              {data.address.length}/300
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="description">Mô tả ngắn <span className="text-red-500">*</span></Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Nhập mô tả ngắn về địa điểm (tối đa 500 ký tự)"
              rows={3}
              maxLength={500}
              className={errors?.description ? "border-red-500" : ""}
            />
            {errors?.description ? (
              <div className="text-xs text-red-500">{errors.description}</div>
            ) : null}
            <div className="text-xs text-muted-foreground text-right">
              {data.description.length}/500
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
