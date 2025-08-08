import type { Metadata } from "next"
import TourEditClient from "./TourEditClient"

export const metadata: Metadata = {
	title: "Chỉnh Sửa Tour | Dashboard",
	description: "Chỉnh sửa thông tin tour du lịch",
	robots: {
		index: false,
		follow: false,
	},
}

interface TourEditPageProps {
	params: {
		id: string
	}
}

export default function TourEditPage({ params }: TourEditPageProps) {
	return <TourEditClient tourId={params.id} />
}
