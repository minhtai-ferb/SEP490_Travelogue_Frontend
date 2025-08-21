"use client";

import CreateExperience from "@/app/(manage)/components/news/experience/create";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

const crumbs: Crumb[] = [
  { label: "Quản lý tin tức", href: "/moderator/news" },
  { label: "Danh sách trải nghiệm", href: "/moderator/news/experience" },
  { label: "Tạo trải nghiệm mới" },
];

export default function CreateExperiencePage() {

  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} />
      <CreateExperience href={`/moderator/news`} />
    </SidebarInset>
  );
}
