"use client";

import SystemDashboard from "@/app/(manage)/components/dashboard/moderator";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";
import React from "react";

const crumb: Crumb[] = [{ label: "Thống kê hệ thống" }];

function DashboardSystem() {
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumb} />
      <SystemDashboard />
    </SidebarInset>
  );
}

export default DashboardSystem;
