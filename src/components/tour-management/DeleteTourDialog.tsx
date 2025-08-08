"use client"

import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { TourDetail } from "@/types/Tour"
import { DeleteConfirmation } from "./DeleteConfirmation"

type DeleteTourDialogProps = {
  open: boolean
  tour: TourDetail | null
  isLoading: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteTourDialog({ open, tour, isLoading, onOpenChange, onConfirm, onCancel }: DeleteTourDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác Nhận Xóa</DialogTitle>
        </DialogHeader>
        {tour && (
          <DeleteConfirmation tour={tour} onConfirm={onConfirm} onCancel={onCancel} isLoading={isLoading} />
        )}
      </DialogContent>
    </Dialog>
  )
}


