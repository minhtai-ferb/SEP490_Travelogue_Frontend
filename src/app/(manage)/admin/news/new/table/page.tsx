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
import { Plus, Eye, Edit, Trash2, Loader2 } from "lucide-react";
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

interface NewsData {
  id: string;
  title: string;
  description: string;
  content: string;
  locationId?: string;
  locationName?: string;
  createdTime: string;
  isHighlighted?: boolean;
}

interface PagedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

const crumbs: Crumb[] = [
  { label: "Quản lý tin tức", href: "/admin/news" },
  { label: "Danh sách tin tức" },
];

export default function NewsPage() {
  const { getPagedNewsFiltered, deleteNews, loading } = useNews();
  const [news, setNews] = useState<NewsData[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsData | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<SearchFiltersType>({});

  const fetchNews = async (
    page: number = currentPage,
    size: number = pageSize,
    searchFilters: SearchFiltersType = filters
  ) => {
    try {
      const response: PagedResponse<NewsData> = await getPagedNewsFiltered({
        title: searchFilters.title,
        locationId: searchFilters.locationId,
        isHighlighted: searchFilters.isHighlighted,
        pageNumber: page,
        pageSize: size,
      });

      if (response) {
        setNews(response.data || []);
        setTotalPages(response.totalPages || 0);
        setTotalItems(response.totalCount || 0);
        setCurrentPage(response.pageNumber || 1);
        setPageSize(response.pageSize || 10);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách tin tức:", error);
      toast.error("Không thể tải danh sách tin tức");
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchNews(page, pageSize, filters);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    fetchNews(1, size, filters);
  };

  const handleSearch = (searchFilters: SearchFiltersType) => {
    setFilters(searchFilters);
    setCurrentPage(1);
    fetchNews(1, pageSize, searchFilters);
  };

  const handleDelete = async () => {
    if (selectedNews) {
      try {
        await deleteNews(selectedNews.id);
        toast.success("Xóa tin tức thành công");
        setIsDeleteOpen(false);
        setSelectedNews(null);
        // Refresh danh sách
        fetchNews();
      } catch (error) {
        console.error("Lỗi khi xóa tin tức:", error);
        toast.error("Không thể xóa tin tức");
      }
    }
  };

  const locationOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const n of news) {
      if (n.locationId && !map.has(n.locationId)) {
        map.set(n.locationId, n.locationName ?? "");
      }
    }
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [news]);

  return (
    <div>
      <BreadcrumbHeader items={crumbs} />
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Quản Lý Tin Tức
              </h1>
              <p className="text-muted-foreground">
                Quản lý các tin tức và chi tiết của chúng
              </p>
            </div>
            <Button asChild>
              <Link href="/admin/news/new/create">
                <Plus className="h-4 w-4 mr-2" />
                Thêm Tin Tức
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <SearchFilters
            onSearch={handleSearch}
            loading={loading}
            locationOptions={locationOptions}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Tin Tức ({totalItems})
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
                      <TableHead>Trạng Thái</TableHead>
                      <TableHead>Ngày Tạo</TableHead>
                      <TableHead className="text-right">Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                          Đang tải dữ liệu...
                        </TableCell>
                      </TableRow>
                    ) : news.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-muted-foreground"
                        >
                          Không có tin tức nào được tìm thấy
                        </TableCell>
                      </TableRow>
                    ) : (
                      news.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.title}
                          </TableCell>
                          <TableCell>{item.locationName ?? "N/A"}</TableCell>
                          <TableCell>
                            {item.isHighlighted && (
                              <Badge variant="secondary">Nổi Bật</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(item.createdTime).toLocaleDateString(
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
                                <Link href={`/admin/news/new/${item.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/news/new/${item.id}/edit`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedNews(item);
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
          title="Xóa Tin Tức"
          description={`Bạn có chắc chắn muốn xóa "${selectedNews?.title}"? Hành động này không thể hoàn tác.`}
        />
      </div>
    </div>
  );
}
