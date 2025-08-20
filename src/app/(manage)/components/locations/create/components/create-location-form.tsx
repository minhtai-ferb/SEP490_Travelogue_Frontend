"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLocations } from "@/services/use-locations";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useCleanupImages } from "../hooks/useCleanupImages";
import {
  LocationType,
  MediaDto,
  type TypeHistoricalLocation,
} from "../types/CreateLocation";
import { BasicLocationInfo } from "./basic-location-info";
import ContentEditor from "./content-editor";
import { CuisineForm } from "./cuisine-form";
import { HistoricalLocationForm } from "./historical-location-form";
import { ImageUpload } from "./image-upload";
import { LocationTypeSelector } from "./location-type-selector";
import { MapSelector } from "./map-selector";
import { TimeSelector } from "./time-selector";

interface LocationFormData {
  name: string;
  description: string;
  content: string;
  address: string;
  latitude: number;
  longitude: number;
  openTime: string;
  closeTime: string;
  districtId: string;
  locationType: LocationType;
  mediaDtos: MediaDto[];
}

interface LocationTypeData {
  cuisine?: {
    signatureProduct: string;
    cookingMethod: string;
    cuisineType: string;
    phoneNumber: string;
    email: string;
    website: string;
  };
  craftVillage?: {
    phoneNumber: string;
    email: string;
    website: string;
    workshopsAvailable: boolean;
    signatureProduct: string;
    yearsOfHistory: number;
    isRecognizedByUnesco: boolean;
  };
  historicalLocation?: {
    heritageRank: number;
    establishedDate: string;
    typeHistoricalLocation: TypeHistoricalLocation;
  };
}

