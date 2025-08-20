import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { TourDetail } from '@/types/Tour'
import { formatDate } from 'date-fns'
import { Calendar, Clock, DollarSign, MapPin } from 'lucide-react'
import React from 'react'

function TourDetailId({ tour }: { tour: TourDetail }) {

	// safe access for extended fields not in TourDetail type
	const startLoc = (tour as any)?.startLocation
	const endLoc = (tour as any)?.endLocation
	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			{/* Main Content */}
			<div className="lg:col-span-2 space-y-6">
				{/* Basic Information */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<div className="w-2 h-2 bg-blue-500 rounded-full" />
							Thông Tin Cơ Bản
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Start/End Locations */}
						{(startLoc || endLoc) && (
							<div className="mb-6">
								{/* Transport type */}
								{(tour as any)?.transportType && (
									<div className="flex items-center gap-2 mb-3">
										<span className="text-sm text-gray-600">Phương tiện di chuyển:</span>
										<Badge variant="outline" className="bg-blue-50 text-blue-700 text-lg border-blue-200">
											{(tour as any).transportType}
										</Badge>
									</div>
								)}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{/* Start Location */}
									{startLoc && (
										<div className="border rounded-lg p-4">
											<h2 className="text-lg font-semibold mb-3">Điểm bắt đầu</h2>
											{startLoc.imageUrl && (
												<img src={startLoc.imageUrl} alt={startLoc.name} className="w-full h-40 object-cover rounded-md mb-3" />
											)}
											<div className="space-y-2">
												<p className="font-medium">{startLoc.name}</p>
												{startLoc.address && (
													<p className="text-sm text-gray-600 flex items-center gap-1"><MapPin className="w-4 h-4" />{startLoc.address}</p>
												)}
												<div className="text-sm text-gray-600 flex items-center gap-2">
													<Clock className="w-4 h-4" />
													<span>{startLoc.startTimeFormatted || startLoc.startTime} - {startLoc.endTimeFormatted || startLoc.endTime}</span>
													{startLoc.duration && <span className="ml-2">({startLoc.duration})</span>}
												</div>
											</div>
										</div>
									)}

									{/* End Location */}
									{endLoc && (
										<div className="border rounded-lg p-4">
											<h2 className="text-lg font-semibold mb-3">Điểm kết thúc</h2>
											{endLoc.imageUrl && (
												<img src={endLoc.imageUrl} alt={endLoc.name} className="w-full h-40 object-cover rounded-md mb-3" />
											)}
											<div className="space-y-2">
												<p className="font-medium">{endLoc.name}</p>
												{endLoc.address && (
													<p className="text-sm text-gray-600 flex items-center gap-1"><MapPin className="w-4 h-4" />{endLoc.address}</p>
												)}
												<div className="text-sm text-gray-600 flex items-center gap-2">
													<Clock className="w-4 h-4" />
													<span>{endLoc.startTimeFormatted || endLoc.startTime} - {endLoc.endTimeFormatted || endLoc.endTime}</span>
													{endLoc.duration && <span className="ml-2">({endLoc.duration})</span>}
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						)}

						<Separator />
						<div>
							<h3 className="font-semibold text-gray-900">Mô tả</h3>
							<p className="text-gray-600 mt-1">{tour.description}</p>
						</div>
						{tour.content && (
							<div>
								<h3 className="font-semibold text-gray-900">Nội dung chi tiết</h3>
								<p className="text-gray-600 mt-1">{tour.content}</p>
							</div>
						)}
						<Separator />
						<div className="grid grid-cols-2 gap-4">
							<div>
								<h4 className="font-medium text-gray-900">Thời gian</h4>
								<p className="text-gray-600">{tour.totalDaysText}</p>
							</div>
							<div>
								<h4 className="font-medium text-gray-900">Loại tour</h4>
								<p className="text-gray-600">{tour.tourTypeText}</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Schedules */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Calendar className="w-5 h-5" />
							Lịch Trình Khởi Hành ({tour.schedules.length})
						</CardTitle>
					</CardHeader>
					<CardContent>
						{tour.schedules.length === 0 ? (
							<p className="text-gray-500 text-center py-4">Chưa có lịch trình nào</p>
						) : (
							<div className="space-y-4">
								{tour.schedules.map((schedule, index) => (
									<div key={schedule.scheduleId} className="border rounded-lg p-4">
										<div className="flex items-center justify-between mb-2">
											<div className="flex items-center gap-2">
												<Calendar className="w-4 h-4 text-blue-500" />
												<span className="font-semibold">{formatDate(schedule?.startTime || "", "dd/MM/yyyy")}</span>
											</div>
											<Badge variant="outline" className="bg-green-50 text-green-700">
												{schedule.currentBooked}/{schedule.maxParticipant} người
											</Badge>
										</div>
										<p className="text-sm text-gray-600 mb-2">{formatDate(schedule?.startTime || "", "dd/MM/yyyy")} - {formatDate(schedule?.endTime || "", "dd/MM/yyyy")}</p>
										<div className="grid grid-cols-2 gap-4 text-sm">
											<div className="flex items-center gap-1">
												<DollarSign className="w-3 h-3 text-green-500" />
												<span>Người lớn: {schedule.adultPrice.toLocaleString()} VNĐ</span>
											</div>
											<div className="flex items-center gap-1">
												<DollarSign className="w-3 h-3 text-blue-500" />
												<span>Trẻ em: {schedule.childrenPrice.toLocaleString()} VNĐ</span>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Daily Itinerary */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<MapPin className="w-5 h-5" />
							Lịch Trình Theo Ngày
						</CardTitle>
					</CardHeader>
					<CardContent>
						{tour.days.length === 0 ? (
							<p className="text-gray-500 text-center py-4">Chưa có lịch trình chi tiết</p>
						) : (
							<Accordion type="multiple" className="w-full">
								{tour.days.map((day) => (
									<AccordionItem key={day.dayNumber} value={`day-${day.dayNumber}`}>
										<AccordionTrigger className="hover:no-underline">
											<div className="flex items-center gap-3">
												<Badge variant="outline" className="bg-blue-50 text-blue-700">
													Ngày {day.dayNumber}
												</Badge>
												<span className="text-sm text-gray-600">{day.activities.length} hoạt động</span>
											</div>
										</AccordionTrigger>
										<AccordionContent>
											<div className="space-y-4">
												{day.activities.map((activity, index) => (
													<div key={activity.tourPlanLocationId} className="border rounded-lg p-4 bg-gray-50">
														<div className="flex items-start gap-4">
															<img
																src={activity.imageUrl || "/placeholder.svg"}
																alt={activity.name}
																className="w-16 h-16 rounded-lg object-cover"
															/>
															<div className="flex-1">
																<div className="flex items-center gap-2 mb-2">
																	<h4 className="font-semibold">{activity.name}</h4>
																	<Badge variant="outline" className="text-xs">
																		<Clock className="w-3 h-3 mr-1" />
																		{activity.startTimeFormatted} - {activity.endTimeFormatted}
																	</Badge>
																	<Badge variant="secondary" className="text-xs">
																		{activity.duration}
																	</Badge>
																</div>
																<p className="text-sm text-gray-600 mb-2">{activity.description}</p>
																<p className="text-xs text-gray-500 mb-2">📍 {activity.address}</p>
																{activity.notes && (
																	<p className="text-sm text-blue-600 italic">Ghi chú: {activity.notes}</p>
																)}
																<div className="flex gap-4 mt-2 text-xs text-gray-500">
																	{activity.travelTimeFromPrev > 0 && (
																		<span>Di chuyển: {activity.travelTimeFromPrev} phút</span>
																	)}
																	{activity.distanceFromPrev > 0 && (
																		<span>Khoảng cách: {activity.distanceFromPrev} km</span>
																	)}
																</div>
															</div>
														</div>
													</div>
												))}
											</div>
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Sidebar */}
			<div className="space-y-6">
				{/* Quick Stats */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Thống Kê Nhanh</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between">
							<span className="text-gray-600">Tổng ngày</span>
							<Badge variant="outline">{tour.totalDays} ngày</Badge>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-gray-600">Lịch trình</span>
							<Badge variant="outline">{tour.schedules.length} lịch trình</Badge>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-gray-600">Địa điểm</span>
							<Badge variant="outline">
								{tour.days.reduce((total, day) => total + day.activities.length, 0)} địa điểm
							</Badge>
						</div>
						<Separator />
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-gray-600">Giá người lớn</span>
								<span className="font-semibold text-green-600">{tour.adultPrice.toLocaleString()} VNĐ</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-gray-600">Giá trẻ em</span>
								<span className="font-semibold text-blue-600">{tour.childrenPrice.toLocaleString()} VNĐ</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-gray-600">Giá cuối</span>
								<span className="font-semibold text-purple-600">{tour.finalPrice.toLocaleString()} VNĐ</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Booking Stats */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg text-center">Thống Kê lượt đặt Chuyến Tham Quan</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{tour.schedules.map((schedule, index) => (
							<div key={schedule.scheduleId} className="space-y-2">
								<div className="flex items-center justify-between text-sm">
									<span className="text-gray-600">
										{formatDate(schedule?.startTime || "", "dd/MM/yyyy")} - {formatDate(schedule?.endTime || "", "dd/MM/yyyy")}
									</span>
									<span className="font-medium">
										{schedule.currentBooked}/{schedule.maxParticipant}
									</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div
										className="bg-blue-500 h-2 rounded-full"
										style={{
											width: `${(schedule.currentBooked / schedule.maxParticipant) * 100}%`,
										}}
									/>
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default TourDetailId
