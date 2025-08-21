"use client";

import { FaMapMarkerAlt } from "react-icons/fa";
import { District } from "@/types/District";

interface DistrictDetailsProps {
  district?: District;
}

export const DistrictDetails = ({ district }: DistrictDetailsProps) => {
  return (
    <div className="border-t border-gray-200 pt-4 mt-2">
      <h3 className="text-lg font-medium mb-3">Thông tin</h3>
      <p className="text-gray-700 mb-4 leading-relaxed">
        {district?.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded">
          <span className="text-gray-500 text-sm">Diện tích:</span>
          <p className="font-medium">{district?.area} km²</p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <span className="text-gray-500 text-sm">Cập nhật:</span>
          <p className="font-medium">
            {district?.createdTime
              ? new Date(district.createdTime).toLocaleDateString()
              : "N/A"}
          </p>
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
  );
};
