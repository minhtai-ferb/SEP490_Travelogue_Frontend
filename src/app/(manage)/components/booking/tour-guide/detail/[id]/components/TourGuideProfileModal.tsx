"use client";

import React from "react";
import {
  Modal,
  Card,
  Descriptions,
  Tag,
  Button,
  Spin,
  Alert,
  Rate,
  Avatar,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  DollarOutlined,
  TeamOutlined,
  StarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

// Interface based on the API response
interface TourGuideProfile {
  id: string;
  email: string;
  userName: string;
  maxParticipants: number;
  sex: number;
  sexText: string;
  address: string | null;
  rating: number;
  price: number;
  introduction: string;
  avatarUrl: string;
  averageRating: number;
  totalReviews: number;
  reviews: any[];
}

interface TourGuideProfileModalProps {
  open: boolean;
  onClose: () => void;
  tourGuideProfile: TourGuideProfile | null;
  loading: boolean;
}

export default function TourGuideProfileModal({
  open,
  onClose,
  tourGuideProfile,
  loading,
}: TourGuideProfileModalProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <UserOutlined />
          <span>Thông tin hướng dẫn viên</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={900}
      destroyOnClose
    >
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Spin size="large" tip="Đang tải thông tin hướng dẫn viên..." />
        </div>
      ) : tourGuideProfile ? (
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <Avatar
              size={80}
              src={tourGuideProfile.avatarUrl}
              icon={<UserOutlined />}
              className="border-2 border-blue-200"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-1">
                {tourGuideProfile.userName}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <span className="flex items-center gap-1">
                  <MailOutlined /> {tourGuideProfile.email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Tag color="blue">ID: {tourGuideProfile.id.slice(-8)}</Tag>
                <Tag color="purple">{tourGuideProfile.sexText}</Tag>
                {tourGuideProfile.averageRating > 0 && (
                  <Tag color="gold" className="flex items-center gap-1">
                    <StarOutlined />
                    {tourGuideProfile.averageRating}/5 ({tourGuideProfile.totalReviews} đánh giá)
                  </Tag>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <Card title="Thông tin chi tiết" size="small">
            <Descriptions column={2} size="middle" bordered>
              <Descriptions.Item label="Tên người dùng">
                {tourGuideProfile.userName}
              </Descriptions.Item>
              
              <Descriptions.Item label="Email">
                <span className="flex items-center gap-1">
                  <MailOutlined />
                  {tourGuideProfile.email}
                </span>
              </Descriptions.Item>
              
              <Descriptions.Item label="Giới tính">
                {tourGuideProfile.sexText}
              </Descriptions.Item>
              
              <Descriptions.Item label="Số người tối đa">
                <span className="flex items-center gap-1">
                  <TeamOutlined />
                  {tourGuideProfile.maxParticipants} người
                </span>
              </Descriptions.Item>
              
              <Descriptions.Item label="Giá dịch vụ/ngày">
                <span className="font-semibold text-green-600 flex items-center gap-1">
                  <DollarOutlined />
                  {formatPrice(tourGuideProfile.price)}
                </span>
              </Descriptions.Item>
              
              <Descriptions.Item label="Đánh giá trung bình">
                <div className="flex items-center gap-2">
                  <Rate 
                    disabled 
                    allowHalf 
                    value={tourGuideProfile.averageRating} 
                    style={{ fontSize: 16 }}
                  />
                  <span className="text-sm">
                    ({tourGuideProfile.totalReviews} đánh giá)
                  </span>
                </div>
              </Descriptions.Item>
              
              <Descriptions.Item label="Địa chỉ" span={2}>
                <div className="flex items-start gap-2">
                  <HomeOutlined className="text-gray-400 mt-1" />
                  <span>{tourGuideProfile.address || "Chưa cập nhật"}</span>
                </div>
              </Descriptions.Item>
              
              {tourGuideProfile.introduction && (
                <Descriptions.Item label="Giới thiệu" span={2}>
                  <div className="whitespace-pre-wrap bg-gray-50 p-3 rounded">
                    {tourGuideProfile.introduction}
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {/* Reviews Section */}
          {tourGuideProfile.reviews && tourGuideProfile.reviews.length > 0 && (
            <Card title={`Đánh giá từ khách hàng (${tourGuideProfile.reviews.length})`} size="small">
              <div className="space-y-3">
                {tourGuideProfile.reviews.slice(0, 5).map((review: any, index: number) => (
                  <div key={index} className="border-b pb-3 last:border-b-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{review.customerName || "Khách hàng"}</span>
                      <Rate disabled value={review.rating} style={{ fontSize: 14 }} />
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    )}
                    {review.reviewDate && (
                      <span className="text-xs text-gray-400">
                        {dayjs(review.reviewDate).format("DD/MM/YYYY")}
                      </span>
                    )}
                  </div>
                ))}
                {tourGuideProfile.reviews.length > 5 && (
                  <div className="text-center text-sm text-gray-500">
                    và {tourGuideProfile.reviews.length - 5} đánh giá khác...
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      ) : (
        <Alert
          message="Không thể tải thông tin hướng dẫn viên"
          description="Vui lòng thử lại sau"
          type="warning"
          showIcon
        />
      )}
    </Modal>
  );
}
