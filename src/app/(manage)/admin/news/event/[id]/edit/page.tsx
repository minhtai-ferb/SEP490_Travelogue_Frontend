"use client";

import EditEvent from "@/app/(manage)/components/news/event/[id]/edit";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

const crumbs : Crumb[] = [
  { label: "Quản lý tin tức", href: "/admin/news" },
  { label: "Danh sách sự kiện", href: "/admin/news/event" },
  { label: "Chỉnh sửa sự kiện" },
];

export default function EditEventPage() {

  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} />
      <EditEvent href="/admin/news" />
    </SidebarInset>
  );
}
