"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Eye, Edit, Trash2 } from "lucide-react"
import type { TourDetail } from "@/types/Tour"

type RowActionsProps = {
  tour: TourDetail
  onView: (tour: TourDetail) => void
  onEdit: (tour: TourDetail) => void
  onDelete: (tour: TourDetail) => void
}

export function RowActions({ tour, onView, onEdit, onDelete }: RowActionsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={() => onView(tour)}>
              <Eye className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Xem chi tiết</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={() => onEdit(tour)}>
              <Edit className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Chỉnh sửa</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(tour)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Xóa tour</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}


