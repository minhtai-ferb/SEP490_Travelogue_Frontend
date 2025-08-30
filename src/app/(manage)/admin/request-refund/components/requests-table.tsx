"use client";

import React from "react";
import { Table, Empty, Space, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import StatusTag from "./satus-tag";
import BookingInfoTooltip from "./booking-info-tooltip";
import { Eye, MapPin, Calendar, User, Phone, Mail, Info } from "lucide-react";
import { RefundRequest } from "@/types/RequestRefund";
import "./booking-styles.css";

export default function RequestsTable({
  data,
  loading,
  onViewTourDetail,
  onViewTripPlanDetail,
  onViewWorkshopDetail,
}: {
  data: RefundRequest[];
  loading: boolean;
  onViewTourDetail?: (tourId: string) => void;
  onViewTripPlanDetail?: (tripPlanId: string) => void;
  onViewWorkshopDetail?: (workshopId: string) => void;
}) {
  const router = useRouter();
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const columns: ColumnsType<RefundRequest> = [
    {
      title: "Người yêu cầu",
      dataIndex: "userName",
      key: "userName",
      width: 180,
      fixed: "left",
      sorter: (a, b) => a.userName.localeCompare(b.userName),
      render: (text: string, record) => (
        <Space direction="vertical" size={2}>
          <span className="font-medium">{text}</span>
          <div className="text-[11px] text-gray-500 space-y-1">
            <div className="flex items-center gap-1">
              <Phone size={10} />
              <span>{record.bookingDataModel?.contactPhone || "-"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail size={10} />
              <span title={record.bookingDataModel?.contactEmail}>
                {record.bookingDataModel?.contactEmail
                  ? record.bookingDataModel.contactEmail.length > 15
                    ? `${record.bookingDataModel.contactEmail.slice(0, 15)}...`
                    : record.bookingDataModel.contactEmail
                  : "-"}
              </span>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Thông tin đặt chỗ",
      key: "bookingInfo",
      width: 320,
      render: (_, record) => {
        const booking = record.bookingDataModel;
        if (!booking) return <span className="text-gray-400">-</span>;

        return (
          <BookingInfoTooltip
            booking={booking}
            onViewTourDetail={onViewTourDetail}
            onViewTripPlanDetail={onViewTripPlanDetail}
            onViewWorkshopDetail={onViewWorkshopDetail}
          >
            <div className="cursor-pointer hover:bg-gray-50 p-2 rounded booking-info-hover">
              <Space direction="vertical" size={4} className="w-full">
                {/* Mã booking và giá */}
                <div className="flex items-center justify-between">
                  {/* <Tag color="blue" className="text-xs font-mono">
                    {booking.id.length > 12 ? `${booking.id.slice(0, 12)}...` : booking.id}
                  </Tag> */}
                  <Tag color="green" className="text-xs w-fit">
                    {booking.bookingTypeText || "Không xác định"}
                  </Tag>
                  <span className="text-xs font-bold text-red-600">
                    {formatPrice(booking.finalPrice)}
                  </span>
                </div>

                {/* Thông tin tour/trip/workshop - chỉ hiển thị cái có */}
                <div className="space-y-1">
                  {booking.tourName && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs flex-3 font-medium text-green-600 truncate max-w-[250px]">
                        Chuyến tham quan: {booking.tourName}
                      </span>
                      {booking.tourId && onViewTourDetail && (
                        <Tooltip title="Xem chi tiết tour">
                          <Eye
                            size={12}
                            className="cursor-pointer text-blue-500 hover:text-blue-600 flex-shrink-0 eye-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewTourDetail(booking.tourId);
                            }}
                          />
                        </Tooltip>
                      )}
                    </div>
                  )}

                  {booking.tripPlanName && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-purple-600 truncate max-w-[250px]">
                        Kế hoạch chuyến đi: {booking.tripPlanName}
                      </span>
                      {booking.tripPlanId && onViewTripPlanDetail && (
                        <Tooltip title="Xem chi tiết kế hoạch">
                          <Eye
                            size={12}
                            className="cursor-pointer text-blue-500 hover:text-blue-600 flex-shrink-0 eye-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewTripPlanDetail(booking.tripPlanId);
                            }}
                          />
                        </Tooltip>
                      )}
                    </div>
                  )}

                  {booking.workshopName && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-orange-600 truncate max-w-[250px]">
                        Trải nghiệm làm nghề: {booking.workshopName}
                      </span>
                      {booking.workshopId && onViewWorkshopDetail && (
                        <Tooltip title="Xem chi tiết workshop">
                          <Eye
                            size={12}
                            className="cursor-pointer text-blue-500 hover:text-blue-600 flex-shrink-0 eye-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewWorkshopDetail(booking.workshopId);
                            }}
                          />
                        </Tooltip>
                      )}
                    </div>
                  )}
                </div>

                {/* Tour guide */}
                {booking.tourGuideName && (
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <User size={10} />
                    <span className="truncate">
                      HDV: {booking.tourGuideName}
                    </span>
                  </div>
                )}

                {/* Ngày khởi hành */}
                {booking.departureDate && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={10} />
                    <span>
                      {dayjs(booking.departureDate).format("DD/MM/YY")}
                    </span>
                  </div>
                )}
              </Space>
            </div>
          </BookingInfoTooltip>
        );
      },
    },
    {
      title: "Liên hệ",
      key: "contact",
      width: 180,
      responsive: ["lg"],
      render: (_, record) => {
        const booking = record.bookingDataModel;
        if (!booking) return <span className="text-gray-400">-</span>;

        return (
          <Space direction="vertical" size={1}>
            <div
              className="text-xs font-medium truncate"
              title={booking.contactName}
            >
              {booking.contactName || "-"}
            </div>
            <div className="text-xs text-gray-600 flex items-center gap-1">
              <Phone size={10} />
              <span>{booking.contactPhone || "-"}</span>
            </div>
            <div
              className="text-xs text-gray-600 flex items-center gap-1"
              title={booking.contactEmail}
            >
              <Mail size={10} />
              <span className="truncate max-w-[120px]">
                {booking.contactEmail || "-"}
              </span>
            </div>
          </Space>
        );
      },
    },
    {
      title: "Lý do hoàn tiền",
      dataIndex: "reason",
      key: "reason",
      width: 200,
      render: (text: string) => (
        <div className="text-xs" title={text}>
          {text && text.length > 50 ? `${text.slice(0, 50)}...` : text || "-"}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, r) => <StatusTag status={r.status} />,
      width: 120,
    },
    {
      title: "Thời gian yêu cầu",
      dataIndex: "requestedAt",
      key: "requestedAt",
      sorter: (a, b) =>
        dayjs(a.requestedAt).valueOf() - dayjs(b.requestedAt).valueOf(),
      render: (v: string) => (
        <div className="text-xs">
          <div>{dayjs(v).format("DD/MM/YYYY")}</div>
          <div className="text-gray-500">{dayjs(v).format("HH:mm")}</div>
        </div>
      ),
      width: 120,
    },
    {
      title: "Thời gian phản hồi",
      dataIndex: "respondedAt",
      key: "respondedAt",
      sorter: (a, b) =>
        dayjs(a.respondedAt).valueOf() - dayjs(b.respondedAt).valueOf(),
      render: (v: string, record) => {
        const isUpdated =
          dayjs(record.respondedAt).format("YYYY-MM-DD HH:mm") !==
          dayjs(v).format("YYYY-MM-DD HH:mm");
        return (
          <div className="text-xs">
            {isUpdated ? (
              <>
                <div>{dayjs(v).format("DD/MM/YYYY")}</div>
                <div className="text-gray-500">{dayjs(v).format("HH:mm")}</div>
              </>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        );
      },
      width: 120,
    },
    {
      title: "Chi tiết",
      key: "actions",
      fixed: "right",
      width: 80,
      render: (_, r) => (
        <div className="flex items-center justify-center">
          <Tooltip title="Xem chi tiết yêu cầu hoàn tiền">
            <Eye
              className="h-4 w-4 cursor-pointer text-blue-500 hover:text-blue-600"
              onClick={() => router.push(`/admin/request-refund/${r.id}`)}
            />
          </Tooltip>
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
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} yêu cầu`,
      }}
      scroll={{ x: 'max-content' }}
      className="mt-4"
      size="small"
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không có yêu cầu hoàn tiền nào"
          />
        ),
      }}
    />
  );
}
