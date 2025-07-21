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

export interface TourItineraryDay {
	day: number
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
	id: string
	title: string
	location: string
	duration: string
	maxGuests: number
	rating: number
	reviewCount: number
	description: string
	activeSlot: number
	images: TourImage[]
	itinerary: TourItineraryDay[]
	amenities: TourAmenity[]
	reviews: TourReview[]
	pricing: TourPricing
	badges: string[]
	dates: TourDate[]
}

export interface BookingData {
	tourId: string
	selectedDate: string
	guestCount: number
	totalPrice: number
}
