import TourDetailClient from "@/app/(manage)/components/tour-management/TourDetailClient";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

interface TourDetailPageProps {
  params: {
    id: string;
  };
}

const crumbs: Crumb[] = [
  { label: "Quản lý chuyến tham quan", href: "/admin/tour" },
  { label: "Chi tiết chuyến tham quan" },
];

export default function TourDetailPage({ params }: TourDetailPageProps) {
  const { id } = params;
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} />
      <TourDetailClient tourId={id} href="/admin/tour" />
    </SidebarInset>
  );
}
