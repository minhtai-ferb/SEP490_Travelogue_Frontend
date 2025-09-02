"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin } from "lucide-react";
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
import { PriceRange } from "./price-range";

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
  minPrice: number;
  maxPrice: number;
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
    minPrice: 0,
    maxPrice: 0,
  });

  const [locationTypeData, setLocationTypeData] = useState<LocationTypeData>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    content?: string;
    address?: string;
    latitude?: string;
    longitude?: string;
    districtId?: string;
    locationType?: string;
    minPrice?: string;
    maxPrice?: string;
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

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Tên địa điểm là bắt buộc";
    } else if (formData.name.length > 200) {
      newErrors.name = "Tên địa điểm không được vượt quá 200 ký tự";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    } else if (formData.description.length > 500) {
      newErrors.description = "Mô tả không được vượt quá 500 ký tự";
    }

    // Content validation
    if (!formData.content.trim()) {
      newErrors.content = "Nội dung là bắt buộc";
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = "Địa chỉ là bắt buộc";
    } else if (formData.address.length > 300) {
      newErrors.address = "Địa chỉ không được vượt quá 300 ký tự";
    }

    // Latitude validation
    if (formData.latitude < -90 || formData.latitude > 90) {
      newErrors.latitude = "Vĩ độ phải nằm trong khoảng -90 đến 90";
    }

    // Longitude validation
    if (formData.longitude < -180 || formData.longitude > 180) {
      newErrors.longitude = "Kinh độ phải nằm trong khoảng -180 đến 180";
    }

    // District validation
    if (!formData.districtId) {
      newErrors.districtId = "Vui lòng chọn quận/huyện";
    }

    // Price validation
    if (formData.minPrice < 0) {
      newErrors.minPrice = "Giá tối thiểu không hợp lệ";
    }

    if (formData.maxPrice < 0) {
      newErrors.maxPrice = "Giá tối đa không hợp lệ";
    }

    if (formData.maxPrice > 0 && formData.minPrice > formData.maxPrice) {
      newErrors.minPrice = "Giá tối thiểu không được lớn hơn giá tối đa";
      newErrors.maxPrice = "Giá tối đa không được nhỏ hơn giá tối thiểu";
    }

    // Location type specific validation
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
        if (!rankValid) newErrors.heritageRank = "Xếp hạng phải từ 0 đến 5";
        if (!hasDate) newErrors.establishedDate = "Vui lòng chọn ngày";
        if (!hasType) newErrors.typeHistoricalLocation = "Vui lòng chọn loại di tích";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBasicInfoChange = (data: Partial<LocationFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    
    // Clear errors for fields being updated
    const updatedErrors = { ...errors };
    Object.keys(data).forEach(key => {
      if (updatedErrors[key as keyof typeof errors]) {
        delete updatedErrors[key as keyof typeof errors];
      }
    });
    setErrors(updatedErrors);
  };

  const handleLocationTypeChange = (type: LocationType) => {
    setFormData((prev) => ({ ...prev, locationType: type }));
    // Reset location type specific data when type changes
    setLocationTypeData({});
  };

  const handleLocationTypeDataChange = (data: Partial<LocationTypeData>) => {
    setLocationTypeData((prev) => ({ ...prev, ...data }));
    
    // Clear related errors when data changes
    if (data.historicalLocation) {
      const updatedErrors = { ...errors };
      delete updatedErrors.heritageRank;
      delete updatedErrors.establishedDate;
      delete updatedErrors.typeHistoricalLocation;
      setErrors(updatedErrors);
    }
  };

  const handleCoordinatesChange = (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
    
    // Clear coordinate errors when values change
    const updatedErrors = { ...errors };
    delete updatedErrors.latitude;
    delete updatedErrors.longitude;
    setErrors(updatedErrors);
  };

  const handleMediaChange = (mediaDtos: MediaDto[]) => {
    setFormData((prev) => ({ ...prev, mediaDtos }));
  };

  const handleTimeChange = (openTime: string, closeTime: string) => {
    setFormData((prev) => ({ ...prev, openTime, closeTime }));
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
    
    // Clear content error when value changes
    if (errors.content) {
      const updatedErrors = { ...errors };
      delete updatedErrors.content;
      setErrors(updatedErrors);
    }
  };

  const handlePriceChange = (minPrice: number, maxPrice: number) => {
    setFormData((prev) => ({ ...prev, minPrice, maxPrice }));
    
    // Clear price errors when values change
    const updatedErrors = { ...errors };
    delete updatedErrors.minPrice;
    delete updatedErrors.maxPrice;
    setErrors(updatedErrors);
  };

  const handleSubmit = async () => {
    // Validate form before submitting
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại các trường bắt buộc");
      return;
    }

    setIsSubmitting(true);
    try {
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
      toast.error("Có lỗi xảy ra khi tạo địa điểm. Vui lòng thử lại!");
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
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tạo địa điểm mới
          </h1>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
            Thêm thông tin chi tiết về địa điểm du lịch, làng nghề, ẩm thực hoặc di tích lịch sử để chia sẻ với cộng đồng
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

          {/* Price Range */}
          <PriceRange
            minPrice={formData.minPrice}
            maxPrice={formData.maxPrice}
            onChange={handlePriceChange}
            errors={{
              minPrice: errors.minPrice,
              maxPrice: errors.maxPrice,
            }}
          />

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
                errors={{
                  latitude: errors.latitude,
                  longitude: errors.longitude,
                }}
              />
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle>
                Nội dung chi tiết <span className="text-red-500">*</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ContentEditor
                content={formData.content}
                onChange={handleContentChange}
                error={errors.content}
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
