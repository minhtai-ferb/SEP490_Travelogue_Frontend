"use client";

import { useDistrictManager } from "@/services/district-manager";
import { District } from "@/types/District";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useImageUpload } from "@/hooks/useImageUpload";
import { SidebarInset } from "@/components/ui/sidebar";
import LoadingContent from "@/components/common/loading-content";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { DistrictContent } from "@/app/(manage)/components/districs/[id]/components/DistrictContent";
import { ImageUpdateModal } from "@/app/(manage)/components/districs/[id]/components/ImageUpdateModal";

const crumb: Crumb[] = [
  { label: "Quản lý quận huyện", href: "/moderator/districts" },
  { label: "Xem chi tiết quận huyện" },
];

const ViewDistricsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const [district, setDistrict] = useState<District>();
  const { getDistrictById, loading } = useDistrictManager();
  const { id } = use(params);

  const fetchDistrict = async () => {
    try {
      const response: District = await getDistrictById(id);
      if (!response) {
        throw new Error("No data returned from API getDistrictById");
      }
      setDistrict(response);
    } catch (error: any) {
      console.error("====================================");
      console.error(error);
      console.error("====================================");
      const errorMessage =
        error?.response?.data.Message ||
        "Đã xảy ra lỗi khi lấy dữ liệu quận huyện";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchDistrict();
  }, [getDistrictById, id]);

  const {
    isImageModalOpen,
    selectedImage,
    imagePreview,
    uploading,
    handleImageChange,
    handleImageUpload,
    handleCloseModal,
    handleRemoveImage,
    openImageModal,
  } = useImageUpload(district, fetchDistrict);

  return (
    <SidebarInset className="flex flex-col gap-4 p-4">
      <BreadcrumbHeader items={crumb} />
      {loading ? (
        <LoadingContent />
      ) : (
        <DistrictContent
          href="/moderator/districts"
          district={district}
          onImageUpdateClick={openImageModal}
        />
      )}

      <ImageUpdateModal
        isOpen={isImageModalOpen}
        onClose={handleCloseModal}
        district={district}
        selectedImage={selectedImage}
        imagePreview={imagePreview}
        uploading={uploading}
        onImageChange={handleImageChange}
        onImageUpload={handleImageUpload}
        onRemoveImage={handleRemoveImage}
      />
    </SidebarInset>
  );
};

export default ViewDistricsPage;
