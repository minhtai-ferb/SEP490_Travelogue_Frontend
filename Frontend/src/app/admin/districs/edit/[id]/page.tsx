"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { District } from "@/types/District";
import { useDistrictManager } from "@/services/district-manager";
import { addToast } from "@heroui/react";
import { Loader2 } from "lucide-react";
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
import { useRouter } from "next/navigation";

const EditDistrictPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const [district, setDistrict] = useState<District | null>(null);
  const [formData, setFormData] = useState<Partial<District>>({});
  const { getDistrictById, updateDistrict, loading } = useDistrictManager();
  const router = useRouter();
  
  // Unwrap the params Promise to get the district ID
  const { id } = use(params);
  
  useEffect(() => {
    const fetchDistrict = async () => {
      try {
        const response: District = await getDistrictById(id);
        if (!response) {
          throw new Error("No data returned from API getDistrictById");
        }
        
        setDistrict(response);
        setFormData({
          name: response.name,
          description: response.description,
          area: response.area,
        });
      } catch (error: any) {
        console.error("Error fetching district:", error);
        const errorMessage =
          error?.response?.data.Message ||
          "Đã xảy ra lỗi khi lấy dữ liệu quận huyện";
          
        addToast({
          title: "Lỗi khi lấy dữ liệu quận huyện",
          description: errorMessage,
          color: "danger",
        });
      }
    };
    
    fetchDistrict();
  }, [getDistrictById, id]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'area' ? parseFloat(value) : value,
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDistrict(id, formData);
      addToast({
        title: "Thành công",
        description: "Cập nhật quận huyện thành công",
        color: "success",
      });
      router.push(`/admin/districs/${id}`);
    } catch (error: any) {
      console.error("Error updating district:", error);
      const errorMessage =
        error?.response?.data.Message ||
        "Đã xảy ra lỗi khi cập nhật quận huyện";
        
      addToast({
        title: "Lỗi khi cập nhật quận huyện",
        description: errorMessage,
        color: "danger",
      });
    }
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
              <BreadcrumbLink href={`/admin/districs/${id}`}>
                {district?.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Chỉnh sửa</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">Chỉnh sửa quận huyện</h1>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Tên quận huyện
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                  Diện tích (km²)
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="area"
                  name="area"
                  value={formData.area || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => router.push(`/admin/districs/${id}`)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditDistrictPage;
