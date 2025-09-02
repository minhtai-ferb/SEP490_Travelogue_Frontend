"use client";
import { Table, Image, Space, Tooltip } from "antd";
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
  onChange: TableProps<LocationTable>["onChange"];
  onEdit: (record: LocationTable) => void;
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
  onChange,
  onEdit,
  onDelete,
}: LocationTableProps) {
  const columns = [
    {
      title: "Tên địa điểm",
      dataIndex: "name",
      fixed: "left" as const,
      key: "name",
      sorter: (a: LocationTable, b: LocationTable) =>
        a.name.localeCompare(b.name),
      ellipsis: {
        showTitle: false,
      },
      width: 200,
      render: (name: string, record: LocationTable) => (
        <Tooltip title={record.description} placement="topLeft">
          <div className="font-medium text-gray-900">{name}</div>
          <div className="text-xs text-gray-500 truncate max-w-[180px]">
            {record.description}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Hình ảnh",
      key: "mediaUrl",
      width: 80,
      render: (_: any, record: LocationTable) => {
        const thumbnailMedia = record.medias?.find(media => media.isThumbnail);
        const imageUrl = thumbnailMedia?.mediaUrl || record.medias?.[0]?.mediaUrl || "/placeholder_image.jpg";
        return (
          <Image
            src={imageUrl}
            alt="Location"
            style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
            fallback="/placeholder_image.jpg"
            preview={false}
          />
        );
      },
    },
    {
      title: "Loại địa điểm",
      dataIndex: "category",
      key: "category",
      width: 150,
      render: (category: string) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          {category}
        </span>
      ),
    },
    {
      title: "Quận/Huyện",
      dataIndex: "districtName",
      key: "districtName",
      width: 120,
    },
    {
      title: "Giá (VNĐ)",
      key: "price",
      width: 120,
      sorter: (a: LocationTable, b: LocationTable) => a.minPrice - b.minPrice,
      render: (_: any, record: LocationTable) => (
        <div className="text-right">
          {record.minPrice === record.maxPrice ? (
            <span className="font-medium text-green-600">
              {record.minPrice.toLocaleString()}
            </span>
          ) : (
            <div className="text-sm flex justify-center items-center gap-1">
              <div className="font-medium text-green-600">
                {record.minPrice.toLocaleString()}
              </div>
              <div className="text-gray-500">
                - {record.maxPrice.toLocaleString()}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Giờ hoạt động",
      key: "operatingHours",
      width: 130,
      render: (_: any, record: LocationTable) => {
        const openTime = record.openTime ? record.openTime.slice(0, 5) : "N/A";
        const closeTime = record.closeTime ? record.closeTime.slice(0, 5) : "N/A";
        return (
          <div className="text-sm flex justify-center items-center gap-1">
            <div className="font-medium">{openTime}</div>
            <div className="text-gray-500">- {closeTime}</div>
          </div>
        );
      },
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      ellipsis: {
        showTitle: false,
      },
      width: 200,
      render: (address: string) => (
        <Tooltip title={address} placement="topLeft">
          <span className="text-sm">{address}</span>
        </Tooltip>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right" as const,
      width: 120,
      render: (_: any, record: LocationTable) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button onClick={() => onView(record)} variant="outline" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => onEdit(record)} variant="outline" size="sm">
              <Pencil className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              onClick={() => onDelete(record)}
              variant="outline"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm ">
      <Table<LocationTable>
        columns={columns}
        dataSource={data.map((item, index) => ({
          ...item,
          key: item.id || index,
        }))}
        loading={loading}
        onChange={onChange}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalCount,
          onChange: onPaginationChange,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50', '100'],
          showTotal: (total, range) =>
            `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} địa điểm`,
          showQuickJumper: true,
          size: "small",
        }}
        scroll={{ x: 1200, y: 500 }}
        size="middle"
        rowClassName={(record, index) => 
          index % 2 === 0 ? "bg-gray-50" : "bg-white"
        }
      />
    </div>
  );
}
