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
}

export function BasicLocationInfo({ data, onChange }: BasicLocationInfoProps) {
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
        <Label htmlFor="name">Tên địa điểm *</Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Nhập tên địa điểm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="district">Quận/Huyện *</Label>
        <Select
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
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="address">Địa chỉ *</Label>
        <Input
          id="address"
          value={data.address}
          onChange={(e) => onChange({ address: e.target.value })}
          placeholder="Nhập địa chỉ chi tiết"
        />
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
