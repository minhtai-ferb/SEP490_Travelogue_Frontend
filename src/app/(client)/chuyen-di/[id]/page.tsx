import { Suspense } from "react"
import TourDetailClient from "./TourDetailClient"

interface TourDetailPageProps {
	params: {
		id: string
	}
}

export default function TourDetailPage({ params }: TourDetailPageProps) {
	return (
		<div className="min-h-screen bg-gray-50">
			<Suspense fallback={<div>Loading...</div>}>
				<TourDetailClient tourId={params.id} />
			</Suspense>
		</div>
	)
}
