"use client";

import React from "react";
import { Table, Empty, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { WithdrawalRequest } from "@/types/RequestWithdrawal";
import { formatVND } from "../utils";
import StatusTag from "./satus-tag";
import { Eye } from "lucide-react";

export default function RequestsTable({
  data,
  loading,
  onOpenDetail,
}: {
  data: WithdrawalRequest[];
  loading: boolean;
  onOpenDetail: (row: WithdrawalRequest) => void;
}) {
  const columns: ColumnsType<WithdrawalRequest> = [
    {
      title: "Người yêu cầu",
      dataIndex: "userName",
      key: "userName",
      sorter: (a, b) => a.userName.localeCompare(b.userName),
      render: (text: string, record) => (
        <Space direction="vertical" size={0}>
          <span className="font-medium">{text}</span>
          <span className="text-[12px] text-gray-500">
            User ID: {record.userId}
          </span>
        </Space>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      sorter: (a, b) => a.amount - b.amount,
      render: (v: number) => (
        <span className="font-medium">{formatVND(v)}</span>
      ),
      width: 140,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, r) => <StatusTag status={r.status} />,
      width: 160,
    },
    {
      title: "Tài khoản ngân hàng",
      key: "bank",
      render: (_, r) => (
        <div className="leading-tight">
          <div className="font-medium">{r.bankAccount?.bankName ?? "-"}</div>
          <div className="text-[12px] text-gray-500">
            {r.bankAccount?.bankOwnerName ?? "-"} •{" "}
            {r.bankAccount?.bankAccountNumber ?? "-"}
          </div>
        </div>
      ),
      responsive: ["md"],
    },
    {
      title: "Thời điểm yêu cầu",
      dataIndex: "requestTime",
      key: "requestTime",
      sorter: (a, b) =>
        dayjs(a.requestTime).valueOf() - dayjs(b.requestTime).valueOf(),
      render: (v: string) => dayjs(v).format("DD/MM/YYYY HH:mm"),
      width: 190,
    },
    {
      title: "Hành động",
      key: "actions",
      fixed: "right",
      width: 120,
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
    <Table<WithdrawalRequest>
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
