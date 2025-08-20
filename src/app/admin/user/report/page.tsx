import BreadcrumbHeader from "@/components/common/breadcrumb-header"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Metadata } from "next"
import Datatable from "./component/datatable"


export const metadata: Metadata = {
	title: "Report",
	description: "Report",
}

const breadcrumbItems = [
	{
		label: "Home",
		href: "/admin",
	},
	{
		label: "Report",
		href: "/admin/user/report",
	},
]

function page() {
	return (
		<div>
			<BreadcrumbHeader items={breadcrumbItems} />
			<Card>
				<CardHeader>Quản lý báo cáo</CardHeader>
				<CardContent>
					<Datatable />
				</CardContent>
			</Card>
		</div>
	)
}

export default page
