"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { CraftVillageData } from "@/types/location"

interface CraftVillageFormProps {
  data?: CraftVillageData
  onChange: (data: CraftVillageData) => void
}

export function CraftVillageForm({ data, onChange }: CraftVillageFormProps) {
  const formData = data || {
    phoneNumber: "",
    email: "",
    website: "",
    workshopsAvailable: false,
    signatureProduct: "",
    yearsOfHistory: 0,
    isRecognizedByUnesco: false,
  }

  const handleChange = (field: keyof CraftVillageData, value: any) => {
    onChange({ ...formData, [field]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin làng nghề</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="signatureProduct">Sản phẩm đặc trưng</Label>
            <Input
              id="signatureProduct"
              value={formData.signatureProduct}
              onChange={(e) => handleChange("signatureProduct", e.target.value)}
              placeholder="VD: Gốm sứ, thêu ren, mây tre đan..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearsOfHistory">Số năm lịch sử</Label>
            <Input
              id="yearsOfHistory"
              type="number"
              value={formData.yearsOfHistory}
              onChange={(e) => handleChange("yearsOfHistory", Number.parseInt(e.target.value) || 0)}
              placeholder="Nhập số năm lịch sử"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Số điện thoại</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              placeholder="Nhập số điện thoại liên hệ"
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

          <div className="flex items-center space-x-2">
            <Switch
              id="workshopsAvailable"
              checked={formData.workshopsAvailable}
              onCheckedChange={(checked) => handleChange("workshopsAvailable", checked)}
            />
            <Label htmlFor="workshopsAvailable">Có workshop trải nghiệm</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isRecognizedByUnesco"
              checked={formData.isRecognizedByUnesco}
              onCheckedChange={(checked) => handleChange("isRecognizedByUnesco", checked)}
            />
            <Label htmlFor="isRecognizedByUnesco">Được UNESCO công nhận</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
