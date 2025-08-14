
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import CraftVillageClient from "./CraftVillageClient";
import { Metadata } from "next";

const crumbs: Crumb[] = [
  { label: "Quản lý tài khoản", href: "/admin/user" },
  { label: "Quản lý yêu cầu làm làng nghề", href: "/admin/user/requests/craftvillage" },
];


export default function CraftVillageRequestsPage() {
  return (
    <div className="space-y-3">
      <BreadcrumbHeader items={crumbs} />
      <CraftVillageClient />
    </div>
  );
}