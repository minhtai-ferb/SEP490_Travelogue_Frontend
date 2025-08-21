"use client";

import TourManagement from "@/app/(manage)/components/tour-management/TourManagement";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

const crumbs: Crumb[] = [
  { label: "Quản lý chuyến tham quan", href: "/admin/tour" },
];

export default function ManageLocation() {
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} />
      <TourManagement href="/admin/tour" />
    </SidebarInset>
  );
}
