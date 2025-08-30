export interface CraftVillageRequest {
	name: string
	description: string
	content: string
	address: string
	latitude: number
	longitude: number
	openTime: string
	closeTime: string
	districtId: string
	phoneNumber: string
	email: string
	website: string
	workshopsAvailable: boolean
	signatureProduct: string
	yearsOfHistory: number
	isRecognizedByUnesco: boolean
	mediaDtos: {
		mediaUrl: string
		isThumbnail: boolean
	}[]
}

export interface ReviewCraftVillageRequest {
	status: CraftVillageRequestStatus
	rejectionReason?: string
}

export enum CraftVillageRequestStatus {
	Pending = 1,
	Approved = 2,
	Rejected = 3,
}

export interface CraftVillageRequestResponse {
	id: string
	ownerId: string
	ownerEmail: string
	ownerFullName: string
	name: string
	description: string
	content: string
	address: string
	latitude: number
	longitude: number
	openTime: string
	closeTime: string
	districtId: string
	phoneNumber: string
	email: string
	website: string | null
	locationId?: string
	workshopsAvailable: boolean
	signatureProduct: string
	yearsOfHistory: number
	isRecognizedByUnesco: boolean
	status: CraftVillageRequestStatus
	statusText?: string
	rejectionReason: string | null
	reviewedAt: string | null
	reviewedBy: string | null
	medias?: {
		mediaUrl: string
		isThumbnail: boolean
	}[]
	workshop?: {
		id: string
		craftVillageRequestId: string
		name: string
		description: string
		content: string
		status: number
		ticketTypes: {
			id: string
			type: number
			name: string
			price: number
			isCombo: boolean
			durationMinutes: number
			content: string
			workshopActivities: {
				id: string
				activity: string
				description: string
				startHour: string
				endHour: string
				activityOrder: number
			}[]
		}[]
		recurringRules: {
			id: string
			daysOfWeek: number[]
			startDate: string
			endDate: string
			sessions: {
				id: string
				startTime: string
				endTime: string
				capacity: number
			}[]
		}[]
		exceptions: any[]
		createdTime: string
		lastUpdatedTime: string
		createdBy: string
		lastUpdatedBy: string
	}
}




