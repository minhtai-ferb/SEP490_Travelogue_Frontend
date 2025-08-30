"use client";

import TourDetailClient from "@/app/(manage)/components/tour-management/TourDetailClient";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { useParams } from "next/navigation";

const crumbs: Crumb[] = [
  { label: "Quản lý chuyến tham quan", href: "/admin/tour" },
  { label: "Chi tiết chuyến tham quan" },
];

export default function TourDetailPage() {
  const params = useParams();
  const id = params.id as string;
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs}  showBackButton={true} />
      <TourDetailClient tourId={id} href="/admin/tour" />
    </SidebarInset>
  );
}
