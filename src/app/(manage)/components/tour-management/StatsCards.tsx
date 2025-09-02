"use client";

import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
  TrophyOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  StarOutlined,
} from "@ant-design/icons";
import type { TourDetail } from "@/types/Tour";

interface StatsCardsProps {
  tours: TourDetail[];
}

export function StatsCards({ tours }: StatsCardsProps) {
  const totalTours = tours.length;
  const draftTours = tours.filter((tour) => tour.statusText === "Draft").length;
  const confirmedTours = tours.filter((tour) => tour.statusText === "Confirmed").length;
  const cancelledTours = tours.filter((tour) => tour.statusText === "Cancelled").length;

  // Tính toán đánh giá trung bình
  const toursWithRating = tours.filter((tour) => tour.averageRating && tour.averageRating > 0);
  const avgRating = toursWithRating.length > 0 
    ? toursWithRating.reduce((sum, tour) => sum + (tour.averageRating || 0), 0) / toursWithRating.length
    : 0;



  const statsData = [
    {
      title: "Tổng số chuyến đi",
      value: totalTours,
      icon: <TrophyOutlined style={{ color: "#1890ff" }} />,
      valueStyle: { color: "#1890ff" },
    },
    {
      title: "Chuyến đi nháp",
      value: draftTours,
      icon: <FileTextOutlined style={{ color: "#faad14" }} />,
      valueStyle: { color: "#faad14" },
    },
    {
      title: "Chuyến đi đã xác nhận",
      value: confirmedTours,
      icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      valueStyle: { color: "#52c41a" },
    },
    {
      title: "Chuyến đi đã hủy",
      value: cancelledTours,
      icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
      valueStyle: { color: "#ff4d4f" },
    },
    {
      title: "Đánh giá trung bình",
      value: avgRating.toFixed(1),
      icon: <StarOutlined style={{ color: "#faad14" }} />,
      valueStyle: { color: "#faad14" },
    },
  ];

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }} justify="space-between">
      {statsData.map((stat, index) => (
        <Col flex="1" style={{ minWidth: 200 }} key={index}>
          <Card
            hoverable
            style={{
              textAlign: "center",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Statistic
              title={stat.title}
              value={stat.value}
              prefix={stat.icon}
              valueStyle={stat.valueStyle}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
}
