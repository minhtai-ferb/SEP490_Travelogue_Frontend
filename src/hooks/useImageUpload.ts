"use client";

import { useState } from "react";
import { useDistrictManager } from "@/services/district-manager";
import { District } from "@/types/District";
import toast from "react-hot-toast";

export const useImageUpload = (
  district: District | undefined,
  onSuccess: () => void
) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { updateDistrictImage } = useDistrictManager();

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!selectedImage || !district) {
      console.error("Selected image or district data is missing.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();

      formData.append("DistrictId", district.id);
      formData.append("Name", district.name);
      formData.append("Area", (district?.area ?? 0).toString());
      formData.append("Description", district?.description);
      formData.append("ImageUpload", selectedImage);

      // Alternatively, iterate through FormData entries
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      await updateDistrictImage(formData);

      toast.success("Hình ảnh đã được cập nhật");
      onSuccess();
      handleCloseModal();
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(
        error?.response.data.Message || "Đã xảy ra lỗi khi cập nhật hình ảnh"
      );
    } finally {
      setUploading(false);
    }
  };

  // Reset the form when the modal closes
  const handleCloseModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const openImageModal = () => {
    setIsImageModalOpen(true);
  };

  return {
    isImageModalOpen,
    selectedImage,
    imagePreview,
    uploading,
    handleImageChange,
    handleImageUpload,
    handleCloseModal,
    handleRemoveImage,
    openImageModal,
  };
};
