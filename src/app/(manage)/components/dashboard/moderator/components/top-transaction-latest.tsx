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

  // Tạo danh sách 5 items (thực tế + placeholder)
  const displayItems = Array.from({ length: 5 }, (_, index) => {
    if (index < transactions.length) {
      return { type: 'real' as const, data: transactions[index], index };
    }
    return { type: 'placeholder' as const, index };
  });

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
        bodyStyle={{ height: 'calc(100% - 70px)', padding: '16px', display: 'flex', flexDirection: 'column' }}
      >
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-2 border rounded-lg">
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
      bodyStyle={{ height: 'calc(100% - 70px)', padding: '16px', display: 'flex', flexDirection: 'column' }}
    >
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {displayItems.map((item) => {
            if (item.type === 'real') {
              const transaction = item.data;
              const isOutbound = transaction.transactionDirection === 1;
              const title = transaction.typeText || transaction.systemKindText || "Giao dịch";
              const ref = transaction.paymentReference;
              const displayTitle = ref ? `${title} #${ref}` : title;

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-2 border rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                        isOutbound
                          ? "bg-red-50 text-red-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {isOutbound ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1 line-clamp-1 text-sm">
                        {displayTitle}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{dayjs(transaction.transactionDateTime).format("DD/MM HH:mm")}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div
                      className={`flex items-center gap-1 text-lg font-semibold ${
                        isOutbound ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {isOutbound ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      <span>{transaction.paidAmount.toLocaleString()} VND</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {transaction.transactionDirectionText}
                    </div>
                  </div>
                </div>
              );
            } else {
              // Placeholder item
              return (
                <div 
                  key={`placeholder-${item.index}`} 
                  className="flex items-center justify-between p-2 border border-dashed border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-400">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-400 mb-1 text-sm">
                        Chưa có giao dịch
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-lg font-semibold text-gray-400">
                      <ArrowUpRight className="h-4 w-4" />
                      <span>0 VND</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      transaction
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
        
        {/* Footer thống kê tổng */}
        <div className="mt-3 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <ArrowDownRight className="h-3 w-3" />
            <span>
              Tổng giá trị: {transactions.reduce((sum, t) => sum + t.paidAmount, 0).toLocaleString()} VND
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
