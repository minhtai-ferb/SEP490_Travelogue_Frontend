"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, Users, Star, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useTour } from "@/services/tour"
import type { TourDetail, TourSchedule } from "@/types/Tour"
import { formatPrice } from "@/utils/format"
import TourCalendar from "@/components/page/trip-planner-detail/tour/TourCalendar"
import TourItinerary from "@/components/page/trip-planner-detail/tour/TourItinerary"
import TourBookingCard from "@/components/page/trip-planner-detail/tour/TourBookingCard"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

interface TourDetailClientProps {
	tourId: string
}

export default function TourDetailClient({ tourId }: TourDetailClientProps) {
	const [tour, setTour] = useState<TourDetail | null>(null)
	const [loading, setLoading] = useState(true)
	const [selectedSchedule, setSelectedSchedule] = useState<TourSchedule | null>(null)
	const { getTourDetail } = useTour()

	useEffect(() => {
		const fetchTour = async () => {
			try {
				setLoading(true)
				const response = await getTourDetail(tourId)
				if (response) {
					setTour(response)
					// Auto select first available schedule
					const availableSchedule = response?.schedules.find((s: any) => s.currentBooked < s.maxParticipant)
					if (availableSchedule) {
						setSelectedSchedule(availableSchedule)
					}
				}
			} catch (error) {
				console.error("Error fetching tour:", error)
			} finally {
				setLoading(false)
			}
		}

		fetchTour()
	}, [tourId, getTourDetail])

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
			</div>
		)
	}

	if (!tour) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-900 mb-2">Chuyến tham quan không tìm thấy</h2>
					<p className="text-gray-600">Xin lỗi, chúng tôi không thể tìm thấy chuyến tham quan này.</p>
				</div>
			</div>
		)
	}

	const availableSpots = selectedSchedule ? selectedSchedule.maxParticipant - selectedSchedule.currentBooked : 0

	const bookingProgress = selectedSchedule
		? (selectedSchedule.currentBooked / selectedSchedule.maxParticipant) * 100
		: 0

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero Section */}
			<div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
				<div className="absolute inset-0 bg-black/20"></div>
				<div className="absolute top-4 left-4 z-10">
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink href="/" className="text-white">Trang chủ</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="text-white" />
							<BreadcrumbItem>
								<BreadcrumbLink href="/chuyen-di" className="text-white">Chuyến đi</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="text-white" />
							<BreadcrumbItem>
								<BreadcrumbLink href="#" className="text-white">{tour.name}</BreadcrumbLink>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						<div className="lg:col-span-2">
							<div className="flex items-center gap-2 mb-4">
								<Badge variant="secondary" className="bg-white/20 text-white border-white/30">
									{tour.tourTypeText}
								</Badge>
								<Badge variant="secondary" className="bg-white/20 text-white border-white/30">
									{tour.totalDaysText}
								</Badge>
							</div>

							<h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{tour.name}</h1>

							<p className="text-xl text-blue-100 mb-6 leading-relaxed">{tour.description}</p>

							<div className="flex flex-wrap items-center gap-6 text-blue-100">
								<div className="flex items-center gap-2">
									<Clock className="h-5 w-5" />
									<span>{tour.totalDaysText}</span>
								</div>
								<div className="flex items-center gap-2">
									<Users className="h-5 w-5" />
									<span>{tour.schedules.length} lịch khởi hành</span>
								</div>
								<div className="flex items-center gap-2">
									<Star className="h-5 w-5 fill-current" />
									<span>{tour?.averageRating || 0} ({tour?.totalReviews || 0} đánh giá)</span>
								</div>
							</div>
						</div>

						<div className="lg:col-span-1">
							<TourBookingCard tour={tour} selectedSchedule={selectedSchedule} onScheduleSelect={setSelectedSchedule} />
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Column - Tour Details */}
					<div className="lg:col-span-2 space-y-8">
						{/* Tour Overview */}
						<Card>
							<CardHeader>
								<CardTitle className="text-2xl text-gray-900">Tổng quan tour</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="prose prose-gray max-w-none">
									<p className="text-gray-700 leading-relaxed">{tour.content}</p>
								</div>

								<Separator className="my-6" />

								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									<div className="text-center p-4 bg-blue-50 rounded-lg">
										<Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
										<div className="font-semibold text-gray-900">{tour.totalDays}</div>
										<div className="text-sm text-gray-600">Ngày</div>
									</div>
									<div className="text-center p-4 bg-blue-50 rounded-lg">
										<MapPin className="h-8 w-8 text-blue-500 mx-auto mb-2" />
										<div className="font-semibold text-gray-900">{tour.days.length}</div>
										<div className="text-sm text-gray-600">Điểm đến</div>
									</div>
									<div className="text-center p-4 bg-blue-50 rounded-lg">
										<Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
										<div className="font-semibold text-gray-900">{selectedSchedule?.maxParticipant || 0}</div>
										<div className="text-sm text-gray-600">Khách tối đa</div>
									</div>
									<div className="text-center p-4 bg-blue-50 rounded-lg">
										<Star className="h-8 w-8 text-blue-500 mx-auto mb-2" />
										<div className="font-semibold text-gray-900">{tour?.averageRating || 0}</div>
										<div className="text-sm text-gray-600">Đánh giá</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Tour Itinerary */}
						<Card>
							<CardHeader>
								<CardTitle className="text-2xl text-gray-900">Lịch trình chi tiết</CardTitle>
							</CardHeader>
							<CardContent>
								<TourItinerary days={tour.days} />
							</CardContent>
						</Card>

						{/* Start / End Locations */}
						{(tour.startLocation || tour.endLocation) && (
							<Card>
								<CardHeader>
									<CardTitle className="text-2xl text-gray-900">Điểm bắt đầu & kết thúc</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{tour.startLocation && (
											<div className="flex gap-4">
												<img
													src={tour.startLocation.imageUrl}
													alt={tour.startLocation.name}
													className="w-24 h-24 rounded object-cover"
												/>
												<div>
													<div className="text-sm text-gray-600 mb-1">Điểm bắt đầu</div>
													<div className="font-semibold text-gray-900">{tour.startLocation.name}</div>
													<div className="text-sm text-gray-700">{tour.startLocation.address}</div>
													<div className="text-sm text-gray-600 mt-1">
														<Clock className="inline h-4 w-4 mr-1" />
														{tour.startLocation.startTimeFormatted} - {tour.startLocation.endTimeFormatted}
													</div>
												</div>
											</div>
										)}

										{tour.endLocation && (
											<div className="flex gap-4">
												<img
													src={tour.endLocation.imageUrl}
													alt={tour.endLocation.name}
													className="w-24 h-24 rounded object-cover"
												/>
												<div>
													<div className="text-sm text-gray-600 mb-1">Điểm kết thúc</div>
													<div className="font-semibold text-gray-900">{tour.endLocation.name}</div>
													<div className="text-sm text-gray-700">{tour.endLocation.address}</div>
													<div className="text-sm text-gray-600 mt-1">
														<Clock className="inline h-4 w-4 mr-1" />
														{tour.endLocation.startTimeFormatted} - {tour.endLocation.endTimeFormatted}
													</div>
												</div>
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						)}

						{/* Calendar Selection */}
						<Card>
							<CardHeader>
								<CardTitle className="text-2xl text-gray-900">Chọn ngày khởi hành</CardTitle>
							</CardHeader>
							<CardContent>
								<TourCalendar
									schedules={tour?.schedules}
									selectedSchedule={selectedSchedule}
									onScheduleSelect={setSelectedSchedule}
								/>
							</CardContent>
						</Card>
					</div>

					{/* Right Column - Booking Info */}
					<div className="lg:col-span-1 space-y-6">
						{/* Booking Status */}
						{selectedSchedule && (
							<Card>
								<CardHeader>
									<CardTitle className="text-lg text-gray-900">Tình trạng đặt tour</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex justify-between items-center">
										<span className="text-gray-600">Đã đặt</span>
										<span className="font-semibold text-gray-900">
											{selectedSchedule.currentBooked}/{selectedSchedule.maxParticipant}
										</span>
									</div>

									<Progress value={bookingProgress} className="h-2" />

									<div className="flex justify-between items-center">
										<span className="text-gray-600">Còn lại</span>
										<span className="font-semibold text-green-600">{availableSpots} chỗ</span>
									</div>

									{availableSpots <= 5 && availableSpots > 0 && (
										<div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
											<div className="flex items-center gap-2 text-orange-700">
												<Clock className="h-4 w-4" />
												<span className="text-sm font-medium">Chỉ còn {availableSpots} chỗ trống!</span>
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						)}

						{/* Price Breakdown */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg text-gray-900">Bảng giá</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex justify-between items-center">
									<span className="text-gray-600">Người lớn</span>
									<span className="font-semibold text-gray-900">
										{formatPrice(selectedSchedule?.adultPrice || tour.adultPrice)}
									</span>
								</div>

								<div className="flex justify-between items-center">
									<span className="text-gray-600">Trẻ em</span>
									<span className="font-semibold text-gray-900">
										{formatPrice(selectedSchedule?.childrenPrice || tour.childrenPrice)}
									</span>
								</div>

								<Separator />

								<div className="space-y-2">
									<div className="flex items-center gap-2 text-green-600">
										<CheckCircle className="h-4 w-4" />
										<span className="text-sm">Bao gồm bữa ăn</span>
									</div>
									<div className="flex items-center gap-2 text-green-600">
										<CheckCircle className="h-4 w-4" />
										<span className="text-sm">Xe đưa đón</span>
									</div>
									<div className="flex items-center gap-2 text-green-600">
										<CheckCircle className="h-4 w-4" />
										<span className="text-sm">Hướng dẫn viên</span>
									</div>
									<div className="flex items-center gap-2 text-green-600">
										<CheckCircle className="h-4 w-4" />
										<span className="text-sm">Bảo hiểm du lịch</span>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Contact Info */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg text-gray-900">Hỗ trợ khách hàng</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="text-center">
									<div className="text-2xl font-bold text-blue-500 mb-1">1900 1234</div>
									<div className="text-sm text-gray-600">Hotline 24/7</div>
								</div>

								<Button variant="outline" className="w-full bg-transparent">
									Chat với tư vấn viên
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}
