"use client";

import React from "react";
import { Popover, Card, Descriptions, Tag, Button, Space, Divider } from "antd";
import { EyeOutlined, CalendarOutlined, UserOutlined, PhoneOutlined, MailOutlined, DollarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { BookingInfo } from "@/types/RequestRefund";

interface BookingInfoTooltipProps {
  booking: BookingInfo;
  onViewTourDetail?: (tourId: string) => void;
  onViewTripPlanDetail?: (tripPlanId: string) => void;
  onViewWorkshopDetail?: (workshopId: string) => void;
  children: React.ReactNode;
}

export default function BookingInfoTooltip({ 
  booking,
  onViewTourDetail,
  onViewTripPlanDetail,
  onViewWorkshopDetail,
  children 
}: BookingInfoTooltipProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const content = (
    <Card title="Chi tiết đặt chỗ" size="small" className="w-96 max-w-sm">
      <div className="space-y-3">
        {/* Basic Info */}
        <div className="flex items-center justify-between">
          <Tag color="blue" className="font-mono text-xs">
            {booking.id}
          </Tag>
          <div className="text-right">
            <div className="text-sm font-bold text-red-600">
              {formatPrice(booking.finalPrice)}
            </div>
            <Tag color="green" className="text-xs mt-1">
              {booking.bookingTypeText}
            </Tag>
          </div>
        </div>

        <Divider className="my-2" />

        {/* Tour/Trip/Workshop Info */}
        {booking.tourName && (
          <div className="bg-green-50 p-2 rounded border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-green-700">Chuyến tham quan</div>
                <div className="text-sm font-medium text-green-600">{booking.tourName}</div>
              </div>
              {booking.tourId && onViewTourDetail && (
                <Button 
                  type="primary" 
                  size="small" 
                  icon={<EyeOutlined />}
                  onClick={() => onViewTourDetail(booking.tourId)}
                />
              )}
            </div>
          </div>
        )}

        {booking.tripPlanName && (
          <div className="bg-purple-50 p-2 rounded border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-purple-700">Kế hoạch cá nhân</div>
                <div className="text-sm font-medium text-purple-600">{booking.tripPlanName}</div>
              </div>
              {booking.tripPlanId && onViewTripPlanDetail && (
                <Button 
                  type="primary" 
                  size="small" 
                  icon={<EyeOutlined />}
                  onClick={() => onViewTripPlanDetail(booking.tripPlanId)}
                />
              )}
            </div>
          </div>
        )}

        {booking.workshopName && (
          <div className="bg-orange-50 p-2 rounded border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-orange-700">Trải nghiệm làng nghề</div>
                <div className="text-sm font-medium text-orange-600">{booking.workshopName}</div>
              </div>
              {booking.workshopId && onViewWorkshopDetail && (
                <Button 
                  type="primary" 
                  size="small" 
                  icon={<EyeOutlined />}
                  onClick={() => onViewWorkshopDetail(booking.workshopId)}
                />
              )}
            </div>
          </div>
        )}

        {/* Tour Guide */}
        {booking.tourGuideName && (
          <div className="flex items-center gap-2 text-sm">
            <UserOutlined className="text-blue-500" />
            <span>Hướng dẫn viên: {booking.tourGuideName}</span>
          </div>
        )}

        {/* Dates */}
        <div className="space-y-1">
          {booking.bookingDate && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <CalendarOutlined />
              <span>Đặt: {dayjs(booking.bookingDate).format("DD/MM/YY HH:mm")}</span>
            </div>
          )}
          {booking.departureDate && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <CalendarOutlined />
              <span>Khởi hành: {dayjs(booking.departureDate).format("DD/MM/YYYY")}</span>
            </div>
          )}
          {booking.startDate && booking.endDate && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <CalendarOutlined />
              <span>
                {dayjs(booking.startDate).format("DD/MM")} - {dayjs(booking.endDate).format("DD/MM/YY")}
              </span>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <Divider className="my-2" />
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <UserOutlined />
            <span>{booking.contactName}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <PhoneOutlined />
            <span>{booking.contactPhone}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <MailOutlined />
            <span title={booking.contactEmail}>
              {booking.contactEmail && booking.contactEmail.length > 25 
                ? `${booking.contactEmail.slice(0, 25)}...` 
                : booking.contactEmail
              }
            </span>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <Popover 
      content={content} 
      title={null}
      placement="right" 
      trigger="hover"
      overlayClassName="booking-info-popover"
    >
      {children}
    </Popover>
  );
}
