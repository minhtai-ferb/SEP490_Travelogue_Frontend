'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign } from 'lucide-react'

interface RevenueStatisticsProps {
  confirmedRevenue: number
  completedRevenue: number
  totalRevenue: number
}

export default function RevenueStatistics({
  confirmedRevenue,
  completedRevenue,
  totalRevenue
}: RevenueStatisticsProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Thống Kê Doanh Thu
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <span className="text-sm font-medium">Doanh thu đã xác nhận</span>
            <span className="text-lg font-bold text-green-600">
              {confirmedRevenue.toLocaleString('vi-VN')} VNĐ
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-sm font-medium">Doanh thu hoàn thành</span>
            <span className="text-lg font-bold text-blue-600">
              {completedRevenue.toLocaleString('vi-VN')} VNĐ
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <span className="text-sm font-medium">Tổng doanh thu</span>
            <span className="text-lg font-bold text-gray-900">
              {totalRevenue.toLocaleString('vi-VN')} VNĐ
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
