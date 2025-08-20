"use client"

import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import TourCreateClient from "./TourCreateClient"

const crumbs: Crumb[] = [
  { label: "Quản lý chuyến tham quan", href: "/admin/tour" },
  { label: "Danh sách chuyến tham quan", href: "/admin/tour/table" },
  { label: "Tạo chuyến tham quan", href: "/admin/tour/create" },
];

export default function TourCreatePage() {
	return (
		<>
			<BreadcrumbHeader items={crumbs} />
			<TourCreateClient />
		</>
	);
}
