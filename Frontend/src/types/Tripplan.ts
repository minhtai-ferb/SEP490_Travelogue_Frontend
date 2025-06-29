import { TourGuide } from "./Tourguide"

export interface TripLocation {
	id: string
	name: string
	type: "destination" | "restaurant" | "craftVillage"
	address: string
	description: string
	imageUrl: string
}

export interface TripActivity {
	time: string
	title: string
	description: string
	location: string
}

export interface TripDay {
	day: number
	activities: TripActivity[]
}

export interface TripPlan {
	id: string
	title: string
	startDate: Date
	duration: number
	destinations: TripLocation[]
	restaurants: TripLocation[]
	craftVillages: TripLocation[]
	budget: number
	travelers: number
	preferences: string
	itinerary: TripDay[]
	isAIGenerated: boolean
	tourguide: TourGuide
}
