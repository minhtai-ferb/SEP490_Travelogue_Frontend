"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
	Calendar,
	MapPin,
	Clock,
	Star,
	Phone,
	Mail,
	ChevronLeft,
	ChevronRight,
	User,
	CheckCircle,
	AlertCircle,
	Plane,
	Utensils,
	Bed,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Types
interface TourDate {
	date: string
	available: boolean
	price: number
	spotsLeft: number
	leaderId?: string
}

interface TourLeader {
	id: string
	name: string
	avatar: string
	experience: number
	rating: number
	languages: string[]
	specialties: string[]
	bio: string
}

interface Tour {
	id: string
	title: string
	destination: string
	duration: string
	images: string[]
	description: string
	highlights: string[]
	includes: string[]
	itinerary: { day: number; title: string; activities: string[] }[]
	price: number
	rating: number
	reviewCount: number
	dates: TourDate[]
}

// Mock data
export const mockTourLeaders: TourLeader[] = [
	{
		id: "1",
		name: "Nguyễn Văn An",
		avatar: "/placeholder.svg?height=100&width=100",
		experience: 8,
		rating: 4.9,
		languages: ["Tiếng Việt", "English", "日本語"],
		specialties: ["Văn hóa Nhật Bản", "Ẩm thực", "Lịch sử"],
		bio: "Hướng dẫn viên có 8 năm kinh nghiệm dẫn tour Nhật Bản, thành thạo 3 ngôn ngữ.",
	},
	{
		id: "2",
		name: "Trần Thị Bình",
		avatar: "/placeholder.svg?height=100&width=100",
		experience: 6,
		rating: 4.8,
		languages: ["Tiếng Việt", "English"],
		specialties: ["Nhiếp ảnh", "Thiên nhiên", "Văn hóa"],
		bio: "Chuyên gia nhiếp ảnh du lịch với kinh nghiệm 6 năm dẫn tour quốc tế.",
	},
	{
		id: "3",
		name: "Lê Minh Cường",
		avatar: "/placeholder.svg?height=100&width=100",
		experience: 10,
		rating: 5.0,
		languages: ["Tiếng Việt", "English", "中文"],
		specialties: ["Lịch sử", "Kiến trúc", "Tôn giáo"],
		bio: "Hướng dẫn viên kỳ cựu với 10 năm kinh nghiệm, chuyên về lịch sử và văn hóa.",
	},
]

const mockTour: Tour = {
	id: "japan-golden-route",
	title: "Nhật Bản: Nagoya - Kyoto - Làng cổ Shirakawago - Núi Phú Sĩ - Tokyo - Vịnh Odaiba",
	destination: "Nhật Bản",
	duration: "7 ngày 6 đêm",
	images: [
		"https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600",
		"https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&h=600",
		"https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600",
	],
	description:
		"Khám phá vẻ đẹp tuyệt vời của Nhật Bản từ Nagoya đến Tokyo, trải nghiệm văn hóa truyền thống tại Kyoto, chiêm ngưỡng làng cổ Shirakawago và núi Phú Sĩ hùng vĩ.",
	highlights: [
		"Tham quan làng cổ Shirakawago - Di sản thế giới UNESCO",
		"Ngắm núi Phú Sĩ từ nhiều góc độ khác nhau",
		"Khám phá văn hóa truyền thống tại Kyoto",
		"Trải nghiệm Tokyo hiện đại và vịnh Odaiba",
		"Bay thẳng bằng Vietjet Air",
	],
	includes: [
		"Vé máy bay khứ hồi",
		"Khách sạn 4 sao",
		"Ăn uống theo chương trình",
		"Hướng dẫn viên tiếng Việt",
		"Bảo hiểm du lịch",
		"Visa Nhật Bản",
	],
	itinerary: [
		{
			day: 1,
			title: "TP.HCM - Nagoya",
			activities: ["Bay từ TP.HCM đến Nagoya", "Nhận phòng khách sạn", "Tự do khám phá thành phố"],
		},
		{
			day: 2,
			title: "Nagoya - Shirakawago - Takayama",
			activities: ["Tham quan làng cổ Shirakawago", "Khám phá kiến trúc truyền thống", "Nghỉ đêm tại Takayama"],
		},
		{
			day: 3,
			title: "Takayama - Núi Phú Sĩ - Tokyo",
			activities: ["Ngắm núi Phú Sĩ", "Tham quan khu vực 5 hồ", "Di chuyển đến Tokyo"],
		},
	],
	price: 32900000,
	rating: 4.8,
	reviewCount: 156,
	dates: [
		{ date: "2025-07-15", available: true, price: 32900000, spotsLeft: 8, leaderId: "1" },
		{ date: "2025-07-22", available: true, price: 32900000, spotsLeft: 12 },
		{ date: "2025-08-08", available: true, price: 34900000, spotsLeft: 6, leaderId: "2" },
		{ date: "2025-08-15", available: true, price: 34900000, spotsLeft: 15 },
		{ date: "2025-08-22", available: false, price: 34900000, spotsLeft: 0, leaderId: "3" },
		{ date: "2025-09-05", available: true, price: 36900000, spotsLeft: 10 },
		{ date: "2025-09-12", available: true, price: 36900000, spotsLeft: 8, leaderId: "1" },
		{ date: "2025-09-19", available: true, price: 36900000, spotsLeft: 14 },
	],
}

