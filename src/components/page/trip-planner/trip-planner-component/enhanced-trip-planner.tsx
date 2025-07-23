"use client"

import TripPlannerPage from ".."
import { FloatingActionButton } from "./floating-action-button"
import { BackgroundElements } from "./background-elements"

export default function EnhancedTripPlanner() {
	return (
		<div className="relative">
			<BackgroundElements />
			<TripPlannerPage />
			<FloatingActionButton />
		</div>
	)
}
