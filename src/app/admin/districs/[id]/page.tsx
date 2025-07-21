"use client";

import { useEffect, useState } from "react";
import { use } from "react"; // Import use for unwrapping promises
import { District } from "@/types/District";
import { useDistrictManager } from "@/services/district-manager";
import { addToast, Image } from "@heroui/react";
import { Loader2, Upload, X } from "lucide-react"; // Added Upload and X icons
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FaMapMarkerAlt, FaCamera } from "react-icons/fa"; // Added FaCamera
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // Add dialog components
import { Button } from "@/components/ui/button"; // Add button component

const ViewDistricsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const [district, setDistrict] = useState<District>();
  const { getDistrictById, loading, updateDistrictImage } = useDistrictManager(); // Add updateDistrictImage function
  const router = useRouter();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { id } = use(params);

  useEffect(() => {
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

        // Display error using toast
        addToast({
          title: "Lỗi khi lấy dữ liệu quận huyện",
          description: errorMessage,
          color: "danger",
        });
      }
    };

    fetchDistrict();
  }, [getDistrictById, id]);

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

      // Retrieve DistrictId using FormData.get
      const districtId = formData.get("DistrictId");
      console.log("DistrictId:", districtId);

      // Alternatively, iterate through FormData entries
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const updatedDistrict = await updateDistrictImage(formData);

      setDistrict(updatedDistrict);

      addToast({
        title: "Thành công",
        description: "Hình ảnh đã được cập nhật",
        color: "success",
      });

      setIsImageModalOpen(false);
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error: any) {
      console.error("Error uploading image:", error);
      addToast({
        title: "Lỗi cập nhật hình ảnh",
        description: error?.message || "Đã xảy ra lỗi khi cập nhật hình ảnh",
        color: "danger",
      });
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

  return (
    <div className="flex flex-col gap-4 p-4">
      <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin/districs/">
                Quản lý quận huyện
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{district?.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="w-full max-w-5xl mx-auto">
          {/* Header with background image */}
          <div
            className="bg-cover bg-center h-48 rounded-t-lg relative"
            style={{
              backgroundImage: `url(${district?.medias && district.medias.length > 0
                ? district?.medias[0]?.mediaUrl
                : "/thanh_pho_tay_ninh.jpg"})`
            }}
          >
            {/* Add overlay button to update image */}
            <button
              className="absolute top-4 right-4 bg-black bg-opacity-60 text-white p-2 rounded-full hover:bg-opacity-80 transition-all z-10"
              onClick={() => setIsImageModalOpen(true)}
              title="Cập nhật hình ảnh"
            >
              <FaCamera size={18} />
            </button>

            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-t-lg">
              <div className="p-6 h-full flex items-end">
                <div className="text-white">
                  <h1 className="text-3xl font-bold">{district?.name}</h1>
                  <div className="flex items-center mt-2">
                    <FaMapMarkerAlt className="text-blue-300 mr-2" />
                    <span>Tây Ninh</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content section */}
          <div className="bg-white shadow-lg rounded-b-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Chi tiết quận huyện</h2>
              <div className="flex gap-3">
                <button
                  className="text-sm font-medium text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
                  onClick={() => router.push(`/admin/districs/edit/${id}`)} // Navigate to edit page
                >
                  Chỉnh sửa
                </button>
                <button className="text-sm font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 transition">
                  Quản lý địa điểm
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-2">
              <h3 className="text-lg font-medium mb-3">Thông tin</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">{district?.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-gray-500 text-sm">Diện tích:</span>
                  <p className="font-medium">{district?.area} km²</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-gray-500 text-sm">Cập nhật:</span>
                  <p className="font-medium">{district?.createdTime ? new Date(district.createdTime).toLocaleDateString() : "N/A"}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <a
                  href={`https://www.google.com/maps?q=${district?.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 flex items-center hover:underline"
                >
                  <FaMapMarkerAlt className="mr-2" />
                  Xem trên bản đồ
                </a>

                <span className="text-gray-500 text-sm">
                  ID: {district?.id?.substring(0, 8)}...
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Update Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cập nhật hình ảnh quận huyện</DialogTitle>
            <DialogDescription>
              Tải lên hình ảnh mới cho quận huyện {district?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {imagePreview ? (
              <div className="relative rounded-md overflow-hidden h-48">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => document.getElementById('image-upload')?.click()}>
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Nhấp để tải lên hoặc kéo và thả
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF lên đến 10MB
                  </p>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              disabled={uploading}
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleImageUpload}
              disabled={!selectedImage || uploading}
              className="ml-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tải lên...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewDistricsPage;
