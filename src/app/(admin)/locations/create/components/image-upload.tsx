"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, X } from "lucide-react";
import { Upload as AntUpload, message, Checkbox, Image } from "antd";
import type { UploadProps } from "antd";
import { useLocations } from "@/services/use-locations";

interface MediaDto {
  url: string;
  isThumbnail: boolean;
}

interface ImageUploadProps {
  mediaDtos: MediaDto[];
  onChange: (mediaDtos: MediaDto[]) => void;
  isLoading?: boolean;
}

export function ImageUpload({
  mediaDtos,
  onChange,
  isLoading = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { uploadMediaMultiple, deleteMediaByFileName } = useLocations();
  const handleUpload = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      setUploading(true);
      try {
        const uploadedFiles = await uploadMediaMultiple(files);

        if (uploadedFiles && Array.isArray(uploadedFiles)) {
          const newMediaDtos = uploadedFiles.map((file: any) => ({
            url: file.url || file.fileName || file,
            isThumbnail: false,
          }));

          onChange([...mediaDtos, ...newMediaDtos]);
          message.success(`Đã tải lên ${files.length} hình ảnh thành công!`);
        }
      } catch (error) {
        console.error("Upload error:", error);
        message.error("Có lỗi xảy ra khi tải lên hình ảnh");
      } finally {
        setUploading(false);
      }
    },
    [mediaDtos, onChange, uploadMediaMultiple]
  );

  const handleDelete = useCallback(
    async (url: string) => {
      try {
        // Extract filename from URL
        const fileName = url.split("/").pop() || url;
        await deleteMediaByFileName(fileName);

        const updatedMediaDtos = mediaDtos.filter((media) => media.url !== url);
        onChange(updatedMediaDtos);
        message.success("Đã xóa hình ảnh thành công!");
      } catch (error) {
        console.error("Delete error:", error);
        message.error("Có lỗi xảy ra khi xóa hình ảnh");
      }
    },
    [mediaDtos, onChange, deleteMediaByFileName]
  );

  const handleSetThumbnail = useCallback(
    (url: string) => {
      const updatedMediaDtos = mediaDtos.map((media) => ({
        ...media,
        isThumbnail: media.url === url,
      }));
      onChange(updatedMediaDtos);
      message.success("Đã đặt làm ảnh đại diện!");
    },
    [mediaDtos, onChange]
  );

  const uploadProps: UploadProps = {
    multiple: true,
    accept: "image/*",
    showUploadList: false,
    beforeUpload: (file, fileList) => {
      const files = fileList || [file];
      handleUpload(files);
      return false; // Prevent default upload
    },
  };

  const hasThumbnail = mediaDtos.some((media) => media.isThumbnail);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hình ảnh</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <AntUpload.Dragger {...uploadProps} disabled={uploading || isLoading}>
          <div className="flex flex-col items-center justify-center py-8">
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">
              {uploading
                ? "Đang tải lên..."
                : "Kéo thả hoặc click để tải lên hình ảnh"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Hỗ trợ: JPG, PNG, GIF (tối đa 10MB mỗi file)
            </p>
          </div>
        </AntUpload.Dragger>

        {/* Image Grid */}
        {mediaDtos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mediaDtos.map((media, index) => (
              <div
                key={`${media.url}-${index}`}
                className="relative group aspect-square rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors flex justify-center items-center"
              >
                {/* Ant Design Image */}
                <Image
                  src={media.url || "placeholder_image.jpg"}
                  fallback="/placeholder_image.jpg?height=200&width=200"
                  preview
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />

                {/* Nút xoá góc trên bên phải */}
                <Button
                  size="sm"
                  type="button"
                  variant="ghost"
                  className="absolute top-2 right-2 h-5 w-5 z-10 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(media.url)}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                {/* Checkbox chọn ảnh đại diện ở góc trái */}
                {(!hasThumbnail || media.isThumbnail) && (
                  <Checkbox
                    checked={media.isThumbnail}
                    className="absolute top-2 left-2 z-10 [&_.ant-checkbox-inner]:bg-white/20 [&_.ant-checkbox-inner]:border-primary [&_.ant-checkbox-checked_.ant-checkbox-inner]:bg-primary [&_.ant-checkbox-checked_.ant-checkbox-inner]:border-primary"
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleSetThumbnail(media.url);
                      } else {
                        const updatedMediaDtos = mediaDtos.map((m) => ({
                          ...m,
                          isThumbnail: false,
                        }));
                        onChange(updatedMediaDtos);
                        message.success("Đã bỏ chọn ảnh đại diện!");
                      }
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Info Text */}
        {mediaDtos.length > 0 && (
          <div className="text-sm text-muted-foreground flex justify-between">
            <p>Đã tải lên {mediaDtos.length} hình ảnh</p>
            {hasThumbnail && (
              <p className="text-primary">✓ Đã chọn ảnh đại diện</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
