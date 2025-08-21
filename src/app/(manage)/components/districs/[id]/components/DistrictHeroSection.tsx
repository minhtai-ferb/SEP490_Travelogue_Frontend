"use client";

import { FaCamera, FaMapMarkerAlt } from "react-icons/fa";
import { District } from "@/types/District";

interface DistrictHeroSectionProps {
  district?: District;
  onImageUpdateClick: () => void;
}

export const DistrictHeroSection = ({ 
  district, 
  onImageUpdateClick 
}: DistrictHeroSectionProps) => {
  return (
    <div
      className="bg-cover bg-center h-48 rounded-t-lg relative"
      style={{
        backgroundImage: `url(${
          district?.medias && district.medias.length > 0
            ? district?.medias[0]?.mediaUrl
            : "/thanh_pho_tay_ninh.jpg"
        })`,
      }}
    >
      {/* Add overlay button to update image */}
      <button
        className="absolute top-4 right-4 bg-black bg-opacity-60 text-white p-2 rounded-full hover:bg-opacity-80 transition-all z-10"
        onClick={onImageUpdateClick}
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
  );
};
