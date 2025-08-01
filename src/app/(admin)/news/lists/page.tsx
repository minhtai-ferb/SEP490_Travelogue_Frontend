"use client";

import type React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import type { TableColumnsType, TableProps } from "antd";
import { Image, Input, Select, Space, Spin, Table } from "antd";
import type {
  SorterResult,
  TableCurrentDataSource,
} from "antd/es/table/interface";
import { Eye, Pencil, Trash2, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useNewsController } from "@/services/news-manager";
import { useLocationController } from "@/services/location-controller";

type OnChange = NonNullable<TableProps<any>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

interface Option {
  value: string;
  label: string;
}

function ManageNews() {
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const { searchNews, deleteNews, getAllNewcategory } = useNewsController();
  const { getAllLocation } = useLocationController();
  const [data, setData] = useState<any[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [locationOptions, setLocationOptions] = useState<Option[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const categoriesResponse = await getAllNewcategory();
        if (categoriesResponse) {
          setCategoryOptions([
            { value: "", label: "Tất cả danh mục" },
            ...categoriesResponse.map((category: any) => ({
              value: category.id,
              label: category.category,
            })),
          ]);
        }

        // Fetch locations
        const locationsResponse = await getAllLocation();
        if (locationsResponse) {
          setLocationOptions([
            { value: "", label: "Tất cả địa điểm" },
            ...locationsResponse.map((location: any) => ({
              value: location.id,
              label: location.name,
            })),
          ]);
        }

        // Fetch news
        const response = await searchNews({
          title: searchText,
          categoryId: selectedCategory,
          categoryName: selectedCategory,
          pageNumber: currentPage,
          pageSize: pageSize,
        });

        if (!response) {
          throw new Error("No data returned from API searchNews");
        }
        setTotalCount(response.totalCount);
        setData(response.data);
      } catch (error: any) {
        console.error("Error fetching news data:", error);
        toast.error("Có lỗi xảy ra khi tải dữ liệu tin tức");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [
    selectedCategory,
    selectedLocation,
    currentPage,
    pageSize,
    searchText,
    getAllNewcategory,
    getAllLocation,
    searchNews,
  ]);

  const handleViewDetails = (record: any) => {
    router.push(`/admin/news/view/${record.id}`);
  };

  const handleEdit = (record: any) => {
    router.push(`/admin/news/edit/${record.id}`);
  };

  const handleDeleteConfirm = (record: any) => {
    setNewsToDelete(record);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (newsToDelete) {
      try {
        await deleteNews(newsToDelete.id);
        // Refresh the data after deletion
        const response = await searchNews({
          title: searchText,
          categoryId: selectedCategory,
          categoryName: selectedCategory,
          pageNumber: currentPage,
          pageSize: pageSize,
        });
        if (!response) {
          throw new Error("No data returned from API searchNews");
        }
        setTotalCount(response.totalCount);
        setData(response.data);
        toast.success("Đã xóa tin tức thành công");
      } catch (error) {
        console.error("Error deleting news:", error);
        toast.error("Không thể xóa tin tức. Vui lòng thử lại sau.");
      } finally {
        setDeleteDialogOpen(false);
        setNewsToDelete(null);
      }
    }
  };

  const columns: TableColumnsType<any> = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: 300,
      filteredValue: filteredInfo.title || null,
      onFilter: (value, record) => record.title.includes(value as string),
      sorter: (a, b) => a.title.length - b.title.length,
      sortOrder: sortedInfo.columnKey === "title" ? sortedInfo.order : null,
      ellipsis: false,
    },
    {
      title: "Hình ảnh",
      dataIndex: "mediaURL",
      key: "mediaURL",
      ellipsis: true,
      render: (text, record) => {
        const thumbnailImage =
          record?.medias?.find((media: any) => media.isThumbnail)?.mediaUrl ||
          record?.medias?.[0]?.mediaUrl ||
          "/placeholder.svg";
        return (
          <Image
            key={record.id}
            src={thumbnailImage || "/placeholder.svg"}
            alt="News"
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
        );
      },
    },
    {
      title: "Danh mục",
      dataIndex: "categoryName",
      key: "categoryName",
      width: 150,
      ellipsis: false,
    },
    {
      title: "Địa điểm",
      dataIndex: "locationName",
      key: "locationName",
      width: 150,
      ellipsis: false,
    },
    {
      title: "Sự kiện",
      dataIndex: "eventName",
      key: "eventName",
      width: 150,
      ellipsis: false,
      render: (text) => text || "Không có",
    },
    {
      title: "Nổi bật",
      dataIndex: "isHighlighted",
      key: "isHighlighted",
      width: 100,
      render: (isHighlighted) =>
        isHighlighted ? (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <Star className="h-3 w-3 mr-1 fill-current" /> Có
          </Badge>
        ) : (
          <Badge variant="outline">Không</Badge>
        ),
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handleViewDetails(record)}
            title="Xem chi tiết"
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">Xem chi tiết</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handleEdit(record)}
            title="Chỉnh sửa"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Chỉnh sửa</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => handleDeleteConfirm(record)}
            title="Xóa"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Xóa</span>
          </Button>
        </Space>
      ),
    },
  ];

  const handleChange: OnChange = (
    pagination: TableProps<any>["pagination"],
    filters: Filters,
    sorter: SorterResult<any> | SorterResult<any>[],
    extra: TableCurrentDataSource<any>
  ) => {
    console.log("Various parameters", pagination, filters, sorter, extra);

    setFilteredInfo(filters);

    if (Array.isArray(sorter)) {
      setSortedInfo(sorter[0] || {});
    } else {
      setSortedInfo(sorter);
    }
  };

  const onCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const onLocationChange = (value: string) => {
    setSelectedLocation(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  return (
    <SidebarInset>
      <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4 z-10">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Quản lý tin tức</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Danh sách tin tức</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
          <div className="flex flex-wrap gap-4">
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Chọn danh mục"
              optionFilterProp="label"
              onChange={onCategoryChange}
              options={categoryOptions}
              value={selectedCategory || undefined}
            />
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Chọn địa điểm"
              optionFilterProp="label"
              onChange={onLocationChange}
              options={locationOptions}
              value={selectedLocation || undefined}
            />
          </div>
          <div className="flex gap-4">
            <Input
              onChange={onSearch}
              placeholder="Tìm kiếm theo tiêu đề"
              style={{ width: 250 }}
              value={searchText}
            />
            <Button
              className="bg-blue-500 text-white"
              onClick={() => router.push("/admin/news/create")}
            >
              Tạo mới tin tức
            </Button>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={data.map((item, index) => ({
              ...item,
              key: item.id || index,
            }))}
            onChange={handleChange}
            loading={loading}
            scroll={{ x: "max-content" }}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalCount,
              onChange: handlePaginationChange,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "50"],
              showTotal: (total: number, range: [number, number]) =>
                `${range[0]}-${range[1]} của ${total} tin tức`,
            }}
          />
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa tin tức</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tin tức "{newsToDelete?.title}"?
            </AlertDialogDescription>
            <AlertDialogDescription className="mt-4 text-xs">
              Chú ý: Tất cả dữ liệu liên quan đến tin tức này sẽ bị xóa vĩnh
              viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarInset>
  );
}

export default ManageNews;
