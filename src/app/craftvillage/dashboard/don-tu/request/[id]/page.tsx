import { Metadata } from "next";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import CraftVillageDetail from "@/app/(manage)/components/user/requests/craftvillage/[id]/CraftVillageDetailClient";
import { SidebarInset } from "@/components/ui/sidebar";
import RequestBecomeCraftVillageForm from "@/app/(client)/ho-so/gia-nhap/components/request-craft-village/components/RequestBecomeCraftVillageForm";
import RequestCraftVillageDetail from "../component/RequestCraftVillageDetail";

const crumbs: Crumb[] = [
  { label: "Dashboard", href: "/craftvillage/dashboard" },
  { label: "Đơn đăng ký", href: "/craftvillage/dashboard/don-tu" },
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
      <RequestCraftVillageDetail id={id} />
    </SidebarInset>
  );
}
