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

