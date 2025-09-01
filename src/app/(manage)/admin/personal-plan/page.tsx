"use client";

import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";
import PersonalPlanManagement from "../../components/personal-plan";

const crumbs: Crumb[] = [
  { label: "Quản lý kế hoạch cá nhân", href: "/admin/personal-plan" },
];

export default function ManageLocation() {
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs}/>
      <PersonalPlanManagement href="/admin/personal-plan" />
    </SidebarInset>
  );
}
