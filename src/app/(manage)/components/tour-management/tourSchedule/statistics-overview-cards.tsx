'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Percent, TrendingUp, TrendingDown } from 'lucide-react'

interface StatisticsOverviewCardsProps {
  totalBookings: number
  completionRate: number
  totalRevenue: number
  lostRevenue: number
}

export default function StatisticsOverviewCards({
  totalBookings,
  completionRate,
  totalRevenue,
  lostRevenue
}: StatisticsOverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng Booking</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{totalBookings}</div>
          <p className="text-xs text-muted-foreground">
            Tất cả booking cho lịch trình này
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tỷ Lệ Hoàn Thành</CardTitle>
          <Percent className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{completionRate}%</div>
          <p className="text-xs text-muted-foreground">
            Booking đã hoàn thành
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Doanh Thu</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {totalRevenue.toLocaleString('vi-VN')} VNĐ
          </div>
          <p className="text-xs text-muted-foreground">
            Tổng doanh thu
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Doanh Thu Mất</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {lostRevenue.toLocaleString('vi-VN')} VNĐ
          </div>
          <p className="text-xs text-muted-foreground">
            Do hủy booking
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
