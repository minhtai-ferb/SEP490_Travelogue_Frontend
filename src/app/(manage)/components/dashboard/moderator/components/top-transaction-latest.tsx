"use client";

import React, { useEffect, useState } from "react";
import { Card, Space, Tag, Skeleton, Empty } from "antd";
import { TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import dayjs from "dayjs";
import { useTransaction } from "@/services/use-transaction";

// Transaction interface (sử dụng lại từ transaction-table)
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

export default function TopTransactionLatest() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { getTopTransactionLatest, loading } = useTransaction();

  const fetchTopTransactions = async () => {
    const data = await getTopTransactionLatest();
    if (data) {
      // Chỉ lấy 5 giao dịch đầu tiên
      setTransactions(data.slice(0, 5));
    }
  };

  useEffect(() => {
    fetchTopTransactions();
  }, [getTopTransactionLatest]);

  if (loading) {
    return (
      <Card 
        className="h-full"
        title={
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Top 5 Giao Dịch Mới Nhất</span>
            </div>
            <span className="text-xs text-gray-500 mt-1">Giao dịch hệ thống đã thanh toán thành công</span>
          </div>
        }
      >
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Skeleton.Avatar size="small" />
                <div>
                  <Skeleton.Input style={{ width: 150, height: 16 }} active />
                  <div className="mt-1">
                    <Skeleton.Input style={{ width: 100, height: 12 }} active />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Skeleton.Input style={{ width: 80, height: 16 }} active />
                <div className="mt-1">
                  <Skeleton.Input style={{ width: 60, height: 12 }} active />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card 
        className="h-full"
        title={
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Top 5 Giao Dịch Mới Nhất</span>
            </div>
            <span className="text-xs text-gray-500 mt-1">Giao dịch của hệ thống</span>
          </div>
        }
      >
        <Empty 
          description="Không có giao dịch nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <Card 
      className="h-full"
      title={
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Top 5 Giao Dịch Mới Nhất</span>
          </div>
          <span className="text-xs text-gray-500 mt-1">Giao dịch hệ thống đã thanh toán thành công</span>
        </div>
      }
    >
      <div className="space-y-3">
        {transactions.map((transaction, index) => {
          const isOutbound = transaction.transactionDirection === 1; // 1 = Trừ tiền, 0 = Cộng tiền
          const title = transaction.typeText || transaction.systemKindText || "Giao dịch";
          const ref = transaction.paymentReference;
          const displayTitle = ref ? `${title} #${ref}` : title;

          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Icon giao dịch */}
                <div
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${
                    isOutbound
                      ? "bg-rose-50 text-rose-600"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  {isOutbound ? (
                    <ArrowUpRight className="w-5 h-5" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5" />
                  )}
                </div>

                {/* Thông tin giao dịch */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-gray-900 truncate max-w-[200px]">
                      {displayTitle}
                    </span>
                    <StatusTag 
                      status={transaction.status} 
                      statusText={transaction.statusText} 
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {dayjs(transaction.createdTime).format("DD/MM/YYYY HH:mm")}
                    </span>
                    {transaction.paymentChannelText && (
                      <>
                        <span>•</span>
                        <span>{transaction.paymentChannelText}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Số tiền và ranking */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div
                    className={`font-semibold text-sm ${
                      isOutbound ? "text-rose-600" : "text-emerald-600"
                    }`}
                  >
                    {isOutbound ? "-" : "+"}{formatVND(transaction.paidAmount)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {transaction.transactionDirectionText}
                  </div>
                </div>
                
                {/* Số thứ tự */}
                <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
                  {index + 1}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Footer thống kê tổng */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span>Tổng giá trị 5 giao dịch:</span>
          </div>
          <span className="font-semibold text-green-600">
            {formatVND(transactions.reduce((sum, t) => sum + t.paidAmount, 0))}
          </span>
        </div>
      </div>
    </Card>
  );
}
