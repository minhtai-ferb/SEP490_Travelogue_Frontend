"use client";

import BookingTourGuideDetail from "@/app/(manage)/components/booking/tour-guide/detail/[id]";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

const crumb: Crumb[] = [
  { label: "Quản lý đặt chỗ", href: "/moderator/booking" },
  {
    label: "Quản lý đặt chỗ hướng dẫn viên",
    href: "/moderator/booking/tour-guide",
  },
  {
    label: "Chi tiết đặt chỗ",
  },
];
export default function BookingTourGuideDetailPage() {
  return (
    <SidebarInset className="space-y-2">
      <BreadcrumbHeader items={crumb} showBackButton={true} />
      <BookingTourGuideDetail href={`/moderator`} />
    </SidebarInset>
  );
}
