import { Metadata } from "next";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import CraftVillageDetail from "@/app/(manage)/components/user/requests/craftvillage/[id]/CraftVillageDetailClient";
import { SidebarInset } from "@/components/ui/sidebar";

const crumbs: Crumb[] = [
  { label: "Quản lý tài khoản", href: "/moderator/user" },
  { label: "Quản lý làng nghề", href: "/moderator/user/craftvillage" },
  { label: "Chi tiết đơn đăng ký", href: "" },
];

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <SidebarInset className="space-y-3">
      <BreadcrumbHeader items={crumbs} />
      <CraftVillageDetail id={id} />
    </SidebarInset>
  );
}
