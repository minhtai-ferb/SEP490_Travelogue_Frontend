"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Loader2 } from 'lucide-react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MediaDto, NewsCreateModel, useNews } from "@/services/use-news";
import BreadcrumbHeader from "@/components/common/breadcrumb-header";
import toast from "react-hot-toast";
import { TypeExperience, TypeExperienceName } from "@/types/News";
import { LocationSelect } from "../components/location-select";
import { ImageUpload } from "../components/image-upload";
import ContentEditor from "../../components/content-editor";

const crumbs = [
  { label: "Quản lý tin tức", href: "/admin/news" },
  { label: "Danh sách trải nghiệm", href: "/admin/news/experience/table" },
  { label: "Tạo trải nghiệm mới" },
];

export default function CreateExperiencePage() {
  const router = useRouter();
  const { createNews, loading } = useNews();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    locationId: "",
    isHighlighted: false,
    typeExperience: TypeExperience.Adventure, 
  });
  const [images, setImages] = useState<MediaDto[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!formData.title || !formData.description || !formData.content) {
        toast.error("Vui lòng điền đầy đủ thông tin bắt buộc.");
        return;
      }
      if (!formData.locationId) {
        toast.error("Vui lòng chọn địa điểm cho trải nghiệm.");
        return;
      }

      // Tạo payload theo NewsCreateModel
      const payload: NewsCreateModel = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        newsCategory: 3, 
        locationId: formData.locationId,
        isHighlighted: formData.isHighlighted,
        typeExperience: formData.typeExperience,
        mediaDtos: images.length > 0 ? images : undefined,
      };

      await createNews(payload);
      toast.success("Tạo trải nghiệm thành công!");
      router.push("/admin/news/experience/table");
    } catch (error) {
      console.error("Lỗi khi tạo trải nghiệm:", error);
      toast.error("Không thể tạo trải nghiệm. Vui lòng thử lại.");
    }
  };

  return (
    <div>
      <BreadcrumbHeader items={crumbs} />
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Tạo Trải Nghiệm Mới</h1>
          <p className="text-muted-foreground">
            Thêm trải nghiệm mới vào hệ thống. Vui lòng điền đầy đủ thông tin cần
            thiết.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Cơ Bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu Đề *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Nhập tiêu đề trải nghiệm"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <LocationSelect
                    value={formData.locationId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, locationId: value })
                    }
                    onLocationChange={(location) =>
                      setFormData({
                        ...formData,
                        locationId: location?.id || "",
                      })
                    }
                    placeholder="Chọn địa điểm"
                    label="Địa điểm *"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô Tả *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Nhập mô tả ngắn về trải nghiệm"
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="typeExperience">Loại Trải Nghiệm *</Label>
                  <Select
                    value={String(formData.typeExperience)}
                    onValueChange={(value) =>
                      setFormData({ ...formData, typeExperience: Number(value) })
                    }
                    disabled={loading}
                  >
                    <SelectTrigger id="typeExperience">
                      <SelectValue placeholder="Chọn loại trải nghiệm" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(TypeExperience)
                        .filter(value => typeof value === 'number') // Filter to get only numeric enum values
                        .map((typeValue) => (
                          <SelectItem key={typeValue} value={String(typeValue)}>
                            {TypeExperienceName[TypeExperience[typeValue as TypeExperience] as keyof typeof TypeExperienceName]}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col items-start justify-evenly space-y-2">
                  <Label className="text-sm" htmlFor="isHighlighted">Đánh dấu nổi bật</Label>
                  <Switch
                    id="isHighlighted"
                    checked={formData.isHighlighted}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isHighlighted: checked })
                    }
                    disabled={loading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <ImageUpload mediaDtos={images} onChange={setImages} />

          <Card>
            <CardHeader>
              <CardTitle>Nội Dung Chi Tiết</CardTitle>
            </CardHeader>
            <CardContent>
              <ContentEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" asChild disabled={loading}>
              <Link href="/admin/news/experience/table">Hủy</Link>
            </Button>
            <Button disabled={loading} onClick={handleSubmit}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang Tạo...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Tạo Trải Nghiệm
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
