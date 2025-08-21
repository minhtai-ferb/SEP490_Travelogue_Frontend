"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { DistrictCreateForm } from "@/app/(manage)/components/districs/create";

const crumb: Crumb[] = [
  { label: "Quản lý quận huyện", href: "/moderator/districts" },
  { label: "Tạo mới quận huyện" },
];

export default function CreateDistrictsPage() {
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumb} />
      <div className="flex flex-1 flex-col gap-4 p-10">
        <DistrictCreateForm hrefCreate="/moderator/districts" />
      </div>
    </SidebarInset>
  );
}