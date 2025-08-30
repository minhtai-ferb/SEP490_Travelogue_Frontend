// components/booking-table.tsx
"use client";

import { Table, Tag, Space, Tooltip } from "antd";
import type { TableProps } from "antd";
import { Eye, XCircle, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

// ==== Types ====
export interface BookingItem {
  id: string;
  userId: string;
  userName: string;
  tourId: string | null;
  tourName: string | null;
  tourScheduleId: string | null;
  departureDate: string | null; 
  tourGuideId: string | null;
  tourGuideName: string | null;
  tripPlanId: string | null;
  tripPlanName: string | null;
  workshopId: string | null;
  workshopName: string | null;
  workshopScheduleId: string | null;
  paymentLinkId: string | null;
  status: number; 
  statusText: string;
  bookingType: number; 
  bookingTypeText: string;
  bookingDate: string; 
  startDate: string; 
  endDate: string; 
  cancelledAt: string | null;
  promotionId: string | null;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
}

export interface BookingTableProps {
  data: BookingItem[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPaginationChange: (page: number, pageSize: number) => void;

  // actions
  onView: (record: BookingItem) => void;
  onCancel?: (record: BookingItem) => void;
  onPay?: (record: BookingItem) => void;

  // antd Table onChange (nếu cần sort/filter)
  onChange?: TableProps<BookingItem>["onChange"];
}

// ==== Helpers ====
const fmtMoney = (n: number) =>
  n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const isDefaultDate = (iso?: string) => !iso || iso.startsWith("0001-01-01");

const fmtDate = (iso?: string | null) =>
  !iso || isDefaultDate(iso) ? "—" : new Date(iso).toLocaleString("vi-VN");

const statusTag = (r: BookingItem) => {
  const map: Record<number, { color: string; text: string }> = {
    0: { color: "gold", text: r.statusText || "Đang chờ thanh toán" },
    1: { color: "blue", text: r.statusText || "Đã thanh toán" },
    2: { color: "red", text: r.statusText || "Bị hủy chưa thanh toán" },
    3: { color: "red", text: r.statusText || "Bị hủy đã thanh toán" },
    4: { color: "red", text: r.statusText || "Bị hủy bởi nhà cung cấp" },
    5: { color: "green", text: r.statusText || "Đã hoàn thành" },
    6: { color: "default", text: r.statusText || "Hết hạn" },
  };
  const s = map[r.status] ?? { color: "default", text: r.statusText ?? "—" };
  return <Tag color={s.color}>{s.text}</Tag>;
};

export function BookingTableComponent({
  data,
  loading,
  currentPage,
  pageSize,
  totalCount,
  onPaginationChange,
  onView,
  onCancel,
  onPay,
  onChange,
}: BookingTableProps) {
  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "userName",
      key: "userName",
      ellipsis: true,
      width: 180,
    },
    {
      title: "Chuyến tham quan",
      key: "tourName",
      ellipsis: true,
      width: 140,
      render: (_: any, r: BookingItem) => (
        <Tooltip title={r.tourName || "—"}>{r.tourName || "—"}</Tooltip>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "bookingDate",
      key: "bookingDate",
      width: 170,
      render: (v: string) => fmtDate(v),
      sorter: (a: BookingItem, b: BookingItem) =>
        new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime(),
    },
    {
      title: "Khởi hành",
      dataIndex: "departureDate",
      key: "departureDate",
      width: 170,
      render: (v: string | null) => fmtDate(v ?? undefined),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 150,
      render: (_: any, r: BookingItem) => statusTag(r),
      filters: [
        { text: "Đang chờ thanh toán", value: 0 },
        { text: "Đã thanh toán", value: 1 },
        { text: "Bị hủy chưa thanh toán", value: 2 },
        { text: "Bị hủy đã thanh toán", value: 3 },
        { text: "Bị hủy bởi nhà cung cấp", value: 4 },
        { text: "Đã hoàn thành", value: 5 },
        { text: "Hết hạn", value: 6 },
      ],
      onFilter: (value: any, record: BookingItem) => record.status === value,
    },
    {
      title: "Thành tiền",
      dataIndex: "finalPrice",
      key: "finalPrice",
      width: 140,
      align: "right" as const,
      render: (v: number, r: BookingItem) => (
        <Tooltip
          title={`Giá gốc: ${fmtMoney(r.originalPrice)} • Giảm: ${fmtMoney(
            r.discountAmount
          )}`}
        >
          <span className="font-medium">{fmtMoney(v)}</span>
        </Tooltip>
      ),
      sorter: (a: BookingItem, b: BookingItem) => a.finalPrice - b.finalPrice,
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right" as const,
      width: 80,
      render: (_: any, r: BookingItem) => (
        <Space size="small" className="flex items-center justify-center">
          <Tooltip title="Xem chi tiết đặt chỗ">
            <Eye
              className="h-4 w-4 cursor-pointer text-blue-500 hover:text-blue-600"
              onClick={() => onView(r)}
            />
          </Tooltip>

          {/* {onPay && r.paymentLinkId && r.status === 0 && (
            <Button onClick={() => onPay(r)} variant="outline" size="sm">
              <Wallet className="h-4 w-4" />
            </Button>
          )}

          {onCancel && r.status === 0 && (
            <Button
              onClick={() => onCancel(r)}
              variant="outline"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )} */}
        </Space>
      ),
    },
  ];

  return (
    <Table<BookingItem>
      rowKey={(x) => x.id}
      columns={columns}
      dataSource={data}
      loading={loading}
      onChange={onChange}
      pagination={{
        current: currentPage,
        pageSize,
        total: totalCount,
        onChange: onPaginationChange,
        showSizeChanger: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} trong ${total} booking`,
      }}
      scroll={{ x: 1100 }}
    />
  );
}
