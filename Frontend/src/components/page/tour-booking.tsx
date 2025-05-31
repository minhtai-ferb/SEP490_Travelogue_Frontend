'use client'

import React from 'react'
import { ListCurrentTours } from '../common/tour'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { Plus, Sparkles } from "lucide-react"

function TourBooking() {
	const router = useRouter()

	const handleCreateTrip = () => {
		router.push("/len-ke-hoach")
	}

	return (

		<div className="relative h-screen">
			<div className="absolute inset-0 z-0">
				<div className="w-full h-full bg-cover bg-top bg-no-repeat"
					style={{ backgroundImage: `url('/image/bg_travel.jpg')` }}>
					<div className="w-full h-full bg-indigo-200/60 backdrop-blur-sm"></div>
				</div>
			</div>
			<div className="relative w-1/2 mx-auto py-6 inset-0 z-0 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-2xl border border-primary/20">
				<div>
					<h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
						Khởi tạo chuyến đi cho riêng bạn
					</h1>
					<p className="text-gray-600 dark:text-gray-300">Tạo lịch trình du lịch cá nhân hóa với AI thông minh</p>
				</div>

				<Button
					onClick={handleCreateTrip}
					size="lg"
					className="group bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
				>
					<Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
					Tạo kế hoạch mới
					<Sparkles className="h-4 w-4 ml-2 group-hover:scale-110 transition-transform duration-300" />
				</Button>
			</div>

			<ListCurrentTours />
		</div>
	)
}

export default TourBooking