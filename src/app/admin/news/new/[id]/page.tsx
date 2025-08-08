"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, MapPin } from 'lucide-react';
import { toast } from "sonner";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DeleteConfirmDialog } from "../../components/delete-confirm-dialog";
import { useNews } from "@/services/use-news";
import LoadingContent from "@/components/common/loading-content";
import BreadcrumbHeader from "@/components/common/breadcrumb-header";

interface NewsData {
  id: string;
  title: string;
  description: string;
  content: string;
  locationId?: string;
  locationName?: string;
  isHighlighted: boolean;
  medias?: Array<{ mediaUrl: string; isThumbnail: boolean }>;
}

const crumbs = [
  { label: "Quản lý tin tức", href: "/admin/news" },
  { label: "Danh sách tin tức", href: "/admin/news/new/table" },
  { label: "Chi tiết tin tức" },
];

export default function ViewNewsPage() {
  const router = useRouter();
  const params = useParams();
  const { getNewsById, deleteNews, loading } = useNews();
  const [newsItem, setNewsItem] = useState<NewsData | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await getNewsById(params.id as string);
        setNewsItem(res);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết tin tức:", error);
        toast.error("Không thể tải chi tiết tin tức");
        router.push("/admin/news/new/table");
      }
    };

    if (params.id) {
      fetchNews();
    }
  }, [params.id, getNewsById, router]);

  const handleDelete = async () => {
    try {
      await deleteNews(params.id as string);
      toast.success("Xóa tin tức thành công");
      setIsDeleteOpen(false);
      router.push("/admin/news/new/table");
    } catch (error) {
      console.error("Lỗi khi xóa tin tức:", error);
      toast.error("Không thể xóa tin tức");
    }
  };

  if (loading || !newsItem) {
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
                  {newsItem.title}
                </h1>
                {newsItem.isHighlighted && (
                  <Badge variant="secondary">Nổi Bật</Badge>
                )}
              </div>
              <p className="text-muted-foreground">{newsItem.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/admin/news/new/${newsItem.id}/edit`}>
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
                <CardTitle>Chi Tiết Tin Tức</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Địa điểm:
                  </span>
                  <span>{newsItem.locationName ?? "Không có"}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nội Dung</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: newsItem.content }}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {newsItem.medias && newsItem.medias.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Hình Ảnh</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {newsItem.medias.map((media, index) => (
                      <div key={index} className="relative">
                        <img
                          src={media.mediaUrl || "/placeholder.svg?height=192&width=256&query=placeholder image"}
                          alt={`Hình ảnh tin tức ${index + 1}`}
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
          title="Xóa Tin Tức"
          description={`Bạn có chắc chắn muốn xóa "${newsItem.title}"? Hành động này không thể hoàn tác.`}
        />
      </div>
    </div>
  );
}
