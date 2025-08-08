export const isValidEmailOrPhone = (value: string): boolean => {
	// Email validation regex
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

	// Phone validation regex (simple version for Vietnamese numbers)
	const phoneRegex = /^(0|\+84)(\d{9,10})$/

	return emailRegex.test(value) || phoneRegex.test(value)
}

export const isValidPassword = (value: string): boolean => {
	return value.length >= 6
}

export const isValidDateIso = (dateStr: string | null | undefined) => {
	if (!dateStr) return false
	if (dateStr.startsWith("0001-01-01")) return false
	const d = new Date(dateStr)
	return !isNaN(d.getTime())
}
