/**
 * Complete TypeScript interfaces for Craft Village Request API
 * Based on the official API schema with proper ticks handling
 */

// Time string format for API (HH:MM:SS)
export type TimeString = string // Format: "HH:MM:SS"

// Media DTO structure
export interface MediaDto {
	mediaUrl: string
	isThumbnail: boolean
}

// Workshop Activity structure
export interface WorkshopActivity {
	activity: string
	description: string
	startHour: TimeString // "HH:MM:SS" format
	endHour: TimeString // "HH:MM:SS" format
	activityOrder: number
}

// Workshop Ticket Type structure
export interface TicketType {
	type: number // 1 = Visit, 2 = Experience
	name: string
	price: number
	isCombo: boolean
	durationMinutes: number
	content: string
	workshopActivities: WorkshopActivity[]
}

// Workshop Schedule structure
export interface WorkshopSchedule {
	id: string // UUID
	startTime: string // ISO 8601 DateTime
	endTime: string // ISO 8601 DateTime
	capacity: number
	currentBooked: number
	status: number // 0/1/2: 1 = Pending
	notes: string
}

// Recurring Session structure
export interface RecurringSession {
	startTime: TimeString // "HH:MM:SS" format
	endTime: TimeString // "HH:MM:SS" format
	capacity: number
}

// Recurring Rule structure
export interface RecurringRule {
	daysOfWeek: number[] // 0 = Sunday, 1 = Monday, etc.
	sessions: RecurringSession[]
}

// Workshop Exception structure
export interface WorkshopException {
	date: string // ISO 8601 DateTime
	reason: string
	isActive: boolean
}

// Complete Workshop structure
export interface Workshop {
	name: string
	description: string
	content: string
	status: number // 0/1/2: 1 = Pending
	ticketTypes: TicketType[]
	schedules: WorkshopSchedule[]
	recurringRules: RecurringRule[]
	exceptions: WorkshopException[]
}

// Main Craft Village Request structure
export interface CraftVillageRequest {
	name: string
	description: string
	content: string
	address: string
	latitude: number // Max: 90
	longitude: number // Max: 180
	openTime: TimeString // "HH:MM:SS" format
	closeTime: TimeString // "HH:MM:SS" format
	districtId: string // UUID
	phoneNumber: string
	email: string
	website: string
	workshopsAvailable: boolean
	signatureProduct: string
	yearsOfHistory: number
	isRecognizedByUnesco: boolean
	mediaDtos: MediaDto[]
	workshop?: Workshop // Optional workshop
}

// ============================================================================
// UTILITY FUNCTIONS FOR TIME STRING CONVERSION
// ============================================================================

/**
 * Convert hours (0-23) to "HH:MM:SS" format
 * @param hours - Hours from 0 to 23
 * @returns Time string in "HH:MM:SS" format
 */
export function hoursToTimeString(hours: number): TimeString {
	return `${hours.toString().padStart(2, '0')}:00:00`
}

/**
 * Convert "HH:MM" time string to "HH:MM:SS" format
 * @param timeString - Time in "HH:MM" format (e.g., "09:30")
 * @returns Time string in "HH:MM:SS" format
 */
export function timeStringToTimeString(timeString: string): TimeString {
	const parts = timeString.split(':')
	const hours = parts[0] || '00'
	const minutes = parts[1] || '00'
	const seconds = parts[2] || '00'

	return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
}

/**
 * Convert "HH:MM:SS" time string to hours (0-23)
 * @param timeString - Time in "HH:MM:SS" format
 * @returns Hours as number
 */
export function timeStringToHours(timeString: TimeString): number {
	const [hours] = timeString.split(':').map(Number)
	return hours || 0
}

/**
 * Convert "HH:MM:SS" time string to "HH:MM" format
 * @param timeString - Time in "HH:MM:SS" format
 * @returns Time string in "HH:MM" format
 */
export function timeStringToShortFormat(timeString: TimeString): string {
	const [hours, minutes] = timeString.split(':')
	return `${hours}:${minutes}`
}

/**
 * Validate time string format
 * @param timeString - Time string to validate
 * @returns True if valid "HH:MM:SS" format
 */
export function isValidTimeString(timeString: string): boolean {
	const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
	return timeRegex.test(timeString)
}

/**
 * Convert JavaScript Date to ISO 8601 DateTime string
 * @param date - JavaScript Date object
 * @returns ISO 8601 DateTime string
 */
export function dateToISOString(date: Date): string {
	return date.toISOString()
}

/**
 * Convert ISO 8601 DateTime string to JavaScript Date
 * @param isoString - ISO 8601 DateTime string
 * @returns JavaScript Date object
 */
export function isoStringToDate(isoString: string): Date {
	return new Date(isoString)
}

/**
 * Get current date as ISO 8601 DateTime string
 * @returns Current date in ISO 8601 format
 */
export function getCurrentISOString(): string {
	return new Date().toISOString()
}

/**
 * Create a sample/default CraftVillageRequest object
 * @returns Complete CraftVillageRequest with default values
 */
export function createDefaultCraftVillageRequest(): CraftVillageRequest {
	return {
		name: "",
		description: "",
		content: "",
		address: "",
		latitude: 0,
		longitude: 0,
		openTime: "08:00:00",
		closeTime: "17:00:00",
		districtId: "",
		phoneNumber: "",
		email: "",
		website: "",
		workshopsAvailable: false,
		signatureProduct: "",
		yearsOfHistory: 0,
		isRecognizedByUnesco: false,
		mediaDtos: [],
		workshop: {
			name: "",
			description: "",
			content: "",
			status: 1, // Pending
			ticketTypes: [
				{
					type: 1, // Visit
					name: "Vé tham quan",
					price: 0,
					isCombo: false,
					durationMinutes: 60,
					content: "",
					workshopActivities: []
				},
				{
					type: 2, // Experience
					name: "Vé trải nghiệm",
					price: 0,
					isCombo: true,
					durationMinutes: 120,
					content: "",
					workshopActivities: []
				}
			],
			schedules: [],
			recurringRules: [],
			exceptions: []
		}
	}
}

// Day of week constants for easier usage
export const DAYS_OF_WEEK = {
	SUNDAY: 0,
	MONDAY: 1,
	TUESDAY: 2,
	WEDNESDAY: 3,
	THURSDAY: 4,
	FRIDAY: 5,
	SATURDAY: 6
} as const

// Ticket type constants
export const TICKET_TYPES = {
	VISIT: 1,
	EXPERIENCE: 2
} as const

// Status constants
export const WORKSHOP_STATUS = {
	INACTIVE: 0,
	PENDING: 1,
	ACTIVE: 2
} as const
