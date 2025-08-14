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

export enum TourguideRequestStatus {
	All = "",
	Pending = 1,
	Approved = 2,
	Rejected = 3,
}

export const TourguideRequestStatusDisplay: Record<TourguideRequestStatus, string> = {
	[TourguideRequestStatus.All]: "",
	[TourguideRequestStatus.Pending]: "Chờ xác nhận",
	[TourguideRequestStatus.Approved]: "Đã xác nhận",
	[TourguideRequestStatus.Rejected]: "Từ chối",
};

export interface TourGuideCertification {
	name: string
	certificateUrl: string
}

export interface TourGuideRequestItem {
	id: string
	userId: string
	email: string
	fullName: string
	introduction: string
	price: number
	status: TourguideRequestStatus | number
	rejectionReason: string | null
	certifications: TourGuideCertification[]
}

export interface TourGuideItem {
	id: string
	email: string
	userName: string
	sex: number
	sexText: string
	address: string
	price: number
	introduction: string
	avatarUrl: string
	averageRating: number
	totalReviews: number
}