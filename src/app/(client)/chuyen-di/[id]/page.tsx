"use client"

import CalendarPicker from "@/components/page/trip-planner-detail/component/calendar-picker"
import { BookingSidebar } from "@/components/page/trip-planner-detail/tour/booking-sidebar"
import { TourInfoHeader } from "@/components/page/trip-planner-detail/tour/tour-info-header"
import { Tourdays } from "@/components/page/trip-planner-detail/tour/tour-itinerary"
import TourRelate from "@/components/page/trip-planner-detail/tour/tour-relate"
import { useTour } from "@/services/tour"
import { Tour } from "@/types/Tour"
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from "react"

function TourBookingPage() {

	const [tour, setTour] = useState<Tour | null>(null)
	const router = useRouter()
	const { getTourDetail } = useTour()
	const { id } = useParams()

	useEffect(() => {
		if (id) {
			fetchTourDetail(id as string)
		} else {
			console.error("Tour ID is not provided")
		}
	}, [id])

	const fetchTourDetail = async (id: string) => {
		try {
			const response = await getTourDetail(id)
			console.info("Fetched tour details:", response)
			setTour(response)
		} catch (error) {
			console.error("Failed to fetch tour details:", error)
			router.push('/404')
		}
	}

	return (
		<div className="min-h-screen">
			{tour &&
				(
					<div className="flex justify-center gap-6 max-w-7xl mx-20 py-20">
						<div className="">
							<TourInfoHeader tour={tour} />
							<Tourdays days={tour?.days} />
							<CalendarPicker tour={tour} />
						</div>
						<div className="w-fit">
							<BookingSidebar
								tour={tour}
								onBooking={(bookingData) => {
									console.log("Booking data:", bookingData)
								}}
							/>
						</div>
						<TourRelate />
					</div>
				)
			}
		</div>
	)
}

export default TourBookingPage