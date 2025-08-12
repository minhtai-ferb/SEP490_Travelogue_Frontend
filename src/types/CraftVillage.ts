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