import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import TourDetailClient from "./TourDetailClient";

interface TourDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const crumbs: Crumb[] = [
  { label: "Quản lý chuyến tham quan", href: "/admin/tour/table" },
  { label: "Chi tiết chuyến tham quan" },
];

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { id } = await params;
  return (
    <>
      <BreadcrumbHeader items={crumbs} />
      <TourDetailClient tourId={id} />
    </>
  );
}
