"use client";

import React, { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  Card,
  Descriptions,
  Tag,
  Divider,
  Table,
  Space,
  Button,
  Spin,
  Alert,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  DollarOutlined,
  TeamOutlined,
  ArrowLeftOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useBookings } from "@/services/use-bookings";
import { BookingItem } from "@/types/Booking";
import { hasAdminInPath } from "@/utils/check-admin";

// Types
interface Participant {
  id: string;
  bookingId: string;
  type: number;
  quantity: number;
  pricePerParticipant: number;
  fullName: string;
  gender: number;
  genderText: string;
  dateOfBirth: string;
}

interface BookingDetailData {
  id: string;
  userId: string;
  userName: string;
  tourId: string;
  tourName: string;
  tourScheduleId: string;
  departureDate: string;
  tourGuideId: string | null;
  tourGuideName: string;
  tripPlanId: string | null;
  tripPlanName: string;
  workshopId: string | null;
  workshopName: string;
  workshopScheduleId: string | null;
  paymentLinkId: string;
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
  participants: Participant[];
}

export default function BookingDetail() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const { getBookingById, loading } = useBookings();

  const [booking, setBooking] = useState<BookingDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const bookingId = params?.id as string;

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetail();
    }
  }, [bookingId]);

  const fetchBookingDetail = async () => {
    try {
      setError(null);
      const data = await getBookingById(bookingId);
      if (data) {
        setBooking(data);
      } else {
        setError("Không tìm thấy thông tin đặt chỗ");
      }
    } catch (error) {
      console.error("Error fetching booking detail:", error);
      setError("Có lỗi xảy ra khi tải thông tin đặt chỗ");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDateTime = (dateString: string) => {
    return dayjs(dateString).format("DD/MM/YYYY HH:mm");
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  const handleViewTourDetail = async () => {
    if (booking?.tourId) {
      const isAdminPath = hasAdminInPath(pathname);
      const basePath = isAdminPath ? "/admin" : "";
      await router.push(`${basePath}/tour/${booking.tourId}`);
    }
  };

  const getStatusTag = (r: BookingItem) => {
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

  const participantColumns = [
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Giới tính",
      dataIndex: "genderText",
      key: "genderText",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (date: string) => formatDate(date),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Giá/người",
      dataIndex: "pricePerParticipant",
      key: "pricePerParticipant",
      render: (price: number) => formatPrice(price),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          action={
            <Space>
              <Button size="small" onClick={() => router.back()}>
                Quay lại
              </Button>
              <Button size="small" type="primary" onClick={fetchBookingDetail}>
                Thử lại
              </Button>
            </Space>
          }
        />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-6">
        <Alert
          message="Không tìm thấy"
          description="Không tìm thấy thông tin đặt chỗ"
          type="warning"
          showIcon
          action={
            <Button size="small" onClick={() => router.back()}>
              Quay lại
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">Chi tiết đặt chỗ</h1>
              <div className="flex items-center gap-2">
                <Tag color="blue" className="font-mono">
                  #{booking.id.slice(-8)}
                </Tag>
                {getStatusTag(booking)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thông tin chính */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thông tin đặt chỗ */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <CalendarOutlined />
                <span>Thông tin đặt chỗ</span>
              </div>
            }
          >
            <Descriptions column={2} size="small">
              <Descriptions.Item label="Loại booking">
                <Tag color="blue">{booking.bookingTypeText}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">
                {formatDateTime(booking.bookingDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Tên chuyến tham quan">
                <strong>{booking.tourName}</strong>
              </Descriptions.Item>
              <Descriptions.Item>
                <p
                  onClick={() => handleViewTourDetail()}
                  className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <EyeOutlined />
                  Xem chi tiết chuyến tham quan
                </p>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày khởi hành">
                {booking.departureDate
                  ? formatDateTime(booking.departureDate)
                  : "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Hướng dẫn viên">
                {booking.tourGuideName || "Chưa có"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu">
                {formatDateTime(booking.startDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày kết thúc">
                {formatDateTime(booking.endDate)}
              </Descriptions.Item>
              {booking.cancelledAt && (
                <Descriptions.Item label="Ngày hủy" span={2}>
                  <span className="text-red-600">
                    {formatDateTime(booking.cancelledAt)}
                  </span>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {/* Danh sách người tham gia */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <TeamOutlined />
                <span>
                  Danh sách người tham gia ({booking.participants.length} người)
                </span>
              </div>
            }
          >
            <Table
              dataSource={booking.participants}
              columns={participantColumns}
              rowKey="id"
              size="small"
              pagination={false}
              scroll={{ x: true }}
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Thông tin liên hệ */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <UserOutlined />
                <span>Thông tin liên hệ</span>
              </div>
            }
          >
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500 mb-1">Tên người đặt</div>
                <div className="font-medium">{booking.contactName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Email</div>
                <div className="flex items-center gap-2">
                  <MailOutlined className="text-gray-400" />
                  <a
                    href={`mailto:${booking.contactEmail}`}
                    className="text-blue-600 hover:underline"
                  >
                    {booking.contactEmail}
                  </a>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Số điện thoại</div>
                <div className="flex items-center gap-2">
                  <PhoneOutlined className="text-gray-400" />
                  <a
                    href={`tel:${booking.contactPhone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {booking.contactPhone}
                  </a>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Địa chỉ</div>
                <div className="flex items-start gap-2">
                  <HomeOutlined className="text-gray-400 mt-1 text-xs" />
                  <span className="text-sm">{booking.contactAddress}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Thông tin thanh toán */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <DollarOutlined />
                <span>Thông tin thanh toán</span>
              </div>
            }
          >
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Giá gốc:</span>
                <span className="font-medium">
                  {formatPrice(booking.originalPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Giảm giá:</span>
                <span className="text-green-600">
                  -{formatPrice(booking.discountAmount)}
                </span>
              </div>
              <Divider className="my-2" />
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Tổng tiền:</span>
                <span className="text-xl font-bold text-blue-600">
                  {formatPrice(booking.finalPrice)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
