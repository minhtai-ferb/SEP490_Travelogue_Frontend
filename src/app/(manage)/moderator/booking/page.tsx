"use client";

import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";

import { SidebarInset } from "@/components/ui/sidebar";
import React, { useState } from "react";
import ManageBooking from "../../components/booking";

const crumb: Crumb[] = [{ label: "Quản lý đặt chỗ" }];

function PageDashboard() {
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumb} />
      <ManageBooking />
    </SidebarInset>
  );
}

export default PageDashboard;
