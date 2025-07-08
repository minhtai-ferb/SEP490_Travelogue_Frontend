'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Tour, TourDate } from "@/types/Tour"
import { formatPrice, getMonthDates } from "@/utils/format"
import { motion } from "framer-motion"
import { AlertCircle, Calendar, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface CalendarPickerProps {
	tour: Tour
}

function CalendarPicker({ tour }: CalendarPickerProps) {

	const [selectedDate, setSelectedDate] = useState<TourDate | null>(null)
	const [currentMonth, setCurrentMonth] = useState(new Date())
	const router = useRouter()
	const nextMonth = () => {
		const newDate = new Date(currentMonth)
		newDate.setMonth(newDate.getMonth() + 1)
		setCurrentMonth(newDate)
	}

	const prevMonth = () => {
		const newDate = new Date(currentMonth)
		newDate.setMonth(newDate.getMonth() - 1)
		setCurrentMonth(newDate)
	}

	const handleDateSelect = (date: TourDate) => {
		setSelectedDate(date)
		console.log("Selected date:", date)
		if (date.available) {
			setSelectedDate(date)
		}
		// Navigate to booking form with selected date
		const searchParams = new URLSearchParams({
			tourId: tour.id,
			selectedDate: date.date,
			price: tour?.pricing?.basePrice.toString() || "0",
			spotsLeft: date.spotsLeft.toString(),
		})

		router.push(`/chuyen-di/dat-tour?${searchParams.toString()}`)
	}

	return (
		<motion.div
			key="calendar"
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 20 }}
		>
			<Card className="shadow-lg">
				<CardHeader id="calendar">
					<CardTitle className="flex items-center justify-between">
						<span className="flex items-center gap-2">
							<Calendar className="w-5 h-5" />
							Chọn ngày khởi hành
						</span>
						<div className="flex items-center gap-2">
							<Button variant="outline" size="icon" onClick={prevMonth}>
								<ChevronLeft className="w-4 h-4" />
							</Button>
							<span className="font-semibold min-w-[120px] text-center">
								{currentMonth.toLocaleDateString("vi-VN", { month: "long", year: "numeric" })}
							</span>
							<Button variant="outline" size="icon" onClick={nextMonth}>
								<ChevronRight className="w-4 h-4" />
							</Button>
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent>
					{/* Debug info - có thể xóa sau */}
					<div className="mb-4 p-2 bg-gray-100 rounded text-sm">
						<div>Tháng hiện tại: {currentMonth.toLocaleDateString("vi-VN")}</div>
						<div>Số tour trong tháng: {getMonthDates(currentMonth, tour).length}</div>
						<div>Tổng số tour: {tour.dates.length}</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
						id="tour-dates"
					>
						{getMonthDates(currentMonth, tour).length > 0 ? (
							getMonthDates(currentMonth, tour).map((date, index) => (
								<motion.div
									key={date.date}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 }}
									whileHover={{ scale: 1.02 }}
									className={cn(
										"p-4 rounded-xl border-2 cursor-pointer transition-all",
										date.available
											? "border-blue-200 hover:border-blue-400 bg-white hover:bg-blue-50"
											: "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60",
									)}
									onClick={() => date.available && handleDateSelect(date)}
								>
									<div className="flex justify-between items-start mb-2">
										<div>
											<div className="font-semibold text-lg">
												{new Date(date.date).toLocaleDateString("vi-VN", {
													day: "2-digit",
													month: "2-digit",
												})}
											</div>
											<div className="text-sm text-gray-600">
												{new Date(date.date).toLocaleDateString("vi-VN", { weekday: "long" })}
											</div>
										</div>
										<Badge variant={date.available ? "default" : "secondary"}>
											{date.available ? `${date.spotsLeft} chỗ` : "Hết chỗ"}
										</Badge>
									</div>

									<div className="text-lg font-bold text-blue-600 mb-2">{formatPrice(date.price)}</div>

									{date.leaderId && (
										<div className="flex items-center gap-2 text-sm text-green-600">
											<CheckCircle className="w-4 h-4" />
											<span>Có trưởng đoàn</span>
										</div>
									)}

									{!date.leaderId && date.available && (
										<div className="flex items-center gap-2 text-sm text-orange-600">
											<AlertCircle className="w-4 h-4" />
											<span>Chọn trưởng đoàn</span>
										</div>
									)}
								</motion.div>
							))
						) : (
							<div className="col-span-full text-center py-8 text-gray-500">
								<Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
								<p>Không có tour nào trong tháng này</p>
								<p className="text-sm">Vui lòng chọn tháng khác</p>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</motion.div>
	)
}

export default CalendarPicker