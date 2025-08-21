"use client";

import TourDetailClient from "@/app/(manage)/components/tour-management/TourDetailClient";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

interface TourDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const crumbs: Crumb[] = [
  { label: "Quản lý chuyến tham quan", href: "/moderator/tour" },
  { label: "Chi tiết chuyến tham quan" },
];

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { id } = await params;
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} />
      <TourDetailClient tourId={id} href="/moderator/tour" />
    </SidebarInset>
  );
}
