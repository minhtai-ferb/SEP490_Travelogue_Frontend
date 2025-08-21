"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { CuisineData } from "../types/EditLocation"

interface CuisineFormProps {
  data?: CuisineData
  onChange: (data: CuisineData) => void
}

export function CuisineForm({ data, onChange }: CuisineFormProps) {
  const formData = data || {
    signatureProduct: "",
    cookingMethod: "",
    cuisineType: "",
    phoneNumber: "",
    email: "",
    website: "",
  }

  const handleChange = (field: keyof CuisineData, value: string) => {
    onChange({ ...formData, [field]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin ẩm thực</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="signatureProduct">Món đặc sản</Label>
            <Input
              id="signatureProduct"
              value={formData.signatureProduct}
              onChange={(e) => handleChange("signatureProduct", e.target.value)}
              placeholder="Nhập món đặc sản"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cuisineType">Loại ẩm thực</Label>
            <Input
              id="cuisineType"
              value={formData.cuisineType}
              onChange={(e) => handleChange("cuisineType", e.target.value)}
              placeholder="VD: Ẩm thực Việt Nam, Châu Âu..."
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="cookingMethod">Phương pháp chế biến</Label>
            <Textarea
              id="cookingMethod"
              value={formData.cookingMethod}
              onChange={(e) => handleChange("cookingMethod", e.target.value)}
              placeholder="Mô tả phương pháp chế biến đặc biệt"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Số điện thoại</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Nhập email"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="Nhập website (nếu có)"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
