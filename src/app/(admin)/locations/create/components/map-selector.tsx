"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Search } from "lucide-react"

interface MapSelectorProps {
  address: string
  latitude: number
  longitude: number
  onChange: (lat: number, lng: number) => void
}

export function MapSelector({ address, latitude, longitude, onChange }: MapSelectorProps) {
  const [searchAddress, setSearchAddress] = useState(address)
  const [isSearching, setIsSearching] = useState(false)
  const [manualMode, setManualMode] = useState(false)

  const handleSearch = async () => {
    if (!searchAddress.trim()) return

    setIsSearching(true)

    try {
      // Giả lập kết quả
      const mockLat = 10.7769 + (Math.random() - 0.5) * 0.1
      const mockLng = 106.7009 + (Math.random() - 0.5) * 0.1

      onChange(mockLat, mockLng)
    } catch (error) {
      console.error("Lỗi khi tìm địa chỉ:", error)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Checkbox chuyển sang nhập tay */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="manualMode"
          checked={manualMode}
          onCheckedChange={(checked) => setManualMode(!!checked)}
        />
        <Label htmlFor="manualMode">Tự nhập tọa độ thủ công</Label>
      </div>

      {/* Ô tìm kiếm địa chỉ */}
      <div className="flex space-x-2">
        <Input
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          placeholder="Nhập địa chỉ để tìm kiếm trên bản đồ"
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          disabled={manualMode}
        />
        <Button onClick={handleSearch} disabled={isSearching || manualMode}>
          <Search className="h-4 w-4 mr-2" />
          {isSearching ? "Đang tìm..." : "Tìm kiếm"}
        </Button>
      </div>

      {/* Tọa độ */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Vĩ độ (Latitude)</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => onChange(Number.parseFloat(e.target.value) || 0, longitude)}
            placeholder="VD: 10.7769"
            disabled={!manualMode}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude">Kinh độ (Longitude)</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => onChange(latitude, Number.parseFloat(e.target.value) || 0)}
            placeholder="VD: 106.7009"
            disabled={!manualMode}
          />
        </div>
      </div>

      {/* Bản đồ giả lập */}
      <Card className="h-64 bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <MapPin className="h-12 w-12 mx-auto mb-2" />
          <p>Bản đồ VietMap</p>
          {latitude && longitude && (
            <p className="text-sm mt-2">
              Tọa độ: {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
