"use client";

import EditExperience from "@/app/(manage)/components/news/experience/[id]/edit";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

const crumbs : Crumb[] = [
  { label: "Quản lý tin tức", href: "/admin/news" },
  { label: "Danh sách trải nghiệm", href: "/admin/news/experience" },
  { label: "Chỉnh sửa trải nghiệm" },
];

export default function EditExperiencePage() {
  
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} />
      <EditExperience href={`/admin/news`} />
    </SidebarInset>
  );
}
