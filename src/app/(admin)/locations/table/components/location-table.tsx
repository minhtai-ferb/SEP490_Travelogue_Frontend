"use client";
import { Table, Image, Space } from "antd";
import type { TableProps } from "antd";
import type { LocationTable } from "@/types/Location";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationTableProps {
  data: LocationTable[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPaginationChange: (page: number, pageSize: number) => void;
  onView: (record: LocationTable) => void;
  //   onChange: TableProps<LocationTable>["onChange"];
  //   onEdit: (record: LocationTable) => void;
  onDelete: (record: LocationTable) => void;
}

export function LocationTableComponent({
  data,
  loading,
  currentPage,
  pageSize,
  totalCount,
  onPaginationChange,
  onView,
  //   onChange,
  //   onEdit,
  onDelete,
}: LocationTableProps) {
  const columns = [
    {
      title: "Tên địa điểm",
      dataIndex: "name",
      key: "name",
      sorter: (a: LocationTable, b: LocationTable) =>
        a.name.length - b.name.length,
      ellipsis: true,
    },
    {
      title: "Hình ảnh địa điểm",
      key: "mediaUrl",
      render: (_: any, record: LocationTable) => (
        <Image
          src={record.medias?.[0]?.mediaUrl ?? "/placeholder_image.jpg"}
          alt="Location"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Loại địa điểm",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Giờ mở cửa",
      dataIndex: "openTime",
      key: "openTime",
      render: (_: any, record: LocationTable) => record.openTime ?? "Không rõ",
    },
    {
      title: "Giờ đóng cửa",
      dataIndex: "closeTime",
      key: "closeTime",
      render: (_: any, record: LocationTable) => record.closeTime ?? "Không rõ",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: LocationTable) => (
        <Space size="small">
          <Button onClick={() => onView(record)} variant="outline" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          {/* <Button onClick={() => onEdit(record)} variant="outline" size="sm">
            <Pencil className="h-4 w-4" />
          </Button> */}
          <Button
            onClick={() => onDelete(record)}
            variant="outline"
            size="sm"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table<LocationTable>
      columns={columns}
      dataSource={data.map((item, index) => ({
        ...item,
        key: item.id || index,
      }))}
      loading={loading}
      //   onChange={onChange}
      pagination={{
        current: currentPage,
        pageSize,
        total: totalCount,
        onChange: onPaginationChange,
        showSizeChanger: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} trong ${total} địa điểm`,
      }}
      scroll={{ x: "max-content" }}
    />
  );
}
