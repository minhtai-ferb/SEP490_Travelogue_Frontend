// utils
export const isValidEmailOrPhone = (input: string) => {
	// Simple regex for email validation
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	// Simple regex for phone number validation (Vietnamese phone number example)
	const phoneRegex = /^(0|\+84)\d{9,10}$/

	return emailRegex.test(input) || phoneRegex.test(input)
}

export const isValidPassword = (password: string) => password.length >= 6;


export const getDataFromLocalStorage = (item: string) => {
	const data = localStorage.getItem(item);
	console.log("item", data)
	if (data) {
		const useData = JSON.parse(data)
		return useData;
	}
}

