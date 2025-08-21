"use client";

import ViewNews from "@/app/(manage)/components/news/new/[id]";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

const crumbs : Crumb[] = [
  { label: "Quản lý tin tức", href: "/admin/news" },
  { label: "Danh sách sự kiện", href: "/admin/news/event" },
  { label: "Chi tiết sự kiện" },
];

export default function ViewEventPage() {

  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} />
      <ViewNews href="/admin/news" />
    </SidebarInset>
  );
}
