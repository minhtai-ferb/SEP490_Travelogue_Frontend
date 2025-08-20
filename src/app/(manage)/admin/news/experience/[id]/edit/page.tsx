"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Loader2 } from 'lucide-react';
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { MediaDto, NewsUpdateModel, useNews } from "@/services/use-news";
import toast from "react-hot-toast";
import LoadingContent from "@/components/common/loading-content";
import { LocationSelect } from "../../components/location-select";
import ContentEditor from "../../../components/content-editor";
import { ImageUpload } from "../../components/image-upload";
import BreadcrumbHeader from "@/components/common/breadcrumb-header";
import { TypeExperience, TypeExperienceName } from "@/types/News";

interface ExperienceData {
  id: string;
  title: string;
  description: string;
  content: string;
  locationId?: string;
  locationName?: string;
  isHighlighted: boolean;
  typeExperience?: TypeExperience; // Use TypeExperience enum
  medias?: Array<{ mediaUrl: string; isThumbnail: boolean }>;
}

const crumbs = [
  { label: "Quản lý tin tức", href: "/admin/news" },
  { label: "Danh sách trải nghiệm", href: "/admin/news/experience/table" },
  { label: "Chỉnh sửa trải nghiệm" },
];

export default function EditExperiencePage() {
  const router = useRouter();
  const params = useParams();
  const { getNewsById, updateNews, loading } = useNews();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    locationId: "",
    locationName: "",
    isHighlighted: false,
    typeExperience: TypeExperience.Adventure, // Default to Adventure
  });
  const [images, setImages] = useState<MediaDto[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const data: ExperienceData = await getNewsById(params.id as string);
        setFormData({
          title: data.title,
          description: data.description,
          content: data.content,
          locationId: data.locationId || "",
          locationName: data.locationName || "",
          isHighlighted: data.isHighlighted,
          typeExperience: data.typeExperience || TypeExperience.Adventure, // Use TypeExperience enum
        });

        if (data.medias) {
          const mediaDtos: MediaDto[] = data.medias.map((media) => ({
            mediaUrl: media.mediaUrl,
            isThumbnail: media.isThumbnail,
          }));
          setImages(mediaDtos);
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết trải nghiệm:", error);
        toast.error("Không thể tải chi tiết trải nghiệm");
        router.push("/admin/news/experience/table");
      } finally {
        setInitialLoading(false);
      }
    };

    if (params.id) {
      fetchExperience();
    }
  }, [params.id, getNewsById, router]);

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

      // Tạo payload theo NewsUpdateModel
      const payload: NewsUpdateModel = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        locationId: formData.locationId,
        isHighlighted: formData.isHighlighted,
        typeExperience: formData.typeExperience,
        mediaDtos: images.length > 0 ? images : undefined,
      };

      await updateNews(params.id as string, payload);
      toast.success("Cập nhật trải nghiệm thành công!");
      router.push(`/admin/news/experience/${params.id}`);
    } catch (error) {
      console.error("Lỗi khi cập nhật trải nghiệm:", error);
      toast.error("Không thể cập nhật trải nghiệm. Vui lòng thử lại.");
    }
  };

  if (initialLoading) {
    return <LoadingContent />;
  }

  return (
    <div>
      <BreadcrumbHeader items={crumbs} />
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Chỉnh Sửa Trải Nghiệm
          </h1>
          <p className="text-muted-foreground">Cập nhật thông tin trải nghiệm</p>
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
                    required
                    disabled={loading}
                  />
                </div>
                <LocationSelect
                  value={formData.locationId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, locationId: value })
                  }
                  onLocationChange={(location) =>
                    setFormData({
                      ...formData,
                      locationId: location?.id || "",
                      locationName: location?.name || "",
                    })
                  }
                  placeholder="Chọn địa điểm"
                  label="Địa điểm *"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô Tả *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
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
              <Link href={`/admin/news/experience/${params.id}`}>Hủy</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang Cập Nhật...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Cập Nhật Trải Nghiệm
                </>
              )}
            </Button>
          </div>
        </form>
      </div>{" "}
    </div>
  );
}
