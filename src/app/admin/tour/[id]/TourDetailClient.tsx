'use client';

import { DeleteConfirmation } from "@/components/tour-management/DeleteConfirmation"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useTour } from "@/services/tour"
import type { TourDetail } from "@/types/Tour"
import { TourTypeLabels } from "@/types/Tour"
import { AlertCircle, ArrowLeft, Calendar, Clock, DollarSign, Edit, Loader2, MapPin, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface TourDetailClientProps {
	tourId: string
}

const statusColorMap: Record<string, string> = {
	Draft: "bg-yellow-100 text-yellow-800",
	Published: "bg-green-100 text-green-800",
	Active: "bg-blue-100 text-blue-800",
	Cancelled: "bg-red-100 text-red-800",
}

export default function TourDetailClient({ tourId }: TourDetailClientProps) {
	const router = useRouter()
	const [tour, setTour] = useState<TourDetail | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
	const [isDeleteOpen, setIsDeleteOpen] = useState(false)
	const [actionLoading, setActionLoading] = useState(false)

	const { getTourDetail, deleteTour } = useTour()

	useEffect(() => {
		const fetchTour = async () => {
			try {
				setLoading(true)
				setError("")
				const response = await getTourDetail(tourId)
				if (response) {
					setTour(response)
				} else {
					throw new Error(response.message || "Failed to fetch tour")
				}
			} catch (error: any) {
				console.error("Error fetching tour:", error)
				setError(error.message || "Không thể tải thông tin tour")
			} finally {
				setLoading(false)
			}
		}

		if (tourId) {
			fetchTour()
		}
	}, [tourId, getTourDetail])

	const handleEdit = () => {
		router.push(`/admin/tour/${tourId}/edit`)
	}

	const handleDelete = () => {
		setIsDeleteOpen(true)
	}

	const handleConfirmDelete = async () => {
		if (!tour) return

		try {
			setActionLoading(true)
			await deleteTour(tour.tourId)
			router.push("/admin/tour")
		} catch (error: any) {
			console.error("Error deleting tour:", error)
			setError(error.message || "Có lỗi khi xóa tour")
		} finally {
			setActionLoading(false)
			setIsDeleteOpen(false)
		}
	}

	const handleBack = () => {
		router.push("/admin/tour")
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("vi-VN", {
			year: "numeric",
			month: "long",
			day: "numeric",
			weekday: "long",
		})
	}

	const formatTime = (time: string) => {
		return time.substring(0, 5) // HH:MM format
	}

	if (loading) {
		return (
			<div className="container mx-auto p-6 max-w-6xl">
				<div className="flex items-center justify-center py-12">
					<Loader2 className="w-8 h-8 animate-spin" />
					<span className="ml-2">Đang tải...</span>
				</div>
			</div>
		)
	}

	if (error || !tour) {
		return (
			<div className="container mx-auto p-6 max-w-6xl">
				<Alert className="mb-6">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error || "Không tìm thấy tour"}</AlertDescription>
				</Alert>
				<Button onClick={handleBack} variant="outline">
					<ArrowLeft className="w-4 h-4 mr-2" />
					Quay lại
				</Button>
			</div>
		)
	}

	return (
		<div className="container mx-auto p-6 max-w-6xl">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-4">
					<div>
						<h1 className="text-3xl font-bold">{tour.name}</h1>
						<div className="flex items-center gap-2 mt-2">
							<Badge className={`${statusColorMap[tour.statusText] || "bg-gray-100 text-gray-800"} text-xs`}>
								{tour.statusText}
							</Badge>
							<Badge variant="outline" className="text-xs">
								{TourTypeLabels[tour.tourType as keyof typeof TourTypeLabels]}
							</Badge>
							<span className="text-sm text-gray-500">ID: {tour.tourId}</span>
						</div>
					</div>
				</div>
				<div className="flex gap-2">
					<Button onClick={handleEdit} className="flex items-center gap-2">
						<Edit className="w-4 h-4" />
						Chỉnh sửa
					</Button>
					<Button variant="destructive" onClick={handleDelete} className="flex items-center gap-2">
						<Trash2 className="w-4 h-4" />
						Xóa
					</Button>
				</div>
			</div>

			{error && (
				<Alert className="mb-6 border-red-200 bg-red-50">
					<AlertCircle className="h-4 w-4 text-red-600" />
					<AlertDescription className="text-red-800">{error}</AlertDescription>
				</Alert>
			)}

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
													<span className="font-semibold">{formatDate(schedule?.startTime || "")}</span>
												</div>
												<Badge variant="outline" className="bg-green-50 text-green-700">
													{schedule.currentBooked}/{schedule.maxParticipant} người
												</Badge>
											</div>
											<p className="text-sm text-gray-600 mb-2">{formatDate(schedule?.startTime || "")} - {formatDate(schedule?.endTime || "")}</p>
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
							<CardTitle className="text-lg">Thống Kê Đặt Tour</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{tour.schedules.map((schedule, index) => (
								<div key={schedule.scheduleId} className="space-y-2">
									<div className="flex items-center justify-between text-sm">
										<span className="text-gray-600">
											{formatDate(schedule?.startTime || "")} - {formatDate(schedule?.endTime || "")}
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

			{/* Delete Confirmation Modal */}
			<Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Xác Nhận Xóa Tour</DialogTitle>
					</DialogHeader>
					<DeleteConfirmation
						tour={tour}
						onConfirm={handleConfirmDelete}
						onCancel={() => setIsDeleteOpen(false)}
						isLoading={actionLoading}
					/>
				</DialogContent>
			</Dialog>
		</div>
	)
}
