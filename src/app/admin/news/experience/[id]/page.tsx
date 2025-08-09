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
import { getTypeExperienceLabel } from "@/types/News";

interface ExperienceData {
  id: string;
  title: string;
  description: string;
  content: string;
  locationId?: string;
  locationName?: string;
  isHighlighted: boolean;
  typeExperience?: number;
  medias?: Array<{ mediaUrl: string; isThumbnail: boolean }>;
}

const crumbs = [
  { label: "Quản lý tin tức", href: "/admin/news" },
  { label: "Danh sách trải nghiệm", href: "/admin/news/experience/table" },
  { label: "Chi tiết trải nghiệm" },
];

export default function ViewExperiencePage() {
  const router = useRouter();
  const params = useParams();
  const { getNewsById, deleteNews, loading } = useNews();
  const [experienceItem, setExperienceItem] = useState<ExperienceData | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await getNewsById(params.id as string);
        setExperienceItem(res);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết trải nghiệm:", error);
        toast.error("Không thể tải chi tiết trải nghiệm");
        router.push("/admin/news/experience/table");
      }
    };

    if (params.id) {
      fetchExperience();
    }
  }, [params.id, getNewsById, router]);

  const handleDelete = async () => {
    try {
      await deleteNews(params.id as string);
      toast.success("Xóa trải nghiệm thành công");
      setIsDeleteOpen(false);
      router.push("/admin/news/experience/table");
    } catch (error) {
      console.error("Lỗi khi xóa trải nghiệm:", error);
      toast.error("Không thể xóa trải nghiệm");
    }
  };

  if (loading || !experienceItem) {
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
                  {experienceItem.title}
                </h1>
                {experienceItem.isHighlighted && (
                  <Badge variant="secondary">Nổi Bật</Badge>
                )}
              </div>
              <p className="text-muted-foreground">{experienceItem.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/admin/news/experience/${experienceItem.id}/edit`}>
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
                <CardTitle>Chi Tiết Trải Nghiệm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Địa điểm:
                  </span>
                  <span>{experienceItem.locationName ?? "Không có"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Loại Trải nghiệm:
                  </span>
                  <span>
                    {getTypeExperienceLabel(experienceItem.typeExperience || 0) ?? "Không xác định"}
                  </span>
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
                  dangerouslySetInnerHTML={{ __html: experienceItem.content }}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {experienceItem.medias && experienceItem.medias.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Hình Ảnh</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {experienceItem.medias.map((media, index) => (
                      <div key={index} className="relative">
                        <img
                          src={media.mediaUrl || "/placeholder.svg?height=192&width=256&query=placeholder image"}
                          alt={`Hình ảnh trải nghiệm ${index + 1}`}
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
          title="Xóa Trải Nghiệm"
          description={`Bạn có chắc chắn muốn xóa "${experienceItem.title}"? Hành động này không thể hoàn tác.`}
        />
      </div>
    </div>
  );
}
