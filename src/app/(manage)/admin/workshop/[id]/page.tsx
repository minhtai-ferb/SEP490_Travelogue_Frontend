"use client";

import WorkShopView from "@/app/(manage)/components/workshop/[id]";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

interface TourDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const crumbs: Crumb[] = [
  { label: "Quản lý trải nghiệm làng nghề", href: "/admin/workshop" },
  { label: "Chi tiết trải nghiệm làng nghề" },
];

export default async function WorkshopDetailPage({ params }: TourDetailPageProps) {
  const { id } = await params;
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} />
      <WorkShopView href="/admin/workshop" />
    </SidebarInset>
  );
}
