'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Ban
} from 'lucide-react'

interface StatusBadgeProps {
  status: number
  statusText: string
}

export default function StatusBadge({ status, statusText }: StatusBadgeProps) {
  const statusMap = {
    1: { variant: 'secondary', icon: <Clock className="h-3 w-3" /> }, // Pending
    2: { variant: 'default', icon: <CheckCircle className="h-3 w-3" /> }, // Confirmed
    3: { variant: 'destructive', icon: <XCircle className="h-3 w-3" /> }, // Cancelled
    4: { variant: 'secondary', icon: <AlertCircle className="h-3 w-3" /> }, // Expired
    5: { variant: 'destructive', icon: <Ban className="h-3 w-3" /> }, // Cancelled by Provider
    6: { variant: 'default', icon: <CheckCircle className="h-3 w-3" /> }, // Completed
  } as const

  const config = statusMap[status as keyof typeof statusMap] || statusMap[1]

  return (
    <Badge variant={config.variant as any} className="gap-1">
      {config.icon}
      {statusText}
    </Badge>
  )
}
