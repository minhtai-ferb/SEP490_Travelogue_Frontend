// 'use client'

// import CardPlace from '@/components/common/card-place'
// import { BreadcrumbItem, Breadcrumbs } from '@heroui/react'
// import { useRouter } from 'next/navigation'
// import React from 'react'

// function Page() {
// 	const router = useRouter()

// 	const handleBack = () => {
// 		router.back()
// 	}

// 	return (
// 		<div className=''>
// 			{/* Breadscrumb */}
// 			<Breadcrumbs className='px-6 py-3' size='lg'>
// 				<BreadcrumbItem onClick={() => { handleBack() }}>Trở về</BreadcrumbItem>
// 				<BreadcrumbItem>Chi tiết chuyến đi</BreadcrumbItem>
// 			</Breadcrumbs>
// 			<div className="flex h-screen overflow-hidden my-12">
// 				<div
// 					className="w-2/5 h-screen sticky top-10 bg-cover bg-center rounded-tr-3xl rounded-br-3xl"
// 					style={{ backgroundImage: "url('/image/auth_form.JPG')" }}
// 				/>

// 				<div className="custom-scrollbar w-full h-screen overflow-y-auto p-6 space-y-8">
// 					<h1 className="text-3xl font-bold mb-4">Chi tiết chuyến đi</h1>

// 					{Array.from({ length: 10 }).map((_, i) => (
// 						<CardPlace i={i} key={i} />
// 					))}
// 				</div>
// 			</div>
// 		</div>
// 	)
// }

// export default Page


"use client"
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { TourInfoHeader } from "@/components/page/trip-planner-detail/tour/tour-info-header"
import { TourAmenities } from "@/components/page/trip-planner-detail/tour/tour-amenities"
import { TourItinerary } from "@/components/page/trip-planner-detail/tour/tour-itinerary"
import { TourReviews } from "@/components/page/trip-planner-detail/tour/tour-reviews"
import { BookingSidebar } from "@/components/page/trip-planner-detail/tour/booking-sidebar"
import { MOCK_TOUR_DATA } from "@/data/region-data"
import { ImageGallery } from "@/components/common/image-glary"
import { BreadcrumbItem, Breadcrumbs } from "@heroui/react"

export default function TourDetailPage() {
	const router = useRouter()
	const tour = MOCK_TOUR_DATA

	const handleBack = () => {
		router.back()
	}

	const handleBooking = (bookingData: any) => {
		console.log("Booking data:", bookingData)
		// Handle booking logic here
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Breadcrumbs className='px-6 py-3' size='lg'>
				<BreadcrumbItem onClick={() => { handleBack() }}>Trở về</BreadcrumbItem>
				<BreadcrumbItem>Chi tiết chuyến đi</BreadcrumbItem>
			</Breadcrumbs>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-8">
						<ImageGallery images={tour.images} />

						<div className="space-y-6">
							<TourInfoHeader tour={tour} />
							<Separator />

							<div>
								<h2 className="text-xl font-semibold mb-3">Về chuyến đi này</h2>
								<p className="text-gray-600 leading-relaxed">{tour.description}</p>
							</div>

							<TourAmenities amenities={tour.amenities} />
							<TourItinerary itinerary={tour.itinerary} />
							<TourReviews reviews={tour.reviews} rating={tour.rating} reviewCount={tour.reviewCount} />
						</div>
					</div>

					{/* Booking Sidebar */}
					<div className="lg:col-span-1">
						<BookingSidebar tour={tour} onBooking={handleBooking} />
					</div>
				</div>
			</div>
		</div>
	)
}
