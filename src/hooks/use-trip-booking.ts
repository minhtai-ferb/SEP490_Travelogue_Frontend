"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { TripPlan } from "@/types/Tripplan"
import type { TourGuide } from "@/types/Tourguide"
import type { TripBookingData, UserTripPlan } from "@/types/TripBooking"

interface UseTripBookingProps {
	plan: TripPlan
	tourGuide?: TourGuide
}

export function useTripBooking({ plan, tourGuide }: UseTripBookingProps) {
	const router = useRouter()
	const [isBooking, setIsBooking] = useState(false)
	const [bookingError, setBookingError] = useState<string | null>(null)

	const calculateTotalPrice = useCallback(() => {
		let total = 0

		// Base trip cost
		if (plan?.estimatedCost) {
			total += plan.estimatedCost
		}

		// Tour guide cost
		if (tourGuide) {
			total += tourGuide.price * plan.duration
		}

		// Additional services (can be extended)
		const serviceFee = total * 0.1 // 10% service fee

		return {
			basePrice: plan.estimatedCost || 0,
			tourGuidePrice: tourGuide ? tourGuide.price * plan.duration : 0,
			serviceFee,
			total: total + serviceFee,
		}
	}, [plan, tourGuide])

	const createBookingData = useCallback((): TripBookingData => {
		const pricing = calculateTotalPrice()
		const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

		return {
			id: bookingId,
			tripPlan: plan,
			tourGuide,
			bookingDetails: {
				totalPrice: pricing.total,
				bookingDate: new Date(),
				status: "pending",
				paymentStatus: "pending",
			},
			userInfo: {
				userId: "user_123", // This should come from auth context
				userName: "Người dùng", // This should come from auth context
				email: "user@example.com", // This should come from auth context
				phone: "+84123456789", // This should come from auth context
			},
			preferences: {
				notifications: true,
				specialRequests: "",
			},
			createdAt: new Date(),
			updatedAt: new Date(),
		}
	}, [plan, tourGuide, calculateTotalPrice])

	const saveBookingData = useCallback(async (bookingData: TripBookingData) => {
		try {
			// Save to localStorage for demo purposes
			const existingBookings = JSON.parse(localStorage.getItem("userTripBookings") || "[]")
			existingBookings.push(bookingData)
			localStorage.setItem("userTripBookings", JSON.stringify(existingBookings))

			// In a real app, this would be an API call
			// await fetch('/api/bookings', {
			//   method: 'POST',
			//   headers: { 'Content-Type': 'application/json' },
			//   body: JSON.stringify(bookingData)
			// })

			return true
		} catch (error) {
			console.error("Error saving booking:", error)
			return false
		}
	}, [])

	const startTrip = useCallback(async () => {
		if (!tourGuide) {
			setBookingError("Vui lòng chọn hướng dẫn viên trước khi bắt đầu chuyến đi")
			return
		}

		setIsBooking(true)
		setBookingError(null)

		try {
			// Create booking data
			const bookingData = createBookingData()

			// Save booking data
			const success = await saveBookingData(bookingData)

			if (success) {
				// Create user trip plan
				const userTripPlan: UserTripPlan = {
					...plan,
					bookingId: bookingData.id,
					tourGuide,
					status: "booked",
					progress: {
						currentDay: 1,
						completedActivities: [],
						notes: [],
					},
				}

				// Save user trip plan
				const existingPlans = JSON.parse(localStorage.getItem("userTripPlans") || "[]")
				existingPlans.push(userTripPlan)
				localStorage.setItem("userTripPlans", JSON.stringify(existingPlans))

				// Redirect to user plans page
				router.push(`/chuyen-di/ke-hoach-cua-ban?bookingId=${bookingData.id}`)
			} else {
				setBookingError("Có lỗi xảy ra khi lưu dữ liệu. Vui lòng thử lại.")
			}
		} catch (error) {
			console.error("Error starting trip:", error)
			setBookingError("Có lỗi xảy ra. Vui lòng thử lại.")
		} finally {
			setIsBooking(false)
		}
	}, [plan, tourGuide, createBookingData, saveBookingData, router])

	return {
		isBooking,
		bookingError,
		startTrip,
		calculateTotalPrice,
		clearError: () => setBookingError(null),
	}
}
