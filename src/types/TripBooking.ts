import { TourGuide, TripPlanStatus } from "./Tourguide"
import type { TripPlanTourGuide } from "./TripPlan"

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
