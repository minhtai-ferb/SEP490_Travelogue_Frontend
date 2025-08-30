"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import RefundContainer from "./components/container";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";

const crumb: Crumb[] = [
  { label: "Yêu cầu hoàn tiền", href: "/admin/request-refund" },
];

export default function WithdrawalRequestsTable() {
  return (
    <SidebarInset >
      <BreadcrumbHeader items={crumb} />
      <RefundContainer />
    </SidebarInset>
  );
}
