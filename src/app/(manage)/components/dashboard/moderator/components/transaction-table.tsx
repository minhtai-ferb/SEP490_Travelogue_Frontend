"use client";

import React, { useEffect, useState } from "react";
import { Table, Empty, Space, Tag } from "antd";
import dayjs from "dayjs";
import {
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from "lucide-react";
import { useTransaction } from "@/services/use-transaction";
import { Button } from "@/components/ui/button";

// Transaction interface dựa trên response thực tế
interface Transaction {
  id: string;
  walletId: string | null;
  userId: string | null;
  isSystem: boolean;
  systemKind: number | null;
  systemKindText: string | null;
  channel: number;
  paymentChannelText: string;
  accountNumber: string | null;
  paidAmount: number;
  paymentLinkId: string | null;
  paymentStatus: number | null;
  paymentStatusText: string | null;
  status: number;
  statusText: string | null;
  type: number;
  typeText: string | null;
  transactionDirection: number;
  transactionDirectionText: string;
  reason: string | null;
  method: string | null;
  paymentReference: string | null;
  transactionDateTime: string;
  counterAccountBankId: string | null;
  counterAccountName: string | null;
  counterAccountNumber: string | null;
  currency: string | null;
  createdTime: string;
  lastUpdatedTime: string;
  createdBy: string;
  createdByName: string | null;
  lastUpdatedBy: string;
  lastUpdatedByName: string | null;
}

// Format tiền VNĐ
const formatVND = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Status Tag component
const StatusTag = ({
  status,
  statusText,
}: {
  status: number;
  statusText: string | null;
}) => {
  const getStatusConfig = (status: number, statusText: string | null) => {
    if (status === 0) return { color: "orange", text: "Đang chờ" };
    if (status === 1) return { color: "processing", text: "Đang xử lý" };
    if (status === 2) return { color: "green", text: "Hoàn tất" };
    if (status === 3) return { color: "red", text: "Thất bại" };
    return { color: "default", text: statusText || "Không xác định" };
  };

  const config = getStatusConfig(status, statusText);
  return <Tag color={config.color}>{config.text}</Tag>;
};

// Payment Status Tag component
const PaymentStatusTag = ({
  status,
  statusText,
}: {
  status: number | null;
  statusText: string | null;
}) => {
  if (status === null) return <Tag color="default">N/A</Tag>;

  const getStatusConfig = (status: number, statusText: string | null) => {
    if (status === 0) return { color: "orange", text: "Pending" };
    if (status === 1) return { color: "processing", text: "Processing" };
    if (status === 2) return { color: "green", text: "Success" };
    if (status === 3) return { color: "red", text: "Failed" };
    return { color: "default", text: statusText || "Unknown" };
  };

  const config = getStatusConfig(status, statusText);
  return <Tag color={config.color}>{config.text}</Tag>;
};

export default function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const { getAllTransactions, loading } = useTransaction();

  const fetchTransactions = async () => {
    console.log("Fetching transactions...");
    const data = await getAllTransactions();
    console.log("Transactions received:", data);
    if (data) {
      setTransactions(data);
      setTotalCount(data.length);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [getAllTransactions]);

  const handleRefresh = () => {
    fetchTransactions();
  };

  const handlePaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const columns = [
    {
      title: "Giao dịch",
      key: "transaction",
      width: 280,
      render: (_: any, record: Transaction) => {
        const isOutbound = record.transactionDirection === 1; // 1 = Trừ tiền, 0 = Cộng tiền
        const title = record.typeText || record.systemKindText || "Giao dịch";
        const ref = record.paymentReference;
        const displayTitle = ref ? `${title} #${ref}` : title;

        return (
          <Space>
            <span
              className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                isOutbound
                  ? "bg-rose-50 text-rose-600"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              {isOutbound ? (
                <ArrowDownRight className="w-4 h-4" />
              ) : (
                <ArrowUpRight className="w-4 h-4" />
              )}
            </span>
            <div>
              <div className="font-medium text-sm">{displayTitle}</div>
              <div className="text-xs text-gray-500">
                {record.userId
                  ? `User: ${record.userId.slice(0, 8)}...`
                  : "System"}
              </div>
              {record.isSystem && <Tag color="purple">System</Tag>}
            </div>
          </Space>
        );
      },
    },
    {
      title: "Loại giao dịch",
      key: "type",
      width: 150,
      render: (_: any, record: Transaction) => (
        <div>
          <Tag color="blue">{record.systemKindText || "N/A"}</Tag>
          {record.typeText && (
            <div className="text-xs text-gray-500 mt-1">{record.typeText}</div>
          )}
        </div>
      ),
    },
    {
      title: "Số tiền",
      key: "amount",
      align: "right" as const,
      width: 150,
      sorter: (a: Transaction, b: Transaction) => a.paidAmount - b.paidAmount,
      render: (_: any, record: Transaction) => {
        const isOutbound = record.transactionDirection === 1;
        const sign = isOutbound ? "-" : "+";
        const amountClass = isOutbound ? "text-rose-600" : "text-emerald-600";

        return (
          <div className={`font-medium ${amountClass}`}>
            {sign} {formatVND(record.paidAmount)}
          </div>
        );
      },
    },
    {
      title: "Kênh thanh toán",
      dataIndex: "paymentChannelText",
      key: "paymentChannelText",
      width: 130,
      render: (channel: string, record: Transaction) => (
        <div>
          <div className="font-medium text-sm">{channel}</div>
          {record.method && (
            <div className="text-xs text-gray-500">{record.method}</div>
          )}
        </div>
      ),
    },
    {
      title: "Thông tin tài khoản",
      key: "account",
      width: 200,
      render: (_: any, record: Transaction) => {
        if (record.counterAccountName && record.counterAccountNumber) {
          return (
            <div>
              <div className="font-medium text-sm">
                {record.counterAccountName}
              </div>
              <div className="text-xs text-gray-500">
                {record.counterAccountNumber}
              </div>
              {record.counterAccountBankId && (
                <div className="text-xs text-gray-400">
                  Bank: {record.counterAccountBankId}
                </div>
              )}
            </div>
          );
        }
        return <span className="text-gray-400">-</span>;
      },
    },
    {
      title: "Trạng thái giao dịch",
      key: "status",
      width: 150,
      render: (_: any, record: Transaction) => (
        <StatusTag status={record.status} statusText={record.statusText} />
      ),
    },
    {
      title: "Thời gian",
      key: "transactionDateTime",
      fixed: "right" as const,
      width: 180,
      sorter: (a: Transaction, b: Transaction) =>
        dayjs(a.transactionDateTime).valueOf() -
        dayjs(b.transactionDateTime).valueOf(),
      render: (_: any, record: Transaction) => {
        const dateText = record.transactionDateTime;
        return (
          <div>
            <div className="font-medium">
              {dayjs(dateText).format("DD/MM/YYYY")}
            </div>
            <div className="text-xs text-gray-500">
              {dayjs(dateText).format("HH:mm:ss")}
            </div>
          </div>
        );
      },
    },
    // {
    //   title: "Hành động",
    //   key: "actions",
    //   fixed: "right" as const,
    //   width: 80,
    //   render: (_: any, record: Transaction) => (
    //     <div className="flex items-center justify-center">
    //       <Eye
    //         className="h-4 w-4 cursor-pointer text-blue-500 hover:text-blue-600"
    //         onClick={() => console.log("View transaction:", record)}
    //       />
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-6 pb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Danh sách giao dịch</h3>
        <Button
          onClick={handleRefresh}
          disabled={loading}
          size="sm"
          variant="outline"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Làm mới
        </Button>
      </div>

      <div className="px-6 pb-6">
        <Table<Transaction>
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={transactions}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalCount,
            onChange: handlePaginationChange,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} giao dịch`,
          }}
          scroll={{ x: "max-content", y: 600 }}
          size="middle"
          locale={{
            emptyText: (
              <Empty
                description="Không có giao dịch nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </div>
    </div>
  );
}
