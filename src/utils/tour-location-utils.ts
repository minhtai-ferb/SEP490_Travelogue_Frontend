// Time conversion utilities
export const timeStringToMinutes = (timeStr: string): number => {
	if (!timeStr) return 0
	const parts = timeStr.split(':').map(Number)
	const h = parts[0] ?? 0
	const m = parts[1] ?? 0
	const s = parts[2] ?? 0
	return h * 60 + m + Math.floor(s / 60)
}

export const minutesToTimeString = (minutes: number): string => {
	const m = ((minutes % (24 * 60)) + (24 * 60)) % (24 * 60)
	const h = Math.floor(m / 60)
	const mm = m % 60
	return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

export const addMinutesToTime = (timeStr: string, minutes: number): string => {
	const totalMinutes = timeStringToMinutes(timeStr) + minutes
	return minutesToTimeString(totalMinutes)
}

// Format time for display (HH:MM)
export const formatTimeForDisplay = (timeStr: string): string => {
	return timeStr.substring(0, 5)
}

// Normalize time for API (HH:MM:SS)
export const normalizeTimeForApi = (timeStr: string): string => {
	if (!timeStr) return '00:00:00'
	const parts = timeStr.split(':')
	if (parts.length === 2) return `${timeStr}:00`
	return timeStr
}

// Convert time to seconds since midnight
export const timeToSecondsSinceMidnight = (timeStr: string): number => {
	const normalized = normalizeTimeForApi(timeStr)
	const [h, m, s] = normalized.split(':').map(v => parseInt(v, 10) || 0)
	return h * 3600 + m * 60 + s
}

// Convert time to .NET ticks (for preferredStartTime/preferredEndTime)
export const timeToTicks = (timeStr: string): number => {
	return timeToSecondsSinceMidnight(timeStr) * 10_000_000
}

// Calculate duration between two times
export const calculateDuration = (startTime: string, endTime: string): string => {
	if (!startTime || !endTime) return ''

	const start = new Date(`2000-01-01T${startTime}`)
	const end = new Date(`2000-01-01T${endTime}`)
	const diffMs = end.getTime() - start.getTime()
	const diffMins = Math.floor(diffMs / 60000)

	if (diffMins < 60) {
		return `${diffMins} phút`
	} else {
		const hours = Math.floor(diffMins / 60)
		const mins = diffMins % 60
		return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`
	}
}

// Generate UUID for client-side IDs
export const generateClientId = (): string => {
	return crypto.randomUUID()
}

// Check if time falls within business hours
export const isWithinBusinessHours = (
	timeStr: string,
	openTime?: string,
	closeTime?: string
): boolean => {
	if (!openTime || !closeTime) return true

	const time = timeStringToMinutes(timeStr)
	const open = timeStringToMinutes(openTime)
	const close = timeStringToMinutes(closeTime)

	return time >= open && time <= close
}

// Validate session against constraints
export const validateSession = (
	session: { startTime: string; endTime: string },
	ticketDuration: number,
	earliestArrival: string,
	openTime?: string,
	closeTime?: string
): { isValid: boolean; reason?: string } => {
	const sessionStart = timeStringToMinutes(session.startTime)
	const sessionEnd = timeStringToMinutes(session.endTime)
	const sessionDuration = sessionEnd - sessionStart
	const arrivalTime = timeStringToMinutes(earliestArrival)

	// Check if session starts before earliest arrival
	if (earliestArrival && sessionStart < arrivalTime) {
		return {
			isValid: false,
			reason: `Bạn đến sớm nhất ${formatTimeForDisplay(earliestArrival)}. Ca bắt đầu ${formatTimeForDisplay(session.startTime)}`
		}
	}

	// Check if session duration is enough for ticket
	if (sessionDuration < ticketDuration) {
		return {
			isValid: false,
			reason: `Ca chỉ có ${sessionDuration} phút, vé yêu cầu ${ticketDuration} phút`
		}
	}

	// Check business hours
	const ticketEndTime = addMinutesToTime(session.startTime, ticketDuration)
	if (!isWithinBusinessHours(session.startTime, openTime, closeTime) ||
		!isWithinBusinessHours(ticketEndTime, openTime, closeTime)) {
		return {
			isValid: false,
			reason: 'Thời gian nằm ngoài giờ mở cửa'
		}
	}

	return { isValid: true }
}
