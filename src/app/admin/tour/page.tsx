import TourManagement from "@/components/tour-management/TourManagement"
import type { Metadata } from "next"


export const metadata: Metadata = {
	title: "Quản Lý Tour | Dashboard",
	description: "Quản lý danh sách tour du lịch",
	robots: {
		index: false,
		follow: false,
	},
}

export default function ToursPage() {
	return <TourManagement />
}
