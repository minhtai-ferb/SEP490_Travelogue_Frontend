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

	return tour.dates.filter((date) => {
		const dateObj = new Date(date.date)
		return dateObj.getFullYear() === year && dateObj.getMonth() === month
	})
}
