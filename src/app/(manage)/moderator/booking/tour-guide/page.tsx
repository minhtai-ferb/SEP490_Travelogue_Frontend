// app/admin/bookings/page.tsx
"use client";

import BookingTourGuideTable from "@/app/(manage)/components/booking/tour-guide/table";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

const crumb: Crumb[] = [
  { label: "Quản lý đặt chỗ", href: "/moderator/booking" },
  {
    label: "Quản lý đặt hướng dẫn viên",
  },
];
export default function BookingTourGuidePage() {
  return (
    <SidebarInset className="space-y-2">
      <BreadcrumbHeader items={crumb} />
      <BookingTourGuideTable />
    </SidebarInset>
  );
}
