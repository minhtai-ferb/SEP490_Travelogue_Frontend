"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TimeSelectorProps {
  openTime: string
  closeTime: string
  onChange: (openTime: string, closeTime: string) => void
}

export function TimeSelector({ openTime, closeTime, onChange }: TimeSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Giờ hoạt động</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="openTime">Giờ mở cửa</Label>
            <Input id="openTime" type="time" value={openTime} onChange={(e) => onChange(e.target.value, closeTime)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="closeTime">Giờ đóng cửa</Label>
            <Input id="closeTime" type="time" value={closeTime} onChange={(e) => onChange(openTime, e.target.value)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
