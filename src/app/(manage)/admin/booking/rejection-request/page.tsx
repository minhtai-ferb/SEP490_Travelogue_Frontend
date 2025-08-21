"use client";

import RejectionRequestTable from "@/app/(manage)/components/booking/rejection-request/RejectionRequest";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

const crumb: Crumb[] = [
  { label: "Quản lý đặt chỗ", href: "/admin/booking" },
  {
    label: "Yêu cầu hủy đặt chỗ",
  },
];
export default function RejectionRequestPage() {
  return (
    <SidebarInset className="space-y-2">
      <BreadcrumbHeader items={crumb} />
      <RejectionRequestTable />
    </SidebarInset>
  );
}
