import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MediaDto } from '../types/CreateLocation';
import { useLocations } from '@/services/use-locations';
import toast from 'react-hot-toast';

interface UseCleanupImagesProps {
  mediaDtos: MediaDto[];
  isSubmitting: boolean;
  isSuccess?: boolean; // Thêm flag để đánh dấu tạo thành công
}

export function useCleanupImages({ mediaDtos, isSubmitting, isSuccess = false }: UseCleanupImagesProps) {
  const { deleteMediaByFileName } = useLocations();
  const hasCleanedUp = useRef(false);

  const cleanupImages = async () => {
    // Không xóa nếu đã tạo thành công hoặc đang submit hoặc không có ảnh
    if (hasCleanedUp.current || mediaDtos.length === 0 || isSubmitting || isSuccess) {
      return;
    }

    try {
      hasCleanedUp.current = true;
      const deletePromises = mediaDtos.map(async (media) => {
        const fileName = media.mediaUrl.split("/").pop() || media.mediaUrl;
        return deleteMediaByFileName(fileName);
      });
      toast.success("Đã xóa tất cả hình ảnh khi rời khỏi trang");
      await Promise.all(deletePromises);
      console.log("Đã xóa tất cả hình ảnh khi rời khỏi trang");
    } catch (error) {
      console.error("Error cleaning up media files:", error);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (mediaDtos.length > 0 && !isSubmitting && !isSuccess) {
        // Xóa ảnh bất đồng bộ khi người dùng đóng tab/refresh
        cleanupImages();
      }
    };

    const handlePopState = () => {
      if (mediaDtos.length > 0 && !isSubmitting && !isSuccess) {
        cleanupImages();
      }
    };

    // Intercept các link clicks để xóa ảnh trước khi chuyển trang
    const handleLinkClick = async (event: Event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && mediaDtos.length > 0 && !isSubmitting && !isSuccess) {
        const href = link.getAttribute('href');
        // Kiểm tra nếu đây là navigation đi ra khỏi trang create
        if (href && (href.includes('/admin/locations') || href.includes('/moderator/locations')) && !href.includes('/create')) {
          event.preventDefault();
          await cleanupImages();
          window.location.href = href; // Điều hướng sau khi xóa
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleLinkClick);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleLinkClick);
    };
    }, [mediaDtos, isSubmitting, isSuccess]);  // Reset flag khi component re-mount hoặc mediaDtos thay đổi
  useEffect(() => {
    hasCleanedUp.current = false;
  }, [mediaDtos.length]);

  return {
    cleanupImages,
  };
}
