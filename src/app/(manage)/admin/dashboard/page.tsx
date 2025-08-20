"use client";

import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";

import { SidebarInset } from "@/components/ui/sidebar";
import React from "react";
import { AdminRevenueChart } from "../../components/dashboard/admin/chart-line-interactive";

const crumb: Crumb[] = [{ label: "Thống kê quản trị viên", href: "/admin/dashboard" }];

function AdminDashboard() {
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumb} />
      <div className="flex flex-1 flex-col gap-4 p-4">
        <AdminRevenueChart/>
      </div>
    </SidebarInset>
  );
}

export default AdminDashboard;
