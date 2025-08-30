"use client"

import { useState } from "react"
import { CalendarIcon, Users, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { TourSchedule } from "@/types/Tour"
import { formatPrice, formatDate } from "@/utils/format"

interface TourCalendarProps {
	schedules: TourSchedule[]
	selectedSchedule: TourSchedule | null
	onScheduleSelect: (schedule: TourSchedule) => void
}

export default function TourCalendar({ schedules, selectedSchedule, onScheduleSelect }: TourCalendarProps) {
	const [currentMonth, setCurrentMonth] = useState(new Date())

	// Group schedules by month for better organization
	const schedulesByMonth = schedules.reduce(
		(acc, schedule) => {
			const date = new Date(schedule.startTime)
			const monthKey = `${date.getFullYear()}-${date.getMonth()}`
			if (!acc[monthKey]) {
				acc[monthKey] = []
			}
			acc[monthKey].push(schedule)
			return acc
		},
		{} as Record<string, TourSchedule[]>,
	)

	const getAvailabilityStatus = (schedule: TourSchedule) => {
		// Prefer departureDate if present; fallback to startTime
		const rawDate = (schedule as any).departureDate || schedule.startTime
		let parsed: Date | null = null
		if (typeof rawDate === "string" && rawDate.length > 0) {
			// Normalize to date-only (ignore time) to avoid marking "today" as past
			const datePart = rawDate.includes("T") ? rawDate.split("T")[0] : rawDate
			parsed = new Date(`${datePart}T00:00:00`)
		}
		if (!parsed || isNaN(parsed.getTime())) {
			return { status: "invalid", text: "Ngày không hợp lệ", color: "bg-gray-100 text-gray-700" }
		}
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		if (parsed < today) {
			return { status: "past", text: "Đã diễn ra", color: "bg-gray-100 text-gray-700" }
		}
		const available = schedule.maxParticipant - schedule.currentBooked
		if (available <= 0) return { status: "full", text: "Hết chỗ", color: "bg-red-100 text-red-700" }
		if (available <= 5)
			return { status: "limited", text: `Còn ${Math.max(available, 0)} chỗ`, color: "bg-orange-100 text-orange-700" }
		return { status: "available", text: `Còn ${available} chỗ`, color: "bg-green-100 text-green-700" }
	}

	return (
		<div className="space-y-6">
			<div className="grid gap-4">
				{schedules.map((schedule) => {
					const availability = getAvailabilityStatus(schedule)
					const isSelected = selectedSchedule?.scheduleId === schedule.scheduleId
					const isAvailable = availability.status === "available" || availability.status === "limited"

					return (
						<Card
							key={schedule.scheduleId}
							className={`cursor-pointer transition-all duration-200 hover:shadow-md ${isSelected ? "ring-2 ring-blue-500 border-blue-500" : "border-gray-200 hover:border-blue-300"
								} ${!isAvailable ? "opacity-60" : ""}`}
							onClick={() => isAvailable && onScheduleSelect(schedule)}
						>
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4">
										<div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
											<CalendarIcon className="h-6 w-6 text-blue-600" />
										</div>

										<div>
											<div className="font-semibold text-lg text-gray-900">{formatDate(schedule.startTime)}</div>
											<div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
												<div className="flex items-center gap-1">
													<Clock className="h-4 w-4" />
													<span>{schedule.totalDays} ngày</span>
												</div>
												<div className="flex items-center gap-1">
													<Users className="h-4 w-4" />
													<span>
														{schedule.currentBooked}/{schedule.maxParticipant}
													</span>
												</div>
											</div>
										</div>
									</div>

									<div className="text-right">
										<div className="text-2xl font-bold text-blue-600 mb-1">{formatPrice(schedule.adultPrice)}</div>
										<Badge className={availability.color}>{availability.text}</Badge>
									</div>
								</div>

								{isSelected && (
									<div className="mt-4 pt-4 border-t border-gray-200">
										<div className="grid grid-cols-2 gap-4 text-sm">
											<div>
												<span className="text-gray-600">Người lớn:</span>
												<span className="ml-2 font-semibold">{formatPrice(schedule.adultPrice)}</span>
											</div>
											<div>
												<span className="text-gray-600">Trẻ em:</span>
												<span className="ml-2 font-semibold">{formatPrice(schedule.childrenPrice)}</span>
											</div>
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					)
				})}
			</div>

			{schedules.length === 0 && (
				<div className="text-center py-12">
					<CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
					<h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có lịch khởi hành</h3>
					<p className="text-gray-600">Vui lòng liên hệ để được tư vấn lịch trình phù hợp.</p>
				</div>
			)}
		</div>
	)
}
