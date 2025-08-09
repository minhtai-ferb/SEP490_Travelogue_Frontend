"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Calendar, Users, Download, Eye, ArrowRight } from "lucide-react"
import { formatPrice } from "@/utils/format"

interface BookingData {
	id: string
	tourId: string
	selectedDate: string
	customerInfo: {
		fullName: string
		email: string
		phone: string
		address: string
	}
	travelers: {
		adults: number
		children: number
	}
	totalPrice: number
	specialRequests: string
	status: string
	createdAt: string
	leaderId?: string
}

export default function BookingConfirmationClient() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const bookingId = searchParams.get("bookingId")

	const [bookingData, setBookingData] = useState<BookingData | null>(null)
	const [showAppDownload, setShowAppDownload] = useState(false)

	useEffect(() => {
		if (bookingId) {
			// Get booking data from localStorage
			const existingBookings = JSON.parse(localStorage.getItem("userBookings") || "[]")
			const booking = existingBookings.find((b: BookingData) => b.id === bookingId)
			setBookingData(booking || null)
		}
	}, [bookingId])

	const handleViewMyBookings = () => {
		router.push("/chuyen-di/ke-hoach-cua-ban")
	}

	const handlePaymentClick = () => {
		setShowAppDownload(true)
	}

	if (!bookingData) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Không tìm thấy thông tin đặt tour</h1>
					<Button onClick={() => router.push("/")}>Về trang chủ</Button>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
			<div className="container mx-auto px-4 py-8">
				{/* Success Header */}
				<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
						<CheckCircle className="w-10 h-10 text-green-600" />
					</div>
					<h1 className="text-4xl font-bold text-gray-900 mb-2">Đặt tour thành công!</h1>
					<p className="text-xl text-gray-600">Cảm ơn bạn đã tin tưởng và lựa chọn dịch vụ của chúng tôi</p>
				</motion.div>

				<div className="max-w-4xl mx-auto">
					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
						<Card className="shadow-xl border-0">
							<CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
								<CardTitle className="text-2xl">Chi tiết đặt tour</CardTitle>
								<div className="flex items-center gap-4 text-green-100">
									<Badge className="bg-white/20 text-white">Mã đặt tour: {bookingData.id}</Badge>
									<Badge className="bg-yellow-500 text-white">Chờ thanh toán</Badge>
								</div>
							</CardHeader>

							<CardContent className="p-8 space-y-6">
								{/* Customer Info */}
								<div>
									<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
										<Users className="w-5 h-5 text-blue-500" />
										Thông tin khách hàng
									</h3>
									<div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
										<div>
											<div className="text-sm text-gray-600">Họ và tên</div>
											<div className="font-semibold">{bookingData.customerInfo.fullName}</div>
										</div>
										<div>
											<div className="text-sm text-gray-600">Số điện thoại</div>
											<div className="font-semibold">{bookingData.customerInfo.phone}</div>
										</div>
										<div>
											<div className="text-sm text-gray-600">Email</div>
											<div className="font-semibold">{bookingData.customerInfo.email}</div>
										</div>
										{bookingData.customerInfo.address && (
											<div>
												<div className="text-sm text-gray-600">Địa chỉ</div>
												<div className="font-semibold">{bookingData.customerInfo.address}</div>
											</div>
										)}
									</div>
								</div>

								<Separator />

								{/* Tour Details */}
								<div>
									<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
										<Calendar className="w-5 h-5 text-blue-500" />
										Thông tin tour
									</h3>
									<div className="bg-blue-50 p-4 rounded-lg space-y-3">
										<div className="flex justify-between">
											<span className="text-gray-600">Ngày khởi hành:</span>
											<span className="font-semibold">
												{new Date(bookingData.selectedDate).toLocaleDateString("vi-VN", {
													weekday: "long",
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-600">Số lượng khách:</span>
											<span className="font-semibold">
												{bookingData.travelers.adults} người lớn
												{bookingData.travelers.children > 0 && `, ${bookingData.travelers.children} trẻ em`}
											</span>
										</div>
										{bookingData.leaderId && (
											<div className="flex justify-between">
												<span className="text-gray-600">Trưởng đoàn:</span>
												<Badge className="bg-green-100 text-green-700">Có trưởng đoàn</Badge>
											</div>
										)}
									</div>
								</div>

								<Separator />

								{/* Price Breakdown */}
								<div>
									<h3 className="text-lg font-semibold mb-4">Chi tiết giá</h3>
									<div className="space-y-2">
										<div className="flex justify-between">
											<span>Người lớn x{bookingData.travelers.adults}</span>
											<span>
												{formatPrice(
													(bookingData.totalPrice /
														(bookingData.travelers.adults + bookingData.travelers.children * 0.7)) *
													bookingData.travelers.adults,
												)}
											</span>
										</div>
										{bookingData.travelers.children > 0 && (
											<div className="flex justify-between">
												<span>Trẻ em x{bookingData.travelers.children}</span>
												<span>
													{formatPrice(
														(bookingData.totalPrice /
															(bookingData.travelers.adults + bookingData.travelers.children * 0.7)) *
														bookingData.travelers.children *
														0.7,
													)}
												</span>
											</div>
										)}
										<Separator />
										<div className="flex justify-between text-xl font-bold text-blue-600">
											<span>Tổng cộng:</span>
											<span>{formatPrice(bookingData.totalPrice)}</span>
										</div>
									</div>
								</div>

								{/* Special Requests */}
								{bookingData.specialRequests && (
									<>
										<Separator />
										<div>
											<h3 className="text-lg font-semibold mb-2">Yêu cầu đặc biệt</h3>
											<div className="bg-gray-50 p-4 rounded-lg">
												<p>{bookingData.specialRequests}</p>
											</div>
										</div>
									</>
								)}

								{/* Action Buttons */}
								<div className="flex flex-col sm:flex-row gap-4 pt-6">
									<Button onClick={handleViewMyBookings} variant="outline" className="flex-1 bg-transparent">
										<Eye className="w-4 h-4 mr-2" />
										Xem tour đã đặt
									</Button>
									<Button
										onClick={handlePaymentClick}
										className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
									>
										Thanh toán ngay
										<ArrowRight className="w-4 h-4 ml-2" />
									</Button>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>

				{/* App Download Modal */}
				{showAppDownload && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
						onClick={() => setShowAppDownload(false)}
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							className="bg-white rounded-2xl p-8 max-w-md w-full"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="text-center">
								<div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
									<Download className="w-8 h-8 text-white" />
								</div>
								<h3 className="text-2xl font-bold mb-4">Tải ứng dụng để thanh toán</h3>
								<p className="text-gray-600 mb-6">
									Để hoàn tất thanh toán và quản lý tour của bạn, vui lòng tải ứng dụng trên Google Play Store.
								</p>
								<div className="space-y-3">
									<Button
										className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
										onClick={() => window.open("https://play.google.com/store", "_blank")}
									>
										<Download className="w-4 h-4 mr-2" />
										Tải ứng dụng ngay
									</Button>
									<Button variant="outline" className="w-full bg-transparent" onClick={() => setShowAppDownload(false)}>
										Để sau
									</Button>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</div>
		</div>
	)
}
