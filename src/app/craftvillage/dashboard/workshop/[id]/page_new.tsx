"use client"

import BreadcrumbHeader from "@/components/common/breadcrumb-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useWorkshop } from "@/services/use-workshop"
import {
	Clock, Users, MapPin, Calendar, Edit, Trash2,
	DollarSign, Activity, AlertCircle, CheckCircle,
	XCircle, Eye
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

// Types based on API response
interface TicketActivity {
	id: string
	workshopTicketTypeId: string
	activity: string
	description: string
	durationMinutes: number
	activityOrder: number
}

interface TicketType {
	id: string
	workshopId: string
	type: number
	name: string
	price: number
	isCombo: boolean
	durationMinutes: number
	content: string
	activities: TicketActivity[]
}

interface WorkshopSchedule {
	id: string
	workshopId: string
	startTime: string
	endTime: string
	capacity: number
	currentBooked: number
	notes: string
	status: number
}

interface SessionRule {
	id: string
	recurringRuleId: string
	startTime: string
	endTime: string
	capacity: number
}

interface RecurringRule {
	id: string
	workshopId: string
	daysOfWeek: number[]
	daysOfWeekText: string[]
	daysOfWeekDisplay: string
	sessions: SessionRule[]
}

interface WorkshopException {
	id: string
	workshopId: string
	date: string
	reason: string
}

interface WorkshopMedia {
	id: string
	url: string
	type: string
}

interface WorkshopDetailData {
	id: string
	name: string
	description: string
	content: string
	status: number
	craftVillageId: string
	locationId: string
	craftVillageName: string
	ticketTypes: TicketType[]
	schedules: WorkshopSchedule[]
	recurringRules: RecurringRule[]
	exceptions: WorkshopException[]
	medias: WorkshopMedia[]
}

function WorkshopDetailPage() {
	const { id } = useParams()
	const router = useRouter()
	const { getWorkshopDetail } = useWorkshop()
	const [workshop, setWorkshop] = useState<WorkshopDetailData | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Mock data from API response for testing
	const mockWorkshop: WorkshopDetailData = {
		id: "08dde6d9-6b7a-4c29-8ef1-70610afe10f9",
		name: "Trải nghiệm nặn gốm",
		description: "Buổi trải nghiệm nặn gốm cùng nghệ nhân địa phương.",
		content: "Bao gồm hướng dẫn, thực hành và trưng bày sản phẩm.",
		status: 1,
		craftVillageId: "08dde6d9-66ff-4c69-8e1a-082ffa97392a",
		locationId: "08dde6d9-66f0-4b83-8ee9-b6a1b12fb5e8",
		craftVillageName: "Làng gốm Bát Tràng",
		ticketTypes: [
			{
				id: "08dde6d9-6c24-4aae-8ee4-fcb5e7a792d2",
				workshopId: "08dde6d9-6b7a-4c29-8ef1-70610afe10f9",
				type: 1,
				name: "Vé trải nghiệm (Người lớn)",
				price: 150000,
				isCombo: false,
				durationMinutes: 90,
				content: "Phù hợp cho người mới bắt đầu.",
				activities: [
					{
						id: "08dde6d9-6c30-4720-8276-64a07fffa754",
						workshopTicketTypeId: "08dde6d9-6c24-4aae-8ee4-fcb5e7a792d2",
						activity: "Giới thiệu làng nghề",
						description: "Lược sử Bát Tràng và các dòng gốm.",
						durationMinutes: 0,
						activityOrder: 1
					},
					{
						id: "08dde6d9-6c3a-4a1c-8391-fd420ce85237",
						workshopTicketTypeId: "08dde6d9-6c24-4aae-8ee4-fcb5e7a792d2",
						activity: "Hướng dẫn kỹ thuật cơ bản",
						description: "Căn chỉnh bàn xoay, kỹ thuật nắn, tạo dáng.",
						durationMinutes: 0,
						activityOrder: 2
					},
					{
						id: "08dde6d9-6c3a-4afd-8771-5c461dabd0df",
						workshopTicketTypeId: "08dde6d9-6c24-4aae-8ee4-fcb5e7a792d2",
						activity: "Thực hành nặn sản phẩm",
						description: "Tự tay nặn sản phẩm gốm đơn giản.",
						durationMinutes: 0,
						activityOrder: 3
					}
				]
			}
		],
		schedules: [
			{
				id: "08dde6d9-7639-4ec8-819d-927a8a082e37",
				workshopId: "08dde6d9-6b7a-4c29-8ef1-70610afe10f9",
				startTime: "2025-09-06T09:00:00",
				endTime: "2025-09-06T10:30:00",
				capacity: 20,
				currentBooked: 0,
				notes: "",
				status: 1
			},
			{
				id: "08dde6d9-7645-4027-8692-52c27f25a55e",
				workshopId: "08dde6d9-6b7a-4c29-8ef1-70610afe10f9",
				startTime: "2025-09-06T14:00:00",
				endTime: "2025-09-06T15:30:00",
				capacity: 20,
				currentBooked: 0,
				notes: "",
				status: 1
			},
			{
				id: "08dde6d9-7646-4c24-8d54-2d7cc9aafa6f",
				workshopId: "08dde6d9-6b7a-4c29-8ef1-70610afe10f9",
				startTime: "2025-09-07T09:00:00",
				endTime: "2025-09-07T10:30:00",
				capacity: 20,
				currentBooked: 4,
				notes: "",
				status: 1
			}
		],
		recurringRules: [
			{
				id: "08dde6d9-6cfc-470f-8245-6abbc740d5d0",
				workshopId: "08dde6d9-6b7a-4c29-8ef1-70610afe10f9",
				daysOfWeek: [6, 0],
				daysOfWeekText: ["Saturday", "Sunday"],
				daysOfWeekDisplay: "Saturday, Sunday",
				sessions: [
					{
						id: "08dde6d9-6ef9-4942-8f19-01e46ec69051",
						recurringRuleId: "08dde6d9-6cfc-470f-8245-6abbc740d5d0",
						startTime: "09:00:00",
						endTime: "10:30:00",
						capacity: 20
					},
					{
						id: "08dde6d9-6f03-464e-817a-a5fa70ca2de2",
						recurringRuleId: "08dde6d9-6cfc-470f-8245-6abbc740d5d0",
						startTime: "14:00:00",
						endTime: "15:30:00",
						capacity: 20
					}
				]
			}
		],
		exceptions: [
			{
				id: "08dde6d9-7043-430d-8ac9-5efc7be1ef5e",
				workshopId: "08dde6d9-6b7a-4c29-8ef1-70610afe10f9",
				date: "2025-09-02T00:00:00",
				reason: "Bảo trì khu trải nghiệm"
			}
		],
		medias: []
	}

	useEffect(() => {
		fetchWorkshopDetail()
	}, [id])

	const fetchWorkshopDetail = async () => {
		try {
			setLoading(true)
			// For now, use mock data
			setWorkshop(mockWorkshop)
			// const result = await getWorkshopDetail(id as string)
			// setWorkshop(result)
		} catch (err) {
			setError('Không thể tải thông tin workshop')
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	const getStatusInfo = (status: number) => {
		switch (status) {
			case 1:
				return {
					text: 'Đã duyệt',
					icon: CheckCircle,
					className: 'bg-green-100 text-green-800 border-green-200'
				}
			case 0:
				return {
					text: 'Chờ duyệt',
					icon: AlertCircle,
					className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
				}
			case -1:
				return {
					text: 'Bị từ chối',
					icon: XCircle,
					className: 'bg-red-100 text-red-800 border-red-200'
				}
			default:
				return {
					text: 'Không xác định',
					icon: AlertCircle,
					className: 'bg-gray-100 text-gray-800 border-gray-200'
				}
		}
	}

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND'
		}).format(price)
	}

	const formatDateTime = (dateString: string) => {
		const date = new Date(dateString)
		return {
			date: date.toLocaleDateString('vi-VN', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			}),
			time: date.toLocaleTimeString('vi-VN', {
				hour: '2-digit',
				minute: '2-digit'
			})
		}
	}

	const getUpcomingSchedules = (schedules: WorkshopSchedule[]) => {
		const now = new Date()
		return schedules
			.filter(schedule => new Date(schedule.startTime) > now)
			.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
			.slice(0, 5)
	}

	const breadcrumbItems = {
		items: [
			{ label: "Dashboard", href: "/craftvillage/dashboard" },
			{ label: "Trải nghiệm", href: "/craftvillage/dashboard/workshop" },
			{ label: workshop?.name || "Chi tiết" }
		]
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Đang tải thông tin workshop...</p>
				</div>
			</div>
		)
	}

	if (error || !workshop) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
					<p className="text-red-600 mb-4">{error || 'Không tìm thấy workshop'}</p>
					<Button onClick={() => router.back()} variant="outline">
						Quay lại
					</Button>
				</div>
			</div>
		)
	}

	const statusInfo = getStatusInfo(workshop.status)
	const StatusIcon = statusInfo.icon

	return (
		<>
			<BreadcrumbHeader items={breadcrumbItems.items} />
			<div className="container mx-auto p-6 max-w-7xl">
				{/* Header Section */}
				<div className="mb-8">
					<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
						<div className="flex-1">
							<div className="flex items-center gap-3 mb-4">
								<Badge className={cn("flex items-center gap-2", statusInfo.className)}>
									<StatusIcon className="h-4 w-4" />
									{statusInfo.text}
								</Badge>
								<Badge variant="outline" className="flex items-center gap-2">
									<MapPin className="h-4 w-4" />
									{workshop.craftVillageName}
								</Badge>
							</div>
							<h1 className="text-4xl font-bold text-gray-900 mb-3">
								{workshop.name}
							</h1>
							<p className="text-lg text-gray-600 mb-6 max-w-3xl">
								{workshop.description}
							</p>

							{/* Quick Stats */}
							<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
								<div className="bg-blue-50 p-4 rounded-lg">
									<div className="flex items-center gap-2">
										<DollarSign className="h-5 w-5 text-blue-600" />
										<span className="text-sm text-gray-600">Từ</span>
									</div>
									<p className="text-xl font-semibold text-blue-700">
										{workshop.ticketTypes.length > 0
											? formatPrice(Math.min(...workshop.ticketTypes.map(t => t.price)))
											: "0 ₫"
										}
									</p>
								</div>
								<div className="bg-green-50 p-4 rounded-lg">
									<div className="flex items-center gap-2">
										<Clock className="h-5 w-5 text-green-600" />
										<span className="text-sm text-gray-600">Thời gian</span>
									</div>
									<p className="text-xl font-semibold text-green-700">
										{workshop.ticketTypes[0]?.durationMinutes || 0} phút
									</p>
								</div>
								<div className="bg-purple-50 p-4 rounded-lg">
									<div className="flex items-center gap-2">
										<Calendar className="h-5 w-5 text-purple-600" />
										<span className="text-sm text-gray-600">Lịch trình</span>
									</div>
									<p className="text-xl font-semibold text-purple-700">
										{workshop.schedules.length} buổi
									</p>
								</div>
								<div className="bg-orange-50 p-4 rounded-lg">
									<div className="flex items-center gap-2">
										<Users className="h-5 w-5 text-orange-600" />
										<span className="text-sm text-gray-600">Sức chứa</span>
									</div>
									<p className="text-xl font-semibold text-orange-700">
										{workshop.schedules[0]?.capacity || 0} người
									</p>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row lg:flex-col gap-3">
							<Button
								onClick={() => router.push(`/craftvillage/dashboard/workshop/${workshop.id}/edit`)}
								className="flex items-center gap-2"
							>
								<Edit className="h-4 w-4" />
								Chỉnh sửa
							</Button>
							<Button variant="outline" className="flex items-center gap-2">
								<Eye className="h-4 w-4" />
								Xem trước
							</Button>
							<Button variant="destructive" className="flex items-center gap-2">
								<Trash2 className="h-4 w-4" />
								Xóa
							</Button>
						</div>
					</div>
				</div>

				{/* Main Content Tabs */}
				<Tabs defaultValue="overview" className="space-y-6">
					<TabsList className="grid w-full grid-cols-5">
						<TabsTrigger value="overview">Tổng quan</TabsTrigger>
						<TabsTrigger value="tickets">Loại vé</TabsTrigger>
						<TabsTrigger value="schedules">Lịch trình</TabsTrigger>
						<TabsTrigger value="recurring">Lặp lại</TabsTrigger>
						<TabsTrigger value="exceptions">Ngoại lệ</TabsTrigger>
					</TabsList>

					{/* Overview Tab */}
					<TabsContent value="overview" className="space-y-6">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							<div className="lg:col-span-2 space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>Mô tả chi tiết</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="prose prose-gray max-w-none">
											<p className="text-gray-700 leading-relaxed">
												{workshop.content}
											</p>
										</div>
									</CardContent>
								</Card>

								{/* Media Gallery */}
								{workshop.medias && workshop.medias.length > 0 && (
									<Card>
										<CardHeader>
											<CardTitle>Hình ảnh</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
												{workshop.medias.map((media, index) => (
													<div key={media.id} className="relative aspect-video rounded-lg overflow-hidden">
														<Image
															src={media.url}
															alt={`Workshop media ${index + 1}`}
															fill
															className="object-cover"
														/>
													</div>
												))}
											</div>
										</CardContent>
									</Card>
								)}
							</div>

							{/* Sidebar */}
							<div className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>Thông tin nhanh</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="flex items-center gap-3">
											<MapPin className="h-5 w-5 text-gray-400" />
											<div>
												<p className="font-medium">Làng nghề</p>
												<p className="text-sm text-gray-600">{workshop.craftVillageName}</p>
											</div>
										</div>

										<div className="flex items-center gap-3">
											<Calendar className="h-5 w-5 text-gray-400" />
											<div>
												<p className="font-medium">Số lịch trình</p>
												<p className="text-sm text-gray-600">{workshop.schedules.length} buổi</p>
											</div>
										</div>

										<div className="flex items-center gap-3">
											<DollarSign className="h-5 w-5 text-gray-400" />
											<div>
												<p className="font-medium">Số loại vé</p>
												<p className="text-sm text-gray-600">{workshop.ticketTypes.length} loại</p>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Lịch trình sắp tới</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											{getUpcomingSchedules(workshop.schedules).map((schedule) => {
												const datetime = formatDateTime(schedule.startTime)
												const bookedPercentage = (schedule.currentBooked / schedule.capacity) * 100
												return (
													<div key={schedule.id} className="p-3 bg-gray-50 rounded-lg">
														<div className="flex justify-between items-start mb-2">
															<div>
																<p className="font-medium text-sm">{datetime.date}</p>
																<p className="text-sm text-gray-600">
																	{datetime.time} - {formatDateTime(schedule.endTime).time}
																</p>
															</div>
															<Badge
																variant={schedule.currentBooked === 0 ? "secondary" : "default"}
																className="text-xs"
															>
																{schedule.currentBooked}/{schedule.capacity}
															</Badge>
														</div>
														<div className="w-full bg-gray-200 rounded-full h-2">
															<div
																className="bg-blue-600 h-2 rounded-full"
																style={{ width: `${bookedPercentage}%` }}
															></div>
														</div>
													</div>
												)
											})}
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</TabsContent>

					{/* Ticket Types Tab */}
					<TabsContent value="tickets" className="space-y-6">
						<div className="grid gap-6">
							{workshop.ticketTypes.map((ticketType) => (
								<Card key={ticketType.id}>
									<CardHeader>
										<div className="flex justify-between items-start">
											<div>
												<CardTitle className="flex items-center gap-2">
													{ticketType.name}
													{ticketType.isCombo && (
														<Badge variant="secondary">Combo</Badge>
													)}
												</CardTitle>
												<p className="text-sm text-gray-600 mt-1">{ticketType.content}</p>
											</div>
											<div className="text-right">
												<p className="text-2xl font-bold text-blue-600">
													{formatPrice(ticketType.price)}
												</p>
												<p className="text-sm text-gray-500">
													{ticketType.durationMinutes} phút
												</p>
											</div>
										</div>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<h4 className="font-medium flex items-center gap-2">
												<Activity className="h-4 w-4" />
												Hoạt động bao gồm
											</h4>
											<div className="space-y-3">
												{ticketType.activities
													.sort((a, b) => a.activityOrder - b.activityOrder)
													.map((activity, index) => (
														<div key={activity.id} className="flex gap-3">
															<div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
																{index + 1}
															</div>
															<div>
																<p className="font-medium">{activity.activity}</p>
																<p className="text-sm text-gray-600">{activity.description}</p>
															</div>
														</div>
													))}
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					{/* Schedules Tab */}
					<TabsContent value="schedules" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Tất cả lịch trình ({workshop.schedules.length})</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{workshop.schedules.map((schedule) => {
										const datetime = formatDateTime(schedule.startTime)
										const endDatetime = formatDateTime(schedule.endTime)
										const bookedPercentage = (schedule.currentBooked / schedule.capacity) * 100
										const isFullyBooked = schedule.currentBooked >= schedule.capacity
										const isPast = new Date(schedule.startTime) < new Date()

										return (
											<div
												key={schedule.id}
												className={cn(
													"p-4 border rounded-lg",
													isPast && "bg-gray-50 opacity-75",
													isFullyBooked && "border-orange-200 bg-orange-50"
												)}
											>
												<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
													<div className="space-y-1">
														<p className="font-medium">{datetime.date}</p>
														<p className="text-sm text-gray-600">
															{datetime.time} - {endDatetime.time}
														</p>
														{schedule.notes && (
															<p className="text-sm text-gray-500">{schedule.notes}</p>
														)}
													</div>

													<div className="flex items-center gap-4">
														<div className="text-center">
															<p className="text-sm text-gray-500">Đã đặt</p>
															<p className="font-medium">
																{schedule.currentBooked}/{schedule.capacity}
															</p>
														</div>

														<div className="w-24">
															<div className="w-full bg-gray-200 rounded-full h-2 mb-1">
																<div
																	className={cn(
																		"h-2 rounded-full",
																		bookedPercentage >= 100 ? "bg-red-500" :
																			bookedPercentage >= 75 ? "bg-orange-500" : "bg-blue-500"
																	)}
																	style={{ width: `${bookedPercentage}%` }}
																></div>
															</div>
															<p className="text-xs text-center text-gray-500">
																{Math.round(bookedPercentage)}%
															</p>
														</div>

														<Badge
															variant={
																isPast ? "secondary" :
																	isFullyBooked ? "destructive" :
																		"default"
															}
														>
															{isPast ? "Đã qua" :
																isFullyBooked ? "Hết chỗ" :
																	"Còn chỗ"}
														</Badge>
													</div>
												</div>
											</div>
										)
									})}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Recurring Rules Tab */}
					<TabsContent value="recurring" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Quy tắc lặp lại ({workshop.recurringRules.length})</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{workshop.recurringRules.map((rule) => (
										<div key={rule.id} className="p-4 border rounded-lg">
											<div className="mb-4">
												<h4 className="font-medium mb-2">Ngày trong tuần</h4>
												<p className="text-sm text-gray-600">{rule.daysOfWeekDisplay}</p>
											</div>

											<div>
												<h4 className="font-medium mb-3">Các phiên ({rule.sessions.length})</h4>
												<div className="grid gap-3">
													{rule.sessions.map((session) => (
														<div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
															<div>
																<p className="font-medium">
																	{session.startTime} - {session.endTime}
																</p>
															</div>
															<div className="text-right">
																<p className="text-sm text-gray-600">Sức chứa</p>
																<p className="font-medium">{session.capacity} người</p>
															</div>
														</div>
													))}
												</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Exceptions Tab */}
					<TabsContent value="exceptions" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Ngày ngoại lệ ({workshop.exceptions.length})</CardTitle>
							</CardHeader>
							<CardContent>
								{workshop.exceptions.length === 0 ? (
									<div className="text-center py-8">
										<AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
										<p className="text-gray-500">Không có ngày ngoại lệ nào</p>
									</div>
								) : (
									<div className="space-y-4">
										{workshop.exceptions.map((exception) => {
											const date = new Date(exception.date)
											return (
												<div key={exception.id} className="p-4 border border-red-200 bg-red-50 rounded-lg">
													<div className="flex items-center gap-3">
														<AlertCircle className="h-5 w-5 text-red-500" />
														<div>
															<p className="font-medium text-red-800">
																{date.toLocaleDateString('vi-VN', {
																	weekday: 'long',
																	year: 'numeric',
																	month: 'long',
																	day: 'numeric'
																})}
															</p>
															<p className="text-sm text-red-600">{exception.reason}</p>
														</div>
													</div>
												</div>
											)
										})}
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</>
	)
}

export default WorkshopDetailPage
