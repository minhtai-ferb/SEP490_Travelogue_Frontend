
import CraftVillageRequestTable from "@/app/(manage)/components/user/requests/craftvillage/CraftVillageClient";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

const crumbs: Crumb[] = [
  { label: "Quản lý tài khoản", href: "/admin/user" },
  { label: "Quản lý làng nghề", href: "/admin/user/craftvillage" },
];


export default function CraftVillageRequestsPage() {
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} />
      <CraftVillageRequestTable href="/admin/user" />
    </SidebarInset>
  );
}