export interface TourGuide {
	id: string
	name: string
	avatar: string
	rating: number
	reviewCount: number
	experience: number
	languages: string[]
	specialties: string[]
	price: number
	bio: string
	isVerified: boolean
	responseTime: string
	badges: string[]
	availability: "available" | "busy" | "offline"
}

export interface TourGuideSelection {
	selectedGuide?: TourGuide
	isSelecting: boolean
}

export type TripPlanStatus = "pending" | "confirmed" | "completed" | "cancelled"

export interface TripPlan {
	id: string
	customerName: string
	customerEmail: string
	phone?: string
	startDate: string // ISO
	endDate: string // ISO
	participants: number
	title: string
	notes?: string
	status: TripPlanStatus
	createdAt: string
	totalPrice?: number
}

export type ScheduleType = "Booking" | "TourSchedule"

export interface GuideScheduleItem {
	id: string
	tourGuideId: string
	tourScheduleId: string | null
	bookingId: string | null
	date: string // ISO
	note: string | null
	tourName: string | null
	customerName: string | null
	price: number
	scheduleType: ScheduleType
}
