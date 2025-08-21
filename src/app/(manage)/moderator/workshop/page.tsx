"use client";

import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";
import WorkshopTable from "../../components/workshop/table";

const crumbs: Crumb[] = [
  { label: "Quản lý trải nghiệm làng nghề", href: "/moderator/workshop" },
];

function WorkshopPage() {
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} />
      <WorkshopTable href="/moderator/workshop" />
    </SidebarInset>
  );
}

export default WorkshopPage;
