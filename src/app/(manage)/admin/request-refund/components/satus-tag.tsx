"use client";

import React from "react";
import { Tag } from "antd";
import { getRefundStatusText, RefundStatus } from "@/types/RequestRefund";

export default function StatusTag({ status }: { status: RefundStatus }) {
  const map: Record<number, { color: string; text: string }> = {
    [RefundStatus.PENDING]: {
      color: "gold",
      text: getRefundStatusText(RefundStatus.PENDING),
    },
    [RefundStatus.APPROVED]: {
      color: "green",
      text: getRefundStatusText(RefundStatus.APPROVED),
    },
    [RefundStatus.REJECTED]: {
      color: "red",
      text: getRefundStatusText(RefundStatus.REJECTED),
    },
  };

  const { color, text } = map[status] ?? { color: "default", text: "Không xác định" };
  return <Tag color={color}>{text}</Tag>;
}
