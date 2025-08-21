"use client";

import UserDetailView from "@/app/(manage)/components/user/manage/[id]";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

const crumbs: Crumb[] = [
  { label: "Quản lý tài khoản", href: "/admin/user" },
  { label: "Chi tiết người dùng" },
];

export default function UserDetailViewPage() {

  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} />
      <UserDetailView />
    </SidebarInset>
  );
}
