// components/booking-table.tsx
"use client";

import { Table, Tag, Space, Button as AntButton } from "antd";
import type { TableProps } from "antd";
import { Eye, XCircle, Wallet, Calendar, User, MapPin } from "lucide-react";
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
  onViewWorkshop?: (record: BookingItem) => void;

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
  onViewWorkshop,
  onChange,
}: BookingTableProps) {
  const columns = [
    {
      title: "Mã booking",
      key: "bookingCode",
      width: 120,
      render: (_: any, r: BookingItem) => (
        <div className="font-mono text-xs bg-purple-50 px-2 py-1 rounded">
          #{r.id.slice(-8)}
        </div>
      ),
    },
    {
      title: "Khách hàng",
      key: "customer",
      width: 200,
      render: (_: any, r: BookingItem) => (
        <div className="space-y-1">
          <div className="font-medium">{r.userName}</div>
          <div className="text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {r.contactName}
            </div>
            <div>{r.contactPhone}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Workshop",
      key: "workshop",
      width: 280,
      render: (_: any, r: BookingItem) => (
        <div className="space-y-2">
          <div className="font-medium">{r.workshopName || "—"}</div>
          <div className="flex items-center gap-2">
            <Tag color="purple">{r.bookingTypeText}</Tag>
            {r.workshopId && onViewWorkshop && (
              <AntButton
                type="link"
                size="small"
                icon={<MapPin className="h-3 w-3" />}
                onClick={() => onViewWorkshop(r)}
                className="p-0 h-auto text-xs"
              >
                Xem chi tiết workshop
              </AntButton>
            )}
          </div>
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
          <div className="inline-flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
            {r.participants?.length || 0}
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 150,
      render: (_: any, r: BookingItem) => statusTag(r),
      filters: [
        { text: "Đang chờ thanh toán", value: 0 },
        { text: "Đã thanh toán", value: 1 },
        { text: "Bị hủy", value: 2 },
        { text: "Hoàn thành", value: 5 },
      ],
      onFilter: (value: any, record: BookingItem) => record.status === value,
    },
    {
      title: "Giá tiền",
      key: "price",
      width: 150,
      align: "right" as const,
      render: (_: any, r: BookingItem) => (
        <div className="text-right space-y-1">
          {r.discountAmount > 0 && (
            <div className="text-xs text-gray-400 line-through">
              {fmtMoney(r.originalPrice)}
            </div>
          )}
          <div className="font-medium text-green-600">
            {fmtMoney(r.finalPrice)}
          </div>
          {r.discountAmount > 0 && (
            <div className="text-xs text-red-500">
              -{fmtMoney(r.discountAmount)}
            </div>
          )}
        </div>
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
        pageSizeOptions: ["10", "20", "50"],
      }}
      scroll={{ x: 1200 }}
      size="middle"
      className="booking-table"
    />
  );
}
