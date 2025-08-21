"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { MediaDto, NewsUpdateModel, useNews } from "@/services/use-news";
import toast from "react-hot-toast";
import LoadingContent from "@/components/common/loading-content";
import { LocationSelect } from "../../components/location-select";
import ContentEditor from "../../../components/content-editor";
import { ImageUpload } from "../../components/image-upload";

interface EventData {
  id: string;
  title: string;
  description: string;
  content: string;
  newsCategory: number;
  locationId: string;
  locationName?: string;
  startDate: string;
  endDate: string;
  isHighlighted: boolean;
  medias?: Array<{ mediaUrl: string; isThumbnail: boolean }>;
}

export default function EditEvent({ href }: { href: string }) {
  const router = useRouter();
  const params = useParams();
  const { getNewsById, updateNews, loading } = useNews();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    locationId: "",
    locationName: "", // Add this
    startDate: "",
    endDate: "",
    isHighlighted: false,
    newsCategory: 2,
  });
  const [images, setImages] = useState<MediaDto[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data: EventData = await getNewsById(params.id as string);
        setFormData({
          title: data.title,
          description: data.description,
          content: data.content,
          locationId: data.locationId,
          newsCategory: 2,
          locationName: data.locationName || "", // Add this
          startDate: data.startDate
            ? new Date(data.startDate).toISOString().split("T")[0]
            : "Chưa có",
          endDate: data.endDate
            ? new Date(data.endDate).toISOString().split("T")[0]
            : "Chưa có",
          isHighlighted: data.isHighlighted,
        });

        if (data.medias) {
          const mediaDtos: MediaDto[] = data.medias.map((media) => ({
            mediaUrl: media.mediaUrl,
            isThumbnail: media.isThumbnail,
          }));
          setImages(mediaDtos);
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết sự kiện:", error);
        toast.error("Không thể tải chi tiết sự kiện");
        router.push(`${href}/event`);
      } finally {
        setInitialLoading(false);
      }
    };

    if (params.id) {
      fetchEvent();
    }
  }, [params.id, getNewsById, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!formData.title || !formData.description || !formData.content) {
        toast.error("Vui lòng điền đầy đủ thông tin bắt buộc.");
        return;
      }
      if (!formData.startDate || !formData.endDate) {
        toast.error("Vui lòng chọn ngày bắt đầu và kết thúc.");
        return;
      }
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        toast.error("Ngày bắt đầu không thể sau ngày kết thúc.");
        return;
      }

      // Tạo payload theo NewsUpdateModel
      const payload: NewsUpdateModel = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        locationId: formData.locationId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isHighlighted: formData.isHighlighted,
        newsCategory: formData.newsCategory,
        mediaDtos: images.length > 0 ? images : undefined,
      };

      await updateNews(params.id as string, payload);
      toast.success("Cập nhật sự kiện thành công!");
      router.push(`${href}/event/${params.id}`);
    } catch (error) {
      console.error("Lỗi khi cập nhật sự kiện:", error);
      toast.error("Không thể cập nhật sự kiện. Vui lòng thử lại.");
    }
  };

  if (initialLoading) {
    return <LoadingContent />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Chỉnh Sửa Sự Kiện</h1>
        <p className="text-muted-foreground">Cập nhật thông tin sự kiện</p>
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
                label="Địa điểm"
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

            <div className="flex items-center space-x-2">
              <Switch
                id="isHighlighted"
                checked={formData.isHighlighted}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isHighlighted: checked })
                }
                disabled={loading}
              />
              <Label htmlFor="isHighlighted">Đánh dấu nổi bật</Label>
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
            <Link href={`/admin/news/event/${params.id}`}>Hủy</Link>
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
                Cập Nhật Sự Kiện
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
