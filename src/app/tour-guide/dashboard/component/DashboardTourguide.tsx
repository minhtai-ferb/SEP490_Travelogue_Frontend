'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import {
	TrendingUp,
	TrendingDown,
	Users,
	DollarSign,
	Calendar,
	Eye,
	Filter,
	Download,
	BarChart3,
	PieChart,
	Activity,
	Clock,
	MapPin,
	Star
} from 'lucide-react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer, Bar, BarChart, PieChart as RechartsPieChart, Pie, Cell } from 'recharts'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent
} from '@/components/ui/chart'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

const { RangePicker } = DatePicker

// TypeScript interfaces based on your schema
interface User {
	id: string
	name: string
	email: string
}

interface Tour {
	id: string
	name: string
	startDate: string
	endDate: string
}

interface Booking {
	id: string
	bookingDate: string
	status: string
	grossRevenue: number
	netRevenue: number
	user: User
	tour: Tour
}

interface BookingResponse {
	data: Booking[]
}

// Mock data based on your new schema
const mockBookings: Booking[] = [
	{
		id: "bkg-001",
		bookingDate: "2025-05-20T12:00:00",
		status: "confirmed",
		grossRevenue: 2000000,
		netRevenue: 1800000,
		user: {
			id: "usr-101",
			name: "Nguyen Van A",
			email: "nguyenvana@example.com"
		},
		tour: {
			id: "tour-99",
			name: "Tây Ninh City Tour",
			startDate: "2025-06-01T08:00:00",
			endDate: "2025-06-01T18:00:00"
		}
	},
	{
		id: "bkg-002",
		bookingDate: "2025-05-21T14:30:00",
		status: "completed",
		grossRevenue: 1500000,
		netRevenue: 1350000,
		user: {
			id: "usr-102",
			name: "Tran Thi B",
			email: "tranthib@example.com"
		},
		tour: {
			id: "tour-100",
			name: "Núi Bà Đen Adventure Tour",
			startDate: "2025-06-02T07:00:00",
			endDate: "2025-06-02T17:00:00"
		}
	},
	{
		id: "bkg-003",
		bookingDate: "2025-05-22T10:15:00",
		status: "pending",
		grossRevenue: 2500000,
		netRevenue: 2250000,
		user: {
			id: "usr-103",
			name: "Le Minh C",
			email: "leminhc@example.com"
		},
		tour: {
			id: "tour-101",
			name: "Workshop Gốm Sứ Tây Ninh",
			startDate: "2025-06-03T09:00:00",
			endDate: "2025-06-03T16:00:00"
		}
	},
	{
		id: "bkg-004",
		bookingDate: "2025-05-23T16:45:00",
		status: "confirmed",
		grossRevenue: 1800000,
		netRevenue: 1620000,
		user: {
			id: "usr-104",
			name: "Pham Van D",
			email: "phamvand@example.com"
		},
		tour: {
			id: "tour-102",
			name: "Cao Đài Temple & Black Virgin Mountain",
			startDate: "2025-06-04T08:30:00",
			endDate: "2025-06-04T17:30:00"
		}
	},
	{
		id: "bkg-005",
		bookingDate: "2025-05-24T11:20:00",
		status: "cancelled",
		grossRevenue: 0,
		netRevenue: 0,
		user: {
			id: "usr-105",
			name: "Hoang Thi E",
			email: "hoangthie@example.com"
		},
		tour: {
			id: "tour-103",
			name: "Tây Ninh Cuisine Experience",
			startDate: "2025-06-05T10:00:00",
			endDate: "2025-06-05T15:00:00"
		}
	}
]

// Mock dashboard data updated to match booking totals
const mockDashboardData = {
	tourGuideId: "08ddda50-0e86-4717-8e0b-43693894c439",
	fromDate: "2025-01-01T00:00:00",
	toDate: "2025-10-01T00:00:00",
	grossRevenueDirect: mockBookings.reduce((sum, booking) => sum + booking.grossRevenue, 0),
	netRevenueDirect: mockBookings.reduce((sum, booking) => sum + booking.netRevenue, 0),
	bookingsDirectCount: mockBookings.filter(b => b.status !== 'cancelled').length,
	bookingsFromToursCount: 3,
	bookingsAllCount: mockBookings.length,
	dailyStats: [
		{ date: "2025-05-20", revenueDirectGross: 2000000, revenueDirectNet: 1800000, bookingsDirect: 1, bookingsFromTours: 0, bookingsAll: 1 },
		{ date: "2025-05-21", revenueDirectGross: 1500000, revenueDirectNet: 1350000, bookingsDirect: 1, bookingsFromTours: 0, bookingsAll: 1 },
		{ date: "2025-05-22", revenueDirectGross: 2500000, revenueDirectNet: 2250000, bookingsDirect: 1, bookingsFromTours: 0, bookingsAll: 1 },
		{ date: "2025-05-23", revenueDirectGross: 1800000, revenueDirectNet: 1620000, bookingsDirect: 1, bookingsFromTours: 0, bookingsAll: 1 },
		{ date: "2025-05-24", revenueDirectGross: 0, revenueDirectNet: 0, bookingsDirect: 0, bookingsFromTours: 0, bookingsAll: 1 },
	]
}

