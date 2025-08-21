"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MediaDto, NewsCreateModel, useNews } from "@/services/use-news";
import toast from "react-hot-toast";
import { LocationSelect } from "../components/location-select";
import { ImageUpload } from "../components/image-upload";
import ContentEditor from "../../components/content-editor";

export default function CreateNews({ href }: { href: string }) {
  const router = useRouter();
  const { createNews, loading } = useNews();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    locationId: "",
    isHighlighted: false,
  });
  const [images, setImages] = useState<MediaDto[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!formData.title || !formData.description || !formData.content) {
        toast.error("Vui lòng điền đầy đủ thông tin bắt buộc.");
        return;
      }

      // Tạo payload theo NewsCreateModel
      const payload: NewsCreateModel = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        newsCategory: 1, // Category for News
        locationId: formData.locationId || undefined, // Optional
        isHighlighted: formData.isHighlighted,
        mediaDtos: images.length > 0 ? images : undefined,
      };

      await createNews(payload);
      toast.success("Tạo tin tức thành công!");
      router.push( `${href}/new`);
    } catch (error) {
      console.error("Lỗi khi tạo tin tức:", error);
      toast.error("Không thể tạo tin tức. Vui lòng thử lại.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Tạo Tin Tức Mới</h1>
        <p className="text-muted-foreground">
          Thêm tin tức mới vào hệ thống. Vui lòng điền đầy đủ thông tin cần
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
                  placeholder="Nhập tiêu đề tin tức"
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
                  placeholder="Chọn địa điểm (Tùy chọn)"
                  label="Địa điểm (Tùy chọn)"
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
                placeholder="Nhập mô tả ngắn về tin tức"
                required
                disabled={loading}
              />
            </div>

            <div className="flex flex-col items-start space-y-2">
              <Label htmlFor="isHighlighted">Đánh dấu nổi bật</Label>
              <Switch
                id="isHighlighted"
                checked={formData.isHighlighted}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isHighlighted: checked })
                }
                disabled={loading}
              />
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
            <Link href="/admin/news/new/table">Hủy</Link>
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
                Tạo Tin Tức
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
