"use client";

import React from "react";
import { Card, Tag, Tooltip, Button, Space, Divider } from "antd";
import { 
  EyeOutlined, 
  CalendarOutlined, 
  UserOutlined, 
  PhoneOutlined, 
  MailOutlined,
  HomeOutlined,
  DollarOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { BookingInfo } from "@/types/RequestRefund";

interface BookingInfoCardProps {
  booking: BookingInfo;
  onViewTourDetail?: (tourId: string) => void;
  onViewTripPlanDetail?: (tripPlanId: string) => void;
  onViewWorkshopDetail?: (workshopId: string) => void;
}

export default function BookingInfoCard({ 
  booking,
  onViewTourDetail,
  onViewTripPlanDetail,
  onViewWorkshopDetail 
}: BookingInfoCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <Card 
      title={
        <div className="flex items-center justify-between">
          <span>Thông tin đặt chỗ</span>
          {/* <Tag color="blue" className="font-mono">
            {booking.id}
          </Tag> */}
        </div>
      }
      size="small"
      className="w-full"
    >
      <div className="space-y-4">
        {/* Loại và trạng thái booking */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag color="green">
              {booking.bookingTypeText || "Không xác định"}
            </Tag>
            <Tag color="blue">
              {booking.statusText || "Không xác định"}
            </Tag>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-red-600">
              {formatPrice(booking.finalPrice)}
            </div>
          </div>
        </div>

        <Divider className="my-3" />

        {/* Thông tin tour/trip/workshop */}
        <div className="space-y-3">
          {booking.tourName && (
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <div className="font-semibold text-green-700 flex items-center gap-2">
                  Chuyến tham quan
                </div>
                <div className="text-sm font-medium text-green-600">
                  {booking.tourName}
                </div>
                {/* <div className="text-xs text-gray-500 mt-1">
                  ID: {booking.tourId} • Schedule: {booking.tourScheduleId || "-"}
                </div> */}
              </div>
              {booking.tourId && onViewTourDetail && (
                <Tooltip title="Xem chi tiết tour">
                  <Button 
                    type="primary"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => onViewTourDetail(booking.tourId)}
                  />
                </Tooltip>
              )}
            </div>
          )}
          
          {booking.tripPlanName && (
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div>
                <div className="font-semibold text-purple-700 flex items-center gap-2">
                  Kế hoạch cá nhân: {booking.tripPlanName}
                </div>
                {/* <div className="text-xs text-gray-500 mt-1">
                  ID: {booking.tripPlanId}
                </div> */}
              </div>
              {booking.tripPlanId && onViewTripPlanDetail && (
                <Tooltip title="Xem chi tiết kế hoạch">
                  <Button 
                    type="primary"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => onViewTripPlanDetail(booking.tripPlanId)}
                  />
                </Tooltip>
              )}
            </div>
          )}
          
          {booking.workshopName && (
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div>
                <div className="font-semibold text-orange-700 flex items-center gap-2">
                  Trải nghiệm làng nghề: {booking.workshopName}
                </div>
                {/* <div className="text-xs text-gray-500 mt-1">
                  ID: {booking.workshopId} • Schedule: {booking.workshopScheduleId || "-"}
                </div> */}
              </div>
              {booking.workshopId && onViewWorkshopDetail && (
                <Tooltip title="Xem chi tiết workshop">
                  <Button 
                    type="primary"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => onViewWorkshopDetail(booking.workshopId)}
                  />
                </Tooltip>
              )}
            </div>
          )}
        </div>

        <Divider className="my-3" />

        {/* Hướng dẫn viên */}
        {booking.tourGuideName && (
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
            <UserOutlined className="text-blue-500" />
            <div>
              <span className="text-sm font-medium">Hướng dẫn viên: {booking.tourGuideName}</span>
              {/* {booking.tourGuideId && (
                <span className="text-xs text-gray-500 ml-2">
                  (ID: {booking.tourGuideId})
                </span>
              )} */}
            </div>
          </div>
        )}

        {/* Thông tin thời gian */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {booking.bookingDate && (
            <div className="flex items-center gap-2 text-sm">
              <CalendarOutlined className="text-gray-500" />
              <span className="text-gray-600">Ngày đặt:</span>
              <span className="font-medium">
                {dayjs(booking.bookingDate).format("DD/MM/YYYY HH:mm")}
              </span>
            </div>
          )}
          
          {booking.departureDate && (
            <div className="flex items-center gap-2 text-sm">
              <CalendarOutlined className="text-gray-500" />
              <span className="text-gray-600">Khởi hành:</span>
              <span className="font-medium">
                {dayjs(booking.departureDate).format("DD/MM/YYYY")}
              </span>
            </div>
          )}
          
          {booking.startDate && booking.endDate && (
            <div className="flex items-center gap-2 text-sm col-span-full">
              <CalendarOutlined className="text-gray-500" />
              <span className="text-gray-600">Thời gian tour:</span>
              <span className="font-medium">
                {dayjs(booking.startDate).format("DD/MM/YYYY")} - {dayjs(booking.endDate).format("DD/MM/YYYY")}
              </span>
            </div>
          )}
        </div>

        <Divider className="my-3" />

        {/* Thông tin liên hệ */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="font-medium text-gray-700 mb-2">Thông tin liên hệ:</div>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2 text-sm">
              <UserOutlined className="text-gray-500" />
              <span>{booking.contactName || "-"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <PhoneOutlined className="text-gray-500" />
              <span>{booking.contactPhone || "-"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MailOutlined className="text-gray-500" />
              <span title={booking.contactEmail}>
                {booking.contactEmail || "-"}
              </span>
            </div>
            {booking.contactAddress && (
              <div className="flex items-start gap-2 text-sm">
                <HomeOutlined className="text-gray-500 mt-1" />
                <span title={booking.contactAddress}>
                  {booking.contactAddress}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
