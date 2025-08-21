import { Metadata } from "next"
import CraftVillageClient from "./CraftVillageDetailClient"
import BreadcrumbHeader from "@/components/common/breadcrumb-header"


export const metadata: Metadata = {
	title: "Chi tiết đơn đăng ký làng nghề",
	description: "Chi tiết đơn đăng ký làng nghề",
}

const crumb = [
	{
		label: "Quản lý làng nghề - Đơn đăng ký",
		href: "/admin/user/requests/craftvillage",
	},
	{
		label: "Chi tiết đơn đăng ký",
		href: "",
	},
]
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	return (
		<div className="space-y-3">
			<BreadcrumbHeader items={crumb} />
			<CraftVillageClient id={id} />
		</div>
	)
}
