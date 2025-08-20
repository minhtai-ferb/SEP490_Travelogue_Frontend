import BreadcrumbHeader from '@/components/common/breadcrumb-header'
import { Metadata } from 'next'
import RejectionRequest from './RejectionRequest'


export const metadata: Metadata = {
	title: "Yêu cầu từ chối tour",
	description: "Yêu cầu từ chối tour",
}

const breadcrumbItems = [
	{
		label: "Quản lý người dùng",
		href: "/admin/user",
	},
	{
		label: "Yêu cầu từ chối tour",
		href: "/admin/user/requests/tourguide/rejection-request",
	},
]

function page() {
	return (
		<div className="flex flex-col gap-4">
			<BreadcrumbHeader items={breadcrumbItems} />
			<RejectionRequest />
		</div>
	)
}

export default page
