"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Eye, Edit, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Event, NewsCategory } from "@/types/News";
import { DeleteConfirmDialog } from "../../components/delete-confirm-dialog";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";

// Mock data
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Lễ Hội Âm Nhạc Mùa Hè",
    description:
      "Lễ hội âm nhạc thường niên với các nghệ sĩ trong nước và quốc tế",
    content:
      "<p>Tham gia cùng chúng tôi trong lễ hội âm nhạc mùa hè tuyệt vời...</p>",
    locationId: "loc1",
    locationName: "Công Viên Trung Tâm",
    newsCategory: NewsCategory.Event,
    startDate: "2024-07-15",
    endDate: "2024-07-17",
    isHighlighted: true,
    createdTime: "2024-01-01T00:00:00Z",
    createdBy: "admin",
    lastUpdatedTime: "2024-01-02T00:00:00Z",
    lastUpdatedBy: "admin",
    medias: [
      { isThumbnail: true, mediaUrl: "/placeholder.svg?height=200&width=300" },
    ],
  },
  {
    id: "2",
    title: "Triển Lãm Ẩm Thực & Rượu Vang",
    description: "Khám phá những món ăn và rượu vang địa phương tuyệt nhất",
    content: "<p>Trải nghiệm những tinh hoa ẩm thực tuyệt vời nhất...</p>",
    locationId: "loc2",
    locationName: "Trung Tâm Hội Nghị",
    newsCategory: NewsCategory.Event,
    startDate: "2024-08-20",
    endDate: "2024-08-22",
    isHighlighted: false,
    createdTime: "2024-01-05T00:00:00Z",
    createdBy: "admin",
    lastUpdatedTime: "2024-01-06T00:00:00Z",
    lastUpdatedBy: "admin",
    medias: [],
  },
];

const crumbs: Crumb[] = [
  { label: "Quản lý tin tức", href: "/admin/news" },
  { label: "Danh sách sự kiện"},
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = () => {
    if (selectedEvent) {
      setEvents(events.filter((e) => e.id !== selectedEvent.id));
      setIsDeleteOpen(false);
      setSelectedEvent(null);
    }
  };

  return (
    <div>
      <BreadcrumbHeader items={crumbs} />
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Quản Lý Sự Kiện
              </h1>
              <p className="text-muted-foreground">
                Quản lý các sự kiện và chi tiết của chúng
              </p>
            </div>
            <Button asChild>
              <Link href="/events/create">
                <Plus className="h-4 w-4 mr-2" />
                Thêm Sự Kiện
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sự Kiện ({events.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tiêu Đề</TableHead>
                    <TableHead>Địa Điểm</TableHead>
                    <TableHead>Ngày Bắt Đầu</TableHead>
                    <TableHead>Ngày Kết Thúc</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead className="text-right">Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">
                        {event.title}
                      </TableCell>
                      <TableCell>{event.locationName}</TableCell>
                      <TableCell>
                        {new Date(event.startDate).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        {new Date(event.endDate).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        {event.isHighlighted && (
                          <Badge variant="secondary">Nổi Bật</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/events/${event.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/events/${event.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedEvent(event);
                              setIsDeleteOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <DeleteConfirmDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          onConfirm={handleDelete}
          title="Xóa Sự Kiện"
          description={`Bạn có chắc chắn muốn xóa "${selectedEvent?.title}"? Hành động này không thể hoàn tác.`}
        />
      </div>
    </div>
  );
}
