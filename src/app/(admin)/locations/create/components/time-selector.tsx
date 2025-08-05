"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TimeSelectorProps {
  openTime: string // kiểu "HH:mm:ss"
  closeTime: string // kiểu "HH:mm:ss"
  onChange: (openTime: string, closeTime: string) => void
}

export function TimeSelector({ openTime, closeTime, onChange }: TimeSelectorProps) {
  // Cắt chuỗi "HH:mm:ss" → "HH:mm" để gán vào input type="time"
  const trimSeconds = (time: string): string => {
    return time.substring(0, 5)
  }

  // Ghép thêm ":00" nếu thiếu giây
  const addSeconds = (time: string): string => {
    return time.length === 5 ? `${time}:00` : time
  }

  const handleOpenTimeChange = (time: string) => {
    onChange(addSeconds(time), closeTime)
  }

  const handleCloseTimeChange = (time: string) => {
    onChange(openTime, addSeconds(time))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="openTime">Giờ mở cửa</Label>
        <Input
          id="openTime"
          type="time"
          value={trimSeconds(openTime)}
          onChange={(e) => handleOpenTimeChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="closeTime">Giờ đóng cửa</Label>
        <Input
          id="closeTime"
          type="time"
          value={trimSeconds(closeTime)}
          onChange={(e) => handleCloseTimeChange(e.target.value)}
        />
      </div>
    </div>
  )
}
