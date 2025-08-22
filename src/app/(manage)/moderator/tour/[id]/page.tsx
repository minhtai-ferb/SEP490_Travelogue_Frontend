"use client";

import TourDetailClient from "@/app/(manage)/components/tour-management/TourDetailClient";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { useParams } from "next/navigation";

const crumbs: Crumb[] = [
  { label: "Quản lý chuyến tham quan", href: "/moderator/tour" },
  { label: "Chi tiết chuyến tham quan" },
];

export default async function TourDetailPage() {
  const params = useParams();
  const id = params.id as string;
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} />
      <TourDetailClient tourId={id} href="/moderator/tour" />
    </SidebarInset>
  );
}
