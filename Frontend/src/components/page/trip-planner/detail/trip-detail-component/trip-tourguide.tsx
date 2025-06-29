"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
	Star,
	MapPin,
	Clock,
	MessageCircle,
	Shield,
	Award,
	Users,
	Languages,
	Heart,
	CheckCircle2,
	Camera,
	Utensils,
	Mountain,
	ShoppingBag,
	User,
	Phone,
} from "lucide-react"
import { MOCK_TOURGUIDES } from "@/data/trip-tourguide"
import type { TourGuide } from "@/types/Tourguide"

interface TripTourguideProps {
	plan: any,
	onGuideSelect: (guide: TourGuide) => void
}

const specialtyIcons: Record<string, any> = {
	"Văn hóa": Award,
	"Lịch sử": MapPin,
	"Ẩm thực": Utensils,
	"Thiên nhiên": Mountain,
	"Phiêu lưu": Mountain,
	"Nhiếp ảnh": Camera,
	"Shopping": ShoppingBag,
	"Thời trang": ShoppingBag,
	"Làm đẹp": Heart,
	"Chợ địa phương": ShoppingBag,
	"Đời sống": Users,
}

const availabilityConfig = {
	available: { color: "text-green-600", bg: "bg-green-100", label: "Sẵn sàng" },
	busy: { color: "text-orange-600", bg: "bg-orange-100", label: "Bận" },
	offline: { color: "text-gray-600", bg: "bg-gray-100", label: "Offline" },
}

