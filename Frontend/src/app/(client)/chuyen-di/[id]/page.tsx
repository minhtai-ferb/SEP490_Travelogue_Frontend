"use client"

import CalendarPicker from "@/components/page/trip-planner-detail/component/calendar-picker"
import { BookingSidebar } from "@/components/page/trip-planner-detail/tour/booking-sidebar"
import { TourInfoHeader } from "@/components/page/trip-planner-detail/tour/tour-info-header"
import { TourItinerary } from "@/components/page/trip-planner-detail/tour/tour-itinerary"
import TourRelate from "@/components/page/trip-planner-detail/tour/tour-relate"
import { MOCK_TOUR_DATA } from "@/data/region-data"

function TourBookingPage() {

	const tour = MOCK_TOUR_DATA

	return (
		<div className="min-h-screen">
			<div className="flex justify-center gap-6 max-w-7xl mx-20 py-20">
				<div className="">
					<TourInfoHeader tour={tour} />
					<TourItinerary itinerary={tour.itinerary} />
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
			</div>

			<TourRelate />
		</div>
	)
}

export default TourBookingPage