export function CreateLocationForm({ href }: { href: string }) {
  const [formData, setFormData] = useState<LocationFormData>({
    name: "",
    description: "",
    content: "",
    address: "",
    latitude: 0,
    longitude: 0,
    openTime: "",
    closeTime: "",
    districtId: "",
    locationType: LocationType.ScenicSpot,
    mediaDtos: [],
  });

  const [locationTypeData, setLocationTypeData] = useState<LocationTypeData>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    districtId?: string;
    address?: string;
    heritageRank?: string;
    establishedDate?: string;
    typeHistoricalLocation?: string;
  }>({});
  const router = useRouter();
  const { addHistoricalLocation, addCuisine, createLocation, deleteMediaByFileName } = useLocations();

  // Hook để xóa hình ảnh khi rời khỏi trang
  const { cleanupImages } = useCleanupImages({
    mediaDtos: formData.mediaDtos,
    isSubmitting,
    isSuccess,
  });

  const handleBasicInfoChange = (data: Partial<LocationFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    // Inline validate as user types/selects
    if (Object.prototype.hasOwnProperty.call(data, "name")) {
      const value = String(data.name ?? "");
      setErrors((prev) => ({
        ...prev,
        name: value.trim() ? undefined : "Vui lòng nhập tên địa điểm",
      }));
    }
    if (Object.prototype.hasOwnProperty.call(data, "districtId")) {
      const value = String(data.districtId ?? "");
      setErrors((prev) => ({
        ...prev,
        districtId: value ? undefined : "Vui lòng chọn quận/huyện",
      }));
    }
    if (Object.prototype.hasOwnProperty.call(data, "address")) {
      const value = String(data.address ?? "");
      setErrors((prev) => ({
        ...prev,
        address: value.trim() ? undefined : "Vui lòng nhập địa chỉ",
      }));
    }
  };

  const handleLocationTypeChange = (type: LocationType) => {
    setFormData((prev) => ({ ...prev, locationType: type }));
    // Reset location type specific data when type changes
    setLocationTypeData({});
  };

  const handleLocationTypeDataChange = (data: Partial<LocationTypeData>) => {
    setLocationTypeData((prev) => ({ ...prev, ...data }));
  };

  const handleCoordinatesChange = (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleMediaChange = (mediaDtos: MediaDto[]) => {
    setFormData((prev) => ({ ...prev, mediaDtos }));
  };

  const handleTimeChange = (openTime: string, closeTime: string) => {
    setFormData((prev) => ({ ...prev, openTime, closeTime }));
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Validate basic required fields
      const basicErrors: typeof errors = {};
      if (!formData.name.trim())
        basicErrors.name = "Vui lòng nhập tên địa điểm";
      if (!formData.districtId)
        basicErrors.districtId = "Vui lòng chọn quận/huyện";
      if (!formData.address.trim())
        basicErrors.address = "Vui lòng nhập địa chỉ";

      if (basicErrors.name || basicErrors.districtId || basicErrors.address) {
        setErrors((prev) => ({ ...prev, ...basicErrors }));
        setIsSubmitting(false);
        return;
      }

      // Validate type-specific required fields before submitting
      if (formData.locationType === LocationType.HistoricalSite) {
        const hist = locationTypeData.historicalLocation;
        const hasDate = Boolean(hist?.establishedDate);
        const hasType =
          hist?.typeHistoricalLocation !== undefined &&
          hist?.typeHistoricalLocation !== null;
        const rank =
          typeof hist?.heritageRank === "number" ? hist?.heritageRank : -1;
        const rankValid = rank >= 0 && rank <= 5;
        if (!hist || !hasDate || !hasType || !rankValid) {
          setErrors((prev) => ({
            ...prev,
            heritageRank: rankValid ? undefined : "Xếp hạng phải từ 0 đến 5",
            establishedDate: hasDate ? undefined : "Vui lòng chọn ngày",
            typeHistoricalLocation: hasType
              ? undefined
              : "Vui lòng chọn loại di tích",
          }));
          setIsSubmitting(false);
          return;
        }
      }

      // Create main location
      const locationResponse = await createLocation(formData);
      const locationId = await locationResponse.id;
      // Create location type specific data
      if (
        formData.locationType === LocationType.Cuisine &&
        locationTypeData.cuisine
      ) {
        await addCuisine(locationId, locationTypeData.cuisine);
      } else if (
        formData.locationType === LocationType.HistoricalSite &&
        locationTypeData.historicalLocation
      ) {
        await addHistoricalLocation(
          locationId,
          locationTypeData.historicalLocation
        );
      }
      // Success notification
      setIsSuccess(true); // Đánh dấu tạo thành công để không xóa ảnh
      toast.success("Địa điểm đã được tạo thành công!");
      router.push(href);
    } catch (error) {
      console.error("Error creating location:", error);
      setErrors({
        name: "Vui lòng kiểm tra lại các trường bắt buộc và thử lại",
        districtId: "Vui lòng kiểm tra lại các trường bắt buộc và thử lại",
        address: "Vui lòng kiểm tra lại các trường bắt buộc và thử lại",
      });
      toast.error("Vui lòng kiểm tra lại các trường bắt buộc và thử lại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    // Xóa hết những hình ảnh đã tải lên
    if (formData.mediaDtos.length > 0) {
      try {
        await cleanupImages();
        toast.success("Đã xóa tất cả hình ảnh đã tải lên!");
      } catch (error) {
        console.error("Error deleting media files:", error);
        toast.error("Có lỗi xảy ra khi xóa hình ảnh");
      }
    }
    
    router.push(href);
  };

  const renderLocationTypeForm = () => {
    switch (formData.locationType) {
      case LocationType.Cuisine:
        return (
          <CuisineForm
            data={locationTypeData.cuisine}
            onChange={(data) => handleLocationTypeDataChange({ cuisine: data })}
          />
        );
      case LocationType.HistoricalSite:
        return (
          <HistoricalLocationForm
            data={locationTypeData.historicalLocation}
            onChange={(data) =>
              handleLocationTypeDataChange({ historicalLocation: data })
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Tạo địa điểm mới</h1>
          <p className="text-muted-foreground mt-2">
            Thêm thông tin chi tiết về địa điểm du lịch, làng nghề, ẩm thực hoặc
            di tích lịch sử
          </p>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent>
              <BasicLocationInfo
                data={formData}
                onChange={handleBasicInfoChange}
                errors={errors}
              />
            </CardContent>
          </Card>
          {/* Time Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Giờ hoạt động</CardTitle>
            </CardHeader>
            <CardContent>
              <TimeSelector
                openTime={formData.openTime}
                closeTime={formData.closeTime}
                onChange={handleTimeChange}
              />
            </CardContent>
          </Card>

          {/* Image Upload */}
          <ImageUpload
            mediaDtos={formData.mediaDtos}
            onChange={handleMediaChange}
            isLoading={isSubmitting}
          />

          {/* Location Type */}
          <Card>
            <CardHeader>
              <CardTitle>Loại địa điểm</CardTitle>
            </CardHeader>
            <CardContent>
              <LocationTypeSelector
                selectedType={formData.locationType}
                onChange={handleLocationTypeChange}
              />
            </CardContent>
          </Card>

          {/* Location Type Specific Form */}
          {renderLocationTypeForm()}

          {/* Map Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Vị trí trên bản đồ</CardTitle>
            </CardHeader>
            <CardContent>
              <MapSelector
                address={formData.address}
                latitude={formData.latitude}
                longitude={formData.longitude}
                center={[formData.latitude, formData.longitude]}
                onChange={handleCoordinatesChange}
              />
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Nội dung chi tiết</CardTitle>
            </CardHeader>
            <CardContent>
              <ContentEditor
                content={formData.content}
                onChange={handleContentChange}
              />
            </CardContent>
          </Card>

          <Separator />

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button onClick={handleCancel} variant="outline" size="lg">
              Hủy
            </Button>
            <Button size="lg" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Đang tạo..." : "Tạo địa điểm"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
