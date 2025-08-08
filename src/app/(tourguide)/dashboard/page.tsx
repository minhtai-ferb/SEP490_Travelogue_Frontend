import type { Metadata } from "next"
import TourGuideDashboardClient from "./tour-guide-dashboard-client"

export const metadata: Metadata = {
	title: "Bảng điều khiển Hướng dẫn viên | Travelogue",
	description: "Quản lý tour, trip plan, ví tiền và hồ sơ của hướng dẫn viên.",
	robots: {
		index: false,
		follow: false,
	},
}

export default function TourGuideDashboardPage() {
	return <TourGuideDashboardClient />
}
