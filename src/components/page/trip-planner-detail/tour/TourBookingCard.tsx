"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { TourDetail, TourSchedule } from "@/types/Tour"
import { formatPrice, formatDate } from "@/utils/format"

interface TourBookingCardProps {
	tour: TourDetail
	selectedSchedule: TourSchedule | null
	onScheduleSelect: (schedule: TourSchedule) => void
}

export default function TourBookingCard({ tour, selectedSchedule, onScheduleSelect }: TourBookingCardProps) {
	const [adults, setAdults] = useState(2)
	const [children, setChildren] = useState(0)
	const router = useRouter()

	const availableSchedules = tour.schedules.filter((schedule) => schedule.currentBooked < schedule.maxParticipant)

	const totalPrice = selectedSchedule
		? adults * selectedSchedule.adultPrice + children * selectedSchedule.childrenPrice
		: 0

	const handleBooking = () => {
		if (!selectedSchedule) return

		const searchParams = new URLSearchParams({
			tourId: tour.tourId,
			scheduleId: selectedSchedule.scheduleId,
			adults: adults.toString(),
			children: children.toString(),
			totalPrice: totalPrice.toString(),
		})

		router.push(`/booking-form?${searchParams.toString()}`)
	}

	return (
		<Card className="sticky top-4 bg-white shadow-lg">
			<CardHeader className="pb-4">
				<CardTitle className="text-xl text-gray-900">Đặt tour ngay</CardTitle>
			</CardHeader>

			<CardContent className="space-y-6">
				{/* Price Display */}
				<div className="text-center">
					<div className="text-3xl font-bold text-blue-600 mb-1">
						{formatPrice(selectedSchedule?.adultPrice || tour.adultPrice)}
					</div>
					<div className="text-sm text-gray-600">/ người lớn</div>
				</div>

				{/* Schedule Selection */}
				<div className="space-y-2">
					<label className="text-sm font-medium text-gray-700">Chọn ngày khởi hành</label>
					<Select
						value={selectedSchedule?.scheduleId || ""}
						onValueChange={(value) => {
							const schedule = tour.schedules.find((s) => s.scheduleId === value)
							if (schedule) onScheduleSelect(schedule)
						}}
					>
						<SelectTrigger>
							<SelectValue placeholder="Chọn ngày khởi hành" />
						</SelectTrigger>
						<SelectContent>
							{availableSchedules.map((schedule) => {
								const available = schedule.maxParticipant - schedule.currentBooked
								return (
									<SelectItem key={schedule.scheduleId} value={schedule.scheduleId}>
										<div className="flex items-center justify-between w-full">
											<span>{formatDate(schedule.departureDate)}</span>
											<Badge variant="secondary" className="ml-2">
												Còn {available} chỗ
											</Badge>
										</div>
									</SelectItem>
								)
							})}
						</SelectContent>
					</Select>
				</div>

				{/* Passenger Selection */}
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700">Người lớn</label>
						<Select value={adults.toString()} onValueChange={(value) => setAdults(Number.parseInt(value))}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
									<SelectItem key={num} value={num.toString()}>
										{num} người
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700">Trẻ em</label>
						<Select value={children.toString()} onValueChange={(value) => setChildren(Number.parseInt(value))}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{[0, 1, 2, 3, 4, 5, 6].map((num) => (
									<SelectItem key={num} value={num.toString()}>
										{num} trẻ
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Price Breakdown */}
				{selectedSchedule && (
					<div className="space-y-2 p-4 bg-gray-50 rounded-lg">
						<div className="flex justify-between text-sm">
							<span>
								Người lớn ({adults} x {formatPrice(selectedSchedule.adultPrice)})
							</span>
							<span>{formatPrice(adults * selectedSchedule.adultPrice)}</span>
						</div>
						{children > 0 && (
							<div className="flex justify-between text-sm">
								<span>
									Trẻ em ({children} x {formatPrice(selectedSchedule.childrenPrice)})
								</span>
								<span>{formatPrice(children * selectedSchedule.childrenPrice)}</span>
							</div>
						)}
						<div className="border-t pt-2 flex justify-between font-semibold">
							<span>Tổng cộng</span>
							<span className="text-blue-600">{formatPrice(totalPrice)}</span>
						</div>
					</div>
				)}

				{/* Booking Button */}
				<Button
					onClick={handleBooking}
					disabled={!selectedSchedule || availableSchedules.length === 0}
					className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 text-lg font-semibold"
					size="lg"
				>
					{availableSchedules.length === 0 ? (
						"Hết chỗ trống"
					) : !selectedSchedule ? (
						"Chọn ngày khởi hành"
					) : (
						<>
							Đặt tour ngay
							<ArrowRight className="ml-2 h-5 w-5" />
						</>
					)}
				</Button>

				{/* Contact Info */}
				<div className="text-center text-sm text-gray-600">
					<p>Cần hỗ trợ? Gọi ngay</p>
					<p className="font-semibold text-blue-600">1900 1234</p>
				</div>
			</CardContent>
		</Card>
	)
}
