"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import type React from "react";
import { useEffect, useState } from "react";
import type { TableColumnsType, TableProps } from "antd";
import { Image, Space, Table, Spin, Input, Select, Modal } from "antd";
import type { Location } from "@/types/Location";
import { useLocationController } from "@/services/location-controller";
import { useDistrictManager } from "@/services/district-manager";
import type { District } from "@/types/District";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
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
import { SorterResult, TableCurrentDataSource } from "antd/es/table/interface";

type OnChange = NonNullable<TableProps<Location>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;
interface Option {
  value: string;
  label: string;
}

function ManageLocation() {
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const { searchLocation, loading, deleteLocation } = useLocationController();
  const { getAllDistrict } = useDistrictManager();
  const [data, setData] = useState<Location[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<Location | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchLocations = async () => {
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
        const response = await searchLocation({
          title: "",
          typeId: "",
          districtId: selectedOption,
          heritageRank: undefined,
          pageNumber: currentPage,
          pageSize: pageSize,
        });
        console.log("Location data: ", response);
        if (!response) {
          throw new Error("No data returned from API getAllLocation");
        }
        setData(response?.data as Location[]);
        setTotalCount(response.totalCount); // Assuming the API returns the total count
      } catch (error: any) {
        console.error("Error fetching location data:", error);
      }
    };
    fetchLocations();
  }, [selectedOption, currentPage, pageSize]);

  const handleViewDetails = (record: Location) => {
    router.push(`/admin/locations/view/${record.id}`);
  };

  const handleEdit = (record: Location) => {
    router.push(`/admin/locations/edit/${record.id}`);
  };

  const handleDeleteConfirm = (record: Location) => {
    setLocationToDelete(record);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (locationToDelete) {
      try {
        await deleteLocation(locationToDelete.id);
        // Refresh the data after deletion
        const response: Location[] = await searchLocation({
          title: "",
          typeId: "",
          districtId: selectedOption,
          heritageRank: undefined,
          pageNumber: currentPage,
          pageSize: pageSize,
        });
        setData(response);
        Modal.success({
          title: "Thành công",
          content: "Đã xóa địa điểm thành công",
        });
      } catch (error) {
        console.error("Error deleting location:", error);
        Modal.error({
          title: "Lỗi",
          content: "Không thể xóa địa điểm. Vui lòng thử lại sau.",
        });
      } finally {
        setDeleteDialogOpen(false);
        setLocationToDelete(null);
      }
    }
  };

  const columns: TableColumnsType<Location> = [
    {
      title: "Tên địa điểm",
      dataIndex: "name",
      key: "name",
      filteredValue: filteredInfo.name || null,
      onFilter: (value, record) => record.name.includes(value as string),
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Hình ảnh địa điểm",
      dataIndex: ["mediaUrl", "medias"],
      key: "mediaUrl",
      ellipsis: true,
      render: (text, record) => {
        return (
          <Image
            key={record.id}
            src={record.medias?.[0]?.mediaUrl ?? "/placeholder_image.jpg"}
            alt="Location"
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
        );
      },
    },
    {
      title: "Loại địa điểm",
      dataIndex: "typeLocationName",
      key: "typeLocationName",
      ellipsis: true,
    },
    {
      title: "Xếp hạng",
      dataIndex: "heritageRank",
      key: "heritageRank",
      ellipsis: true,
      render: (value) => {
        switch (value) {
          case 1:
            return "Di tích cấp tỉnh";
          case 2:
            return "Di tích cấp quốc gia";
          case 3:
            return "Di tích Quốc gia Đặc biệt";
          default:
            return "Không xác định";
        }
      },
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
    pagination: TableProps<Location>["pagination"],
    filters: Filters,
    sorter: SorterResult<Location> | SorterResult<Location>[], // Updated type
    extra: TableCurrentDataSource<Location> // Added extra parameter
  ) => {
    console.log("Various parameters", pagination, filters, sorter, extra);

    setFilteredInfo(filters);

    // Handle both single and array sorter cases
    if (Array.isArray(sorter)) {
      setSortedInfo(sorter[0] || {}); // Use the first sorter if it's an array
    } else {
      setSortedInfo(sorter);
    }
  };

  const onChange = async (value: string) => {
    setSelectedOption(value);
    console.log("Selected option:", value);
    try {
      const response = await searchLocation({
        title: "",
        typeId: "",
        districtId: selectedOption,
        heritageRank: undefined,
        pageNumber: currentPage,
        pageSize: pageSize,
      });
      setData(response?.data as Location[]);
      setTotalCount(response.totalCount);
    } catch (error) {
      console.error("Error fetching data on select change:", error);
    }
  };

  const onSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("Search value:", value);
    try {
      const response = await searchLocation({
        title: value,
        typeId: "",
        districtId: selectedOption,
        heritageRank: undefined,
        pageNumber: currentPage,
        pageSize: pageSize,
      });
      setData(response?.data as Location[]);
      setTotalCount(response.totalCount);
    } catch (error) {
      console.error("Error fetching data on search:", error);
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
              <BreadcrumbLink href="#">Quản lý địa điểm</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Danh sách địa điểm</BreadcrumbPage>
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
          <Input onChange={onSearch} placeholder="Tìm kiếm theo tên địa điểm" />
          <Button
            className="bg-blue-500 text-white"
            onClick={() => router.push("/admin/locations/create")}
          >
            Tạo mới địa điểm
          </Button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Spin size="large" />
          </div>
        ) : (
          <Table<Location>
            columns={columns}
            dataSource={data.map((item, index) => ({
              ...item,
              key: item.id || index,
            }))}
            onChange={handleChange}
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
            <AlertDialogTitle>Xác nhận xóa địa điểm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa địa điểm "{locationToDelete?.name}"?
              Hành động này không thể hoàn tác.
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

export default ManageLocation;
