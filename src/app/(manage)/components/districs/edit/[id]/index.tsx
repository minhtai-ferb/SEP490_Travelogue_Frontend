"use client";

import { useRouter } from "next/navigation";
import { District } from "@/types/District";

interface DistrictEditFormProps {
  formData: Partial<District>;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  districtId: string;
  href: string;
}

export const DistrictEditForm = ({ 
  formData, 
  onFormChange, 
  onSubmit, 
  districtId,
  href
}: DistrictEditFormProps) => {
  const router = useRouter();

  const handleCancel = () => {
    router.push(`${href}/${districtId}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Chỉnh sửa quận huyện</h1>
        
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Tên quận huyện
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={onFormChange}
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
              onChange={onFormChange}
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
              onChange={onFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
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
  );
};
