"use client";

import ViewNews from "@/app/(manage)/components/news/new/[id]";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

const crumbs : Crumb[] = [
  { label: "Quản lý tin tức", href: "/moderator/news" },
  { label: "Danh sách tin tức", href: "/moderator/news/new" },
  { label: "Chi tiết tin tức" },
];

export default function ViewNewsPage() {
 
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} />
      <ViewNews href="/moderator/news" />
    </SidebarInset>
  );
}
