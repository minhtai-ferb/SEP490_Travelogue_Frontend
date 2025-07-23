'use client'

import { useRouter } from 'next/navigation'
import TravelCTA from '../common/booking-tour-button'
import { ListCurrentTours } from '../common/tour'
import FavoritesDestinations from '../common/favorite-destinations'

function TourBooking() {
	const router = useRouter()

	const navigateToTripPlaning = () => {
		router.push("/len-ke-hoach")
	}

	return (

		<div className="relative h-full">
			<div className="absolute inset-0 z-0">
				<div className="w-full h-full bg-cover bg-top bg-no-repeat"
					style={{ backgroundImage: `url('/image/bg_travel.jpg')` }}>
					<div className="w-full h-full bg-indigo-200/60 backdrop-blur-sm"></div>
				</div>
			</div>

			<div>
				<TravelCTA label='Khởi tạo chuyến đi của bạn' onClick={navigateToTripPlaning} />
			</div>

			<ListCurrentTours />

			<FavoritesDestinations />
		</div>
	)
}

export default TourBooking
