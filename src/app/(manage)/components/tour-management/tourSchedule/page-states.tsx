'use client'

import React from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, BarChart3 } from 'lucide-react'
import BreadcrumbHeader from '@/components/common/breadcrumb-header'

interface LoadingStateProps {
  breadcrumbItems: Array<{ label: string; href?: string }>
}

export function LoadingState({ breadcrumbItems }: LoadingStateProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbHeader items={breadcrumbItems} />
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )
}

interface ErrorStateProps {
  breadcrumbItems: Array<{ label: string; href?: string }>
  error: string
}

export function ErrorState({ breadcrumbItems, error }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbHeader items={breadcrumbItems} />
      <div className="max-w-7xl mx-auto p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}

interface NoDataStateProps {
  breadcrumbItems: Array<{ label: string; href?: string }>
}

export function NoDataState({ breadcrumbItems }: NoDataStateProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbHeader items={breadcrumbItems} />
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Không tìm thấy dữ liệu thống kê</p>
        </div>
      </div>
    </div>
  )
}
