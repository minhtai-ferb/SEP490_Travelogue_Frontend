'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, CheckCircle, Clock, XCircle } from 'lucide-react'

interface BookingStatusBreakdownProps {
  pendingBookings: number
  confirmedBookings: number
  completedBookings: number
  cancelledBookings: number
}

export default function BookingStatusBreakdown({
  pendingBookings,
  confirmedBookings,
  completedBookings,
  cancelledBookings
}: BookingStatusBreakdownProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Thống Kê Trạng Thái Booking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium">Chờ xử lý</span>
            </div>
            <span className="text-lg font-bold text-yellow-600">{pendingBookings}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Đã xác nhận</span>
            </div>
            <span className="text-lg font-bold text-blue-600">{confirmedBookings}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Hoàn thành</span>
            </div>
            <span className="text-lg font-bold text-green-600">{completedBookings}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium">Đã hủy</span>
            </div>
            <span className="text-lg font-bold text-red-600">{cancelledBookings}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
