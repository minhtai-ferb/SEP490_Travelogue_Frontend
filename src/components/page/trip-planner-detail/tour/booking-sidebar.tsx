"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Phone, Star, Sparkles, Gift, Clock } from "lucide-react"
import { useBooking } from "@/hooks/useBooking"
import type { Tour } from "@/types/Tour"
import { formatPriceSimple } from "@/utils/format"
import { useRouter } from "next/navigation"

interface BookingSidebarProps {
	tour: Tour
	onBooking?: (bookingData: any) => void
}

export function BookingSidebar({ tour, onBooking }: BookingSidebarProps) {
	const {
		selectedDate,
		setSelectedDate,
		guestCount,
		incrementGuests,
		decrementGuests,
		totalPrice,
		subtotal,
		bookingData,
		isBookingValid,
	} = useBooking({
		tourId: tour.id,
		pricing: tour.pricing,
	})

	const route = useRouter()

	const handleBooking = () => {
		// route.push('#calendar')
		const el = document.getElementById("calendar")
		if (el) {
			el.scrollIntoView({ behavior: "smooth" })
		}
	}

	const discountPercentage = tour.pricing.originalPrice
		? Math.round(((tour.pricing.originalPrice - tour.pricing.basePrice) / tour.pricing.originalPrice) * 100)
		: 0

	return (
		<div className="sticky top-24 space-y-4">
			{/* Main Booking Card */}
			<Card className="shadow-2xl border-0 overflow-hidden bg-gradient-to-br from-white to-blue-50/30">

				<CardHeader className="pb-4">
					<div className="space-y-3">
						{/* Price Display */}
						<div className="text-center">
							<div className="flex items-center justify-center gap-3">
								<span className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
									{formatPriceSimple(tour.pricing.basePrice)}
								</span>
								{tour.pricing.originalPrice && (
									<div className="flex flex-col items-start">
										<span className="text-lg text-gray-400 line-through">
											{formatPriceSimple(tour.pricing.originalPrice)}
										</span>
										<Badge className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-0">
											-{discountPercentage}%
										</Badge>
									</div>
								)}
							</div>
							<p className="text-sm text-gray-600 mt-1">mỗi người</p>
						</div>

						{/* Trust Indicators */}
						<div className="flex items-center justify-center gap-4 text-sm">
							<div className="flex items-center gap-1 text-green-600">
								<Star className="h-4 w-4 fill-current" />
								<span className="font-medium">{tour.rating}</span>
							</div>
							<div className="flex items-center gap-1 text-blue-600">
								<Users className="h-4 w-4" />
								<span className="font-medium">{tour.reviewCount}+ đánh giá</span>
							</div>
						</div>
					</div>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Date Selection */}
					{/* <div className="space-y-2">
						<label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
							<Calendar className="h-4 w-4 text-blue-500" />
							Chọn ngày khởi hành
						</label>
						<div className="relative">
							<input
								type="date"
								className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
								value={selectedDate}
								onChange={(e) => setSelectedDate(e.target.value)}
							/>
						</div>
					</div> */}

					{/* Guest Count */}
					{/* <div className="space-y-2">
						<label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
							<Users className="h-4 w-4 text-purple-500" />
							Số lượng khách
						</label>
						<div className="flex items-center justify-between bg-gray-50 border-2 border-gray-200 rounded-xl p-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={decrementGuests}
								disabled={guestCount <= 1}
								className="h-10 w-10 rounded-lg bg-white shadow-sm hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
							>
								-
							</Button>
							<div className="text-center">
								<div className="font-bold text-lg">{guestCount}</div>
								<div className="text-xs text-gray-500">người</div>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => incrementGuests(tour.maxGuests)}
								disabled={guestCount >= tour.maxGuests}
								className="h-10 w-10 rounded-lg bg-white shadow-sm hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
							>
								+
							</Button>
						</div> 
					</div> */}

					{/* Price Breakdown */}
					{/* <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 space-y-3">
						<h4 className="font-semibold text-gray-800 flex items-center gap-2">
							<Gift className="h-4 w-4 text-green-500" />
							Chi tiết giá
						</h4>

						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-gray-600">
									{formatPriceSimple(tour.pricing.basePrice)} × {guestCount} người
								</span>
								<span className="font-medium">{formatPriceSimple(subtotal)}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Phí dịch vụ</span>
								<span className="font-medium">{formatPriceSimple(tour.pricing.serviceFee)}</span>
							</div>

							<Separator className="my-2" />

							<div className="flex justify-between items-center text-lg font-bold">
								<span>Tổng cộng</span>
								<span className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
									{formatPriceSimple(totalPrice)}
								</span>
							</div>
						</div>
					</div> */}

					{/* Booking Button */}
					<div className="space-y-3">
						<Button
							className="w-full py-4 text-lg font-bold rounded-xl transition-all duration-300 transform bg-gradient-to-r 
							from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg 
							hover:shadow-xl"
							onClick={handleBooking}
						>
							<span className="flex items-center justify-center gap-2">
								<Sparkles className="h-5 w-5" />
								Chọn ngày khởi hành
								<Sparkles className="h-5 w-5" />
							</span>
						</Button>

						<div className="text-center space-y-1">
							{/* <p className="text-xs text-gray-500">✅ Không tính phí ngay lập tức</p> */}
							<p className="text-xs text-green-600 font-medium">🎁 Miễn phí hủy trong 24h</p>
						</div>
					</div>

					{/* Urgency Indicator */}
					{/* <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-3">
						<div className="flex items-center gap-2 text-orange-700">
							<Clock className="h-4 w-4" />
							<span className="text-sm font-medium">⚡ Chỉ còn 3 chỗ trống cho ngày này!</span>
						</div>
					</div> */}
				</CardContent>
			</Card>

			{/* Contact Support Card */}
			<Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
				<CardContent className="p-6">
					<div className="text-center space-y-4">
						<div className="flex justify-center">
							<div className="relative">
								<Avatar className="h-16 w-16 border-4 border-white shadow-lg">
									<AvatarImage src="/placeholder.svg?height=64&width=64" />
									<AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white font-bold text-lg">
										TT
									</AvatarFallback>
								</Avatar>
								<div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
									<div className="w-3 h-3 bg-white rounded-full"></div>
								</div>
							</div>
						</div>

						<div>
							<p className="font-bold text-gray-800">🎯 Cần hỗ trợ tư vấn?</p>
							<p className="text-sm text-gray-600 mt-1">Chuyên gia du lịch 24/7</p>
						</div>

						<Button
							variant="outline"
							className="w-full bg-white hover:bg-green-50 border-2 border-green-200 hover:border-green-300 text-green-700 font-semibold py-3 rounded-xl transition-all duration-200"
						>
							<Phone className="h-4 w-4 mr-2" />Gọi ngay: 1900 1234
						</Button>

						<div className="flex items-center justify-center gap-4 text-xs text-gray-500">
							<span>⭐ 4.9/5 đánh giá</span>
							<span>🏆 Tư vấn miễn phí</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div >
	)
}
