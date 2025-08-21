// app/admin/bookings/page.tsx
"use client";

import BookingWorkshopTable from "@/app/(manage)/components/booking/workshop/table";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

const crumb: Crumb[] = [
  { label: "Quản lý đặt chỗ", href: "/admin/booking" },
  {
    label: "Quản lý đặt chỗ chuyến tham quan",
    href: "/admin/booking",
  },
];
export default function BookingWorkshopPage() {
  return (
    <SidebarInset className="space-y-2">
      <BreadcrumbHeader items={crumb} />
      <BookingWorkshopTable />
    </SidebarInset>
  );
}
