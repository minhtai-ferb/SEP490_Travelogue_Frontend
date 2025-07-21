"use client"

import { useEffect, useState } from "react"
// import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTourguideAssign } from "@/services/tourguide"
import { userAtom } from "@/store/auth"
import { formatDate, formatPrice } from "@/utils/format"
import { motion } from "framer-motion"
import { useAtom } from "jotai"
import { ArrowLeft, Calendar, CalendarDays, Clock, Eye, List, MapPin, Users } from "lucide-react"
import Link from "next/link"

interface AssignedTour {
	id: string
	name: string
	startDate: string
	endDate: string
	meetingLocation: string
	status: "upcoming" | "in_progress" | "completed"
	participants: number
	maxParticipants: number
	description: string
	notes?: string
	price: number
}

const MOCK_ASSIGNED_TOURS: AssignedTour[] = [
	{
		id: "1",
		name: "Khám phá Tây Ninh - Núi Bà Đen",
		startDate: "2024-02-15T08:00:00Z",
		endDate: "2024-02-15T18:00:00Z",
		meetingLocation: "Bến xe Miền Tây, TP.HCM",
		status: "upcoming",
		participants: 15,
		maxParticipants: 20,
		description: "Tour khám phá núi Bà Đen, chùa Bà Đen và các điểm du lịch nổi tiếng tại Tây Ninh",
		notes: "Chuẩn bị đồ ăn nhẹ cho đoàn. Kiểm tra thời tiết trước khi khởi hành.",
		price: 450000,
	},
	{
		id: "2",
		name: "Hành trình Cao Đài - Địa đạo Củ Chi",
		startDate: "2024-02-20T07:30:00Z",
		endDate: "2024-02-20T17:30:00Z",
		meetingLocation: "Công viên 23/9, Quận 1",
		status: "upcoming",
		participants: 12,
		maxParticipants: 18,
		description: "Tham quan thánh tòa Cao Đài và khám phá địa đạo Củ Chi lịch sử",
		notes: "Nhắc nhở khách mang giày thể thao để vào địa đạo",
		price: 380000,
	},
	{
		id: "3",
		name: "Tour Tây Ninh 2 ngày 1 đêm",
		startDate: "2024-01-10T06:00:00Z",
		endDate: "2024-01-11T20:00:00Z",
		meetingLocation: "Sân bay Tân Sơn Nhất",
		status: "completed",
		participants: 18,
		maxParticipants: 20,
		description: "Tour trọn gói khám phá Tây Ninh với lưu trú qua đêm",
		price: 1200000,
	},
]

// export default function MyToursClient() {
// 	return (
// 		<ProtectedRoute requiredRole="tour_guide">
// 			<MyToursContent />
// 		</ProtectedRoute>
// 	)
// }

