"use client";

import React from "react";
import { Table, Empty, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import StatusTag from "./satus-tag";
import { Eye } from "lucide-react";
import { RefundRequest } from "@/types/RequestRefund";

export default function RequestsTable({
  data,
  loading,
  onOpenDetail,
}: {
  data: RefundRequest[];
  loading: boolean;
  onOpenDetail: (row: RefundRequest) => void;
}) {
  const columns: ColumnsType<RefundRequest> = [
    {
      title: "Người yêu cầu",
      dataIndex: "userName",
      key: "userName",
      width: 200,
      sorter: (a, b) => a.userName.localeCompare(b.userName),
      render: (text: string, record) => (
        <Space direction="vertical" size={0}>
          <span className="font-medium">{text}</span>
          {/* <span className="text-[12px] text-gray-500">
            User ID: {record.userId}
          </span> */}
        </Space>
      ),
    },
    {
      title: "Mã đặt chỗ",
      dataIndex: "bookingId",
      key: "bookingId",
      width: 200,
      render: (text) => (
        <span
          className="font-mono text-xs font-medium break-all"
          title={text ?? "-"}
        >
          {text ?? "-"}
        </span>
      ),
      responsive: ["md"],
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, r) => <StatusTag status={r.status} />,
      width: 100,
    },
    {
      title: "Thời điểm yêu cầu",
      dataIndex: "createdTime",
      key: "createdTime",
      sorter: (a, b) =>
        dayjs(a.createdTime).valueOf() - dayjs(b.createdTime).valueOf(),
      render: (v: string) => dayjs(v).format("DD/MM/YYYY HH:mm"),
      width: 150,
    },
    {
      title: "Thời gian phản hồi",
      dataIndex: "lastUpdatedTime",
      key: "lastUpdatedTime",
      sorter: (a, b) =>
        dayjs(a.lastUpdatedTime).valueOf() - dayjs(b.lastUpdatedTime).valueOf(),
      render: (v: string) => dayjs(v).format("DD/MM/YYYY HH:mm"),
      width: 150,
    },
    {
      title: "Hành động",
      key: "actions",
      fixed: "right",
      width: 100,
      render: (_, r) => (
        <div className="flex items-center justify-center">
          <Eye
            className="h-4 w-4 cursor-pointer text-blue-500 hover:text-blue-600"
            onClick={() => onOpenDetail(r)}
          />
        </div>
      ),
    },
  ];

  return (
    <Table<RefundRequest>
      rowKey="id"
      loading={loading}
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 10, showSizeChanger: true }}
      className="mt-4"
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không có dữ liệu"
          />
        ),
      }}
    />
  );
}
