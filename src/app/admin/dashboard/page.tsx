"use client";

import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";

import { SidebarInset } from "@/components/ui/sidebar";
import React from "react";
import { BookingStatsChart } from "./components/chart-area-interactive";

const crumb: Crumb[] = [{ label: "Dashboard", href: "/admin/dashboard" }];

function ManageUser() {
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumb} />
      <div className="flex flex-1 flex-col gap-4 p-4">
      </div>
    </SidebarInset>
  );
}

export default ManageUser;
