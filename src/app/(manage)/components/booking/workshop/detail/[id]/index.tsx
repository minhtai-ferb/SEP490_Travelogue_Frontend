"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import {
  Card,
  Descriptions,
  Table,
  Tag,
  Button,
  Alert,
  Space,
  Spin,
  Typography,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  MoneyCollectOutlined,
  PhoneOutlined,
  ArrowLeftOutlined,
  EyeOutlined,
  CompassOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  MailOutlined,
  DollarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useBookings } from "@/services/use-bookings";

const { Title } = Typography;

interface Participant {
  id: string;
  fullName: string;
  genderText: string;
  dateOfBirth: string;
  quantity: number;
  pricePerParticipant: number;
}

interface BookingDetailData {
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

  const formatDateTime = (dateString: string) => {
    return dayjs(dateString).format("DD/MM/YYYY HH:mm");
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const hasAdminInPath = pathname?.includes('/admin') || pathname?.includes('/moderator');
  
  const handleBackToTable = () => {
    const basePath = hasAdminInPath 
      ? pathname?.includes('/admin') ? '/admin' : '/moderator'
      : '';
    router.push(`${basePath}/booking/workshop`);
  };

  const handleViewWorkshop = () => {
    if (!booking?.workshopId) return;
    const basePath = hasAdminInPath 
      ? pathname?.includes('/admin') ? '/admin' : '/moderator'
      : '';
    router.push(`${basePath}/workshop/detail/${booking.workshopId}`);
  };

  const getStatusTag = (booking: BookingDetailData) => {
    const statusMap: Record<number, { color: string; text: string }> = {
      0: { color: "gold", text: "Đang chờ thanh toán" },
      1: { color: "blue", text: "Đã thanh toán" },
      2: { color: "red", text: "Bị hủy chưa thanh toán" },
      3: { color: "red", text: "Bị hủy đã thanh toán" },
      4: { color: "red", text: "Bị hủy bởi nhà cung cấp" },
      5: { color: "green", text: "Đã hoàn thành" },
      6: { color: "default", text: "Hết hạn" },
    };
    const status = statusMap[booking.status] || { color: "default", text: booking.statusText };
    return <Tag color={status.color}>{status.text}</Tag>;
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
              <Button size="small" onClick={handleBackToTable}>
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
            <Button size="small" onClick={handleBackToTable}>
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
      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-4">
          <Button
            onClick={handleBackToTable}
            className="flex items-center gap-2"
          >
            <ArrowLeftOutlined className="w-4 h-4" />
            Quay lại danh sách
          </Button>
          {booking.workshopId && (
            <Button
              type="dashed"
              onClick={handleViewWorkshop}
              className="flex items-center gap-2"
            >
              <EyeOutlined className="w-4 h-4" />
              Xem workshop
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Tag color="purple" className="font-mono">
            #{booking.id.slice(-8)}
          </Tag>
          {getStatusTag(booking)}
        </div>
      </div>

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Chi tiết đặt chỗ workshop</h1>
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
                <Tag color="purple">{booking.bookingTypeText}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">
                {formatDateTime(booking.bookingDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Tên workshop" span={2}>
                <div className="flex items-center gap-2">
                  <strong>{booking.workshopName || "Chưa có"}</strong>
                  {booking.workshopId && (
                    <Button
                      type="link"
                      size="small"
                      onClick={handleViewWorkshop}
                      className="flex items-center gap-1 p-0 h-auto"
                    >
                      <EyeOutlined /> Xem chi tiết
                    </Button>
                  )}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu">
                {formatDateTime(booking.startDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày kết thúc">
                {formatDateTime(booking.endDate)}
              </Descriptions.Item>
              {booking.cancelledAt && (
                <Descriptions.Item label="Ngày hủy" span={2}>
                  <span className="text-red-500">
                    {formatDateTime(booking.cancelledAt)}
                  </span>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {/* Thông tin khách hàng */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <UserOutlined />
                <span>Thông tin khách hàng</span>
              </div>
            }
          >
            <Descriptions column={2} size="small">
              <Descriptions.Item label="Tên khách hàng">
                <strong>{booking.userName}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="ID người dùng">
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {booking.userId}
                </span>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Thông tin liên hệ */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <PhoneOutlined />
                <span>Thông tin liên hệ</span>
              </div>
            }
          >
            <Descriptions column={2} size="small">
              <Descriptions.Item label="Tên liên hệ">
                <strong>{booking.contactName}</strong>
              </Descriptions.Item>
              <Descriptions.Item 
                label="Email"
                labelStyle={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <div className="flex items-center gap-2">
                  <MailOutlined className="text-gray-400" />
                  <a href={`mailto:${booking.contactEmail}`} className="text-blue-600 hover:underline">
                    {booking.contactEmail}
                  </a>
                </div>
              </Descriptions.Item>
              <Descriptions.Item 
                label="Số điện thoại"
                labelStyle={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <div className="flex items-center gap-2">
                  <PhoneOutlined className="text-gray-400" />
                  <a href={`tel:${booking.contactPhone}`} className="text-blue-600 hover:underline">
                    {booking.contactPhone}
                  </a>
                </div>
              </Descriptions.Item>
              <Descriptions.Item 
                label="Địa chỉ"
                labelStyle={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                span={2}
              >
                <div className="flex items-center gap-2">
                  <HomeOutlined className="text-gray-400" />
                  <span>{booking.contactAddress}</span>
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Danh sách người tham gia */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <TeamOutlined />
                <span>Danh sách người tham gia ({booking.participants?.length || 0})</span>
              </div>
            }
          >
            <Table
              dataSource={booking.participants}
              columns={participantColumns}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: 600 }}
            />
          </Card>
        </div>

        {/* Sidebar - Thông tin thanh toán */}
        <div className="space-y-6">
          <Card
            title={
              <div className="flex items-center gap-2">
                <MoneyCollectOutlined />
                <span>Thông tin thanh toán</span>
              </div>
            }
          >
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Giá gốc:</span>
                <span>{formatPrice(booking.originalPrice)}</span>
              </div>
              
              {booking.discountAmount > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>Giảm giá:</span>
                  <span>-{formatPrice(booking.discountAmount)}</span>
                </div>
              )}
              
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng:</span>
                  <span className="text-green-600">{formatPrice(booking.finalPrice)}</span>
                </div>
              </div>

              {booking.paymentLinkId && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600">
                    <DollarOutlined className="mr-1" />
                    Payment Link ID: {booking.paymentLinkId}
                  </div>
                </div>
              )}

              {booking.promotionId && (
                <div className="mt-2 p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600">
                    🎁 Mã khuyến mãi: {booking.promotionId}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Thông tin hệ thống */}
          <Card title="Thông tin hệ thống">
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Booking ID:</span>
                <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded mt-1">
                  {booking.id}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Ngày tạo:</span>
                <div className="font-medium">{formatDateTime(booking.bookingDate)}</div>
              </div>
              {booking.workshopScheduleId && (
                <div>
                  <span className="text-gray-500">Schedule ID:</span>
                  <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded mt-1">
                    {booking.workshopScheduleId}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
