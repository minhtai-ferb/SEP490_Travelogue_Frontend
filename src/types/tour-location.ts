// Types for Tour Location form
export interface TourLocationFormData {
	tourPlanLocationId?: string
	locationId: string
	dayOrder: number
	activityType: number
	startTime: string
	endTime: string
	notes: string
	travelTimeFromPrev: number
	distanceFromPrev: number
	estimatedStartTime: number
	estimatedEndTime: number
	workshopId?: string
	workshopTicketTypeId?: string
	workshopSessionRuleId?: string
	preferredStartTime?: { ticks: number }
	preferredEndTime?: { ticks: number }
}

export interface WorkshopTicketType {
	id: string
	type: number
	name: string
	price: number
	isCombo: boolean
	durationMinutes: number
	content: string
	workshopActivities: WorkshopActivity[]
}

export interface WorkshopActivity {
	activity: string
	description: string
	durationMinutes: number
	activityOrder: number
}

export interface WorkshopSession {
	id: string
	startTime: string
	endTime: string
	capacity: number
	ruleId?: string
}

export interface WorkshopRecurringRule {
	id: string
	daysOfWeek: number[]
	sessions: WorkshopSession[]
}

export interface Workshop {
	id: string
	name: string
	description: string
	content: string
	status: number
	ticketTypes: WorkshopTicketType[]
	recurringRules: WorkshopRecurringRule[]
}

export interface SessionValidation {
	isValid: boolean
	reason?: string
}

export interface TourLocationFormProps {
	tourId: string
	tourDays: number
	initialData?: TourLocationFormData[]
	onSubmit: (data: TourLocationFormData[]) => void
	onPrevious: () => void
	onCancel: () => void
	isLoading?: boolean
}

export interface SimpleSessionSelectorProps {
	workshop: Workshop
	selectedSession?: WorkshopSession | null
	onSessionSelect: (session: WorkshopSession) => void
	earliestArrival?: string
	ticketDuration?: number
	isLoading?: boolean
}
