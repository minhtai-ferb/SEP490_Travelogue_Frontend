"use client"

import TourEditClient from "@/app/(manage)/components/tour-management/TourEditClient";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header"
import { SidebarInset } from "@/components/ui/sidebar";
import { useParams } from "next/navigation";

export default function TourEditPage() {
	const params = useParams();
	const id = params.id as string;
	const crumbs: Crumb[] = [
		{ label: "Quản lý chuyến tham quan", href: "/admin/tour" },
		{ label: "Chi tiết chuyến tham quan", href: `/admin/tour/${id}` },
		{ label: "Chỉnh sửa chuyến tham quan" },
	]

	return (
		<SidebarInset>
			<BreadcrumbHeader items={crumbs} />
			<TourEditClient tourId={id} href={`/admin/tour`} />
		</SidebarInset>
	)
}
