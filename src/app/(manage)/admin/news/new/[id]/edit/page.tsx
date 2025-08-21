"use client";

import EditNews from "@/app/(manage)/components/news/new/[id]/edit/page";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

const crumbs : Crumb[] = [
  { label: "Quản lý tin tức", href: "/admin/news" },
  { label: "Danh sách tin tức", href: "/admin/news/new" },
  { label: "Chỉnh sửa tin tức" },
];

export default function EditNewsPage() {
  
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} />
      <EditNews href="/admin/news" />
    </SidebarInset>
  );
}
