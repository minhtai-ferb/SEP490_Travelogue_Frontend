"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Download, Eye, ArrowLeft, Clock, CheckCircle } from "lucide-react"
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

export default function MyBookingsPage() {
	const router = useRouter()
	const [bookings, setBookings] = useState<BookingData[]>([])
	const [showAppDownload, setShowAppDownload] = useState(false)
	const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null)

	useEffect(() => {
		// Get bookings from localStorage
		const existingBookings = JSON.parse(localStorage.getItem("userBookings") || "[]")
		setBookings(
			existingBookings.sort(
				(a: BookingData, b: BookingData) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			),
		)
	}, [])

	const handlePaymentClick = (booking: BookingData) => {
		setSelectedBooking(booking)
		setShowAppDownload(true)
	}

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "pending_payment":
				return <Badge className="bg-yellow-100 text-yellow-700">Chờ thanh toán</Badge>
			case "paid":
				return <Badge className="bg-green-100 text-green-700">Đã thanh toán</Badge>
			case "cancelled":
				return <Badge className="bg-red-100 text-red-700">Đã hủy</Badge>
			default:
				return <Badge className="bg-gray-100 text-gray-700">Không xác định</Badge>
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="flex items-center gap-4 mb-8"
				>
					<Button variant="outline" onClick={() => router.push("/chuyen-di")}>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Quay lại
					</Button>
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Tour đã đặt</h1>
						<p className="text-gray-600">Quản lý và theo dõi các tour bạn đã đặt</p>
					</div>
				</motion.div>

				{/* Bookings List */}
				<div className="space-y-6">
					{bookings.length === 0 ? (
						<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
							<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<Calendar className="w-12 h-12 text-gray-400" />
							</div>
							<h2 className="text-2xl font-bold text-gray-900 mb-2">Chưa có tour nào</h2>
							<p className="text-gray-600 mb-6">
								Bạn chưa đặt tour nào. Hãy khám phá các tour tuyệt vời của chúng tôi!
							</p>
							<Button onClick={() => router.push("/")}>Khám phá tour</Button>
						</motion.div>
					) : (
						bookings.map((booking, index) => (
							<motion.div
								key={booking.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
							>
								<Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
									<CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
										<div className="flex justify-between items-start">
											<div>
												<CardTitle className="text-xl mb-2">Tour #{booking.id.split("-")[1]}</CardTitle>
												<div className="flex items-center gap-4 text-blue-100">
													<div className="flex items-center gap-1">
														<Clock className="w-4 h-4" />
														<span className="text-sm">
															Đặt ngày {new Date(booking.createdAt).toLocaleDateString("vi-VN")}
														</span>
													</div>
												</div>
											</div>
											{getStatusBadge(booking.status)}
										</div>
									</CardHeader>

									<CardContent className="p-6">
										<div className="grid md:grid-cols-2 gap-6">
											{/* Tour Info */}
											<div className="space-y-4">
												<div>
													<h4 className="font-semibold mb-2 flex items-center gap-2">
														<Calendar className="w-4 h-4 text-blue-500" />
														Thông tin tour
													</h4>
													<div className="bg-blue-50 p-3 rounded-lg space-y-2">
														<div className="flex justify-between">
															<span className="text-gray-600">Ngày khởi hành:</span>
															<span className="font-semibold">
																{new Date(booking.selectedDate).toLocaleDateString("vi-VN")}
															</span>
														</div>
														<div className="flex justify-between">
															<span className="text-gray-600">Số khách:</span>
															<span className="font-semibold">
																{booking.travelers.adults + booking.travelers.children} người
															</span>
														</div>
														{booking.leaderId && (
															<div className="flex items-center gap-2 text-green-600">
																<CheckCircle className="w-4 h-4" />
																<span className="text-sm">Có trưởng đoàn</span>
															</div>
														)}
													</div>
												</div>
												<Button
													variant="outline"
													className="w-full bg-transparent"
													onClick={() => router.push(`/xac-nhan-booking?bookingId=${booking.id}`)}
												>
													<Eye className="w-4 h-4 mr-2" />
													Xem chi tiết
												</Button>

												{/* Customer Info */}
												<div>
													<h4 className="font-semibold mb-2 flex items-center gap-2">
														<Users className="w-4 h-4 text-blue-500" />
														Thông tin khách hàng
													</h4>
													<div className="bg-gray-50 p-3 rounded-lg space-y-1">
														<div className="font-semibold">{booking.customerInfo.fullName}</div>
														<div className="text-sm text-gray-600">{booking.customerInfo.phone}</div>
														<div className="text-sm text-gray-600">{booking.customerInfo.email}</div>
													</div>
												</div>
											</div>

											{/* Price & Actions */}
											<div className="space-y-4">
												<div>
													<h4 className="font-semibold mb-2">Tổng chi phí</h4>
													<div className="text-3xl font-bold text-blue-600">{formatPrice(booking.totalPrice)}</div>
												</div>

												<div className="space-y-3">
													{booking.status === "pending_payment" && (
														<Button
															onClick={() => handlePaymentClick(booking)}
															className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
														>
															Thanh toán ngay
														</Button>
													)}
													{/* <Button
														variant="outline"
														className="w-full bg-transparent"
														onClick={() => router.push(`/xac-nhan-booking?bookingId=${booking.id}`)}
													>
														<Eye className="w-4 h-4 mr-2" />
														Xem chi tiết
													</Button> */}
												</div>

												{booking.specialRequests && (
													<div className="bg-yellow-50 p-3 rounded-lg">
														<div className="text-sm font-medium text-yellow-800 mb-1">Yêu cầu đặc biệt:</div>
														<div className="text-sm text-yellow-700">{booking.specialRequests}</div>
													</div>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))
					)}
				</div>

				{/* App Download Modal */}
				{showAppDownload && selectedBooking && (
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
								<p className="text-gray-600 mb-4">
									Để hoàn tất thanh toán cho tour <strong>#{selectedBooking.id.split("-")[1]}</strong>
									với tổng chi phí <strong>{formatPrice(selectedBooking.totalPrice)}</strong>, vui lòng tải ứng dụng
									trên Google Play Store.
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
