"use client";

import CreateExperience from "@/app/(manage)/components/news/experience/create";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

const crumbs: Crumb[] = [
  { label: "Quản lý tin tức", href: "/admin/news" },
  { label: "Danh sách trải nghiệm", href: "/admin/news/experience" },
  { label: "Tạo trải nghiệm mới" },
];

export default function CreateExperiencePage() {

  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} />
      <CreateExperience href={`/admin/news`} />
    </SidebarInset>
  );
}
