"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { User, Users, Calendar, Plus, Minus, ArrowLeft, CheckCircle } from "lucide-react"
import { formatPrice } from "@/utils/format"

interface BookingFormData {
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
	specialRequests: string
}

export default function BookingFormPage() {
	const router = useRouter()
	const searchParams = useSearchParams()

	// Get tour data from URL params
	const tourId = searchParams.get("tourId")
	const selectedDate = searchParams.get("selectedDate")
	const price = Number.parseInt(searchParams.get("price") || "0")
	const spotsLeft = Number.parseInt(searchParams.get("spotsLeft") || "0")

	const [formData, setFormData] = useState<BookingFormData>({
		customerInfo: {
			fullName: "",
			email: "",
			phone: "",
			address: "",
		},
		travelers: {
			adults: 2,
			children: 0,
		},
		specialRequests: "",
	})

	const [isSubmitting, setIsSubmitting] = useState(false)

	const totalTravelers = formData.travelers.adults + formData.travelers.children
	const totalPrice = price * formData.travelers.adults + price * 0.7 * formData.travelers.children

	const updateTravelers = (type: "adults" | "children", action: "increase" | "decrease") => {
		setFormData((prev) => ({
			...prev,
			travelers: {
				...prev.travelers,
				[type]:
					action === "increase"
						? Math.min(
							prev.travelers[type] + 1,
							spotsLeft - (type === "adults" ? prev.travelers.children : prev.travelers.adults),
						)
						: Math.max(prev.travelers[type] - 1, type === "adults" ? 1 : 0),
			},
		}))
	}

	const handleInputChange = (field: keyof BookingFormData["customerInfo"], value: string) => {
		setFormData((prev) => ({
			...prev,
			customerInfo: {
				...prev.customerInfo,
				[field]: value,
			},
		}))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 2000))

		// Create booking data
		const bookingData = {
			id: `booking-${Date.now()}`,
			tourId,
			selectedDate,
			customerInfo: formData.customerInfo,
			travelers: formData.travelers,
			totalPrice,
			specialRequests: formData.specialRequests,
			status: "pending_payment",
			createdAt: new Date().toISOString(),
		}

		// Save to localStorage (in real app, save to database)
		const existingBookings = JSON.parse(localStorage.getItem("userBookings") || "[]")
		existingBookings.push(bookingData)
		localStorage.setItem("userBookings", JSON.stringify(existingBookings))

		setIsSubmitting(false)

		// Navigate to booking confirmation
		router.push(`/xac-nhan-booking?bookingId=${bookingData.id}`)
	}

	const isFormValid = () => {
		return (
			formData.customerInfo.fullName.trim() !== "" &&
			formData.customerInfo.email.trim() !== "" &&
			formData.customerInfo.phone.trim() !== "" &&
			formData.travelers.adults > 0 &&
			totalTravelers <= spotsLeft
		)
	}

	if (!tourId || !selectedDate) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Thông tin không hợp lệ</h1>
					<Button onClick={() => router.push("/chuyen-di")}>Quay lại</Button>
				</div>
			</div>
		)
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
					<Button variant="outline" onClick={() => router.back()}>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Quay lại
					</Button>
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Thông tin đặt tour</h1>
						<p className="text-gray-600">Vui lòng điền đầy đủ thông tin để hoàn tất đặt tour</p>
					</div>
				</motion.div>

				<div className="grid lg:grid-cols-3 gap-8">
					{/* Main Form */}
					<div className="lg:col-span-2">
						<motion.form
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							onSubmit={handleSubmit}
							className="space-y-6"
						>
							{/* Customer Information */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<User className="w-5 h-5" />
										Thông tin khách hàng
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid md:grid-cols-2 gap-4">
										<div>
											<Label htmlFor="fullName">Họ và tên *</Label>
											<Input
												id="fullName"
												value={formData.customerInfo.fullName}
												onChange={(e) => handleInputChange("fullName", e.target.value)}
												placeholder="Nhập họ và tên"
												required
											/>
										</div>
										<div>
											<Label htmlFor="phone">Số điện thoại *</Label>
											<Input
												id="phone"
												type="tel"
												value={formData.customerInfo.phone}
												onChange={(e) => handleInputChange("phone", e.target.value)}
												placeholder="Nhập số điện thoại"
												required
											/>
										</div>
									</div>
									<div>
										<Label htmlFor="email">Email *</Label>
										<Input
											id="email"
											type="email"
											value={formData.customerInfo.email}
											onChange={(e) => handleInputChange("email", e.target.value)}
											placeholder="Nhập địa chỉ email"
											required
										/>
									</div>
									<div>
										<Label htmlFor="address">Địa chỉ</Label>
										<Input
											id="address"
											value={formData.customerInfo.address}
											onChange={(e) => handleInputChange("address", e.target.value)}
											placeholder="Nhập địa chỉ"
										/>
									</div>
								</CardContent>
							</Card>

							{/* Travelers Information */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Users className="w-5 h-5" />
										Số lượng khách
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									{/* Adults */}
									<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
										<div>
											<div className="font-semibold">Người lớn</div>
											<div className="text-sm text-gray-600">Từ 12 tuổi trở lên</div>
											<div className="text-sm font-medium text-blue-600">{formatPrice(price)}/người</div>
										</div>
										<div className="flex items-center gap-3">
											<Button
												type="button"
												variant="outline"
												size="icon"
												onClick={() => updateTravelers("adults", "decrease")}
												disabled={formData.travelers.adults <= 1}
											>
												<Minus className="w-4 h-4" />
											</Button>
											<span className="w-8 text-center font-semibold">{formData.travelers.adults}</span>
											<Button
												type="button"
												variant="outline"
												size="icon"
												onClick={() => updateTravelers("adults", "increase")}
												disabled={totalTravelers >= spotsLeft}
											>
												<Plus className="w-4 h-4" />
											</Button>
										</div>
									</div>

									{/* Children */}
									<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
										<div>
											<div className="font-semibold">Trẻ em</div>
											<div className="text-sm text-gray-600">Từ 2-11 tuổi</div>
											<div className="text-sm font-medium text-blue-600">{formatPrice(price * 0.7)}/trẻ</div>
										</div>
										<div className="flex items-center gap-3">
											<Button
												type="button"
												variant="outline"
												size="icon"
												onClick={() => updateTravelers("children", "decrease")}
												disabled={formData.travelers.children <= 0}
											>
												<Minus className="w-4 h-4" />
											</Button>
											<span className="w-8 text-center font-semibold">{formData.travelers.children}</span>
											<Button
												type="button"
												variant="outline"
												size="icon"
												onClick={() => updateTravelers("children", "increase")}
												disabled={totalTravelers >= spotsLeft}
											>
												<Plus className="w-4 h-4" />
											</Button>
										</div>
									</div>

									<div className="text-sm text-gray-600">Còn lại: {spotsLeft - totalTravelers} chỗ</div>
								</CardContent>
							</Card>

							{/* Special Requests */}
							<Card>
								<CardHeader>
									<CardTitle>Yêu cầu đặc biệt</CardTitle>
								</CardHeader>
								<CardContent>
									<textarea
										className="w-full p-3 border border-gray-300 rounded-lg resize-none"
										rows={4}
										placeholder="Nhập yêu cầu đặc biệt (nếu có)..."
										value={formData.specialRequests}
										onChange={(e) => setFormData((prev) => ({ ...prev, specialRequests: e.target.value }))}
									/>
								</CardContent>
							</Card>

							{/* Submit Button */}
							<Button type="submit" size="lg" className="w-full" disabled={!isFormValid() || isSubmitting}>
								{isSubmitting ? (
									<>
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
										Đang xử lý...
									</>
								) : (
									<>
										<CheckCircle className="w-4 h-4 mr-2" />
										Xác nhận đặt tour
									</>
								)}
							</Button>
						</motion.form>
					</div>

					{/* Booking Summary Sidebar */}
					<div className="lg:col-span-1">
						<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="sticky top-4">
							<Card>
								<CardHeader>
									<CardTitle>Tóm tắt đặt tour</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{/* Tour Date */}
									<div className="flex items-center gap-2 text-sm">
										<Calendar className="w-4 h-4 text-blue-500" />
										<span>Ngày khởi hành:</span>
									</div>
									<div className="font-semibold">
										{selectedDate
											? new Date(selectedDate).toLocaleDateString("vi-VN", {
												weekday: "long",
												year: "numeric",
												month: "long",
												day: "numeric",
											})
											: ""}
									</div>

									<Separator />

									{/* Travelers */}
									<div>
										<div className="text-sm text-gray-600 mb-2">Số lượng khách:</div>
										<div className="space-y-1">
											<div className="flex justify-between">
												<span>Người lớn x{formData.travelers.adults}</span>
												<span>{formatPrice(price * formData.travelers.adults)}</span>
											</div>
											{formData.travelers.children > 0 && (
												<div className="flex justify-between">
													<span>Trẻ em x{formData.travelers.children}</span>
													<span>{formatPrice(price * 0.7 * formData.travelers.children)}</span>
												</div>
											)}
										</div>
									</div>

									<Separator />

									{/* Total */}
									<div className="flex justify-between items-center text-lg font-bold">
										<span>Tổng cộng:</span>
										<span className="text-blue-600">{formatPrice(totalPrice)}</span>
									</div>

									<div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded">
										<strong>Lưu ý:</strong> Đây chỉ là bước đặt chỗ. Để hoàn tất thanh toán, vui lòng tải ứng dụng trên
										Google Play.
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	)
}
