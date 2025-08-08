"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { LoadingSkeleton } from "@/components/common/loading-skeleton"
import { ErrorAlert } from "@/components/tourguide/error-alert"
import { StatsCard } from "@/components/tourguide/stat-card"
import { TourList } from "@/components/tourguide/tour-list"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { useDebounce } from "@/hooks/useDebounce"
import { useTourguideAssign } from "@/services/tourguide"
import { userAtom } from "@/store/auth"
import { AssignedTour, TourStats } from "@/types/Tour"
import { formatDate, formatPrice } from "@/utils/format"
import { useAtom } from "jotai"
import { ArrowLeft, Calendar, CalendarDays, Clock, List, MapPin, Users } from "lucide-react"
import Link from "next/link"

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

function MyToursContent() {
	const [user] = useAtom(userAtom)
	const [tours, setTours] = useState<AssignedTour[]>(MOCK_ASSIGNED_TOURS)
	const [searchTerm, setSearchTerm] = useState("")
	const [statusFilter, setStatusFilter] = useState<string>("all")
	const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
	const [selectedTour, setSelectedTour] = useState<AssignedTour | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [isLoading, setLoading] = useState<boolean>(false)
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
	const { getTourGuideSchedule } = useTourguideAssign()

	const debouncedSearchTerm = useDebounce(searchTerm, 300)


	const fetchTours = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await getTourGuideSchedule();
			setTours(data ?? MOCK_ASSIGNED_TOURS);
		} catch {
			setError("Không thể tải danh sách tour. Vui lòng thử lại sau.");
		} finally {
			setLoading(false);
		}
	}, [getTourGuideSchedule, user?.email]);

	useEffect(() => {
		if (user?.email) fetchTours();
	}, [user?.email, fetchTours]);

	// Memoized filtered tours với debounced search
	const filteredTours = useMemo(() => {
		return tours.filter((tour) => {
			const matchesSearch = tour.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
			const matchesStatus = statusFilter === "all" || tour.status === statusFilter
			return matchesSearch && matchesStatus
		})
	}, [tours, debouncedSearchTerm, statusFilter])

	// Memoized stats - chỉ tính toán lại khi tours thay đổi
	const tourStats = useMemo<TourStats>(() => {
		return {
			upcoming: tours.filter((t) => t.status === "upcoming").length,
			completed: tours.filter((t) => t.status === "completed").length,
			inProgress: tours.filter((t) => t.status === "in_progress").length,
			total: tours.length,
			totalParticipants: tours.reduce((sum, tour) => sum + tour.participants, 0),
			totalRevenue: tours.reduce((sum, tour) => sum + tour.price * tour.participants, 0),
		}
	}, [tours])

	const handleViewModeChange = useCallback((mode: "list" | "calendar") => {
		setViewMode(mode)
	}, [])

	const handleTourSelect = useCallback((tour: AssignedTour) => {
		setSelectedTour(tour)
		setIsDialogOpen(true)
	}, [])

	const handleStatusFilterChange = useCallback((value: string) => {
		setStatusFilter(value)
	}, [])

	const handleRetry = useCallback(() => {
		fetchTours()
	}, [])

	// Close dialog handler
	const handleCloseDialog = useCallback(() => {
		setIsDialogOpen(false)
		setSelectedTour(null)
	}, [])

	// Stats cards configuration
	const statsCards = useMemo(
		() => [
			{
				icon: Calendar,
				label: "Tour sắp tới",
				value: tourStats.upcoming,
				delay: 0.1,
				iconBgColor: "bg-blue-100",
				iconColor: "text-blue-600",
			},
			{
				icon: MapPin,
				label: "Đã hoàn thành",
				value: tourStats.completed,
				delay: 0.2,
				iconBgColor: "bg-green-100",
				iconColor: "text-green-600",
			},
			{
				icon: Users,
				label: "Tổng khách",
				value: tourStats.totalParticipants,
				delay: 0.3,
				iconBgColor: "bg-purple-100",
				iconColor: "text-purple-600",
			},
			{
				icon: Clock,
				label: "Tổng tour",
				value: tourStats.total,
				delay: 0.4,
				iconBgColor: "bg-yellow-100",
				iconColor: "text-yellow-600",
			},
		],
		[tourStats],
	)

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
								<AvatarImage src={user?.avatar || "/placeholder.svg"} />
								<AvatarFallback>
									{user && user?.fullName
										? user?.fullName[0]
										: "U"}
								</AvatarFallback>
							</Avatar>
							<div className="hidden md:block">
								<div className="text-sm font-medium">{user?.fullName}</div>
								<div className="text-xs text-gray-200">Hướng dẫn viên</div>
							</div>
						</div>
					</div>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Stats */}
				{error && <ErrorAlert message={error} onRetry={handleRetry} />}
				{/* Stats */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					{statsCards.map((card, index) => (
						<StatsCard key={index} {...card} />
					))}
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

								<Select value={statusFilter} onValueChange={handleStatusFilterChange}>
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
									onClick={() => handleViewModeChange("list")}
								>
									<List className="w-4 h-4 mr-2" />
									Danh sách
								</Button>
								<Button
									variant={viewMode === "calendar" ? "default" : "outline"}
									size="sm"
									onClick={() => handleViewModeChange("calendar")}
								>
									<CalendarDays className="w-4 h-4 mr-2" />
									Lịch
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Loading State */}
				{isLoading && <LoadingSkeleton />}

				{/* Tours List */}
				{!isLoading && viewMode === "list" && <TourList tours={filteredTours} onViewDetails={handleTourSelect} />}

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

				{/* Empty State */}
				{!isLoading && filteredTours.length === 0 && (
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

				{/* Tour Details Dialog */}
				<Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
					<DialogTrigger asChild>
						<div style={{ display: "none" }} />
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
										<p className="text-sm text-gray-600">Bắt đầu: {formatDate(selectedTour.startDate)}</p>
										<p className="text-sm text-gray-600">Kết thúc: {formatDate(selectedTour.endDate)}</p>
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
										<p className="text-sm font-medium text-green-600">{formatPrice(selectedTour.price)}</p>
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
	)
}

export default MyToursContent
