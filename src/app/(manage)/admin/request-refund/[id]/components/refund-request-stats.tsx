"use client";

import { Card, Row, Col, Statistic } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { RefundRequest, RefundStatus } from "@/types/RequestRefund";
import { Banknote } from "lucide-react";

interface RefundRequestStatsProps {
  data?: RefundRequest;
}

export default function RefundRequestStats({ data }: RefundRequestStatsProps) {
  if (!data?.bookingDataModel) return null;

  const { bookingDataModel } = data;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusIcon = () => {
    switch (data.status) {
      case RefundStatus.APPROVED:
        return <CheckCircleOutlined className="text-green-600" />;
      case RefundStatus.REJECTED:
        return <CloseCircleOutlined className="text-red-600" />;
      case RefundStatus.PENDING:
      default:
        return <ClockCircleOutlined className="text-yellow-600" />;
    }
  };

  const getStatusColor = () => {
    switch (data.status) {
      case RefundStatus.APPROVED:
        return "text-green-600";
      case RefundStatus.REJECTED:
        return "text-red-600";
      case RefundStatus.PENDING:
      default:
        return "text-yellow-600";
    }
  };

  return (
    <Card title="Tổng quan" className="mb-6">
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <div className="flex justify-start">
            <Statistic
              title="Số tiền hoàn"
              value={bookingDataModel.finalPrice}
              formatter={(value) => formatPrice(Number(value))}
              prefix={<Banknote className="mx-auto" />}
            />
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div className="flex justify-start">
            <Statistic
              title="Trạng thái"
              value={
                data.status === RefundStatus.PENDING
                  ? "Đang chờ"
                  : data.status === RefundStatus.APPROVED
                  ? "Đã duyệt"
                  : "Đã từ chối"
              }
              prefix={
                <div className="flex justify-center">{getStatusIcon()}</div>
              }
              valueStyle={{ color: getStatusColor().replace("text-", "#") }}
            />
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div className="flex justify-start">
            <Statistic
              title="Loại booking"
              value={bookingDataModel.bookingTypeText || "Không xác định"}
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
}
