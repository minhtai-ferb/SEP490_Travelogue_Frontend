"use client";

import BreadcrumbHeader, { type Crumb } from "@/components/common/breadcrumb-header";
import { useRouter } from "next/navigation";
import { MediaDto } from "../types/CreateLocation";
import { useLocations } from "@/services/use-locations";
import toast from "react-hot-toast";

interface CreateLocationBreadcrumbProps {
  items: Crumb[];
  mediaDtos: MediaDto[];
  isSubmitting: boolean;
  showSidebarTrigger?: boolean;
  sticky?: boolean;
  className?: string;
}

export function CreateLocationBreadcrumb({
  items,
  mediaDtos,
  isSubmitting,
  showSidebarTrigger = true,
  sticky = true,
  className,
}: CreateLocationBreadcrumbProps) {
  const router = useRouter();
  const { deleteMediaByFileName } = useLocations();

  const handleBreadcrumbClick = async (href: string, event: React.MouseEvent) => {
    // Kiểm tra nếu đang submit thì không xóa ảnh
    if (isSubmitting) {
      return;
    }

    // Nếu có ảnh đã upload, xóa trước khi chuyển trang
    if (mediaDtos.length > 0) {
      event.preventDefault(); // Ngăn chặn điều hướng mặc định
      
      try {
        const deletePromises = mediaDtos.map(async (media) => {
          const fileName = media.mediaUrl.split("/").pop() || media.mediaUrl;
          return deleteMediaByFileName(fileName);
        });
        
        await Promise.all(deletePromises);
        toast.success("Đã xóa tất cả hình ảnh đã tải lên!");
        
        // Sau khi xóa xong, điều hướng
        router.push(href);
      } catch (error) {
        console.error("Error deleting media files:", error);
        toast.error("Có lỗi xảy ra khi xóa hình ảnh");
        
        // Vẫn điều hướng ngay cả khi có lỗi
        router.push(href);
      }
    }
  };

  // Tạo items mới với custom onClick handlers
  const enhancedItems: Crumb[] = items.map((item) => ({
    ...item,
    onClick: item.href ? (event: React.MouseEvent) => handleBreadcrumbClick(item.href!, event) : undefined,
  }));

  return (
    <BreadcrumbHeader
      items={enhancedItems}
      showSidebarTrigger={showSidebarTrigger}
      sticky={sticky}
      className={className}
    />
  );
}
