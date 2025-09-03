'use client'

import React from 'react'
import { BarChart3 } from 'lucide-react'

interface StatisticsHeaderProps {
  tourId?: string
}

export default function StatisticsHeader({ tourId }: StatisticsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          Thống Kê Lịch Trình Tour
        </h1>
        <p className="text-gray-600 mt-1">Chi tiết thống kê booking và doanh thu cho lịch trình</p>
      </div>
    </div>
  )
}
