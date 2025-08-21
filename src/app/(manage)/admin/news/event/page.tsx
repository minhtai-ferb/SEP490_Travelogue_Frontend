"use client";

import EventsTable from "@/app/(manage)/components/news/event/table";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

const crumbs: Crumb[] = [
  { label: "Quản lý tin tức", href: "/admin/news" },
  { label: "Danh sách sự kiện" },
];

export default function EventsPage() {

  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} />
      <EventsTable href="/admin/news" />
    </SidebarInset>
  );
}
