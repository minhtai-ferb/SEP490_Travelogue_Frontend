"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Upload, X } from "lucide-react";
import { District } from "@/types/District";

interface ImageUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  district?: District;
  selectedImage: File | null;
  imagePreview: string | null;
  uploading: boolean;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageUpload: () => void;
  onRemoveImage: () => void;
}

export const ImageUpdateModal = ({
  isOpen,
  onClose,
  district,
  selectedImage,
  imagePreview,
  uploading,
  onImageChange,
  onImageUpload,
  onRemoveImage,
}: ImageUpdateModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật hình ảnh quận huyện</DialogTitle>
          <DialogDescription>
            Tải lên hình ảnh mới cho quận huyện {district?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {imagePreview ? (
            <div className="relative rounded-md overflow-hidden h-48">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                onClick={onRemoveImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Nhấp để tải lên hoặc kéo và thả
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF lên đến 10MB
                </p>
              </div>
              <input
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={onImageChange}
              />
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={uploading}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={onImageUpload}
            disabled={!selectedImage || uploading}
            className="ml-2"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tải lên...
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
