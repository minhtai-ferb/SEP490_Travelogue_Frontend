"use client";

import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";

import { SidebarInset } from "@/components/ui/sidebar";
import React, { useState } from "react";
import { BookingStatsChart } from "./components/chart-area-interactive";

const crumb: Crumb[] = [{ label: "Quản lý đặt chỗ", href: "/admin/booking" }];

function ManageBooking() {
  const [timeRange, setTimeRange] = useState("30d");

  function getTimeRangeLabel(timeRange: string) {
    switch (timeRange) {
      case "90d":
        return "3 tháng qua";
      case "30d":
        return "30 ngày qua";
      case "7d":
        return "7 ngày qua";
      default:
        return "30 ngày qua";
    }
  }

  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumb} />
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="">
          <h1 className="text-3xl font-bold tracking-tight">
            Thống kê đặt chỗ {getTimeRangeLabel(timeRange)}
          </h1>
          <p className="text-muted-foreground mt-2">
            Theo dõi xu hướng booking cho các dịch vụ của bạn
          </p>
        </div>
        <BookingStatsChart timeRange={timeRange} setTimeRange={setTimeRange} />
      </div>
    </SidebarInset>
  );
}

export default ManageBooking;
