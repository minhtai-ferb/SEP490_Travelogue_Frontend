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
	Pending = 0,
	Approved = 1,
	Rejected = 2,
}

export interface CraftVillageRequestResponse {
	Id: string
	OwnerId: string
	OwnerEmail: string
	OwnerFullName: string
	Name: string
	Description: string
	Content: string
	Address: string
	Latitude: number
	Longitude: number
	OpenTime: { ticks: number }
	CloseTime: { ticks: number }
	DistrictId: string
	PhoneNumber: string
	Email: string
	Website: string
	LocationId: string
	WorkshopsAvailable: boolean
	SignatureProduct: string
	YearsOfHistory: number
	IsRecognizedByUnesco: boolean
	Status: CraftVillageRequestStatus
	RejectionReason: string
	ReviewedAt: { ticks: number }
	ReviewedBy: string
}