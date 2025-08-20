"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Plus, Eye, Edit, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { DeleteConfirmDialog } from "../../components/delete-confirm-dialog";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { useNews } from "@/services/use-news";
import {
  SearchFilters,
  SearchFilters as SearchFiltersType,
} from "./components/search-filters";
import toast from "react-hot-toast";
import { Pagination } from "../../components/pagination";

interface EventData {
  id: string;
  title: string;
  description: string;
  locationId: string;
  locationName: string;
  startDate: string;
  endDate: string;
  createdTime: string;
  isHighlighted: boolean;
}

interface PagedResponse {
  data: EventData[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

const crumbs: Crumb[] = [
  { label: "Quản lý tin tức", href: "/admin/news" },
  { label: "Danh sách sự kiện" },
];

export default function EventsPage() {
  const { getPagedEvents, deleteNews, loading } = useNews();
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<SearchFiltersType>({});

  const fetchEvents = async (
    page: number = currentPage,
    size: number = pageSize,
    searchFilters: SearchFiltersType = filters
  ) => {
    try {
      const response: PagedResponse = await getPagedEvents({
        title: searchFilters.title,
        locationId: searchFilters.locationId,
        isHighlighted: searchFilters.isHighlighted,
        month: searchFilters.month,
        year: searchFilters.year,
        pageNumber: page,
        pageSize: size,
      });

      if (response) {
        setEvents(response.data || []);
        setTotalPages(response.totalPages || 0);
        setTotalItems(response.totalCount || 0);
        setCurrentPage(response.pageNumber || 1);
        setPageSize(response.pageSize || 10);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách sự kiện:", error);
      toast.error("Không thể tải danh sách sự kiện");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchEvents(page, pageSize, filters);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    fetchEvents(1, size, filters);
  };

  const handleSearch = (searchFilters: SearchFiltersType) => {
    setFilters(searchFilters);
    setCurrentPage(1);
    fetchEvents(1, pageSize, searchFilters);
  };

  const handleDelete = async () => {
    if (selectedEvent) {
      try {
        await deleteNews(selectedEvent.id);
        toast.success("Xóa sự kiện thành công");
        setIsDeleteOpen(false);
        setSelectedEvent(null);
        // Refresh danh sách
        fetchEvents();
      } catch (error) {
        console.error("Lỗi khi xóa sự kiện:", error);
        toast.error("Không thể xóa sự kiện");
      }
    }
  };

  const locationOptions = useMemo(() => {
    const map = new Map<string, string>();
    // rút từ dữ liệu đã trả về (trang hiện tại)
    for (const e of events) {
      if (e.locationId && !map.has(e.locationId)) {
        map.set(e.locationId, e.locationName ?? "");
      }
    }
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [events]);

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
              <Link href="/admin/news/event/create">
                <Plus className="h-4 w-4 mr-2" />
                Thêm Sự Kiện
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <SearchFilters
            onSearch={handleSearch}
            showDateFilters={true}
            loading={loading}
            locationOptions={locationOptions}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Sự Kiện ({totalItems})
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              </CardTitle>
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
                      <TableHead>Ngày Tạo</TableHead>
                      <TableHead className="text-right">Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                          Đang tải dữ liệu...
                        </TableCell>
                      </TableRow>
                    ) : events.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-muted-foreground"
                        >
                          Không có sự kiện nào được tìm thấy
                        </TableCell>
                      </TableRow>
                    ) : (
                      events.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">
                            {event.title}
                          </TableCell>
                          <TableCell>{event.locationName}</TableCell>
                          <TableCell>
                            {new Date(event.startDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(event.endDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </TableCell>
                          <TableCell>
                            {event.isHighlighted && (
                              <Badge variant="secondary">Nổi Bật</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(event.createdTime).toLocaleDateString(
                              "vi-VN",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              }
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/news/event/${event.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/news/event/${event.id}/edit`}>
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
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={totalItems}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

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
