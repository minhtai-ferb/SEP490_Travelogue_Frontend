"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDistrictManager } from "@/services/district-manager";
import { useEffect, useState } from "react";
import { District } from "@/types/District";

interface BasicLocationInfoProps {
  data: {
    name: string;
    description: string;
    address: string;
    districtId: string;
  };
  onChange: (data: any) => void;
  errors: {
    name?: string;
    districtId?: string;
    address?: string;
  };
}

export function BasicLocationInfo({ data, onChange, errors }: BasicLocationInfoProps) {
  const { getAllDistrict } = useDistrictManager();
  const [districts, setDistricts] = useState<District[]>([]);
  useEffect(() => {
    const fetchDistricts = async () => {
      const response: District[] = await getAllDistrict();
      if (response) {
        setDistricts(response);
      }
    };
    fetchDistricts();
  }, [getAllDistrict]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="name">
          Tên địa điểm <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Nhập tên địa điểm"
          required
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name ? (
          <div className="text-xs text-red-500">{errors.name}</div>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="district">
          Quận/Huyện <span className="text-red-500">*</span>
        </Label>
        <Select
          required
          value={data.districtId}
          onValueChange={(value) => onChange({ districtId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn quận/huyện" />
          </SelectTrigger>
          <SelectContent>
            {districts.map((district) => (
              <SelectItem key={district.id} value={district.id}>
                {district.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.districtId ? (
          <div className="text-xs text-red-500">{errors.districtId}</div>
        ) : null}
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="address">
          Địa chỉ <span className="text-red-500">*</span>
        </Label>
        <Input
          required
          id="address"
          value={data.address}
          onChange={(e) => onChange({ address: e.target.value })}
          placeholder="Nhập địa chỉ chi tiết"
          className={errors.address ? "border-red-500" : ""}
        />
        {errors.address ? (
          <div className="text-xs text-red-500">{errors.address}</div>
        ) : null}
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="description">Mô tả ngắn</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Nhập mô tả ngắn về địa điểm"
          rows={3}
        />
      </div>
    </div>
  );
}
