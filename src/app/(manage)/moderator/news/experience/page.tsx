"use client";

import ExperiencesTable from "@/app/(manage)/components/news/experience/table";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

const crumbs: Crumb[] = [
  { label: "Quản lý tin tức", href: "/moderator/news" },
  { label: "Danh sách trải nghiệm" },
];

export default function ExperiencesPage() {
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} />
      <ExperiencesTable href="/moderator/news" />
    </SidebarInset>
  );
}
