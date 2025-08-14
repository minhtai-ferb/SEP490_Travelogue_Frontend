export interface CraftVillageRequest {
	name: string
	description: string
	content: string
	address: string
	latitude: number
	longitude: number
	openTime: { ticks: number }
	closeTime: { ticks: number }
	districtId: string
	phoneNumber: string
	email: string
	website: string | null
	workshopsAvailable: boolean
	signatureProduct: string
	yearsOfHistory: number
	isRecognizedByUnesco: boolean
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
	website: string
	locationId: string
	workshopsAvailable: boolean
	signatureProduct: string
	yearsOfHistory: number
	isRecognizedByUnesco: boolean
	status: CraftVillageRequestStatus
	rejectionReason: string
	reviewedAt: string
	reviewedBy: string
}