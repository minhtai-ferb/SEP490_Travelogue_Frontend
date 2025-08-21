"use client";

import { useRouter } from "next/navigation";

interface DistrictActionsProps {
  districtId: string;
  href: string;
}

export const DistrictActions = ({ districtId, href }: DistrictActionsProps) => {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-800">
        Chi tiết quận huyện
      </h2>
      <div className="flex gap-3">
        <button
          className="text-sm font-medium text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
          onClick={() => router.push(`${href}/edit/${districtId}`)}
        >
          Chỉnh sửa
        </button>
        <button className="text-sm font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 transition">
          Quản lý địa điểm
        </button>
      </div>
    </div>
  );
};
