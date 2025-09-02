"use client";

import React, { useState } from "react";
import { BookingStatsChart } from "./components/chart-area-interactive";
import dayjs, { Dayjs } from "dayjs";


function ManageBooking() {
  // Thiết lập mặc định: ngày hiện tại ± 15 ngày (tổng 30 ngày)
  const today = dayjs();
  const defaultStartDate = today.subtract(15, 'day');
  const defaultEndDate = today.add(15, 'day');
  
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([defaultStartDate, defaultEndDate]);

  function formatDateRange(startDate: Dayjs, endDate: Dayjs) {
    return `${startDate.format('DD/MM/YYYY')} - ${endDate.format('DD/MM/YYYY')}`;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="">
        <h1 className="text-3xl font-bold tracking-tight">
          Thống kê đặt chỗ {formatDateRange(dateRange[0], dateRange[1])}
        </h1>
        <p className="text-muted-foreground mt-2">
          Theo dõi xu hướng booking cho các dịch vụ của bạn
        </p>
      </div>
      <BookingStatsChart dateRange={dateRange} setDateRange={setDateRange} />
    </div>
  );
}

export default ManageBooking;
