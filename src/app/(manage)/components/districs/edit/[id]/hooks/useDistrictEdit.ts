"use client";

import { useEffect, useState } from "react";
import { District } from "@/types/District";
import { useDistrictManager } from "@/services/district-manager";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useDistrictEdit = (id: string, href: string) => {
  const [district, setDistrict] = useState<District | null>(null);
  const [formData, setFormData] = useState<Partial<District>>({});
  const { getDistrictById, updateDistrict, loading } = useDistrictManager();
  const router = useRouter();

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
        toast.error(errorMessage);
      }
    };

    fetchDistrict();
  }, [getDistrictById, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "area" ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDistrict(id, formData);
      toast.success("Cập nhật quận huyện thành công");
      router.push(`${href}/${id}`);
    } catch (error: any) {
      console.error("Error updating district:", error);
      const errorMessage =
        error?.response?.data.Message ||
        "Đã xảy ra lỗi khi cập nhật quận huyện";
      toast.error(errorMessage);
    }
  };

  return {
    district,
    formData,
    loading,
    handleChange,
    handleSubmit,
  };
};
