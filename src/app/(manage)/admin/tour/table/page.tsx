import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import TourManagement from "@/components/tour-management/TourManagement";

const crumbs: Crumb[] = [
  { label: "Quản lý chuyến tham quan", href: "/admin/tour/table" },
  { label: "Danh sách chuyến tham quan" },
];

export default function ToursPage() {
  return (
    <div>
      <BreadcrumbHeader items={crumbs} />
      <TourManagement />
    </div>
  );
}
