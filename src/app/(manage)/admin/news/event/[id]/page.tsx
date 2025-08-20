"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Trash2, MapPin, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DeleteConfirmDialog } from "../../components/delete-confirm-dialog";
import { useNews } from "@/services/use-news";
import LoadingContent from "@/components/common/loading-content";
import BreadcrumbHeader from "@/components/common/breadcrumb-header";

interface EventData {
  id: string;
  title: string;
  description: string;
  content: string;
  locationId: string;
  locationName: string;
  startDate: string;
  endDate: string;
  isHighlighted: boolean;
  medias?: Array<{ mediaUrl: string; isThumbnail: boolean }>;
}

const crumbs = [
  { label: "Quản lý tin tức", href: "/admin/news" },
  { label: "Danh sách sự kiện", href: "/admin/news/event/table" },
  { label: "Chi tiết sự kiện" },
];

export default function ViewEventPage() {
  const router = useRouter();
  const params = useParams();
  const { getNewsById, deleteNews, loading } = useNews();
  const [event, setEvent] = useState<EventData | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await getNewsById(params.id as string);
        const data = {
          ...res,
          startDate:
            new Date(res.startDate).toLocaleDateString("vi-VN") || "Không có",
          endDate:
            new Date(res.endDate).toLocaleDateString("vi-VN") || "Không có",
        };
        console.log("Event data:", res);
        
        setEvent(data);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết sự kiện:", error);
        toast.error("Không thể tải chi tiết sự kiện");
        router.push("/admin/news/event/table");
      }
    };

    if (params.id) {
      fetchEvent();
    }
  }, [params.id, getNewsById, router]);

  const handleDelete = async () => {
    try {
      await deleteNews(params.id as string);
      toast.success("Xóa sự kiện thành công");
      setIsDeleteOpen(false);
      router.push("/admin/news/event/table");
    } catch (error) {
      console.error("Lỗi khi xóa sự kiện:", error);
      toast.error("Không thể xóa sự kiện");
    }
  };

  if (loading || !event) {
    return <LoadingContent />;
  }

  return (
    <div>
      <BreadcrumbHeader items={crumbs} />
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  {event.title}
                </h1>
                {event.isHighlighted && (
                  <Badge variant="secondary">Nổi Bật</Badge>
                )}
              </div>
              <p className="text-muted-foreground">{event.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/admin/news/event/${event.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh Sửa
                </Link>
              </Button>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chi Tiết Sự Kiện</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Địa điểm:
                    </span>
                    <span>{event.locationName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Thời gian:
                    </span>
                    <span>
                      {event.startDate} - {event.endDate}
                    </span>
                  </div>
                </div>
                {/* <div className="text-xs text-muted-foreground space-y-1">
                  <p>Mã sự kiện: {event.id}</p>
                  <p>Mã địa điểm: {event.locationId}</p>
                </div> */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nội Dung</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: event.content }}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {event.medias && event.medias.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Hình Ảnh</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {event.medias.map((media, index) => (
                      <div key={index} className="relative">
                        <img
                          src={media.mediaUrl || "/placeholder_image.jpg"}
                          alt={`Hình ảnh sự kiện ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        {media.isThumbnail && (
                          <Badge
                            className="absolute top-2 left-2"
                            variant="secondary"
                          >
                            Ảnh Đại Diện
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <DeleteConfirmDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          onConfirm={handleDelete}
          title="Xóa Sự Kiện"
          description={`Bạn có chắc chắn muốn xóa "${event.title}"? Hành động này không thể hoàn tác.`}
        />
      </div>
    </div>
  );
}