function MyToursContent() {
	const user = useAtom(userAtom)
	const [tours, setTours] = useState<AssignedTour[]>(MOCK_ASSIGNED_TOURS)
	const [searchTerm, setSearchTerm] = useState("")
	const [statusFilter, setStatusFilter] = useState<string>("all")
	const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
	const [selectedTour, setSelectedTour] = useState<AssignedTour | null>(null)

	const { getTourAssign } = useTourguideAssign()


	const fetchTours = async () => {
		try {
			const response = await getTourAssign()
			setTours(response || MOCK_ASSIGNED_TOURS)
		} catch (error) {
			console.error("Failed to fetch tours:", error)
		}
	}

	useEffect(() => {
		fetchTours()
		setViewMode("list") // Reset to list view on mount
		setSearchTerm("") // Clear search term
		setStatusFilter("all") // Reset status filter
		setSelectedTour(null) // Clear selected tour
	}, [])

	const filteredTours = tours.filter((tour) => {
		const matchesSearch = tour.name.toLowerCase().includes(searchTerm.toLowerCase())
		const matchesStatus = statusFilter === "all" || tour.status === statusFilter
		return matchesSearch && matchesStatus
	})

	const getStatusBadge = (status: AssignedTour["status"]) => {
		const variants = {
			upcoming: "bg-blue-100 text-blue-800",
			in_progress: "bg-green-100 text-green-800",
			completed: "bg-gray-100 text-gray-800",
		}
		const labels = {
			upcoming: "Sắp diễn ra",
			in_progress: "Đang diễn ra",
			completed: "Đã hoàn thành",
		}
		return <Badge className={variants[status]}>{labels[status]}</Badge>
	}

	const upcomingTours = tours.filter((t) => t.status === "upcoming").length
	const completedTours = tours.filter((t) => t.status === "completed").length
	const totalParticipants = tours.reduce((sum, tour) => sum + tour.participants, 0)

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-blue-500 shadow-sm border-b text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center space-x-4">
							<Link href="/">
								<Button variant="ghost" size="sm">
									<ArrowLeft className="w-4 h-4 mr-2" />
									Về lại trang chủ
								</Button>
							</Link>
							<h1 className="text-2xl font-bold">Tour của tôi</h1>
						</div>

						<div className="flex items-center space-x-3">
							<Avatar className="text-blue-500 font-bold">
								<AvatarImage src={user?.[0]?.avatar || "/placeholder.svg"} />
								<AvatarFallback>
									{user && user[0] && user?.[0]?.fullName
										? user?.[0]?.fullName[0]
										: "U"}
								</AvatarFallback>
							</Avatar>
							<div className="hidden md:block">
								<div className="text-sm font-medium">{user?.[0]?.fullName}</div>
								<div className="text-xs text-gray-200">Hướng dẫn viên</div>
							</div>
						</div>
					</div>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Stats */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					{/* Upcoming Tours */}
					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
						<Card>
							<CardContent className="p-6">
								<div className="flex items-center">
									<div className="p-2 rounded-lg bg-blue-100">
										<Calendar className="w-6 h-6 text-blue-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-600">Tour sắp tới</p>
										<p className="text-2xl font-bold text-gray-900">{upcomingTours}</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Completed Tours */}
					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
						<Card>
							<CardContent className="p-6">
								<div className="flex items-center">
									<div className="p-2 rounded-lg bg-green-100">
										<MapPin className="w-6 h-6 text-green-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-600">Đã hoàn thành</p>
										<p className="text-2xl font-bold text-gray-900">{completedTours}</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Total Participants */}
					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
						<Card>
							<CardContent className="p-6">
								<div className="flex items-center">
									<div className="p-2 rounded-lg bg-purple-100">
										<Users className="w-6 h-6 text-purple-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-600">Tổng khách</p>
										<p className="text-2xl font-bold text-gray-900">{totalParticipants}</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Total Tours */}
					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
						<Card>
							<CardContent className="p-6">
								<div className="flex items-center">
									<div className="p-2 rounded-lg bg-yellow-100">
										<Clock className="w-6 h-6 text-yellow-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-600">Tổng tour</p>
										<p className="text-2xl font-bold text-gray-900">{tours.length}</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>

				{/* Filters and View Toggle */}
				<Card className="mb-6">
					<CardContent className="p-6">
						<div className="flex flex-col md:flex-row gap-4 items-center justify-between">
							<div className="flex flex-col md:flex-row gap-4 flex-1">
								<div className="relative flex-1 max-w-sm">
									<Input
										placeholder="Tìm kiếm tour..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
									/>
								</div>

								<Select value={statusFilter} onValueChange={setStatusFilter}>
									<SelectTrigger className="w-48">
										<SelectValue placeholder="Lọc theo trạng thái" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Tất cả trạng thái</SelectItem>
										<SelectItem value="upcoming">Sắp diễn ra</SelectItem>
										<SelectItem value="in_progress">Đang diễn ra</SelectItem>
										<SelectItem value="completed">Đã hoàn thành</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="flex items-center space-x-2">
								<Button
									variant={viewMode === "list" ? "default" : "outline"}
									size="sm"
									onClick={() => setViewMode("list")}
								>
									<List className="w-4 h-4 mr-2" />
									Danh sách
								</Button>
								<Button
									variant={viewMode === "calendar" ? "default" : "outline"}
									size="sm"
									onClick={() => setViewMode("calendar")}
								>
									<CalendarDays className="w-4 h-4 mr-2" />
									Lịch
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Tours List */}
				{viewMode === "list" && (
					<div className="space-y-4">
						{filteredTours.map((tour, index) => (
							<motion.div
								key={tour.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
							>
								<Card className="hover:shadow-md transition-shadow">
									<CardContent className="p-6">
										<div className="flex flex-col md:flex-row md:items-center justify-between">
											<div className="flex-1">
												<div className="flex items-center space-x-3 mb-2">
													<h3 className="text-lg font-semibold text-gray-900">{tour.name}</h3>
													{getStatusBadge(tour.status)}
												</div>

												<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
													<div className="flex items-center">
														<Calendar className="w-4 h-4 mr-2" />
														<span>
															{formatDate(tour.startDate)} - {formatDate(tour.endDate)}
														</span>
													</div>
													<div className="flex items-center">
														<MapPin className="w-4 h-4 mr-2" />
														<span>{tour.meetingLocation}</span>
													</div>
													<div className="flex items-center">
														<Users className="w-4 h-4 mr-2" />
														<span>
															{tour.participants}/{tour.maxParticipants} người
														</span>
													</div>
													<div className="flex items-center">
														<span className="font-medium text-green-600">{formatPrice(tour.price)}</span>
													</div>
												</div>

												{tour.notes && (
													<div className="mt-3 p-3 bg-yellow-50 rounded-lg">
														<p className="text-sm text-yellow-800">
															<strong>Ghi chú:</strong> {tour.notes}
														</p>
													</div>
												)}
											</div>

											<div className="mt-4 md:mt-0 md:ml-6">
												<Dialog>
													<DialogTrigger asChild>
														<Button onClick={() => setSelectedTour(tour)}>
															<Eye className="w-4 h-4 mr-2" />
															Chi tiết
														</Button>
													</DialogTrigger>
													<DialogContent className="max-w-2xl">
														<DialogHeader>
															<DialogTitle>{selectedTour?.name}</DialogTitle>
															<DialogDescription>Thông tin chi tiết về tour</DialogDescription>
														</DialogHeader>
														{selectedTour && (
															<div className="space-y-4">
																<div className="grid grid-cols-2 gap-4">
																	<div>
																		<h4 className="font-medium text-gray-900 mb-2">Thời gian</h4>
																		<p className="text-sm text-gray-600">
																			Bắt đầu: {formatDate(selectedTour.startDate)}
																		</p>
																		<p className="text-sm text-gray-600">
																			Kết thúc: {formatDate(selectedTour.endDate)}
																		</p>
																	</div>
																	<div>
																		<h4 className="font-medium text-gray-900 mb-2">Điểm hẹn</h4>
																		<p className="text-sm text-gray-600">{selectedTour.meetingLocation}</p>
																	</div>
																</div>

																<div>
																	<h4 className="font-medium text-gray-900 mb-2">Mô tả tour</h4>
																	<p className="text-sm text-gray-600">{selectedTour.description}</p>
																</div>

																<div className="grid grid-cols-2 gap-4">
																	<div>
																		<h4 className="font-medium text-gray-900 mb-2">Số lượng khách</h4>
																		<p className="text-sm text-gray-600">
																			{selectedTour.participants}/{selectedTour.maxParticipants} người
																		</p>
																	</div>
																	<div>
																		<h4 className="font-medium text-gray-900 mb-2">Giá tour</h4>
																		<p className="text-sm font-medium text-green-600">
																			{formatPrice(selectedTour.price)}
																		</p>
																	</div>
																</div>

																{selectedTour.notes && (
																	<div>
																		<h4 className="font-medium text-gray-900 mb-2">Ghi chú từ quản lý</h4>
																		<div className="p-3 bg-yellow-50 rounded-lg">
																			<p className="text-sm text-yellow-800">{selectedTour.notes}</p>
																		</div>
																	</div>
																)}

																<div className="flex justify-end space-x-2">
																	<Button variant="outline">In thông tin</Button>
																	<Button>Liên hệ khách hàng</Button>
																</div>
															</div>
														)}
													</DialogContent>
												</Dialog>
											</div>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				)}

				{/* Calendar View */}
				{viewMode === "calendar" && (
					<Card>
						<CardHeader>
							<CardTitle>Lịch tour</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-center py-12 text-gray-500">
								<CalendarDays className="w-12 h-12 mx-auto mb-4" />
								<p>Chế độ xem lịch sẽ được phát triển trong phiên bản tiếp theo</p>
							</div>
						</CardContent>
					</Card>
				)}

				{filteredTours.length === 0 && (
					<Card>
						<CardContent className="text-center py-12">
							<MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-gray-900 mb-2">Không có tour nào</h3>
							<p className="text-gray-600">
								{searchTerm || statusFilter !== "all"
									? "Không tìm thấy tour phù hợp với bộ lọc"
									: "Bạn chưa được phân công tour nào"}
							</p>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	)
}

export default MyToursContent
