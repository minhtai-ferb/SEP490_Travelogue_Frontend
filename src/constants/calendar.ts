// API Constants
export const SCHEDULE_TYPES = {
	BOOKING: 2,
	TOUR_SCHEDULE: 3,
} as const

export const DEFAULT_PAGINATION = {
	PAGE: 1,
	SIZE: 1000,
} as const

// UI Constants
export const CALENDAR_HEIGHT = "calc(100vh - 160px)"
export const HEADER_HEIGHT = 64

// Date formats
export const DATE_FORMATS = {
	MONTH_YEAR: { month: 'long', year: 'numeric' } as const,
	ISO: 'YYYY-MM-DDTHH:mm:ss',
} as const

// Event colors
export const EVENT_COLORS = {
	BOOKING: '#3b82f6',
	TOUR_SCHEDULE: '#f59e0b',
	DEFAULT: '#3b82f6',
} as const

// Filter options
export const FILTER_OPTIONS = ['all', 'Booking', 'TourSchedule'] as const
export type FilterType = typeof FILTER_OPTIONS[number]
