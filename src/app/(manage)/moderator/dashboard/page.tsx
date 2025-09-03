"use client";

import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";

import { SidebarInset } from "@/components/ui/sidebar";
import SystemDashboard from "../../components/dashboard/moderator";

const crumb: Crumb[] = [
  { label: "Thống kê hệ thống", href: "/moderator/dashboard" },
];

function ManageUser() {
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumb} />
      <SystemDashboard />
    </SidebarInset>
  );
}

export default ManageUser;
