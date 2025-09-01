"use client";

import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import TripPlanViewDetail from "@/app/(manage)/components/personal-plan/detail";
import { SidebarInset } from "@/components/ui/sidebar";

export default function TripPlanDetailPage() {
  const crumbs: Crumb[] = [
    { label: "Quản lý kế hoạch cá nhân", href: "/admin/personal-plan" },
    {
      label: "Chi tiết kế hoạch",
    },
  ];

  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} showBackButton={true} />
      <TripPlanViewDetail href={`/admin/personal-plan`} />
    </SidebarInset>
  );
}
