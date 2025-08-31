"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, MapPin, Calendar, Users, Star, CreditCard, Shield, CheckCircle2, Clock, User } from "lucide-react"
import type { TourGuide } from "@/types/Tourguide"
import { TripPlanTourGuide } from "@/types/TripPlan"

interface BookingConfirmationModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	plan: TripPlanTourGuide
	tourGuide?: TourGuide
	pricing: {
		basePrice: number
		tourGuidePrice: number
		serviceFee: number
		total: number
	}
	isLoading: boolean
}

export function BookingConfirmationModal({
	isOpen,
	onClose,
	onConfirm,
	plan,
	tourGuide,
	pricing,
	isLoading,
}: BookingConfirmationModalProps) {
	const formatPrice = (price: number) => price.toLocaleString("vi-VN") + "₫"

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("vi-VN", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(date)
	}

	const getEndDate = () => {
		const endDate = new Date(plan.startDate)
		endDate.setDate(endDate.getDate() + plan.duration - 1)
		return endDate
	}

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="absolute inset-0 bg-black/50 backdrop-blur-sm"
						onClick={onClose}
					/>

					{/* Modal */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
					>
						<Card className="bg-white shadow-2xl border-0">
							<CardHeader className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
								<Button
									variant="ghost"
									size="icon"
									className="absolute right-4 top-4 text-white hover:bg-white/20"
									onClick={onClose}
								>
									<X className="h-4 w-4" />
								</Button>

								<CardTitle className="text-2xl font-bold pr-12">🎉 Xác nhận đặt chuyến đi</CardTitle>
								<p className="text-blue-100">Kiểm tra thông tin và xác nhận để bắt đầu hành trình tuyệt vời</p>
							</CardHeader>

							<CardContent className="p-6 space-y-6">
								{/* Trip Overview */}
								<div className="space-y-4">
									<h3 className="text-lg font-semibold flex items-center gap-2">
										<MapPin className="h-5 w-5 text-blue-500" />
										Thông tin chuyến đi
									</h3>

									<div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
										<h4 className="font-bold text-lg text-gray-800 mb-2">{plan?.destinations?.[0]?.name}</h4>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
											<div className="flex items-center gap-2">
												<Calendar className="h-4 w-4 text-blue-500" />
												<div>
													<div className="font-medium">Bắt đầu</div>
													<div className="text-gray-600">{formatDate(plan.startDate)}</div>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<Clock className="h-4 w-4 text-purple-500" />
												<div>
													<div className="font-medium">Kết thúc</div>
													<div className="text-gray-600">{formatDate(getEndDate())}</div>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<Users className="h-4 w-4 text-green-500" />
												<div>
													<div className="font-medium">Thời gian</div>
													<div className="text-gray-600">{plan.duration} ngày</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Tour Guide */}
								{tourGuide && (
									<div className="space-y-4">
										<h3 className="text-lg font-semibold flex items-center gap-2">
											<User className="h-5 w-5 text-purple-500" />
											Hướng dẫn viên
										</h3>

										<div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
											<div className="flex items-center gap-4">
												<Avatar className="h-16 w-16 border-2 border-white shadow-lg">
													<AvatarImage src={tourGuide.avatar || "/placeholder.svg"} alt={tourGuide.name} />
													<AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white font-bold">
														{tourGuide.name
															.split(" ")
															.map((n) => n[0])
															.join("")}
													</AvatarFallback>
												</Avatar>

												<div className="flex-1">
													<div className="flex items-center gap-2 mb-1">
														<h4 className="font-bold text-gray-800">{tourGuide.name}</h4>
														{tourGuide.isVerified && <Shield className="h-4 w-4 text-blue-500" />}
													</div>
													<div className="flex items-center gap-4 text-sm text-gray-600">
														<div className="flex items-center gap-1">
															<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
															<span>
																{tourGuide.rating} ({tourGuide.reviewCount})
															</span>
														</div>
														<span>{tourGuide.experience} năm kinh nghiệm</span>
													</div>
													<div className="flex flex-wrap gap-1 mt-2">
														{tourGuide.specialties.slice(0, 3).map((specialty, idx) => (
															<Badge key={idx} variant="secondary" className="text-xs">
																{specialty}
															</Badge>
														))}
													</div>
												</div>

												<div className="text-right">
													<div className="text-lg font-bold text-green-600">{formatPrice(tourGuide.price)}</div>
													<div className="text-xs text-gray-500">mỗi ngày</div>
												</div>
											</div>
										</div>
									</div>
								)}

								<Separator />

								{/* Pricing Breakdown */}
								<div className="space-y-4">
									<h3 className="text-lg font-semibold flex items-center gap-2">
										<CreditCard className="h-5 w-5 text-green-500" />
										Chi tiết thanh toán
									</h3>

									<div className="bg-gray-50 rounded-xl p-4 space-y-3">
										<div className="flex justify-between text-sm">
											<span>Chi phí chuyến đi</span>
											<span className="font-medium">{formatPrice(pricing.basePrice)}</span>
										</div>

										{tourGuide && (
											<div className="flex justify-between text-sm">
												<span>Hướng dẫn viên ({plan.duration} ngày)</span>
												<span className="font-medium">{formatPrice(pricing.tourGuidePrice)}</span>
											</div>
										)}

										<div className="flex justify-between text-sm">
											<span>Phí dịch vụ</span>
											<span className="font-medium">{formatPrice(pricing.serviceFee)}</span>
										</div>

										<Separator />

										<div className="flex justify-between text-lg font-bold">
											<span>Tổng cộng</span>
											<span className="text-blue-600">{formatPrice(pricing.total)}</span>
										</div>
									</div>
								</div>

								{/* Trust Indicators */}
								<div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
									<div className="flex items-center justify-center gap-6 text-sm">
										<div className="flex items-center gap-2 text-green-700">
											<CheckCircle2 className="h-4 w-4" />
											<span>Hoàn tiền 100%</span>
										</div>
										<div className="flex items-center gap-2 text-blue-700">
											<Shield className="h-4 w-4" />
											<span>Bảo hiểm du lịch</span>
										</div>
										<div className="flex items-center gap-2 text-purple-700">
											<Star className="h-4 w-4" />
											<span>Hỗ trợ 24/7</span>
										</div>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex gap-4 pt-4">
									<Button variant="outline" onClick={onClose} className="flex-1" disabled={isLoading}>
										Quay lại
									</Button>
									<Button
										onClick={onConfirm}
										disabled={isLoading}
										className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
									>
										{isLoading ? (
											<div className="flex items-center gap-2">
												<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
												Đang xử lý...
											</div>
										) : (
											"Xác nhận & Bắt đầu chuyến đi"
										)}
									</Button>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	)
}
