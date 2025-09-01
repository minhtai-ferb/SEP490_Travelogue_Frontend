// app/admin/bookings/page.tsx
"use client";

import BookingScheduleTable from "@/app/(manage)/components/booking/tour-schedule/table";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

const crumb: Crumb[] = [
  { label: "Quản lý đặt chỗ", href: "/admin/booking" },
  {
    label: "Quản lý đặt chỗ chuyến tham quan",
  },
];
export default function BookingSchedulePage() {
  return (
    <div className="space-y-2">
      <BreadcrumbHeader items={crumb} />
      <div className="">
        <BookingScheduleTable href="/admin/booking/tour-schedule" />
      </div>
    </div>
  );
}
