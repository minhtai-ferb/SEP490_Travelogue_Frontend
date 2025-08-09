import { Suspense } from "react"
import TourDetailClient from "./TourDetailClient"

interface TourDetailPageProps {
	params: Promise<{
		id: string
	}>
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
	const { id } = await params

	return (
		<div className="min-h-screen bg-gray-50">
			<Suspense fallback={<div>Đang tải thông tin...</div>}>
				<TourDetailClient tourId={id} />
			</Suspense>
		</div>
	)
}
