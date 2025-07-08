"use client"

import { useState, useCallback, useMemo } from "react"
import type { BookingData, TourPricing } from "@/types/Tour"

interface UseBookingProps {
	tourId: string
	pricing: TourPricing
}

export function useBooking({ tourId, pricing }: UseBookingProps) {
	const [selectedDate, setSelectedDate] = useState("")
	const [guestCount, setGuestCount] = useState(2)

	const incrementGuests = useCallback((maxGuests: number) => {
		setGuestCount((prev) => Math.min(maxGuests, prev + 1))
	}, [])

	const decrementGuests = useCallback(() => {
		setGuestCount((prev) => Math.max(1, prev - 1))
	}, [])

	const totalPrice = useMemo(() => {
		return pricing.basePrice * guestCount + pricing.serviceFee
	}, [pricing.basePrice, pricing.serviceFee, guestCount])

	const subtotal = useMemo(() => {
		return pricing.basePrice * guestCount
	}, [pricing.basePrice, guestCount])

	const bookingData: BookingData = useMemo(
		() => ({
			tourId,
			selectedDate,
			guestCount,
			totalPrice,
		}),
		[tourId, selectedDate, guestCount, totalPrice],
	)

	const isBookingValid = useMemo(() => {
		return selectedDate !== "" && guestCount > 0
	}, [selectedDate, guestCount])

	return {
		selectedDate,
		setSelectedDate,
		guestCount,
		incrementGuests,
		decrementGuests,
		totalPrice,
		subtotal,
		bookingData,
		isBookingValid,
	}
}