export function TourBookingSystem() {
	const [selectedDate, setSelectedDate] = useState<TourDate | null>(null)
	const [currentMonth, setCurrentMonth] = useState(new Date())
	const [selectedLeader, setSelectedLeader] = useState<TourLeader | null>(null)
	const [showLeaderSelection, setShowLeaderSelection] = useState(false)
	const [bookingStep, setBookingStep] = useState<"calendar" | "details" | "leader" | "confirm">("calendar")

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
	}

	const getMonthDates = () => {
		const year = currentMonth.getFullYear()
		const month = currentMonth.getMonth()

		return mockTour.dates.filter((date) => {
			const dateObj = new Date(date.date)
			return dateObj.getFullYear() === year && dateObj.getMonth() === month
		})
	}

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
		const leader = mockTourLeaders.find((l) => l.id === date.leaderId)
		setSelectedLeader(leader || null)
		setBookingStep("details")
	}

	const handleBooking = () => {
		if (!selectedDate?.leaderId) {
			setShowLeaderSelection(true)
			setBookingStep("leader")
		} else {
			setBookingStep("confirm")
		}
	}

	const handleLeaderSelect = (leader: TourLeader) => {
		setSelectedLeader(leader)
		setShowLeaderSelection(false)
		setBookingStep("confirm")
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">{mockTour.title}</h1>
					<div className="flex items-center justify-center gap-4 text-gray-600">
						<div className="flex items-center gap-1">
							<MapPin className="w-4 h-4" />
							<span>{mockTour.destination}</span>
						</div>
						<div className="flex items-center gap-1">
							<Clock className="w-4 h-4" />
							<span>{mockTour.duration}</span>
						</div>
						<div className="flex items-center gap-1">
							<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
							<span>
								{mockTour.rating} ({mockTour.reviewCount} đánh giá)
							</span>
						</div>
					</div>
				</motion.div>

				<div className="grid lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-8">
						{/* Tour Images */}
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							className="grid grid-cols-1 md:grid-cols-3 gap-4"
						>
							{mockTour.images.map((image, index) => (
								<div
									key={index}
									className={cn(
										"relative overflow-hidden rounded-2xl",
										index === 0 ? "md:col-span-2 md:row-span-2 h-96" : "h-44",
									)}
								>
									<img
										src={image || "/placeholder.svg"}
										alt={`Tour image ${index + 1}`}
										className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
									/>
								</div>
							))}
						</motion.div>

						{/* Calendar Section */}
						<AnimatePresence mode="wait">
							{bookingStep === "calendar" && (
								<motion.div
									key="calendar"
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 20 }}
								>
									<Card className="shadow-lg">
										<CardHeader>
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
												<div>Số tour trong tháng: {getMonthDates().length}</div>
												<div>Tổng số tour: {mockTour.dates.length}</div>
											</div>

											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
												{getMonthDates().length > 0 ? (
													getMonthDates().map((date, index) => (
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
							)}

							{/* Tour Details */}
							{bookingStep === "details" && selectedDate && (
								<motion.div
									key="details"
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 20 }}
									className="space-y-6"
								>
									<Card className="shadow-lg">
										<CardHeader>
											<CardTitle className="flex items-center justify-between">
												<span>Chi tiết tour đã chọn</span>
												<Button variant="outline" onClick={() => setBookingStep("calendar")}>
													Chọn ngày khác
												</Button>
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-6">
											<div className="bg-blue-50 p-4 rounded-xl">
												<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
													<div>
														<div className="text-sm text-gray-600">Ngày khởi hành</div>
														<div className="font-semibold">
															{new Date(selectedDate.date).toLocaleDateString("vi-VN")}
														</div>
													</div>
													<div>
														<div className="text-sm text-gray-600">Giá tour</div>
														<div className="font-semibold text-blue-600">{formatPrice(selectedDate.price)}</div>
													</div>
													<div>
														<div className="text-sm text-gray-600">Chỗ còn lại</div>
														<div className="font-semibold">{selectedDate.spotsLeft} chỗ</div>
													</div>
													<div>
														<div className="text-sm text-gray-600">Trạng thái</div>
														<Badge variant={selectedDate.leaderId ? "default" : "secondary"}>
															{selectedDate.leaderId ? "Có trưởng đoàn" : "Chưa có trưởng đoàn"}
														</Badge>
													</div>
												</div>
											</div>

											{selectedLeader && (
												<div className="bg-green-50 p-4 rounded-xl">
													<h4 className="font-semibold mb-3 flex items-center gap-2">
														<User className="w-4 h-4" />
														Trưởng đoàn của tour
													</h4>
													<div className="flex items-start gap-4">
														<Avatar className="w-16 h-16">
															<AvatarImage src={selectedLeader.avatar || "/placeholder.svg"} />
															<AvatarFallback>{selectedLeader.name[0]}</AvatarFallback>
														</Avatar>
														<div className="flex-1">
															<div className="font-semibold text-lg">{selectedLeader.name}</div>
															<div className="text-sm text-gray-600 mb-2">{selectedLeader.bio}</div>
															<div className="flex items-center gap-4 text-sm">
																<span className="flex items-center gap-1">
																	<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
																	{selectedLeader.rating}
																</span>
																<span>{selectedLeader.experience} năm kinh nghiệm</span>
																<span>{selectedLeader.languages.join(", ")}</span>
															</div>
														</div>
													</div>
												</div>
											)}

											<div className="flex gap-4">
												<Button onClick={handleBooking} className="flex-1" size="lg">
													{selectedDate.leaderId ? "Đặt tour ngay" : "Chọn trưởng đoàn và đặt tour"}
												</Button>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							)}

							{/* Leader Selection */}
							{bookingStep === "leader" && (
								<motion.div
									key="leader"
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 20 }}
								>
									<Card className="shadow-lg">
										<CardHeader>
											<CardTitle className="flex items-center justify-between">
												<span>Chọn trưởng đoàn</span>
												<Button variant="outline" onClick={() => setBookingStep("details")}>
													Quay lại
												</Button>
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="grid gap-4">
												{mockTourLeaders.map((leader) => (
													<motion.div
														key={leader.id}
														whileHover={{ scale: 1.02 }}
														className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 cursor-pointer transition-all"
														onClick={() => handleLeaderSelect(leader)}
													>
														<div className="flex items-start gap-4">
															<Avatar className="w-20 h-20">
																<AvatarImage src={leader.avatar || "/placeholder.svg"} />
																<AvatarFallback>{leader.name[0]}</AvatarFallback>
															</Avatar>
															<div className="flex-1">
																<div className="font-semibold text-xl mb-1">{leader.name}</div>
																<div className="text-gray-600 mb-2">{leader.bio}</div>
																<div className="flex items-center gap-4 text-sm mb-2">
																	<span className="flex items-center gap-1">
																		<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
																		{leader.rating}
																	</span>
																	<span>{leader.experience} năm kinh nghiệm</span>
																</div>
																<div className="flex flex-wrap gap-2 mb-2">
																	{leader.languages.map((lang) => (
																		<Badge key={lang} variant="outline">
																			{lang}
																		</Badge>
																	))}
																</div>
																<div className="flex flex-wrap gap-2">
																	{leader.specialties.map((specialty) => (
																		<Badge key={specialty} variant="secondary">
																			{specialty}
																		</Badge>
																	))}
																</div>
															</div>
														</div>
													</motion.div>
												))}
											</div>
										</CardContent>
									</Card>
								</motion.div>
							)}

							{/* Booking Confirmation */}
							{bookingStep === "confirm" && selectedDate && selectedLeader && (
								<motion.div
									key="confirm"
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 20 }}
								>
									<Card className="shadow-lg border-green-200">
										<CardHeader className="bg-green-50">
											<CardTitle className="text-green-800 flex items-center gap-2">
												<CheckCircle className="w-5 h-5" />
												Xác nhận đặt tour
											</CardTitle>
										</CardHeader>
										<CardContent className="p-6 space-y-6">
											<div className="text-center">
												<div className="text-2xl font-bold text-green-600 mb-2">Đặt tour thành công!</div>
												<div className="text-gray-600">Cảm ơn bạn đã chọn tour của chúng tôi</div>
											</div>

											<Separator />

											<div className="space-y-4">
												<h4 className="font-semibold">Thông tin tour:</h4>
												<div className="grid grid-cols-2 gap-4 text-sm">
													<div>
														<span className="text-gray-600">Ngày khởi hành:</span>
														<div className="font-semibold">
															{new Date(selectedDate.date).toLocaleDateString("vi-VN")}
														</div>
													</div>
													<div>
														<span className="text-gray-600">Giá tour:</span>
														<div className="font-semibold text-blue-600">{formatPrice(selectedDate.price)}</div>
													</div>
												</div>
											</div>

											<Separator />

											<div className="space-y-4">
												<h4 className="font-semibold">Trưởng đoàn:</h4>
												<div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
													<Avatar className="w-16 h-16">
														<AvatarImage src={selectedLeader.avatar || "/placeholder.svg"} />
														<AvatarFallback>{selectedLeader.name[0]}</AvatarFallback>
													</Avatar>
													<div>
														<div className="font-semibold text-lg">{selectedLeader.name}</div>
														<div className="text-sm text-gray-600">{selectedLeader.bio}</div>
														<div className="flex items-center gap-2 text-sm mt-1">
															<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
															<span>{selectedLeader.rating}</span>
															<span>•</span>
															<span>{selectedLeader.experience} năm kinh nghiệm</span>
														</div>
													</div>
												</div>
											</div>

											<div className="flex gap-4">
												<Button onClick={() => setBookingStep("calendar")} variant="outline" className="flex-1">
													Đặt tour khác
												</Button>
												<Button className="flex-1">Xem chi tiết booking</Button>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Tour Info */}
						<Card className="shadow-lg sticky top-4">
							<CardHeader>
								<CardTitle className="text-xl">Thông tin tour</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<h4 className="font-semibold mb-2">Điểm nổi bật:</h4>
									<ul className="space-y-1 text-sm">
										{mockTour.highlights.map((highlight, index) => (
											<li key={index} className="flex items-start gap-2">
												<CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
												<span>{highlight}</span>
											</li>
										))}
									</ul>
								</div>

								<Separator />

								<div>
									<h4 className="font-semibold mb-2">Bao gồm:</h4>
									<div className="grid grid-cols-2 gap-2 text-sm">
										{mockTour.includes.map((item, index) => (
											<div key={index} className="flex items-center gap-2">
												{item.includes("máy bay") && <Plane className="w-4 h-4 text-blue-500" />}
												{item.includes("khách sạn") && <Bed className="w-4 h-4 text-purple-500" />}
												{item.includes("ăn") && <Utensils className="w-4 h-4 text-orange-500" />}
												{!item.includes("máy bay") && !item.includes("khách sạn") && !item.includes("ăn") && (
													<CheckCircle className="w-4 h-4 text-green-500" />
												)}
												<span>{item}</span>
											</div>
										))}
									</div>
								</div>

								<Separator />

								<div className="text-center">
									<div className="text-sm text-gray-600">Giá từ</div>
									<div className="text-2xl font-bold text-blue-600">{formatPrice(mockTour.price)}</div>
									<div className="text-sm text-gray-500">/người</div>
								</div>

								<div className="flex gap-2">
									<Button className="flex-1" size="sm">
										<Phone className="w-4 h-4 mr-2" />
										Gọi tư vấn
									</Button>
									<Button variant="outline" size="sm">
										<Mail className="w-4 h-4" />
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}
