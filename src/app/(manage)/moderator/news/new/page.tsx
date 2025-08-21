"use client";

import NewsTable from "@/app/(manage)/components/news/new/table";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

const crumbs : Crumb[] = [
  { label: "Quản lý tin tức", href: "/moderator/news" },
  { label: "Danh sách tin tức" },
];

export default function NewsPage() {

  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} />
      <NewsTable href="/moderator/news" />
    </SidebarInset>
  );
}
