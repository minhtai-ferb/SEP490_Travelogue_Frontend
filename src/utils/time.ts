export function normalizeTimeString(time: string): string {
	if (!time) return "00:00:00"
	const parts = time.split(":")
	if (parts.length === 2) return `${time}:00`
	return time
}

export function toSecondsSinceMidnight(time: string): number {
	const [h, m, s] = normalizeTimeString(time).split(":").map((v) => Number.parseInt(v, 10) || 0)
	return h * 3600 + m * 60 + s
}

export function calculateDuration(startTime: string, endTime: string): string {
	if (!startTime || !endTime) return ""
	const start = new Date(`2000-01-01T${normalizeTimeString(startTime)}`)
	const end = new Date(`2000-01-01T${normalizeTimeString(endTime)}`)
	const diffMs = end.getTime() - start.getTime()
	const diffMins = Math.floor(diffMs / 60000)
	if (diffMins < 60) return `${diffMins} phút`
	const hours = Math.floor(diffMins / 60)
	const mins = diffMins % 60
	return `${hours}h${mins > 0 ? ` ${mins}m` : ""}`
}

export function formatTimeHHmm(time: string): string {
	const t = normalizeTimeString(time)
	return t.substring(0, 5)
}


