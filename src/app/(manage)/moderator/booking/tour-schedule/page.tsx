// app/admin/bookings/page.tsx
"use client";

import BookingScheduleTable from "@/app/(manage)/components/booking/tour-schedule/table";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

const crumb: Crumb[] = [
  { label: "Quản lý đặt chỗ", href: "/moderator/booking" },
  {
    label: "Quản lý đặt chỗ chuyến tham quan",
  },
];
export default function BookingSchedulePage() {
  return (
    <SidebarInset className="space-y-2">
      <BreadcrumbHeader items={crumb} />
      <BookingScheduleTable />
    </SidebarInset>
  );
}
