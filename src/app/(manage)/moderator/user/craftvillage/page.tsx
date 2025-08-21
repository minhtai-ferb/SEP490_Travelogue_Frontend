
import CraftVillageRequestTable from "@/app/(manage)/components/user/requests/craftvillage/CraftVillageClient";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

const crumbs: Crumb[] = [
  { label: "Quản lý tài khoản", href: "/moderator/user" },
  { label: "Quản lý làng nghề", href: "/moderator/user/craftvillage" },
];


export default function CraftVillageRequestsPage() {
  return (
    <SidebarInset>
      <BreadcrumbHeader items={crumbs} />
      <CraftVillageRequestTable href="/moderator/user" />
    </SidebarInset>
  );
}