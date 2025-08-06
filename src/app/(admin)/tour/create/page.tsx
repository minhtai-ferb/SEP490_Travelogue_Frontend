import type { Metadata } from "next"
import TourCreateClient from "./TourCreateClient"

export const metadata: Metadata = {
	title: "Tạo Tour Mới | Dashboard",
	description: "Tạo tour du lịch mới với wizard 3 bước",
	robots: {
		index: false,
		follow: false,
	},
}

export default function TourCreatePage() {
	return <TourCreateClient />
}
