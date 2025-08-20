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
  departureDate: string | null;       // có thể null
  tourGuideId: string | null;
  tourGuideName: string | null;
  tripPlanId: string | null;
  tripPlanName: string | null;
  workshopId: string | null;
  workshopName: string | null;
  workshopScheduleId: string | null;
  paymentLinkId: string | null;
  status: number;                     // 0: pending, 1: confirmed, 2: cancelled, ...
  statusText: string;
  bookingType: number;                // 1: Tour, 2: Workshop, 3: Tour Guide, 4: Trip Plan ...
  bookingTypeText: string;
  bookingDate: string;                // ISO
  startDate: string;                  // ISO
  endDate: string;                    // ISO
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

const isDefaultDate = (iso?: string) =>
  !iso || iso.startsWith("0001-01-01");

const fmtDate = (iso?: string | null) =>
  !iso || isDefaultDate(iso) ? "—" : new Date(iso).toLocaleString("vi-VN");

const getSubject = (r: BookingItem) =>
  r.tourName ??
  r.workshopName ??
  r.tourGuideName ??
  r.tripPlanName ??
  "(không rõ)";

const statusTag = (r: BookingItem) => {
  const map: Record<number, { color: string; text: string }> = {
    0: { color: "gold", text: r.statusText || "Đang chờ" },
    1: { color: "green", text: r.statusText || "Đã xác nhận" },
    2: { color: "red", text: r.statusText || "Đã hủy" },
  };
  const s = map[r.status] ?? { color: "default", text: r.statusText ?? "—" };
  return <Tag color={s.color}>{ s.text }</Tag>;
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
      title: "Loại đặt chỗ",
      dataIndex: "bookingTypeText",
      key: "bookingTypeText",
      width: 140,
      render: (t: string) => <Tag>{t}</Tag>,
    },
    {
      title: "Đối tượng",
      key: "subject",
      ellipsis: true,
      render: (_: any, r: BookingItem) => getSubject(r),
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
        { text: "Chờ xác nhận", value: 0 },
        { text: "Đã xác nhận", value: 1 },
        { text: "Đã hủy", value: 2 },
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
      width: 180,
      render: (_: any, r: BookingItem) => (
        <Space size="small">
          <Button onClick={() => onView(r)} variant="outline" size="sm">
            <Eye className="h-4 w-4" />
          </Button>

          {onPay && r.paymentLinkId && r.status === 0 && (
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
          )}
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
