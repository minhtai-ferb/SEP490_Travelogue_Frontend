"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Eye, Edit2, Trash2 } from "lucide-react";

import { Table, Button, Input, Select, Card, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { TripPlan } from "@/types/TripPlan";

const { Search } = Input;
const { Option } = Select;

interface TripPlanTableProps {
  data: TripPlan[];
  loading?: boolean;
  onView?: (tripPlan: TripPlan) => void;
  onEdit?: (tripPlan: TripPlan) => void;
  onDelete?: (tripPlan: TripPlan) => void;
}

const getStatusTag = (status: number, statusText: string) => {
  // Mapping dựa trên status number
  const statusMap: Record<number, { color: string; label: string }> = {
    0: { color: "default", label: "Nháp" },
    1: { color: "processing", label: "Phác thảo" },
    2: { color: "success", label: "Đã đặt" },
    3: { color: "error", label: "Đã hủy" },
  };

  // Ưu tiên status number
  if (statusMap[status]) {
    return <Tag color={statusMap[status].color}>{statusMap[status].label}</Tag>;
  }

  // Fallback: mapping statusText từ tiếng Anh sang tiếng Việt
  const statusTextMap: Record<string, { color: string; label: string }> = {
    Draft: { color: "default", label: "Nháp" },
    Sketch: { color: "processing", label: "Phác thảo" },
    Booked: { color: "success", label: "Đã đặt" },
    Cancelled: { color: "error", label: "Đã hủy" },
  };

  if (statusTextMap[statusText]) {
    return (
      <Tag color={statusTextMap[statusText].color}>
        {statusTextMap[statusText].label}
      </Tag>
    );
  }

  // Fallback cuối cùng
  return <Tag color="default">{statusText}</Tag>;
};

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
  } catch {
    return "—";
  }
};

const getTotalActivities = (tripPlan: TripPlan) => {
  return tripPlan.days.reduce((total, day) => total + day.activities.length, 0);
};

export default function TripPlanTable({
  data,
  loading = false,
  onView,
  onEdit,
  onDelete,
}: TripPlanTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter data based on search and status
  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ownerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || item.status.toString() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns: ColumnsType<TripPlan> = [
    {
      title: "#",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên kế hoạch",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name: string, record: TripPlan) => (
        <div>
          <div className="font-medium text-gray-900 line-clamp-2">{name}</div>
          {record.imageUrl && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Có hình ảnh
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 200,
      render: (description: string) => (
        <div className="max-w-[200px]">
          <p className="text-sm text-gray-700 line-clamp-2">{description}</p>
        </div>
      ),
    },
    {
      title: "Người tạo",
      dataIndex: "ownerName",
      key: "ownerName",
      width: 120,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      width: 120,
      render: (date: string) => formatDate(date),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      width: 120,
      render: (date: string) => formatDate(date),
    },
    {
      title: "Số ngày",
      dataIndex: "totalDays",
      key: "totalDays",
      width: 80,
      render: (days: number) => `${days} ngày`,
    },
    {
      title: "Địa điểm",
      key: "activities",
      width: 100,
      render: (_, record: TripPlan) => (
        <Tag color="blue">{getTotalActivities(record)} địa điểm</Tag>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 100,
      render: (_, record: TripPlan) =>
        getStatusTag(record.status, record.statusText),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (_, record: TripPlan) => (
        <Space size="small" className="flex justify-center items-center">
          {onView && (
            <Button
              type="text"
              size="small"
              icon={<Eye className="w-4 h-4" />}
              onClick={() => onView(record)}
              title="Xem chi tiết"
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">
          {/* Search */}
          <Search
            placeholder="Tìm kiếm theo tên kế hoạch, mô tả, người tạo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
            allowClear
          />

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-full md:w-48"
            placeholder="Lọc trạng thái"
          >
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="0">Nháp</Option>
            <Option value="1">Phác thảo</Option>
            <Option value="2">Đã đặt</Option>
            <Option value="3">Đã hủy</Option>
          </Select>
        </div>
      </Card>

      {/* Table with built-in pagination */}
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} kế hoạch`,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        scroll={{ x: 1200 }}
        size="middle"
      />
    </div>
  );
}
