import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header"
import TourEditClient from "./TourEditClient"

interface TourEditPageProps {
	params: Promise<{
		id: string
	}>
}

export default async function TourEditPage({ params }: TourEditPageProps) {
	const { id } = await params

	const crumbs: Crumb[] = [
		{ label: "Quản lý chuyến tham quan", href: "/admin/tour/table" },
		{ label: "Chi tiết chuyến tham quan", href: `/admin/tour/${id}` },
		{ label: "Chỉnh sửa chuyến tham quan" },
	]

	return (
		<>
			<BreadcrumbHeader items={crumbs} />
			<TourEditClient tourId={id} />
		</>
	)
}
