import { TourGuide, TripPlanStatus } from "./Tourguide"
export interface TripBookingData {
	id: string
	tripPlan: TripPlanTourGuide
	tourGuide?: TourGuide
	bookingDetails: {
		totalPrice: number
		bookingDate: Date
		status: "pending" | "confirmed" | "active" | "completed" | "cancelled"
		paymentStatus: "pending" | "paid" | "refunded"
	}
	userInfo: {
		userId: string
		userName: string
		email: string
		phone: string
	}
	preferences: {
		notifications: boolean
		emergencyContact?: string
		specialRequests?: string
	}
	createdAt: Date
	updatedAt: Date
}

export interface UserTripPlan extends TripPlanTourGuide {
	bookingId?: string
	tourGuide?: TourGuide
	status: number
	progress?: {
		currentDay?: number
		completedActivities?: string[]
		notes?: string[]
	},
	title?: string
}
 interface TripPlanTourGuide {
	id: string
	isAIGenerated: boolean
	title?: string
	startDate: Date
	duration: number
	destinations: TripLocation[]
	restaurants?: TripLocation[]
	craftVillages?: TripLocation[]
	budget: number
	estimatedCost?: number
	travelers: number
	preferences?: string
	itinerary?: TripDay[]
	tourguide?: TourGuide
	statusText: TripPlanStatus
	status: number
 }

 
interface TripActivity {
	time: string
	title: string
	description: string
	location: string
}

interface TripDay {
	day: number
	activities: TripActivity[]
}

interface TripLocation {
	id: string
	name: string
	type: "destination" | "restaurant" | "craftVillage"
	address: string
	description: string
	imageUrl: string
}
