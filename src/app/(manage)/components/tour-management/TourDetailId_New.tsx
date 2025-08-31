'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { TourDetail } from '@/types/Tour'
import { formatDate } from 'date-fns'
import {
	Calendar,
	Clock,
	DollarSign,
	MapPin,
	User,
	Mail,
	Star,
	Ticket,
	Route,
	Users,
	Camera,
	Utensils,
	ShoppingBag,
	Coffee,
	Gamepad2,
	Activity,
	Wrench,
	Timer,
	Navigation
} from 'lucide-react'
import React from 'react'

function TourDetailId({ tour }: { tour: TourDetail }) {

	// Safe access for extended fields not in TourDetail type
	const startLoc = (tour as any)?.startLocation
	const endLoc = (tour as any)?.endLocation

	// Activity type icons mapping
	const getActivityIcon = (activityType: number) => {
		switch (activityType) {
			case 1: return <Camera className="h-4 w-4" />
			case 2: return <Utensils className="h-4 w-4" />
			case 3: return <ShoppingBag className="h-4 w-4" />
			case 4: return <Coffee className="h-4 w-4" />
			case 5: return <Gamepad2 className="h-4 w-4" />
			case 6: return <Activity className="h-4 w-4" />
			default: return <MapPin className="h-4 w-4" />
		}
	}

	// Activity type colors
	const getActivityColor = (activityType: number) => {
		switch (activityType) {
			case 1: return "bg-blue-100 text-blue-800 border-blue-200"
			case 2: return "bg-orange-100 text-orange-800 border-orange-200"
			case 3: return "bg-purple-100 text-purple-800 border-purple-200"
			case 4: return "bg-green-100 text-green-800 border-green-200"
			case 5: return "bg-pink-100 text-pink-800 border-pink-200"
			case 6: return "bg-red-100 text-red-800 border-red-200"
			default: return "bg-gray-100 text-gray-800 border-gray-200"
		}
	}

	return (
		<div className="max-w-7xl mx-auto p-6 space-y-8">
			{/* Hero Section */}
			<div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
				<div className="absolute inset-0 bg-black/20" />
				<div className="relative p-8">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
						<div className="flex-1">
							<div className="flex items-center gap-3 mb-4">
								<Badge variant="secondary" className="bg-white/20 text-white border-white/30">
									{tour.tourTypeText}
								</Badge>
								<Badge variant="secondary" className="bg-white/20 text-white border-white/30">
									{tour.totalDaysText}
								</Badge>
							</div>
							<h1 className="text-4xl font-bold mb-3">{tour.name}</h1>
							<p className="text-xl text-white/90 mb-4">{tour.description}</p>
							<div className="flex items-center gap-6 text-white/80">
								<div className="flex items-center gap-2">
									<DollarSign className="h-5 w-5" />
									<span className="font-semibold">{tour.finalPrice.toLocaleString('vi-VN')} VNĐ</span>
								</div>
								<div className="flex items-center gap-2">
									<Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
									<span>{tour.averageRating || 'Chưa có đánh giá'}</span>
								</div>
								<div className="flex items-center gap-2">
									<User className="h-5 w-5" />
									<span>{tour.totalReviews} đánh giá</span>
								</div>
							</div>
						</div>

						{/* Tour Images */}
						{tour.medias && tour.medias.length > 0 && (
							<div className="lg:w-80">
								<div className="relative rounded-lg overflow-hidden shadow-2xl">
									<img
										src={tour.medias.find(m => m.isThumbnail)?.mediaUrl || tour.medias[0].mediaUrl}
										alt={tour.name}
										className="w-full h-48 object-cover"
									/>
									{tour.medias.length > 1 && (
										<div className="absolute bottom-2 right-2">
											<Badge className="bg-black/50 text-white">
												+{tour.medias.length - 1} ảnh
											</Badge>
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
				{/* Main Content */}
				<div className="xl:col-span-3 space-y-8">
					{/* Tour Content */}
					<Card className="shadow-sm">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<div className="w-2 h-2 bg-blue-500 rounded-full" />
								Nội Dung Chuyến Đi
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="prose max-w-none text-gray-700 leading-relaxed">
								{tour.content || 'Chưa có mô tả chi tiết'}
							</div>
						</CardContent>
					</Card>

					{/* Daily Itinerary */}
					<Card className="shadow-sm">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Route className="h-5 w-5 text-blue-500" />
								Lịch Trình Chi Tiết
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Accordion type="single" collapsible className="space-y-4">
								{tour.days.map((day, dayIndex) => (
									<AccordionItem key={dayIndex} value={`day-${day.dayNumber}`} className="border rounded-lg">
										<AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
											<div className="flex items-center gap-4">
												<div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
													{day.dayNumber}
												</div>
												<div className="text-left">
													<h3 className="font-semibold">Ngày {day.dayNumber}</h3>
													<p className="text-sm text-gray-600">{day.activities.length} hoạt động</p>
												</div>
											</div>
										</AccordionTrigger>
										<AccordionContent className="px-6 pb-6">
											<div className="space-y-4">
												{day.activities.map((activity, activityIndex) => {
													// Safe access to extended properties
													const activityExt = activity as any
													return (
														<div key={activityIndex} className="relative">
															{/* Timeline connector */}
															{activityIndex < day.activities.length - 1 && (
																<div className="absolute left-6 top-20 w-0.5 h-16 bg-gray-200" />
															)}

															{/* Activity Card */}
															<div className="flex gap-4">
																{/* Timeline dot */}
																<div className="relative">
																	<div className="w-12 h-12 bg-white border-4 border-blue-200 rounded-full flex items-center justify-center shadow-sm">
																		{getActivityIcon(activityExt.activityType || 0)}
																	</div>
																</div>

																{/* Activity Content */}
																<div className="flex-1">
																	<div className={`p-6 rounded-lg border-2 ${activityExt.workshop
																			? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-md'
																			: 'bg-white border-gray-200 shadow-sm'
																		}`}>
																		{/* Activity Header */}
																		<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
																			<div className="flex-1">
																				<div className="flex items-center gap-3 mb-2">
																					<h4 className="text-xl font-semibold text-gray-900">
																						{activity.name}
																					</h4>
																					{activityExt.workshop && (
																						<Badge className="bg-purple-100 text-purple-800 border-purple-300">
																							<Wrench className="h-3 w-3 mr-1" />
																							Workshop
																						</Badge>
																					)}
																					<Badge className={`border ${getActivityColor(activityExt.activityType || 0)}`}>
																						{getActivityIcon(activityExt.activityType || 0)}
																						<span className="ml-1">{activityExt.activityTypeText || 'Khác'}</span>
																					</Badge>
																				</div>
																				<p className="text-gray-600 mb-3">{activity.description}</p>
																			</div>

																			{/* Activity Image */}
																			{activity.imageUrl && (
																				<div className="w-32 h-24 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
																					<img
																						src={activity.imageUrl}
																						alt={activity.name}
																						className="w-full h-full object-cover"
																					/>
																				</div>
																			)}
																		</div>

																		{/* Activity Details Grid */}
																		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
																			{/* Time */}
																			<div className="flex items-center gap-2 p-3 bg-white/50 rounded-lg">
																				<Clock className="h-4 w-4 text-green-600" />
																				<div>
																					<p className="text-xs text-gray-500 uppercase tracking-wide">Thời gian</p>
																					<p className="font-semibold">{activity.startTimeFormatted} - {activity.endTimeFormatted}</p>
																					<p className="text-xs text-gray-600">{activity.duration}</p>
																				</div>
																			</div>

																			{/* Location */}
																			<div className="flex items-center gap-2 p-3 bg-white/50 rounded-lg">
																				<MapPin className="h-4 w-4 text-red-500" />
																				<div>
																					<p className="text-xs text-gray-500 uppercase tracking-wide">Địa điểm</p>
																					<p className="font-semibold text-sm">{activity.address}</p>
																				</div>
																			</div>

																			{/* Travel Info */}
																			{activityExt.travelTimeFromPrev > 0 && (
																				<div className="flex items-center gap-2 p-3 bg-white/50 rounded-lg">
																					<Navigation className="h-4 w-4 text-blue-500" />
																					<div>
																						<p className="text-xs text-gray-500 uppercase tracking-wide">Di chuyển</p>
																						<p className="font-semibold">{activityExt.travelTimeFromPrev} phút</p>
																						<p className="text-xs text-gray-600">{activityExt.distanceFromPrev} km</p>
																					</div>
																				</div>
																			)}

																			{/* Workshop specific info */}
																			{activityExt.workshop && (
																				<div className="flex items-center gap-2 p-3 bg-purple-100/50 rounded-lg">
																					<Users className="h-4 w-4 text-purple-600" />
																					<div>
																						<p className="text-xs text-purple-600 uppercase tracking-wide font-semibold">Trải nghiệm</p>
																						<p className="font-semibold text-purple-800">Làng nghề</p>
																					</div>
																				</div>
																			)}
																		</div>

																		{/* Notes */}
																		{activity.notes && (
																			<div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
																				<p className="text-sm text-yellow-800">
																					<strong>Ghi chú:</strong> {activity.notes}
																				</p>
																			</div>
																		)}
																	</div>
																</div>
															</div>
														</div>
													)
												})}
											</div>
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</CardContent>
					</Card>
				</div>

				{/* Sidebar */}
				<div className="xl:col-span-1 space-y-6">
					{/* Quick Info */}
					<Card className="sticky top-6 shadow-md">
						<CardHeader>
							<CardTitle className="text-lg">Thông Tin Tour</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* Pricing */}
							<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
								<div className="flex items-center justify-between">
									<span className="text-green-700 font-medium">Người lớn:</span>
									<span className="text-lg font-bold text-green-800">
										{tour.adultPrice.toLocaleString('vi-VN')} VNĐ
									</span>
								</div>
								<div className="flex items-center justify-between mt-2">
									<span className="text-green-700 font-medium">Trẻ em:</span>
									<span className="text-lg font-bold text-green-800">
										{tour.childrenPrice.toLocaleString('vi-VN')} VNĐ
									</span>
								</div>
							</div>

							{/* Transport & Pickup */}
							<div className="space-y-3">
								{(tour as any)?.transportType && (
									<div className="flex items-center gap-2">
										<span className="text-sm text-gray-600">Phương tiện:</span>
										<Badge variant="outline">{(tour as any).transportType}</Badge>
									</div>
								)}
								{(tour as any)?.pickupAddress && (
									<div>
										<p className="text-sm text-gray-600 mb-1">Điểm đón:</p>
										<p className="text-sm font-medium">{(tour as any).pickupAddress}</p>
									</div>
								)}
								{(tour as any)?.stayInfo && (
									<div>
										<p className="text-sm text-gray-600 mb-1">Lưu trú:</p>
										<p className="text-sm font-medium">{(tour as any).stayInfo}</p>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Schedules */}
					{tour.schedules && tour.schedules.length > 0 && (
						<Card className="shadow-md">
							<CardHeader>
								<CardTitle className="text-lg flex items-center gap-2">
									<Calendar className="h-5 w-5" />
									Lịch Khởi Hành
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								{tour.schedules.map((schedule, index) => (
									<div key={index} className="p-3 border border-gray-200 rounded-lg">
										<div className="flex items-center justify-between mb-2">
											<span className="font-semibold">
												{formatDate(new Date(schedule.startTime), 'dd/MM/yyyy')}
											</span>
											<Badge variant="outline">
												{schedule.maxParticipant - schedule.currentBooked} chỗ trống
											</Badge>
										</div>
										<div className="text-sm text-gray-600">
											<p>HDV: {(schedule.tourGuide as any)?.userName || 'Chưa phân công'}</p>
											<p>Đã đặt: {schedule.currentBooked}/{schedule.maxParticipant}</p>
										</div>
									</div>
								))}
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	)
}

export default TourDetailId
