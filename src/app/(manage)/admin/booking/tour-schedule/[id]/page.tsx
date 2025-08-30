// app/admin/bookings/page.tsx
"use client";

import BookingDetail from "@/app/(manage)/components/booking/tour-schedule/detail/[id]";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

const crumb: Crumb[] = [
  { label: "Quản lý đặt chỗ", href: "/admin/booking" },
  {
    label: "Quản lý đặt chỗ chuyến tham quan",
    href: "/admin/booking/tour-schedule",
  },
  {
    label: "Chi tiết đặt chỗ",
  },
];
export default function BookingScheduleDetailPage() {
  return (
    <SidebarInset className="space-y-2">
      <BreadcrumbHeader items={crumb} showBackButton={true} />
      <BookingDetail />
    </SidebarInset>
  );
}
