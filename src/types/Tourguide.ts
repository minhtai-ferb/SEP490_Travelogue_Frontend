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
