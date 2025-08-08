"use client";

import Image from "next/image";
import { MoreVertical } from "lucide-react";
import { useState } from "react";

interface CityCardProps {
  cityImage: string;
  cityName: string;
}

function CityCard({ cityImage, cityName }: CityCardProps) {

  return (
    <div className="bg-white w-60 h-50 rounded-lg shadow-lg overflow-hidden relative">
      <Image
        src={cityImage}
        alt={cityName}
        width={256}
        height={160}
        className="object-cover w-full h-32"
      />
      <div className="p-2 h-8 flex justify-between items-center relative">
        <p className="text-xs text-black font-semibold">{cityName}</p>
        <button
          className="text-gray-500 hover:text-gray-700"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
        
      </div>
    </div>
  );
}

export default CityCard;
