'use client';

import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import TourEditClient from "./TourEditClient"


const crumbs: Crumb[] = [
  { label: "Quản lý chuyến tham quan", href: "/admin/tour" },
  { label: "Danh sách chuyến tham quan", href: "/admin/tour/table" },
  { label: "Chỉnh sửa chuyến tham quan" },
];

interface TourEditPageProps {
	params: Promise<{
		id: string
	}>
}

export default async function TourEditPage({ params }: TourEditPageProps) {
	const { id } = await params
	return (
		<>
			<BreadcrumbHeader items={crumbs} />
			<TourEditClient tourId={id} />
		</>
	)
}

