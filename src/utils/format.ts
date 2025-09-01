import { Tour } from "@/types/Tour"

export function formatPrice(price: number, currency = "VND"): string {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: currency,
		minimumFractionDigits: 0,
	}).format(price)
}

export function formatPriceSimple(price: number): string {
	return price.toLocaleString("vi-VN") + "₫"
}

export function formatRating(rating: number): string {
	return rating.toFixed(1)
}

export const getMonthDates = (currentMonth: Date, tour: Tour) => {
	const year = currentMonth.getFullYear()
	const month = currentMonth.getMonth()

	return tour?.dates?.filter((date: any) => {
		const dateObj = new Date(date.date)
		return dateObj.getFullYear() === year && dateObj.getMonth() === month
	})
}

export const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	})
}

export const getActivityColor = (activityType: number) => {
	switch (activityType) {
		case 1: return "bg-blue-100 text-blue-800 border-blue-200"
		case 2: return "bg-orange-100 text-orange-800 border-orange-200"
		case 3: return "bg-purple-100 text-purple-800 border-purple-200"
		case 4: return "bg-green-100 text-green-800 border-green-200"
		case 5: return "bg-pink-100 text-pink-800 border-pink-200"
		case 6: return "bg-red-100 text-red-800 border-red-200"
		default: return "bg-gray-100 text-gray-800 border-gray-200"
	}
}

