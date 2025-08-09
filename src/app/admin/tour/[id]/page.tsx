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
	params: Promise<{
		id: string
	}>
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
	const { id } = await params
	return <TourDetailClient tourId={id} />
}
