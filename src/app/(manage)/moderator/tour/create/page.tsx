"use client"

import TourCreateClient from "@/app/(manage)/components/tour-management/TourCreateClient";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { SidebarInset } from "@/components/ui/sidebar";

const crumbs: Crumb[] = [
  { label: "Quản lý chuyến tham quan", href: "/moderator/tour" },
  { label: "Tạo chuyến tham quan", href: "/moderator/tour/create" },
];

export default function TourCreatePage() {
	return (
		<SidebarInset>
			<BreadcrumbHeader items={crumbs} />
			<TourCreateClient href="/moderator/tour" />
		</SidebarInset>
	);
}
