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
import { useExperienceController } from "@/services/experience-controller"; // Changed to experience controller
import type { District } from "@/types/District";
import type { Experience } from "@/types/Experience"; // Changed to Experience
import { addToast } from "@heroui/react";
import { createStyles } from "@mui/material";
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


type OnChange = NonNullable<TableProps<Experience>["onChange"]>; // Changed to Experience
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;


interface Option {
  value: string;
  label: string;
}

function ManageExperience() {
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const { searchExperience, deleteExperience } = useExperienceController(); // Changed to useExperienceController
  const { getAllDistrict } = useDistrictManager();
  const [data, setData] = useState<Experience[]>([]); // Changed to Experience
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState<Experience | null>(null); // Changed to Experience
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExperiences = async () => {
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
        const response = await searchExperience({
          title: "",
          typeExperienceId: "",
          districtId: selectedOption,
          pageNumber: currentPage,
          pageSize: pageSize,
        });

        console.log("Experience data: ", response);
        if (!response) {
          throw new Error("No data returned from API getAllExperience");
        }
        setTotalCount(response.totalCount);
        setData(response.data);
      } catch (error: any) {
        console.error("Error fetching experience data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, [selectedOption, currentPage, pageSize]);

  const handleViewDetails = (record: Experience) => { // Changed to Experience
    router.push(`/admin/experience/view/${record.id}`);
  };

  const handleEdit = (record: Experience) => { // Changed to Experience
    router.push(`/admin/experience/edit/${record.id}`);
  };

  const handleDeleteConfirm = (record: Experience) => { // Changed to Experience
    setExperienceToDelete(record); // Changed to Experience
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (experienceToDelete) { // Changed to Experience
      try {
        await deleteExperience(experienceToDelete.id); // Changed to deleteExperience
        // Refresh the data after deletion
        const response = await searchExperience({
          title: "",
          typeExperienceId: "",
          districtId: selectedOption,
          pageNumber: currentPage,
          pageSize: pageSize,
        });
        if (!response) {
          throw new Error("No data returned from API getAllExperience");
        }
        setTotalCount(response.totalCount);
        setData(response.data);
        Modal.success({
          title: "Thành công",
          content: "Đã xóa trải nghiệm thành công",
        });
        addToast({
          title: "Xóa trải nghiệm thành công!", 
          description: "Trải nghiệm đã được xóa.", 
          color: "success",
        });
      } catch (error) {
        console.error("Error deleting experience:", error); 
        Modal.error({
          title: "Lỗi",
          content: "Không thể xóa trải nghiệm. Vui lòng thử lại sau.",
        });
      } finally {
        setDeleteDialogOpen(false);
        setExperienceToDelete(null); 
      }
    }
  };

  const columns: TableColumnsType<Experience> = [ 
    {
      title: "Tiêu đề", 
      dataIndex: "title",
      key: "title",
      width: 300,
      filteredValue: filteredInfo.name || null,
      onFilter: (value, record) => record.title.includes(value as string),
      sorter: (a, b) => a.title.length - b.title.length,
      sortOrder: sortedInfo.columnKey === "title" ? sortedInfo.order : null,
      ellipsis: false,
    },
    {
      title: "Hình ảnh trải nghiệm", 
      dataIndex: "mediaURL", 
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
            alt="Experience" // Changed to Experience
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
        );
      },
    },
    {
      title: "Loại trải nghiệm", // Changed to Experience
      dataIndex: "typeExperienceName", // Changed to typeExperienceName
      key: "typeExperienceName", // Changed to typeExperienceName
      width: 200,
      ellipsis: false,
    },
    {
      title: "Tên sự kiện",
      dataIndex: "eventName",
      key: "eventName",
      width: 200,
      ellipsis: false,
    },
    {
      title: "Tên địa điểm",
      dataIndex: "districtName",
      width: 200,
      key: "districtName",
      ellipsis: false,
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: 'right',
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
    pagination: TableProps<Experience>["pagination"], 
    filters: Filters,
    sorter: SorterResult<Experience> | SorterResult<Experience>[], 
    extra: TableCurrentDataSource<Experience>
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
      const response = await searchExperience({
        title: "",
        typeExperienceId: "",
        districtId: value,
        pageNumber: currentPage,
        pageSize: pageSize,
      });

      console.log("Experience data: ", response);
      if (!response) {
        throw new Error("No data returned from API getAllExperience");
      }
      setTotalCount(response.totalCount);
      setData(response.data);
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
      const response = await searchExperience({
        title: value,
        typeExperienceId: "",
        districtId: selectedOption,
        pageNumber: currentPage,
        pageSize: pageSize,
      });

      console.log("Experience data: ", response);
      if (!response) {
        throw new Error("No data returned from API getAllExperience");
      }
      setTotalCount(response.totalCount);
      setData(response.data);
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
              <BreadcrumbLink href="#">Quản lý trải nghiệm</BreadcrumbLink> {/* Changed to Experience */}
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Danh sách trải nghiệm</BreadcrumbPage> {/* Changed to Experience */}
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
            placeholder="Tìm kiếm theo tên trải nghiệm" 
          />
          <Button
            className="bg-blue-500 text-white"
            onClick={() => router.push("/admin/experience/create")} 
          >
            Tạo mới trải nghiệm
          </Button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Spin size="large" />
          </div>
        ) : (
          <Table<Experience> // Changed to Experience
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
            <AlertDialogTitle>Xác nhận xóa trải nghiệm</AlertDialogTitle> {/* Changed to Experience */}
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa trải nghiệm "{experienceToDelete?.title}"? {/* Changed to Experience */}
            </AlertDialogDescription>
            <AlertDialogDescription className="mt-4 text-xs">
              Chú ý: Tất cả dữ liệu liên quan đến trải nghiệm này sẽ bị xóa vĩnh
              viễn. {/* Changed to Experience */}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Xóa {/* Changed to Experience */}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarInset>
  );
}

export default ManageExperience;
