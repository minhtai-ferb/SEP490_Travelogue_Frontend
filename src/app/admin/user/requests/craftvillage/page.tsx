
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import CraftVillageClient from "./CraftVillageClient";
import { Metadata } from "next";

const crumbs: Crumb[] = [
  { label: "Quản lý tài khoản", href: "/admin/user" },
  { label: "Yêu cầu làm làng nghề", href: "/admin/user/requests/craftvillage" },
];

export const metadata: Metadata = {
  title: "Yêu cầu làm làng nghề",
  description: "Yêu cầu làm làng nghề",
};

export default function CraftVillageRequestsPage() {
  return (
    <div className="space-y-3">
      <BreadcrumbHeader items={crumbs} />
      <CraftVillageClient />
    </div>
  );
}