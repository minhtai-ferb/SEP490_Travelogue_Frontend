"use client";

import { DistrictActions } from "./DistrictActions";
import { District } from "@/types/District";
import { DistrictHeroSection } from "./DistrictHeroSection";
import { DistrictDetails } from "./DistrictDetails";

interface DistrictContentProps {
  district?: District;
  href: string;
  onImageUpdateClick: () => void;
}

export const DistrictContent = ({ 
  district, 
  href,
  onImageUpdateClick 
}: DistrictContentProps) => {
  if (!district) return null;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header with background image */}
      <DistrictHeroSection
        district={district}
        onImageUpdateClick={onImageUpdateClick}
      />

      {/* Content section */}
      <div className="bg-white shadow-lg rounded-b-lg p-6">
        <DistrictActions districtId={district.id} href={href} />
        <DistrictDetails district={district} />
      </div>
    </div>
  );
};
