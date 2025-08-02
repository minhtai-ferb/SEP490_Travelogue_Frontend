import type { Metadata } from "next"
import TourDetailClient from "./TourDetailClient"

export const metadata: Metadata = {
	title: "Chi Tiết Tour | Dashboard",
	description: "Xem chi tiết thông tin tour du lịch",
	robots: {
		index: false,
		follow: false,
	},
}

interface TourDetailPageProps {
	params: {
		id: string
	}
}

export default function TourDetailPage({ params }: TourDetailPageProps) {
	return <TourDetailClient tourId={params.id} />
}
