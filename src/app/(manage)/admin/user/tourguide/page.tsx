"use client";

import TourguideRequestsTable from "@/app/(manage)/components/user/requests/tourguide";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

const crumbs: Crumb[] = [
  { label: "Quản lý tài khoản", href: "/admin/user" },
  { label: "Hướng dẫn viên", href: "/admin/user/tourguide" },
];

export default function TourguideRequestsPage() {
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} />
      <div className="w-full mx-auto px-4 space-y-6 mt-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Quản lý yêu cầu hướng dẫn viên
            </h1>
            <p className="text-sm text-muted-foreground">
              Duyệt, chấp nhận hoặc từ chối các yêu cầu đăng ký
            </p>
          </div>
        </div>
        <TourguideRequestsTable />
      </div>
    </SidebarInset>
  );
}
