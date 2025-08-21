"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ActionButtonsProps {
  isSubmitting: boolean;
  onSubmit: () => Promise<void>;
  onCancel?: () => Promise<void>;
  backUrl?: string;
}

export function ActionButtons({
  isSubmitting,
  onSubmit,
  onCancel,
  backUrl = "/admin/locations/table"
}: ActionButtonsProps) {
  const router = useRouter();

  const handleCancel = async () => {
    if (onCancel) {
      try {
        await onCancel();
        toast.success("Đã xóa các hình ảnh mới đã tải lên!");
      } catch (error) {
        console.error("Error during cancel:", error);
        toast.error("Có lỗi xảy ra khi xóa hình ảnh");
      }
    }
    router.push(backUrl);
  };

  const handleSubmit = async () => {
    try {
      await onSubmit();
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  return (
    <div className="flex justify-end space-x-4">
      <Button 
        variant="outline" 
        size="lg" 
        onClick={handleCancel}
        disabled={isSubmitting}
      >
        Hủy
      </Button>
      <Button 
        size="lg" 
        onClick={handleSubmit} 
        disabled={isSubmitting}
      >
        {isSubmitting ? "Đang cập nhật..." : "Cập nhật địa điểm"}
      </Button>
    </div>
  );
}
