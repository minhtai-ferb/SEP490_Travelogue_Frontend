import { TourGuide, TripPlanStatus } from "./Tourguide"
import type { TripPlan } from "./Tripplan"

export interface TripBookingData {
	id: string
	tripPlan: TripPlan
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

export interface UserTripPlan extends TripPlan {
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
