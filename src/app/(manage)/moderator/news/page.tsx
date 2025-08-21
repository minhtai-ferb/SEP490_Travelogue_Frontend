"use client";

import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";
import DashboardNews from "../../components/news";


const crumbs: Crumb[] = [
  { label: "Quản lý tin tức" },
];

function ManageNewsPage() {

  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} />
      <DashboardNews href="/moderator/news" />
    </SidebarInset>
  );
}

export default ManageNewsPage;
