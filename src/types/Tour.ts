export interface TourImage {
	id: string
	url: string
	alt: string
	thumbnail?: string
}

export interface TourActivity {
	id: string
	name: string
	description?: string
}

export interface TourDays {
	day: number
	dayNumber: number
	title: string
	description: string
	time: string
	activities: TourActivity[]
}

export interface TourAmenity {
	id: string
	name: string
	icon: string
	included: boolean
}

export interface TourReview {
	id: string
	userName: string
	userAvatar?: string
	rating: number
	comment: string
	date: string
}

export interface TourPricing {
	basePrice: number
	originalPrice?: number
	serviceFee: number
	currency: string
}

export interface TourDate {
	date: string
	available: boolean
	price: number
	spotsLeft: number
	leaderId?: string
}

export interface Tour {
	tourId: string
	name: string
	title: string
	totalDays: number
	location: string
	duration: string
	maxGuests: number
	rating: number
	reviewCount: number
	description: string
	activeSlot: number
	images: TourImage[]
	content: string | null
	days: TourDays[]
	amenities: TourAmenity[]
	reviews: TourReview[]
	pricing: TourPricing
	badges: string[]
	tourType: number
	dates: TourDate[]
	status: number
	tourTypeText: string
	totalDaysText: string
	adultPrice: number
	finalPrice: number
	statusText: TourStatus
	isActive: boolean
	minParticipants: number
	maxParticipants: number
	bookedCount: number
	childrenPrice: number
}

export type TourStatus = "Draft" | "Published" | "Active" | "Cancelled"

export interface CreateTourRequest {
	name: string
	description: string
	content: string | null
	tourTypeText: string
	tourType: number
	totalDaysText: string
	totalDays: number
	adultPrice: number
	childrenPrice: number
	finalPrice: number
	statusText: TourStatus
	status: number
}


export interface ScheduleFormData {
	departureDate: string
	maxParticipant: number
	totalDays: number
	adultPrice: number
	childrenPrice: number
}

export interface UpdateTourRequest extends Partial<CreateTourRequest> {
	tourId: string
}
export interface BookingData {
	tourId: string
	selectedDate: string
	guestCount: number
	totalPrice: number
}


export interface AssignedTour {
	id: string
	name: string
	startDate: string
	endDate: string
	meetingLocation: string
	status: TourStatus
	participants: number
	maxParticipants: number
	description: string
	notes?: string
	price: number
}

export interface TourStats {
	upcoming: number
	completed: number
	inProgress: number
	total: number
	totalParticipants: number
	totalRevenue: number
}


export interface LocationMedia {
	mediaUrl: string
	fileName: string
	fileType: string
	isThumbnail: boolean
	sizeInBytes: number
	createdTime: string
}

export interface TourLocationRequest {
	locationId: string
	dayOrder: number
	startTime: string
	endTime: string
	notes: string
	travelTimeFromPrev: number
	distanceFromPrev: number
	estimatedStartTime: number
	estimatedEndTime: number
}

export interface CreateTourBasicRequest {
	name: string
	description: string
	content: string
	totalDays: number
	tourType: number
}

export interface LocationResponse {
	data: Location[]
	message: string
	succeeded: boolean
	statusCode: number
}

export enum TourType {
	International = 1,
	Leisure = 2,
	Adventure = 3,
	Ecotourism = 4,
	Cultural = 5,
	Spiritual = 6,
	Culinary = 7,
	Extreme = 8,
}

export interface Location {
	id: string
	name: string
	description: string
	content: string
	address: string
	latitude: number
	longitude: number
	rating: number
	openTime: string | null
	closeTime: string | null
	category: string
	districtId: string
	districtName: string
	medias: LocationMedia[]
}

export const TourTypeLabels: Record<TourType, string> = {
	[TourType.International]: "Du lịch trong nước",
	[TourType.Leisure]: "Du lịch nghỉ dưỡng",
	[TourType.Adventure]: "Du lịch khám phá",
	[TourType.Ecotourism]: "Du lịch sinh thái",
	[TourType.Cultural]: "Du lịch văn hóa",
	[TourType.Spiritual]: "Du lịch tâm linh",
	[TourType.Culinary]: "Du lịch ẩm thực",
	[TourType.Extreme]: "Du lịch mạo hiểm",
}