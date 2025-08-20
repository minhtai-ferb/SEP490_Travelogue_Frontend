"use client";

import { SystemRevenueChart } from "@/app/(manage)/components/dashboard/moderator/chart-line-interactive";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";

import { SidebarInset } from "@/components/ui/sidebar";
import React from "react";

const crumb: Crumb[] = [{ label: "Thống kê hệ thống" }];

function ManageUser() {
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumb} />
      <div className="flex flex-1 flex-col gap-4 p-4">
        <SystemRevenueChart />
      </div>
    </SidebarInset>
  );
}

export default ManageUser;
