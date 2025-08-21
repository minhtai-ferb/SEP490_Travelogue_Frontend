import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { LocationTable } from "@/types/Location";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  location: LocationTable | null;
}

export function DeleteLocationDialog({ open, onOpenChange, onDelete, location }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa địa điểm</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa địa điểm "{location?.name}"? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
