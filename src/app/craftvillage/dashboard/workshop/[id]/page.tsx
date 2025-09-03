"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import BreadcrumbHeader from "@/components/common/breadcrumb-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWorkshop } from "@/services/use-workshop"
import {
	Activity, AlertCircle,
	Calendar,
	CheckCircle,
	Clock,
	DollarSign,
	Edit,
	Eye,
	MapPin,
	Ticket,
	Trash2,
	Users,
	XCircle
} from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CiMoneyBill } from "react-icons/ci"
import { ChevronLeft, ChevronRight } from "lucide-react"

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

	// Pagination states
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage] = useState(5) // 5 schedules per page

	useEffect(() => {
		if (id) {
			fetchWorkshopDetail()
		}
	}, [id])

	const fetchWorkshopDetail = async () => {
		try {
			setLoading(true)
			setError(null)
			const result = await getWorkshopDetail(id as string)
			if (result) {
				setWorkshop(result?.data)
			} else {
				setError('Workshop không tồn tại')
			}
		} catch (err: any) {
			setError(err?.message || 'Không thể tải thông tin workshop')
			console.error('Error fetching workshop detail:', err)
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
			case 2:
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

	// Pagination helpers
	const getPaginatedSchedules = (schedules: WorkshopSchedule[]) => {
		const startIndex = (currentPage - 1) * itemsPerPage
		const endIndex = startIndex + itemsPerPage
		return schedules.slice(startIndex, endIndex)
	}

	const getTotalPages = (totalItems: number) => {
		return Math.ceil(totalItems / itemsPerPage)
	}

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage)
		// Scroll to top of schedules section
		const schedulesSection = document.getElementById('schedules-section')
		if (schedulesSection) {
			schedulesSection.scrollIntoView({ behavior: 'smooth' })
		}
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
										<CiMoneyBill className="h-5 w-5 text-blue-600" />
										<span className="text-sm text-gray-600">Từ</span>
									</div>
									<p className="text-xl font-semibold text-blue-700">
										{workshop?.ticketTypes
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
						{/* <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
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
						</div> */}
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
								{workshop?.medias && workshop?.medias?.length > 0 && (
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
											<Ticket className="h-5 w-5 text-gray-400" />
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
					<TabsContent value="schedules" className="space-y-6" id="schedules-section">
						<div className="grid gap-6">
							{/* Summary Stats */}
							<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
								<Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
									<CardContent className="p-4">
										<div className="flex items-center gap-3">
											<div className="p-2 bg-blue-500 rounded-lg">
												<Calendar className="h-5 w-5 text-white" />
											</div>
											<div>
												<p className="text-sm text-blue-700 font-medium">Tổng lịch trình</p>
												<p className="text-2xl font-bold text-blue-800">{workshop.schedules.length}</p>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
									<CardContent className="p-4">
										<div className="flex items-center gap-3">
											<div className="p-2 bg-green-500 rounded-lg">
												<CheckCircle className="h-5 w-5 text-white" />
											</div>
											<div>
												<p className="text-sm text-green-700 font-medium">Còn chỗ</p>
												<p className="text-2xl font-bold text-green-800">
													{workshop.schedules.filter(s => s.currentBooked < s.capacity && new Date(s.startTime) > new Date()).length}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
									<CardContent className="p-4">
										<div className="flex items-center gap-3">
											<div className="p-2 bg-orange-500 rounded-lg">
												<Users className="h-5 w-5 text-white" />
											</div>
											<div>
												<p className="text-sm text-orange-700 font-medium">Tổng đã đặt</p>
												<p className="text-2xl font-bold text-orange-800">
													{workshop.schedules.reduce((sum, s) => sum + s.currentBooked, 0)}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
									<CardContent className="p-4">
										<div className="flex items-center gap-3">
											<div className="p-2 bg-purple-500 rounded-lg">
												<Activity className="h-5 w-5 text-white" />
											</div>
											<div>
												<p className="text-sm text-purple-700 font-medium">Tỷ lệ đặt</p>
												<p className="text-2xl font-bold text-purple-800">
													{Math.round((workshop.schedules.reduce((sum, s) => sum + s.currentBooked, 0) / workshop.schedules.reduce((sum, s) => sum + s.capacity, 0)) * 100) || 0}%
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Schedules Grid */}
							<Card>
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle className="flex items-center gap-2">
											<Calendar className="h-5 w-5" />
											Lịch trình chi tiết
										</CardTitle>
										<div className="flex items-center gap-2 text-sm text-gray-500">
											<div className="flex items-center gap-1">
												<div className="w-3 h-3 bg-blue-500 rounded-full"></div>
												<span>Còn chỗ</span>
											</div>
											<div className="flex items-center gap-1">
												<div className="w-3 h-3 bg-orange-500 rounded-full"></div>
												<span>Gần hết</span>
											</div>
											<div className="flex items-center gap-1">
												<div className="w-3 h-3 bg-red-500 rounded-full"></div>
												<span>Hết chỗ</span>
											</div>
											<div className="flex items-center gap-1">
												<div className="w-3 h-3 bg-gray-400 rounded-full"></div>
												<span>Đã qua</span>
											</div>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div className="grid gap-4">
										{getPaginatedSchedules(workshop?.schedules || [])?.map((schedule) => {
											const datetime = formatDateTime(schedule.startTime)
											const endDatetime = formatDateTime(schedule.endTime)
											const bookedPercentage = (schedule.currentBooked / schedule.capacity) * 100
											const isFullyBooked = schedule.currentBooked >= schedule.capacity
											const isPast = new Date(schedule.startTime) < new Date()
											const isNearFull = bookedPercentage >= 75 && !isFullyBooked

											return (
												<div
													key={schedule.id}
													className={cn(
														"group relative p-5 border-2 rounded-xl transition-all duration-200 hover:shadow-lg",
														isPast && "bg-gray-50 border-gray-200 opacity-75",
														!isPast && !isFullyBooked && !isNearFull && "bg-blue-50 border-blue-200 hover:border-blue-300",
														!isPast && isNearFull && "bg-orange-50 border-orange-200 hover:border-orange-300",
														!isPast && isFullyBooked && "bg-red-50 border-red-200 hover:border-red-300"
													)}
												>
													<div className="flex items-center justify-between">
														{/* Left Section - Date & Time */}
														<div className="flex items-center gap-4">
															<div className={cn(
																"p-3 rounded-xl",
																isPast && "bg-gray-200",
																!isPast && !isFullyBooked && !isNearFull && "bg-blue-500",
																!isPast && isNearFull && "bg-orange-500",
																!isPast && isFullyBooked && "bg-red-500"
															)}>
																<Calendar className="h-6 w-6 text-white" />
															</div>
															<div>
																<p className="font-semibold text-lg text-gray-900">{datetime.date}</p>
																<div className="flex items-center gap-2 mt-1">
																	<Clock className="h-4 w-4 text-gray-500" />
																	<p className="text-gray-600 font-medium">
																		{datetime.time} - {endDatetime.time}
																	</p>
																</div>
																{schedule.notes && (
																	<p className="text-sm text-gray-500 mt-1 italic">{schedule.notes}</p>
																)}
															</div>
														</div>

														{/* Right Section - Stats & Status */}
														<div className="flex items-center gap-6">
															{/* Booking Stats */}
															<div className="text-center">
																<div className="flex items-center gap-2 mb-2">
																	<Users className="h-4 w-4 text-gray-500" />
																	<span className="text-sm text-gray-500 font-medium">Đã đặt</span>
																</div>
																<p className="text-2xl font-bold text-gray-900">
																	<span className={cn(
																		isFullyBooked && "text-red-600",
																		isNearFull && "text-orange-600",
																		!isNearFull && !isFullyBooked && "text-blue-600"
																	)}>
																		{schedule.currentBooked}
																	</span>
																	<span className="text-gray-400">/{schedule.capacity}</span>
																</p>
															</div>

															{/* Progress Bar */}
															<div className="w-32">
																<div className="flex justify-between items-center mb-2">
																	<span className="text-xs text-gray-500 font-medium">Tỷ lệ đặt</span>
																	<span className={cn(
																		"text-xs font-bold",
																		isPast && "text-gray-500",
																		!isPast && bookedPercentage >= 100 && "text-red-600",
																		!isPast && bookedPercentage >= 75 && bookedPercentage < 100 && "text-orange-600",
																		!isPast && bookedPercentage < 75 && "text-blue-600"
																	)}>
																		{Math.round(bookedPercentage)}%
																	</span>
																</div>
																<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
																	<div
																		className={cn(
																			"h-full rounded-full transition-all duration-300",
																			isPast && "bg-gray-400",
																			!isPast && bookedPercentage >= 100 && "bg-red-500",
																			!isPast && bookedPercentage >= 75 && bookedPercentage < 100 && "bg-orange-500",
																			!isPast && bookedPercentage < 75 && "bg-blue-500"
																		)}
																		style={{ width: `${Math.min(bookedPercentage, 100)}%` }}
																	></div>
																</div>
															</div>

															{/* Status Badge */}
															<div className="text-right">
																<Badge
																	className={cn(
																		"px-3 py-1 text-sm font-semibold",
																		isPast && "bg-gray-100 text-gray-600 border-gray-300",
																		!isPast && isFullyBooked && "bg-red-100 text-red-700 border-red-300",
																		!isPast && isNearFull && "bg-orange-100 text-orange-700 border-orange-300",
																		!isPast && !isNearFull && !isFullyBooked && "bg-blue-100 text-blue-700 border-blue-300"
																	)}
																	variant="outline"
																>
																	{isPast ? (
																		<>
																			<XCircle className="h-4 w-4 mr-1" />
																			Đã qua
																		</>
																	) : isFullyBooked ? (
																		<>
																			<AlertCircle className="h-4 w-4 mr-1" />
																			Hết chỗ
																		</>
																	) : isNearFull ? (
																		<>
																			<Clock className="h-4 w-4 mr-1" />
																			Gần hết
																		</>
																	) : (
																		<>
																			<CheckCircle className="h-4 w-4 mr-1" />
																			Còn chỗ
																		</>
																	)}
																</Badge>
															</div>
														</div>
													</div>
												</div>
											)
										})}
									</div>

									{/* Pagination */}
									{workshop?.schedules && workshop.schedules.length > itemsPerPage && (
										<div className="flex items-center justify-between mt-8 pt-6 border-t">
											<div className="flex items-center gap-2 text-sm text-gray-600">
												<span>Hiển thị</span>
												<span className="font-medium">
													{((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, workshop.schedules.length)}
												</span>
												<span>của</span>
												<span className="font-medium">{workshop.schedules.length}</span>
												<span>lịch trình</span>
											</div>

											<div className="flex items-center gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => handlePageChange(currentPage - 1)}
													disabled={currentPage === 1}
													className="flex items-center gap-1"
												>
													<ChevronLeft className="h-4 w-4" />
													Trước
												</Button>

												<div className="flex items-center gap-1">
													{Array.from({ length: getTotalPages(workshop.schedules.length) }, (_, index) => {
														const page = index + 1
														const isCurrentPage = page === currentPage

														// Show first page, last page, current page, and pages around current
														const shouldShow =
															page === 1 ||
															page === getTotalPages(workshop.schedules.length) ||
															Math.abs(page - currentPage) <= 1

														if (!shouldShow) {
															// Show ellipsis for gaps
															if (page === currentPage - 2 || page === currentPage + 2) {
																return (
																	<span key={page} className="px-2 text-gray-400">
																		...
																	</span>
																)
															}
															return null
														}

														return (
															<Button
																key={page}
																variant={isCurrentPage ? "default" : "outline"}
																size="sm"
																onClick={() => handlePageChange(page)}
																className={cn(
																	"w-8 h-8 p-0",
																	isCurrentPage && "bg-blue-600 hover:bg-blue-700"
																)}
															>
																{page}
															</Button>
														)
													})}
												</div>

												<Button
													variant="outline"
													size="sm"
													onClick={() => handlePageChange(currentPage + 1)}
													disabled={currentPage === getTotalPages(workshop.schedules.length)}
													className="flex items-center gap-1"
												>
													Sau
													<ChevronRight className="h-4 w-4" />
												</Button>
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						</div>
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
												<p className="text-sm text-gray-600">{rule?.daysOfWeekDisplay}</p>
											</div>

											<div>
												<h4 className="font-medium mb-3">Các phiên ({rule?.sessions?.length})</h4>
												<div className="grid gap-3">
													{rule?.sessions?.map((session) => (
														<div key={session?.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
															<div>
																<p className="font-medium">
																	{session?.startTime} - {session?.endTime}
																</p>
															</div>
															<div className="text-right">
																<p className="text-sm text-gray-600">Sức chứa</p>
																<p className="font-medium">{session?.capacity} người</p>
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
