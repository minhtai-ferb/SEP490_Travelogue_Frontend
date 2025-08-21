"use client";

import CreateNews from "@/app/(manage)/components/news/new/create";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

const crumbs: Crumb[] = [
  { label: "Quản lý tin tức", href: "/moderator/news" },
  { label: "Danh sách tin tức", href: "/moderator/news/new" },
  { label: "Tạo tin tức mới" },
];

export default function CreateNewsPage() {
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} />
      <CreateNews href="/moderator/news" />
    </SidebarInset>
  );
}
