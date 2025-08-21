"use client";

import CreateEvent from "@/app/(manage)/components/news/event/create";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

const crumbs: Crumb[] = [
  { label: "Quản lý tin tức", href: "/moderator/news" },
  { label: "Danh sách sự kiện", href: "/moderator/news/event" },
  { label: "Tạo sự kiện mới" },
];

export default function CreateEventPage() {

  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} />
      <CreateEvent href="/moderator/news" />
    </SidebarInset>
  );
}
