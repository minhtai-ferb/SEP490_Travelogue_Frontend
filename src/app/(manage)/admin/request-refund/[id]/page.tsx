"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import RefundRequestDetail from "./components/detail-refund";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";

const crumb: Crumb[] = [
  { label: "Yêu cầu hoàn tiền", href: "/admin/request-refund" },
  { label: "Chi tiết yêu cầu"},
];

export default function RefundRequestDetailPage() {
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumb} />
      <RefundRequestDetail />
    </SidebarInset>
  );
}
