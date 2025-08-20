"use client";

import LocationView from "@/app/(manage)/components/locations/view/[id]";
import { SidebarInset } from "@/components/ui/sidebar";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";

const crumb: Crumb[] = [
  { label: "Quản lý địa điểm", href: "/admin/locations" },
  { label: "Chi tiết địa điểm" },
];

export default function LocationViewPage() {
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumb} />
      <LocationView />
    </SidebarInset>
  );
}
