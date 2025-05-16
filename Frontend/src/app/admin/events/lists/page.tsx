"use client";

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
import { useDistrictManager } from "@/services/district-manager";
import { useEventController } from "@/services/event-controller";
import type { District } from "@/types/District";
import type { Event } from "@/types/Event";
import { addToast } from "@heroui/react";
import type { TableColumnsType, TableProps } from "antd";
import { Image, Input, Modal, Select, Space, Spin, Table } from "antd";
import type {
  SorterResult,
  TableCurrentDataSource,
} from "antd/es/table/interface";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

type OnChange = NonNullable<TableProps<Event>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

interface Option {
  value: string;
  label: string;
}

function ManageEvent() {
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const { searchEvent, deleteEvent } = useEventController();
  const { getAllDistrict } = useDistrictManager();
  const [data, setData] = useState<Event[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const districtResponse = await getAllDistrict();
        console.log("District data: ", districtResponse);
        setOptions([
          { value: "", label: "Tất cả" },
          ...districtResponse.map((district: District) => ({
            value: district.id,
            label: district.name,
          })),
        ]);
        const response = await searchEvent({
          title: "",
          typeId: "",
          districtId: selectedOption,
          pageNumber: currentPage,
          pageSize: pageSize,
        });

        const sortedEvents = (response?.data as Event[]).sort(
          (a: Event, b: Event) => {
            const now = new Date();
            const aStartDate = a.startDate ? new Date(a.startDate) : new Date();
            const bStartDate = b.startDate ? new Date(b.startDate) : new Date();

            // So sánh sự kiện có StartDate gần nhất với ngày hiện tại
            return (
              Math.abs(aStartDate.getTime() - now.getTime()) -
              Math.abs(bStartDate.getTime() - now.getTime())
            );
          }
        );

        console.log("Event data: ", sortedEvents);
        if (!sortedEvents) {
          throw new Error("No data returned from API getAllEvent");
        }
        setTotalCount(response.totalCount);
        setData(sortedEvents);
      } catch (error: any) {
        console.error("Error fetching event data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [selectedOption, currentPage, pageSize]);

  const handleViewDetails = (record: Event) => {
    router.push(`/admin/events/view/${record.id}`);
  };

  const handleEdit = (record: Event) => {
    router.push(`/admin/events/edit/${record.id}`);
  };

  const handleDeleteConfirm = (record: Event) => {
    setEventToDelete(record);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (eventToDelete) {
      try {
        await deleteEvent(eventToDelete.id);
        // Refresh the data after deletion
        const response = await searchEvent({
          title: "",
          typeId: "",
          districtId: selectedOption,
          pageNumber: currentPage,
          pageSize: pageSize,
        });
        const sortedEvents = (response?.data as Event[]).sort(
          (a: Event, b: Event) => {
            const now = new Date();
            const aStartDate = a.startDate ? new Date(a.startDate) : new Date();
            const bStartDate = b.startDate ? new Date(b.startDate) : new Date();

            // So sánh sự kiện có StartDate gần nhất với ngày hiện tại
            return (
              Math.abs(aStartDate.getTime() - now.getTime()) -
              Math.abs(bStartDate.getTime() - now.getTime())
            );
          }
        );
        if (!sortedEvents) {
          throw new Error("No data returned from API getAllEvent");
        }
        setTotalCount(response.totalCount);
        setData(sortedEvents);
        Modal.success({
          title: "Thành công",
          content: "Đã xóa sự kiện thành công",
        });
        addToast({
          title: "Xóa sự kiện thành công!",
          description: "Sự kiện đã được xóa.",
          color: "success",
        });
      } catch (error) {
        console.error("Error deleting event:", error);
        Modal.error({
          title: "Lỗi",
          content: "Không thể xóa sự kiện. Vui lòng thử lại sau.",
        });
      } finally {
        setDeleteDialogOpen(false);
        setEventToDelete(null);
      }
    }
  };

  const columns: TableColumnsType<Event> = [
    {
      title: "Tên sự kiện",
      dataIndex: "name",
      key: "name",
      filteredValue: filteredInfo.name || null,
      onFilter: (value, record) => record.name.includes(value as string),
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Hình ảnh sự kiện",
      dataIndex: "mediaURL", // Dùng mediaURL thay vì mediaUrl
      key: "mediaURL",
      ellipsis: true,
      render: (text, record) => {
        const thumbnailImage =
          record?.medias?.find((media) => media.isThumbnail)?.mediaUrl ||
          record?.medias?.[0]?.mediaUrl ||
          "/placeholder_image.jpg";
        return (
          <Image
            key={record.id}
            src={thumbnailImage}
            alt="Event"
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
        );
      },
    },
    {
      title: "Loại sự kiện",
      dataIndex: "typeEventName",
      key: "typeEventName",
      ellipsis: true,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (value) =>
        new Date(value).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }), // Format as dd/mm/yyyy
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (value) =>
        new Date(value).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }), // Format as dd/mm/yyyy
    },
    {
      title: "Thao tác",
      key: "action",
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
    pagination: TableProps<Event>["pagination"],
    filters: Filters,
    sorter: SorterResult<Event> | SorterResult<Event>[],
    extra: TableCurrentDataSource<Event>
  ) => {
    console.log("Various parameters", pagination, filters, sorter, extra);

    setFilteredInfo(filters);

    if (Array.isArray(sorter)) {
      setSortedInfo(sorter[0] || {});
    } else {
      setSortedInfo(sorter);
    }
  };

  const onChange = async (value: string) => {
    setSelectedOption(value);
    setLoading(true);
    console.log("Selected option:", value);
    try {
      const response = await searchEvent({
        title: "",
        typeId: "",
        districtId: value,
        pageNumber: currentPage,
        pageSize: pageSize,
      });
      const sortedEvents = (response?.data as Event[]).sort(
        (a: Event, b: Event) => {
          const now = new Date();
          const aStartDate = a.startDate ? new Date(a.startDate) : new Date();
          const bStartDate = b.startDate ? new Date(b.startDate) : new Date();

          // So sánh sự kiện có StartDate gần nhất với ngày hiện tại
          return (
            Math.abs(aStartDate.getTime() - now.getTime()) -
            Math.abs(bStartDate.getTime() - now.getTime())
          );
        }
      );

      console.log("Event data: ", sortedEvents);
      if (!sortedEvents) {
        throw new Error("No data returned from API getAllEvent");
      }
      setTotalCount(response.totalCount);
      setData(sortedEvents);
    } catch (error) {
      console.error("Error fetching data on select change:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("Search value:", value);
    setLoading(true);
    try {
      const response = await searchEvent({
        title: value,
        typeId: "",
        districtId: selectedOption,
        pageNumber: currentPage,
        pageSize: pageSize,
      });

      const sortedEvents = (response?.data as Event[]).sort(
        (a: Event, b: Event) => {
          const now = new Date();
          const aStartDate = a.startDate ? new Date(a.startDate) : new Date();
          const bStartDate = b.startDate ? new Date(b.startDate) : new Date();

          // So sánh sự kiện có StartDate gần nhất với ngày hiện tại
          return (
            Math.abs(aStartDate.getTime() - now.getTime()) -
            Math.abs(bStartDate.getTime() - now.getTime())
          );
        }
      );

      console.log("Event data: ", sortedEvents);
      if (!sortedEvents) {
        throw new Error("No data returned from API getAllEvent");
      }
      setTotalCount(response.totalCount);
      setData(sortedEvents);
    } catch (error) {
      console.error("Error fetching data on search:", error);
    } finally {
      setLoading(false);
    }
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
              <BreadcrumbLink href="#">Quản lý sự kiện</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Danh sách sự kiện</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex justify-between items-center mb-4 gap-4">
          <Select
            showSearch
            style={{ width: 200 }}
            defaultValue="Tất cả"
            placeholder="Chọn quận huyện"
            optionFilterProp="label"
            onChange={onChange}
            options={options}
          />
          <Input
            onChange={onSearch}
            placeholder="Tìm kiếm theo tên sự kiện" // Changed from địa điểm to sự kiện
          />
          <Button
            className="bg-blue-500 text-white"
            onClick={() => router.push("/admin/events/create")} // Changed from locations to events
          >
            Tạo mới sự kiện
          </Button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Spin size="large" />
          </div>
        ) : (
          <Table<Event> // Changed from Location to Event
            columns={columns}
            dataSource={data.map((item, index) => ({
              ...item,
              key: item.id || index,
            }))} // Ensure each item has a unique key
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
                `${range[0]}-${range[1]} of ${total} items`,
            }}
          />
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa sự kiện</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa sự kiện "{eventToDelete?.name}"?
            </AlertDialogDescription>
            <AlertDialogDescription className="mt-4 text-xs">
              Chú ý: Tất cả dữ liệu liên quan đến sự kiện này sẽ bị xóa vĩnh
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

export default ManageEvent;
