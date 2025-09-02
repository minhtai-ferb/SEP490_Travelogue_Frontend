"use client";

import React from "react";
import { Table, Tag, Space, Button, Image, Tooltip } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { TourDetail } from "@/types/Tour";

interface ToursTableAntdProps {
  tours: TourDetail[];
  loading: boolean;
  onView: (tour: TourDetail) => void;
  onEdit: (tour: TourDetail) => void;
  onDelete: (tour: TourDetail) => void;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize?: number) => void;
  };
}

export function ToursTableAntd({
  tours,
  loading,
  onView,
  onEdit,
  onDelete,
  pagination,
}: ToursTableAntdProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "orange";
      case "Confirmed":
        return "green";
      case "Cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Draft":
        return "Nháp";
      case "Confirmed":
        return "Đã xác nhận";
      case "Cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getThumbnailImage = (medias: any[]) => {
    const thumbnail = medias?.find((media) => media.isThumbnail);
    return thumbnail?.mediaUrl || "/default_image.png";
  };

  const columns: ColumnsType<TourDetail> = [
    {
      title: "Hình ảnh",
      dataIndex: "medias",
      key: "medias",
      width: 80,
      fixed: "left",
      render: (medias: any[]) => (
        <Image
          width={60}
          height={60}
          src={getThumbnailImage(medias)}
          alt="Hình ảnh chuyến đi"
          style={{ objectFit: "cover", borderRadius: 8 }}
          fallback="/default_image.png"
        />
      ),
    },
    {
      title: "Thông tin chuyến đi",
      dataIndex: "name",
      key: "name",
      width: 300,
      fixed: "left",
      render: (text: string, record: TourDetail) => (
        <div className="tour-name-cell">
          <div className="tour-title">{text}</div>
          <div className="tour-description">
            {record.description?.substring(0, 80)}
            {record.description && record.description.length > 80 ? "..." : ""}
          </div>
        </div>
      ),
    },
    {
      title: "Loại chuyến đi",
      dataIndex: "tourTypeText",
      key: "tourTypeText",
      width: 150,
      render: (text: string) => (
        <Tag color="blue" style={{ margin: 0 }}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "totalDaysText",
      key: "totalDaysText",
      width: 120,
      align: "center",
    },
    {
      title: "Phương tiện",
      dataIndex: "transportType",
      key: "transportType",
      width: 120,
      render: (text: string) => text || "Chưa xác định",
    },
    {
      title: "Giá người lớn",
      dataIndex: "adultPrice",
      key: "adultPrice",
      width: 130,
      align: "right",
      render: (price: number) => (
        <span style={{ fontWeight: 600, color: "#52c41a" }}>
          {formatPrice(price)}
        </span>
      ),
    },
    {
      title: "Giá trẻ em",
      dataIndex: "childrenPrice",
      key: "childrenPrice",
      width: 120,
      align: "right",
      render: (price: number) => (
        <span style={{ fontWeight: 600, color: "#1890ff" }}>
          {formatPrice(price)}
        </span>
      ),
    },
    {
      title: "Đánh giá",
      key: "rating",
      width: 100,
      align: "center",
      render: (_, record: TourDetail) => (
        <div style={{ fontSize: 12 }}>
          {record.averageRating && record.averageRating > 0 ? (
            <div>
              <div style={{ color: "#faad14", fontWeight: 600 }}>
                {record.averageRating.toFixed(1)} ⭐
              </div>
              <div style={{ color: "#666" }}>
                ({record.totalReviews || 0} đánh giá)
              </div>
            </div>
          ) : (
            <span style={{ color: "#999" }}>Chưa có đánh giá</span>
          )}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "statusText",
      key: "statusText",
      width: 120,
      align: "center",
      render: (status: string) => (
        <Tag color={getStatusColor(status)} className="tour-status-tag">
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "Người tạo",
      dataIndex: "createdByName",
      key: "createdByName",
      width: 120,
      render: (text: string) => (
        <div style={{ fontSize: 12 }}>
          {text || "Unknown User"}
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdTime",
      key: "createdTime",
      width: 120,
      render: (date: string) => (
        <div style={{ fontSize: 12 }}>
          {new Date(date).toLocaleDateString("vi-VN")}
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      fixed: "right",
      align: "center",
      render: (_, record: TourDetail) => (
        <Space size="small" className="tour-actions">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record)}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      className="tour-management-table"
      columns={columns}
      dataSource={tours}
      loading={loading}
      rowKey="tourId"
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        onChange: pagination.onChange,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} chuyến đi`,
        pageSizeOptions: ["10", "20", "50", "100"],
      }}
      scroll={{ x: 1500, y: 500 }}
      size="middle"
      bordered={false}
      sticky={{ offsetHeader: 0 }}
    />
  );
}
