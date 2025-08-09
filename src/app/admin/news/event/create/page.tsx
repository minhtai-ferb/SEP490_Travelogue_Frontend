"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MediaDto, NewsCreateModel, useNews } from "@/services/use-news";
import ContentEditor from "../../components/content-editor";
import BreadcrumbHeader from "@/components/common/breadcrumb-header";
import { LocationSelect } from "../components/location-select";
import { ImageUpload } from "../components/image-upload";
import toast from "react-hot-toast";

const crumbs = [
  { label: "Quản lý tin tức", href: "/admin/news" },
  { label: "Danh sách sự kiện", href: "/admin/news/event/table" },
  { label: "Tạo sự kiện mới" },
];

export default function CreateEventPage() {
  const router = useRouter();
  const { createNews, loading } = useNews();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    locationId: "",
    startDate: "",
    endDate: "",
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
      // Kiểm tra ngày bắt đầu và kết thúc
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        toast.error("Ngày bắt đầu không thể lớn hơn ngày kết thúc.");
        return;
      }
      if (!formData.locationId) {
        toast.error("Vui lòng chọn địa điểm cho sự kiện.");
        return;
      }
      if (!formData.startDate || !formData.endDate) {
        toast.error("Vui lòng chọn ngày bắt đầu và kết thúc.");
        return;
      }
      // Tạo payload theo NewsCreateModel
      const payload: NewsCreateModel = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        newsCategory: 2, // Event category
        locationId: formData.locationId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isHighlighted: formData.isHighlighted,
        mediaDtos: images.length > 0 ? images : undefined,
      };

      await createNews(payload);
      toast.success("Tạo sự kiện thành công!");
      router.push("/admin/news/event/table");
    } catch (error) {
      console.error("Lỗi khi tạo sự kiện:", error);
      toast.error("Không thể tạo sự kiện. Vui lòng thử lại.");
    }
  };

  return (
    <div>
      <BreadcrumbHeader items={crumbs} />
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Tạo Sự Kiện Mới</h1>
          <p className="text-muted-foreground">
            Thêm sự kiện mới vào hệ thống. Vui lòng điền đầy đủ thông tin cần
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
                    placeholder="Nhập tiêu đề sự kiện"
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
                    label="Địa điểm"
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
                  placeholder="Nhập mô tả ngắn về sự kiện"
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Ngày Bắt Đầu *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Ngày Kết Thúc *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    required
                    disabled={loading}
                  />
                </div>
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
              <Link href="/admin/news/event/table">Hủy</Link>
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
                  Tạo Sự Kiện
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
