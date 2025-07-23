import React from "react"
import type { AssignedTour } from "@/types/Tour"
import { TourCard } from "../tour-card"

interface TourListProps {
	tours: AssignedTour[]
	onViewDetails: (tour: AssignedTour) => void
}

export const TourList = React.memo<TourListProps>(({ tours, onViewDetails }) => {
	return (
		<div className="space-y-4">
			{tours.map((tour, index) => (
				<TourCard key={tour.id} tour={tour} index={index} onViewDetails={onViewDetails} />
			))}
		</div>
	)
})

TourList.displayName = "TourList"
