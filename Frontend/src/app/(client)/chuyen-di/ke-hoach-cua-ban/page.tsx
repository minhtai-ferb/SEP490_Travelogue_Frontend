"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@heroui/react"
import { MapPin, Calendar, Clock, Star, CheckCircle2, PlayCircle, Edit, Share2, MoreVertical } from "lucide-react"
import type { UserTripPlan } from "@/types/TripBooking"

export default function UserPlansPage() {
	const searchParams = useSearchParams()
	const bookingId = searchParams.get("bookingId")
	const [userPlans, setUserPlans] = useState<UserTripPlan[]>([])
	const [loading, setLoading] = useState(true)

	const router = useRouter()

	useEffect(() => {
		// Load user trip plans from localStorage
		const plans = JSON.parse(localStorage.getItem("userTripPlans") || "[]")
		setUserPlans(plans)
		setLoading(false)

		// If there's a bookingId, scroll to that plan
		if (bookingId) {
			setTimeout(() => {
				const element = document.getElementById(`plan-${bookingId}`)
				if (element) {
					element.scrollIntoView({ behavior: "smooth" })
				}
			}, 500)
		}
	}, [bookingId])

	const formatDate = (date: string | Date) => {
		const d = typeof date === "string" ? new Date(date) : date
		return new Intl.DateTimeFormat("vi-VN", {
			weekday: "short",
			day: "numeric",
			month: "short",
			year: "numeric",
		}).format(d)
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case "booked":
				return "bg-blue-100 text-blue-700 border-blue-200"
			case "active":
				return "bg-green-100 text-green-700 border-green-200"
			case "completed":
				return "bg-purple-100 text-purple-700 border-purple-200"
			default:
				return "bg-gray-100 text-gray-700 border-gray-200"
		}
	}

	const getStatusLabel = (status: string) => {
		switch (status) {
			case "booked":
				return "Đã đặt"
			case "active":
				return "Đang diễn ra"
			case "completed":
				return "Hoàn thành"
			default:
				return "Lên kế hoạch"
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
				<div className="text-center">
					<div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600">Đang tải kế hoạch của bạn...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
					<div className="flex items-center justify-center">
						<h1 className="text-4xl md:text-5xl font-bold">
							🗺️
						</h1>
						<h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent py-9">
							Kế hoạch du lịch của bạn
						</h1>
					</div>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Quản lý và theo dõi tất cả các chuyến du lịch của bạn
					</p>
				</motion.div>

				{/* Plans Grid */}
				{userPlans.length === 0 ? (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="text-center py-16"
					>
						<div className="text-6xl mb-4">🧳</div>
						<h3 className="text-2xl font-bold text-gray-800 mb-2">Chưa có kế hoạch nào</h3>
						<p className="text-gray-600 mb-6">Hãy tạo kế hoạch du lịch đầu tiên của bạn!</p>
						<Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
							onClick={() => router.push("/len-ke-hoach")}>
							Tạo kế hoạch mới
						</Button>
					</motion.div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{userPlans.map((plan, index) => (
							<motion.div
								key={plan.bookingId}
								id={`plan-${plan.bookingId}`}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className={`${bookingId === plan.bookingId ? "ring-4 ring-blue-400 ring-opacity-50" : ""}`}
							>
								<Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 overflow-hidden">
									{/* Card Header with Image */}
									<div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
										<div className="absolute inset-0 bg-black/20"></div>
										<div className="absolute top-4 left-4 right-4 flex justify-between items-start">
											<Badge className={`${getStatusColor(plan.status)} border font-medium`}>
												{getStatusLabel(plan.status)}
											</Badge>
											<Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
												<MoreVertical className="h-4 w-4" />
											</Button>
										</div>
										<div className="absolute bottom-4 left-4 right-4 text-white">
											<h3 className="text-xl font-bold mb-1">{plan?.destinations?.[0]?.name}</h3>
											<div className="flex items-center gap-4 text-sm opacity-90">
												<div className="flex items-center gap-1">
													<Calendar className="h-3 w-3" />
													{formatDate(plan.startDate)}
												</div>
												<div className="flex items-center gap-1">
													<Clock className="h-3 w-3" />
													{plan.duration} ngày
												</div>
											</div>
										</div>
									</div>

									<CardContent className="p-6 space-y-4">
										{/* Tour Guide */}
										{plan.tourGuide && (
											<div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
												<Avatar className="h-10 w-10 border-2 border-white shadow-sm">
													<AvatarImage src={plan.tourGuide.avatar || "/placeholder.svg"} alt={plan.tourGuide.name} />
													<AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white font-bold text-sm">
														{plan.tourGuide.name
															.split(" ")
															.map((n) => n[0])
															.join("")}
													</AvatarFallback>
												</Avatar>
												<div className="flex-1">
													<div className="font-medium text-sm text-gray-800">{plan.tourGuide.name}</div>
													<div className="flex items-center gap-1 text-xs text-gray-600">
														<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
														<span>{plan.tourGuide.rating}</span>
													</div>
												</div>
											</div>
										)}

										{/* Progress */}
										{plan.status === "active" && (
											<div className="space-y-2">
												<div className="flex justify-between text-sm">
													<span className="text-gray-600">Tiến độ</span>
													<span className="font-medium">
														Ngày {plan.progress.currentDay}/{plan.duration}
													</span>
												</div>
												<Progress value={(plan.progress.currentDay / plan.duration) * 100} className="h-2" />
											</div>
										)}

										{/* Activities Summary */}
										<div className="text-sm text-gray-600">
											<div className="flex items-center gap-2 mb-2">
												<MapPin className="h-4 w-4 text-blue-500" />
												<span className="font-medium">Hoạt động chính:</span>
											</div>
											<div className="space-y-1">
												{plan.itinerary?.slice(0, 2).map((day, idx) => (
													<div key={idx} className="flex items-center gap-2 text-xs">
														<CheckCircle2 className="h-3 w-3 text-green-500" />
														<span>
															Ngày {day.day}: {day?.title}
														</span>
													</div>
												))}
												{plan.itinerary && plan.itinerary.length > 2 && (
													<div className="text-xs text-gray-500">+{plan.itinerary.length - 2} hoạt động khác</div>
												)}
											</div>
										</div>

										{/* Action Buttons */}
										<div className="flex gap-2 pt-2">
											<Button
												size="sm"
												className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
												onClick={() => router.push(`/chuyen-di/${plan.id}`)}
											>
												<PlayCircle className="h-4 w-4 mr-2" />
												{plan.status === "active" ? "Tiếp tục" : "Xem chi tiết"}
											</Button>
											<Button variant="outline" size="sm">
												<Edit className="h-4 w-4" />
											</Button>
											<Button variant="outline" size="sm">
												<Share2 className="h-4 w-4" />
											</Button>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
