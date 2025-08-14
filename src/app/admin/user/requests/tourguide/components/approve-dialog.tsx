"use client"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

export function ApproveDialog({
  open,
  onOpenChange,
  onConfirm,
  note,
  setNote,
}: {
  open: boolean
  onOpenChange?: (o: boolean) => void
  onConfirm: () => void
  note: string
  setNote: (v: string) => void
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Lý do chấp nhận (tuỳ chọn)</AlertDialogTitle>
          <AlertDialogDescription>Bạn có thể ghi chú lý do chấp nhận yêu cầu này (không bắt buộc).</AlertDialogDescription>
        </AlertDialogHeader>
        <Textarea rows={3} placeholder="Nhập lý do (không bắt buộc)..." value={note} onChange={(e) => setNote(e.target.value)} />
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Xác nhận</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}