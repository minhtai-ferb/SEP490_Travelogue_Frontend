"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TimeSelectorProps {
  openTime: { ticks: number }
  closeTime: { ticks: number }
  onChange: (openTime: { ticks: number }, closeTime: { ticks: number }) => void
}

export function TimeSelector({ openTime, closeTime, onChange }: TimeSelectorProps) {
  // Convert ticks to time string (simplified conversion)
  const ticksToTime = (ticks: number): string => {
    if (ticks === 0) return "08:00"
    const hours = Math.floor(ticks / 36000000000) // 1 hour = 36000000000 ticks
    const minutes = Math.floor((ticks % 36000000000) / 600000000) // 1 minute = 600000000 ticks
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
  }

  // Convert time string to ticks
  const timeToTicks = (timeString: string): number => {
    const [hours, minutes] = timeString.split(":").map(Number)
    return hours * 36000000000 + minutes * 600000000
  }

  const handleOpenTimeChange = (timeString: string) => {
    const ticks = timeToTicks(timeString)
    onChange({ ticks }, closeTime)
  }

  const handleCloseTimeChange = (timeString: string) => {
    const ticks = timeToTicks(timeString)
    onChange(openTime, { ticks })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="openTime">Giờ mở cửa</Label>
        <Input
          id="openTime"
          type="time"
          value={ticksToTime(openTime.ticks)}
          onChange={(e) => handleOpenTimeChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="closeTime">Giờ đóng cửa</Label>
        <Input
          id="closeTime"
          type="time"
          value={ticksToTime(closeTime.ticks)}
          onChange={(e) => handleCloseTimeChange(e.target.value)}
        />
      </div>
    </div>
  )
}
