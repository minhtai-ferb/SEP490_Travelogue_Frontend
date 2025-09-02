// components/booking-table.tsx
"use client";

import { Table, Tag, Space, Tooltip, Button as AntButton } from "antd";
import type { TableProps } from "antd";
import { Eye, XCircle, Wallet, MapPin, Calendar } from "lucide-react";
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
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  participants: Array<{
    id: string;
    fullName: string;
    genderText: string;
    dateOfBirth: string;
    quantity: number;
    pricePerParticipant: number;
  }>;
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
  onViewTour?: (record: BookingItem) => void;

  // antd Table onChange (nếu cần sort/filter)
  onChange?: TableProps<BookingItem>["onChange"];
}

// ==== Helpers ====
const fmtMoney = (n: number) =>
  n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const isDefaultDate = (iso?: string) => !iso || iso.startsWith("0001-01-01");

const fmtDate = (iso?: string | null) =>
  !iso || isDefaultDate(iso) ? "—" : new Date(iso).toLocaleString("vi-VN");

const fmtDateOnly = (iso?: string | null) =>
  !iso || isDefaultDate(iso) ? "—" : new Date(iso).toLocaleDateString("vi-VN");

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
  onViewTour,
  onChange,
}: BookingTableProps) {
  const columns = [
    {
      title: "Mã đặt chỗ",
      dataIndex: "id",
      key: "id",
      width: 120,
      render: (id: string) => (
        <Tag color="blue" className="font-mono text-xs">
          #{id.slice(-8)}
        </Tag>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "userName",
      key: "userName",
      ellipsis: true,
      width: 150,
      render: (name: string, record: BookingItem) => (
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-gray-500">{record.contactName || "—"}</div>
        </div>
      ),
    },
    {
      title: "Chuyến tham quan",
      key: "tour",
      width: 200,
      render: (_: any, r: BookingItem) => (
        <div className="space-y-1">
          <div className="font-medium">{r.tourName || "—"}</div>
          {r.tourId && onViewTour && (
            <AntButton
              type="link"
              size="small"
              icon={<MapPin className="h-3 w-3" />}
              onClick={() => onViewTour(r)}
              className="p-0 h-auto text-xs"
            >
              Xem chi tiết tour
            </AntButton>
          )}
        </div>
      ),
    },
    {
      title: "Thời gian",
      key: "duration",
      width: 180,
      render: (_: any, r: BookingItem) => (
        <div className="space-y-1">
          <div className="text-sm">
            <span className="text-gray-500">Khởi hành:</span> {fmtDateOnly(r.departureDate)}
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Bắt đầu:</span> {fmtDateOnly(r.startDate)}
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Kết thúc:</span> {fmtDateOnly(r.endDate)}
          </div>
          <div className="text-xs text-gray-400">
            Đặt: {fmtDate(r.bookingDate)}
          </div>
        </div>
      ),
    },
    {
      title: "Người tham gia",
      key: "participants",
      width: 120,
      align: "center" as const,
      render: (_: any, r: BookingItem) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">
            {r.participants?.length || 0}
          </div>
          <div className="text-xs text-gray-500">người</div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 150,
      render: (_: any, r: BookingItem) => statusTag(r),
      filters: [
        { text: "Chờ thanh toán", value: 0 },
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
          <div className="text-right">
            <div className="font-semibold text-green-600">{fmtMoney(v)}</div>
            {r.discountAmount > 0 && (
              <div className="text-xs text-gray-400 line-through">
                {fmtMoney(r.originalPrice)}
              </div>
            )}
          </div>
        </Tooltip>
      ),
      sorter: (a: BookingItem, b: BookingItem) => a.finalPrice - b.finalPrice,
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right" as const,
      width: 120,
      render: (_: any, r: BookingItem) => (
        <Space size="small" direction="vertical">
          <Button onClick={() => onView(r)} variant="outline" size="sm" className="w-full">
            <Eye className="h-4 w-4 mr-1" />
            Chi tiết
          </Button>

          {/* {onPay && r.paymentLinkId && r.status === 0 && (
            <Button onClick={() => onPay(r)} variant="outline" size="sm" className="w-full">
              <Wallet className="h-4 w-4 mr-1" />
              Thanh toán
            </Button>
          )} */}
{/* 
          {onCancel && [0, 1].includes(r.status) && (
            <Button
              onClick={() => onCancel(r)}
              variant="outline"
              size="sm"
              className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Hủy
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
        pageSizeOptions: ["10", "20", "50"],
      }}
      scroll={{ x: 1200 }}
      size="middle"
      className="booking-table"
    />
  );
}
