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
	params: Promise<{
		id: string
	}>
}

export default async function TourEditPage({ params }: TourEditPageProps) {
	const { id } = await params
	return <TourEditClient tourId={id} />
}