const chartConfig = {
	revenueDirectGross: {
		label: "Doanh thu gộp",
		color: "hsl(var(--chart-1))",
	},
	revenueDirectNet: {
		label: "Doanh thu ròng",
		color: "hsl(var(--chart-2))",
	},
	bookingsAll: {
		label: "Tổng booking",
		color: "hsl(var(--chart-3))",
	},
} satisfies ChartConfig

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

function DashboardTourguide() {
	const [selectedDateRange, setSelectedDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
		dayjs().subtract(30, 'day'),
		dayjs()
	])
	const [viewType, setViewType] = useState<'revenue' | 'bookings'>('revenue')
	const [selectedBookings, setSelectedBookings] = useState<Booking[]>([])
	const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND'
		}).format(value)
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'confirmed': return 'bg-blue-100 text-blue-800'
			case 'completed': return 'bg-green-100 text-green-800'
			case 'pending': return 'bg-yellow-100 text-yellow-800'
			case 'cancelled': return 'bg-red-100 text-red-800'
			default: return 'bg-gray-100 text-gray-800'
		}
	}

	const getStatusText = (status: string) => {
		switch (status) {
			case 'confirmed': return 'Đã xác nhận'
			case 'completed': return 'Đã hoàn thành'
			case 'pending': return 'Chờ xác nhận'
			case 'cancelled': return 'Đã hủy'
			default: return status
		}
	}

	const handleChartClick = (data: any) => {
		// Filter bookings for the selected date
		const selectedDate = data.date
		const filteredBookings = mockBookings.filter(booking =>
			dayjs(booking.tour.startDate).format('YYYY-MM-DD') === selectedDate
		)
		setSelectedBookings(filteredBookings)
		setIsBookingDialogOpen(true)
	}	// Stats cards data
	const statsCards = [
		{
			title: "Tổng Doanh Thu",
			value: formatCurrency(mockDashboardData.grossRevenueDirect),
			change: "+12.5%",
			trend: "up",
			icon: DollarSign,
			description: "So với tháng trước"
		},
		{
			title: "Doanh Thu Ròng",
			value: formatCurrency(mockDashboardData.netRevenueDirect),
			change: "+8.2%",
			trend: "up",
			icon: TrendingUp,
			description: "Sau khi trừ phí"
		},
		{
			title: "Tổng Booking",
			value: mockDashboardData.bookingsAllCount.toString(),
			change: "+15.3%",
			trend: "up",
			icon: Users,
			description: "Booking trong kỳ"
		},
		{
			title: "Booking Trực Tiếp",
			value: mockDashboardData.bookingsDirectCount.toString(),
			change: "-2.1%",
			trend: "down",
			icon: Calendar,
			description: "Booking không qua tour"
		}
	]

	const pieChartData = [
		{ name: 'Booking Trực Tiếp', value: mockDashboardData.bookingsDirectCount },
		{ name: 'Booking Từ Tour', value: mockDashboardData.bookingsFromToursCount },
	]

	return (
		<div className="flex-1 space-y-6 p-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">Dashboard Hướng Dẫn Viên</h2>
					<p className="text-muted-foreground">
						Theo dõi hiệu suất và quản lý booking của bạn
					</p>
				</div>
				<div className="flex items-center space-x-2">
					<Select value={viewType} onValueChange={(value: 'revenue' | 'bookings') => setViewType(value)}>
						<SelectTrigger className="w-40">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="revenue">Doanh thu</SelectItem>
							<SelectItem value="bookings">Booking</SelectItem>
						</SelectContent>
					</Select>
					<RangePicker
						value={selectedDateRange}
						onChange={(dates) => {
							if (dates && dates[0] && dates[1]) {
								setSelectedDateRange([dates[0], dates[1]])
							}
						}}
						format="DD/MM/YYYY"
						className="w-64"
					/>
					<Button variant="outline" size="sm">
						<Download className="h-4 w-4 mr-2" />
						Xuất báo cáo
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{statsCards.map((card, index) => {
					const Icon = card.icon
					return (
						<Card key={index} className="hover:shadow-md transition-shadow">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									{card.title}
								</CardTitle>
								<Icon className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{card.value}</div>
								<div className="flex items-center text-xs text-muted-foreground">
									{card.trend === 'up' ? (
										<TrendingUp className="h-3 w-3 text-green-500 mr-1" />
									) : (
										<TrendingDown className="h-3 w-3 text-red-500 mr-1" />
									)}
									<span className={card.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
										{card.change}
									</span>
									<span className="ml-1">{card.description}</span>
								</div>
							</CardContent>
						</Card>
					)
				})}
			</div>

			{/* Charts Section */}
			<div className="grid gap-4 md:grid-cols-7">
				{/* Main Chart */}
				<Card className="col-span-5">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BarChart3 className="h-5 w-5" />
							{viewType === 'revenue' ? 'Biểu đồ Doanh thu' : 'Biểu đồ Booking'}
						</CardTitle>
						<CardDescription>
							Nhấp vào điểm trên biểu đồ để xem chi tiết booking
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer config={chartConfig}>
							<ResponsiveContainer width="100%" height={350}>
								<LineChart
									data={mockDashboardData.dailyStats}
									margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis
										dataKey="date"
										tickFormatter={(value) => dayjs(value).format('DD/MM')}
									/>
									<YAxis
										tickFormatter={(value) =>
											viewType === 'revenue'
												? `${(value / 1000000).toFixed(1)}M`
												: value.toString()
										}
									/>
									<ChartTooltip
										content={
											<ChartTooltipContent
												formatter={(value, name) => [
													viewType === 'revenue'
														? formatCurrency(value as number)
														: `${value} booking`,
													name
												]}
												labelFormatter={(value) =>
													`Ngày: ${dayjs(value).format('DD/MM/YYYY')}`
												}
											/>
										}
									/>
									<Line
										type="monotone"
										dataKey={viewType === 'revenue' ? 'revenueDirectGross' : 'bookingsAll'}
										stroke="var(--color-revenueDirectGross)"
										strokeWidth={2}
										dot={{ fill: 'var(--color-revenueDirectGross)', strokeWidth: 2, r: 4 }}
										activeDot={{
											r: 6,
											onClick: handleChartClick,
											cursor: 'pointer'
										}}
									/>
									{viewType === 'revenue' && (
										<Line
											type="monotone"
											dataKey="revenueDirectNet"
											stroke="var(--color-revenueDirectNet)"
											strokeWidth={2}
											dot={{ fill: 'var(--color-revenueDirectNet)', strokeWidth: 2, r: 4 }}
										/>
									)}
								</LineChart>
							</ResponsiveContainer>
						</ChartContainer>
					</CardContent>
				</Card>

				{/* Pie Chart */}
				<Card className="col-span-2">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<PieChart className="h-5 w-5" />
							Phân bổ Booking
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={200}>
							<RechartsPieChart>
								<Pie
									data={pieChartData}
									cx="50%"
									cy="50%"
									innerRadius={40}
									outerRadius={80}
									paddingAngle={5}
									dataKey="value"
								>
									{pieChartData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
							</RechartsPieChart>
						</ResponsiveContainer>
						<div className="space-y-2 mt-4">
							{pieChartData.map((entry, index) => (
								<div key={entry.name} className="flex items-center gap-2 text-sm">
									<div
										className="w-3 h-3 rounded-full"
										style={{ backgroundColor: COLORS[index % COLORS.length] }}
									/>
									<span>{entry.name}: {entry.value}</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Recent Bookings */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Activity className="h-5 w-5" />
						Booking Gần Đây
					</CardTitle>
					<CardDescription>
						Danh sách booking mới nhất của bạn
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Khách hàng</TableHead>
								<TableHead>Tour/Dịch vụ</TableHead>
								<TableHead>Ngày đặt</TableHead>
								<TableHead>Ngày tour</TableHead>
								<TableHead>Số người</TableHead>
								<TableHead>Doanh thu</TableHead>
								<TableHead>Trạng thái</TableHead>
								<TableHead>Hành động</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{mockBookings.map((booking) => (
								<TableRow key={booking.id} className="hover:bg-muted/50">
									<TableCell>
										<div className="flex items-center gap-2">
											<Avatar className="w-8 h-8">
												<AvatarImage src="" />
												<AvatarFallback>
													{booking.user.name.charAt(0)}
												</AvatarFallback>
											</Avatar>
											<span className="font-medium">{booking.user.name}</span>
										</div>
									</TableCell>
									<TableCell>
										<div>
											<p className="font-medium">{booking.tour.name}</p>
											<Badge variant="outline" className="text-xs">
												{booking.status !== 'cancelled' ? 'Đang hoạt động' : 'Đã hủy'}
											</Badge>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-1">
											<Calendar className="h-3 w-3 text-muted-foreground" />
											{dayjs(booking.bookingDate).format('DD/MM/YYYY')}
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-1">
											<Clock className="h-3 w-3 text-muted-foreground" />
											{dayjs(booking.tour.startDate).format('DD/MM/YYYY')}
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-1">
											<Users className="h-3 w-3 text-muted-foreground" />
											1
										</div>
									</TableCell>
									<TableCell className="font-semibold text-green-600">
										{formatCurrency(booking.grossRevenue)}
									</TableCell>
									<TableCell>
										<Badge className={getStatusColor(booking.status)}>
											{getStatusText(booking.status)}
										</Badge>
									</TableCell>
									<TableCell>
										<Dialog>
											<DialogTrigger asChild>
												<Button variant="outline" size="sm">
													<Eye className="h-3 w-3 mr-1" />
													Chi tiết
												</Button>
											</DialogTrigger>
											<DialogContent className="max-w-2xl">
												<DialogHeader>
													<DialogTitle>Chi tiết Booking #{booking.id}</DialogTitle>
													<DialogDescription>
														Thông tin đầy đủ về booking này
													</DialogDescription>
												</DialogHeader>
												<div className="grid gap-4 py-4">
													<div className="grid grid-cols-2 gap-4">
														<div>
															<h4 className="font-semibold mb-2">Thông tin khách hàng</h4>
															<div className="space-y-2 text-sm">
																<p><span className="font-medium">Tên:</span> {booking.user.name}</p>
																<p><span className="font-medium">Email:</span> {booking.user.email}</p>
															</div>
														</div>
														<div>
															<h4 className="font-semibold mb-2">Thông tin tour</h4>
															<div className="space-y-2 text-sm">
																<p><span className="font-medium">Tên tour:</span> {booking.tour.name}</p>
																<p><span className="font-medium">Mã tour:</span> {booking.tour.id}</p>
															</div>
														</div>
													</div>
													<Separator />
													<div className="grid grid-cols-2 gap-4">
														<div>
															<h4 className="font-semibold mb-2">Thời gian</h4>
															<div className="space-y-2 text-sm">
																<p><span className="font-medium">Ngày đặt:</span> {dayjs(booking.bookingDate).format('DD/MM/YYYY HH:mm')}</p>
																<p><span className="font-medium">Ngày bắt đầu:</span> {dayjs(booking.tour.startDate).format('DD/MM/YYYY HH:mm')}</p>
																<p><span className="font-medium">Ngày kết thúc:</span> {dayjs(booking.tour.endDate).format('DD/MM/YYYY HH:mm')}</p>
															</div>
														</div>
														<div>
															<h4 className="font-semibold mb-2">Thanh toán</h4>
															<div className="space-y-2 text-sm">
																<p><span className="font-medium">Doanh thu gộp:</span> <span className="text-green-600 font-semibold">{formatCurrency(booking.grossRevenue)}</span></p>
																<p><span className="font-medium">Doanh thu ròng:</span> <span className="text-blue-600 font-semibold">{formatCurrency(booking.netRevenue)}</span></p>
																<p><span className="font-medium">Trạng thái:</span>
																	<Badge className={`ml-1 ${getStatusColor(booking.status)}`}>
																		{getStatusText(booking.status)}
																	</Badge>
																</p>
															</div>
														</div>
													</div>
												</div>
											</DialogContent>
										</Dialog>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Booking Details Dialog */}
			<Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
				<DialogContent className="max-w-4xl">
					<DialogHeader>
						<DialogTitle>Chi tiết Booking theo ngày</DialogTitle>
						<DialogDescription>
							Danh sách booking trong ngày đã chọn
						</DialogDescription>
					</DialogHeader>
					<div className="max-h-96 overflow-y-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Khách hàng</TableHead>
									<TableHead>Tour/Dịch vụ</TableHead>
									<TableHead>Số người</TableHead>
									<TableHead>Doanh thu</TableHead>
									<TableHead>Trạng thái</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{selectedBookings.map((booking) => (
									<TableRow key={booking.id}>
										<TableCell>
											<div className="flex items-center gap-2">
												<Avatar className="w-6 h-6">
													<AvatarFallback className="text-xs">
														{booking.user.name.charAt(0)}
													</AvatarFallback>
												</Avatar>
												{booking.user.name}
											</div>
										</TableCell>
										<TableCell>{booking.tour.name}</TableCell>
										<TableCell>1</TableCell>
										<TableCell className="font-semibold text-green-600">
											{formatCurrency(booking.grossRevenue)}
										</TableCell>
										<TableCell>
											<Badge className={getStatusColor(booking.status)}>
												{getStatusText(booking.status)}
											</Badge>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default DashboardTourguide