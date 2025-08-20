"use client";

import React from "react";
import { Tag } from "antd";
import { getWithdrawalStatusText, WithdrawalStatus } from "@/types/RequestWithdrawal";

export default function StatusTag({ status }: { status: WithdrawalStatus }) {
  const map: Record<number, { color: string; text: string }> = {
    [WithdrawalStatus.PENDING]: {
      color: "gold",
      text: getWithdrawalStatusText(WithdrawalStatus.PENDING),
    },
    [WithdrawalStatus.APPROVED]: {
      color: "green",
      text: getWithdrawalStatusText(WithdrawalStatus.APPROVED),
    },
    [WithdrawalStatus.REJECTED]: {
      color: "red",
      text: getWithdrawalStatusText(WithdrawalStatus.REJECTED),
    },
  };

  const { color, text } = map[status] ?? { color: "default", text: "Không xác định" };
  return <Tag color={color}>{text}</Tag>;
}
