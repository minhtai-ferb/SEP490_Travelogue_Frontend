"use client";

import React from "react";
import { Row, Col, Input, Select, Button, Space } from "antd";
import { SearchOutlined, PlusOutlined, FilterOutlined } from "@ant-design/icons";

const { Option } = Select;

interface TopBarAntdProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
  ratingFilter: string;
  onRatingChange: (value: string) => void;
  onCreate: () => void;
  totalCount: number;
}

const statusOptions = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "Draft", label: "Nháp" },
  { value: "Confirmed", label: "Đã xác nhận" },
  { value: "Cancelled", label: "Đã hủy" },
];

const typeOptions = [
  { value: "all", label: "Tất cả loại chuyến đi" },
  { value: "Du lịch nghỉ dưỡng", label: "Du lịch nghỉ dưỡng" },
  { value: "Du lịch khám phá", label: "Du lịch khám phá" },
  { value: "Du lịch sinh thái", label: "Du lịch sinh thái" },
  { value: "Du lịch văn hóa", label: "Du lịch văn hóa" },
  { value: "Du lịch tâm linh", label: "Du lịch tâm linh" },
  { value: "Du lịch ẩm thực", label: "Du lịch ẩm thực" },
  { value: "Du lịch mạo hiểm", label: "Du lịch mạo hiểm" },
];

const ratingOptions = [
  { value: "all", label: "Tất cả đánh giá" },
  { value: "5", label: "5 sao" },
  { value: "4+", label: "4+ sao" },
  { value: "3+", label: "3+ sao" },
  { value: "2+", label: "2+ sao" },
  { value: "1+", label: "1+ sao" },
  { value: "no-rating", label: "Chưa có đánh giá" },
];

export function TopBarAntd({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  ratingFilter,
  onRatingChange,
  onCreate,
  totalCount,
}: TopBarAntdProps) {
  return (
    <div style={{ marginBottom: 24 }}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={6}>
          <Input
            placeholder="Tìm kiếm theo tên chuyến đi hoặc mô tả..."
            prefix={<SearchOutlined />}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={6} md={3}>
          <Select
            value={statusFilter}
            onChange={onStatusChange}
            style={{ width: "100%" }}
            placeholder="Lọc trạng thái"
            suffixIcon={<FilterOutlined />}
          >
            {statusOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={6} md={3}>
          <Select
            value={typeFilter}
            onChange={onTypeChange}
            style={{ width: "100%" }}
            placeholder="Lọc loại chuyến đi"
            suffixIcon={<FilterOutlined />}
          >
            {typeOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={6} md={3}>
          <Select
            value={ratingFilter}
            onChange={onRatingChange}
            style={{ width: "100%" }}
            placeholder="Lọc đánh giá"
            suffixIcon={<FilterOutlined />}
          >
            {ratingOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onCreate}
              size="middle"
              className="tour-create-btn"
            >
              Tạo chuyến đi mới
            </Button>
          </Space>
        </Col>
        <Col xs={24} md={3}>
          <div style={{ textAlign: "right", color: "#666", fontSize: 14 }}>
            Tổng: {totalCount} chuyến đi
          </div>
        </Col>
      </Row>
    </div>
  );
}
