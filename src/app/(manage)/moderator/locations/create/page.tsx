"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import { CreateLocationForm } from "@/app/(manage)/components/locations/create/components/create-location-form";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";

const crumb: Crumb[] = [
  { label: "Quản lý địa điểm", href: "/moderator/locations" },
  { label: "Tạo mới địa điểm" },
];

export default function CreateLocationPage() {
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumb} />
      <CreateLocationForm href="/moderator/locations" />
    </SidebarInset>
  );
}
