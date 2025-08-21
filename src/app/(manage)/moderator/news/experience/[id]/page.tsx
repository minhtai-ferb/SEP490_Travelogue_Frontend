"use client";

import ViewExperience from "@/app/(manage)/components/news/experience/[id]";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

const crumbs : Crumb[] = [
  { label: "Quản lý tin tức", href: "/moderator/news" },
  { label: "Danh sách trải nghiệm", href: "/moderator/news/experience" },
  { label: "Chi tiết trải nghiệm" },
];

export default function ViewExperiencePage() {

  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} />
      <ViewExperience href={`/moderator/news`} />
    </SidebarInset>
  );
}
