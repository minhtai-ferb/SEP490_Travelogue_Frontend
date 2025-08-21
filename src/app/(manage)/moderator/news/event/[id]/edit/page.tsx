"use client";

import EditEvent from "@/app/(manage)/components/news/event/[id]/edit";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

const crumbs : Crumb[] = [
  { label: "Quản lý tin tức", href: "/moderator/news" },
  { label: "Danh sách sự kiện", href: "/moderator/news/event/table" },
  { label: "Chỉnh sửa sự kiện" },
];

export default function EditEventPage() {

  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} />
      <EditEvent href="/moderator/news" />
    </SidebarInset>
  );
}
