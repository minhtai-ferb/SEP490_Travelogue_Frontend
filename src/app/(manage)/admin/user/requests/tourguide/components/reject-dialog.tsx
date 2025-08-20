"use client"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

export function RejectDialog({
  open,
  onOpenChange,
  onConfirm,
  reason,
  setReason,
  disabled,
}: {
  open: boolean
  onOpenChange?: (o: boolean) => void
  onConfirm: () => void
  reason: string
  setReason: (v: string) => void
  disabled?: boolean
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Lý do từ chối</AlertDialogTitle>
          <AlertDialogDescription>Hãy cung cấp lý do để từ chối yêu cầu này.</AlertDialogDescription>
        </AlertDialogHeader>
        <Textarea rows={4} placeholder="Nhập lý do..." value={reason} onChange={(e) => setReason(e.target.value)} />
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={disabled}>Xác nhận</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}