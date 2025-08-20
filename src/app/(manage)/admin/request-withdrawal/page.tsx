"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import WithdrawalContainer from "./components/container";

const crumb: Crumb[] = [
  { label: "Yêu cầu rút tiền", href: "/admin/request-withdrawal" },
  {
    label: "Danh sách yêu cầu rút tiền",
    href: "/admin/request-withdrawal/request-table",
  },
];

export default function WithdrawalRequestsTable() {
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumb} />
      <WithdrawalContainer />;
    </SidebarInset>
  );
}