function TripTourguide({ plan, onGuideSelect }: TripTourguideProps) {
	const [selectedGuide, setSelectedGuide] = useState<TourGuide | null>(plan?.tourguide || null)
	const [isSelecting, setIsSelecting] = useState(!plan?.tourguide)


	const handleSelectGuide = (guide: TourGuide) => {
		setSelectedGuide(guide)
		setIsSelecting(false)
		onGuideSelect(guide)
	}

	const handleChangeGuide = () => {
		setIsSelecting(true)
	}

	if (isSelecting) {
		return (
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
				{/* Header */}
				<div className="text-center space-y-4">
					<h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						🎯 Chọn hướng dẫn viên
					</h2>
					<p className="text-gray-600 max-w-2xl mx-auto">
						Lựa chọn hướng dẫn viên phù hợp để có trải nghiệm du lịch tuyệt vời nhất
					</p>
				</div>

				{/* Tour Guides Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{MOCK_TOURGUIDES.map((guide, index) => {
						const availability = availabilityConfig[guide.availability]

						return (
							<motion.div
								key={guide.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
							>
								<Card
									className={`
                  group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2
                  border-2 hover:border-blue-200 bg-gradient-to-br from-white to-blue-50/30
                  ${guide.availability === "available" ? "hover:border-green-300" : ""}
                  ${guide.availability === "busy" ? "opacity-75" : ""}
                `}
								>
									<CardHeader className="pb-4">
										<div className="flex items-start gap-4">
											{/* Avatar */}
											<div className="relative">
												<Avatar className="h-20 w-20 border-4 border-white shadow-lg">
													<AvatarImage src={guide.avatar || "/placeholder.svg"} alt={guide.name} />
													<AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-bold text-lg">
														{guide.name
															.split(" ")
															.map((n) => n[0])
															.join("")}
													</AvatarFallback>
												</Avatar>

												{/* Status Indicator */}
												<div
													className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${availability.bg} border-2 border-white flex items-center justify-center`}
												>
													<div
														className={`w-3 h-3 rounded-full ${guide.availability === "available" ? "bg-green-500" : guide.availability === "busy" ? "bg-orange-500" : "bg-gray-500"}`}
													></div>
												</div>
											</div>

											{/* Basic Info */}
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-2">
													<h3 className="text-xl font-bold text-gray-800">{guide.name}</h3>
													{guide.isVerified && <Shield className="h-5 w-5 text-blue-500" />}
												</div>

												<div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
													<div className="flex items-center gap-1">
														<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
														<span className="font-medium">{guide.rating}</span>
														<span>({guide.reviewCount})</span>
													</div>
													<div className="flex items-center gap-1">
														<Award className="h-4 w-4 text-purple-500" />
														<span>{guide.experience} năm KN</span>
													</div>
												</div>

												{/* Badges */}
												<div className="flex flex-wrap gap-2 mb-3">
													{guide.badges.map((badge, idx) => (
														<Badge key={idx} variant="secondary" className="text-xs">
															{badge}
														</Badge>
													))}
													<Badge className={`text-xs ${availability.bg} ${availability.color} border-0`}>
														{availability.label}
													</Badge>
												</div>
											</div>

											{/* Price */}
											<div className="text-right">
												<div className="text-2xl font-bold text-blue-600">{guide.price.toLocaleString("vi-VN")}₫</div>
												<div className="text-xs text-gray-500">mỗi ngày</div>
											</div>
										</div>
									</CardHeader>

									<CardContent className="space-y-4">
										{/* Bio */}
										<p className="text-sm text-gray-600 leading-relaxed">{guide.bio}</p>

										{/* Languages */}
										<div>
											<div className="flex items-center gap-2 mb-2">
												<Languages className="h-4 w-4 text-blue-500" />
												<span className="text-sm font-medium text-gray-700">Ngôn ngữ:</span>
											</div>
											<div className="flex flex-wrap gap-1">
												{guide.languages.map((lang, idx) => (
													<Badge key={idx} variant="outline" className="text-xs">
														{lang}
													</Badge>
												))}
											</div>
										</div>

										{/* Specialties */}
										<div>
											<div className="flex items-center gap-2 mb-2">
												<Star className="h-4 w-4 text-purple-500" />
												<span className="text-sm font-medium text-gray-700">Chuyên môn:</span>
											</div>
											<div className="flex flex-wrap gap-2">
												{guide.specialties.map((specialty, idx) => {
													const IconComponent = specialtyIcons[specialty] || Award
													return (
														<div
															key={idx}
															className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-lg text-xs"
														>
															<IconComponent className="h-3 w-3" />
															{specialty}
														</div>
													)
												})}
											</div>
										</div>

										{/* Response Time
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<Clock className="h-4 w-4 text-green-500" />
											<span>Phản hồi: {guide.responseTime}</span>
										</div> */}

										<Separator />

										{/* Action Buttons */}
										<div className="flex gap-3">
											<Button
												onClick={() => handleSelectGuide(guide)}
												disabled={guide.availability !== "available"}
												className={`flex-1 ${guide.availability === "available"
													? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
													: "bg-gray-300 cursor-not-allowed"
													}`}
											>
												{guide.availability === "available" ? "Chọn hướng dẫn viên" : "Không khả dụng"}
											</Button>
											{/* <Button variant="outline" size="icon">
												<MessageCircle className="h-4 w-4" />
											</Button> */}
										</div>
									</CardContent>
								</Card>
							</motion.div>
						)
					})}
				</div>
			</motion.div>
		)
	}

	if (!selectedGuide) {
		return (
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				className="text-center p-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl border-2 border-dashed border-blue-200"
			>
				<User className="h-16 w-16 text-blue-400 mx-auto mb-4" />
				<h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có hướng dẫn viên</h3>
				<p className="text-gray-600 mb-6">Hãy lựa chọn hướng dẫn viên cho kế hoạch du lịch của bạn</p>
				<Button
					onClick={() => setIsSelecting(true)}
					className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
				>
					Chọn hướng dẫn viên
				</Button>
			</motion.div>
		)
	}

	// Selected Guide Display
	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
					👨‍🏫 Hướng dẫn viên của bạn
				</h2>
				<Button variant="outline" onClick={handleChangeGuide}>
					Thay đổi
				</Button>
			</div>

			{/* Selected Guide Card */}
			<Card className="bg-gradient-to-br from-white to-green-50/30 border-2 border-green-200 shadow-xl">
				<CardContent className="p-8">
					<div className="flex items-start gap-6">
						{/* Avatar */}
						<div className="relative">
							<Avatar className="h-24 w-24 border-4 border-white shadow-lg">
								<AvatarImage src={selectedGuide.avatar || "/placeholder.svg"} alt={selectedGuide.name} />
								<AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white font-bold text-xl">
									{selectedGuide.name
										.split(" ")
										.map((n) => n[0])
										.join("")}
								</AvatarFallback>
							</Avatar>

							{/* Verified Badge */}
							{selectedGuide.isVerified && (
								<div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
									<CheckCircle2 className="h-4 w-4 text-white" />
								</div>
							)}
						</div>

						{/* Info */}
						<div className="flex-1">
							<div className="flex items-center gap-3 mb-3">
								<h3 className="text-2xl font-bold text-gray-800">{selectedGuide.name}</h3>
								<div className="flex gap-2">
									{selectedGuide.badges.map((badge, idx) => (
										<Badge key={idx} className="bg-green-100 text-green-700 border-green-200">
											{badge}
										</Badge>
									))}
								</div>
							</div>

							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
								<div className="text-center p-3 bg-white/60 rounded-xl">
									<div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
										<Star className="h-4 w-4 fill-current" />
										<span className="font-bold">{selectedGuide.rating}</span>
									</div>
									<div className="text-xs text-gray-600">{selectedGuide.reviewCount} đánh giá</div>
								</div>

								<div className="text-center p-3 bg-white/60 rounded-xl">
									<div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
										<Award className="h-4 w-4" />
										<span className="font-bold">{selectedGuide.experience}</span>
									</div>
									<div className="text-xs text-gray-600">năm kinh nghiệm</div>
								</div>

								<div className="text-center p-3 bg-white/60 rounded-xl">
									<div className="flex items-center justify-center gap-1 text-purple-500 mb-1">
										<Languages className="h-4 w-4" />
										<span className="font-bold">{selectedGuide.languages.length}</span>
									</div>
									<div className="text-xs text-gray-600">ngôn ngữ</div>
								</div>

								<div className="text-center p-3 bg-white/60 rounded-xl">
									<div className="text-lg font-bold text-green-600 mb-1">
										{selectedGuide.price.toLocaleString("vi-VN")}₫
									</div>
									<div className="text-xs text-gray-600">mỗi ngày</div>
								</div>
							</div>

							<p className="text-gray-600 mb-4">{selectedGuide.bio}</p>

							{/* Contact Actions */}
							{/* <div className="flex gap-3">
								<Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
									<MessageCircle className="h-4 w-4 mr-2" />
									Nhắn tin
								</Button>
								<Button variant="outline">
									<Phone className="h-4 w-4 mr-2" />
									Gọi điện
								</Button>
							</div> */}
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	)
}

export default TripTourguide
