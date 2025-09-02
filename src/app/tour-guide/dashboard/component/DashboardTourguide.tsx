'use client'

import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import {
	Activity,
	BarChart3,
	Calendar,
	Download,
	PieChart,
	TrendingDown,
	TrendingUp,
	Users
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { CartesianGrid, Cell, Line, LineChart, Pie, PieChart as RechartsPieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent
} from '@/components/ui/chart'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useTourguideAssign } from '@/services/tourguide'
import { getUserFromLocalStorage } from '@/utils'
import { CiMoneyBill } from 'react-icons/ci'
import BookingDetailDialog from './TourDetail'
import { useUser } from '@/services/use-user'

const { RangePicker } = DatePicker

// TypeScript interfaces based on your new API schema
interface DailyStat {
	date: string
	revenueDirectGross: number
	revenueDirectNet: number
	bookingsDirect: number
	bookingsFromTours: number
	bookingsAll: number
}

interface TourguideStatistics {
	tourGuideId: string
	fromDate: string
	toDate: string
	grossRevenueDirect: number
	netRevenueDirect: number
	bookingsDirectCount: number
	bookingsFromToursCount: number
	bookingsAllCount: number
	dailyStats: DailyStat[]
}

interface ApiResponse {
	data: TourguideStatistics
	message: string
	succeeded: boolean
	statusCode: number
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
	const user = getUserFromLocalStorage()
	const { getUserDetail } = useUser()
	const [viewType, setViewType] = useState<'revenue' | 'bookings'>('revenue')
	const [selectedBookingId, setSelectedBookingId] = useState<string>('')
	const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)

	// State for API data - initialize with mock data to avoid runtime errors
	const [statistics, setStatistics] = useState<TourguideStatistics>()
	const [isLoading, setIsLoading] = useState(false)

	const { tourguideDashboard } = useTourguideAssign()

	const getUserDetailById = async (userId: any) => {
		try {
			const userDetail = await getUserDetail(userId)
			console.log('User Detail:', userDetail)
			return userDetail
		} catch (error) {
			console.error('Error fetching user detail:', error)
			return null
		}
	}

	const fetchDashboardStatistics = async () => {
		try {
			setIsLoading(true)
			const userDetail = await getUserDetailById(user?.userId)
			const tourguideId = userDetail?.tourGuideInfo?.id

			// Validate tourguideId
			if (!tourguideId) {
				console.error('No valid tourguide ID found. Check user detail:', userDetail)
				return
			}

			const startDate = selectedDateRange[0].format('YYYY-MM-DD')
			const toDate = selectedDateRange[1].format('YYYY-MM-DD')

			const response = await tourguideDashboard(tourguideId, startDate, toDate)

			console.log('API Response:', response)

			if (response) {
				setStatistics(response)
			} else {
				console.warn('No data returned from API')
			}
		} catch (error: any) {
			console.error('Error fetching dashboard statistics:', error)
			console.error('Error details:', {
				message: error.message,
				status: error.response?.status,
				data: error.response?.data,
				config: error.config
			})
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		// Debug localStorage
		if (typeof window !== 'undefined') {
			console.log('LocalStorage Debug:', {
				tourguideId: localStorage.getItem('tourguideId'),
				userId: localStorage.getItem('userId'),
				user: localStorage.getItem('user'),
				allKeys: Object.keys(localStorage)
			})
		}

		fetchDashboardStatistics()
	}, [selectedDateRange])

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
		// For daily stats chart clicks, you might want to show detailed breakdown
		console.log('Chart clicked:', data)
	}

	// Calculate trend and percentage change from daily stats
	const calculateTrend = (type: 'grossRevenue' | 'netRevenue' | 'totalBookings' | 'directBookings') => {
		if (!statistics?.dailyStats || statistics.dailyStats.length < 2) {
			return { change: "0%", trend: "neutral" as const }
		}

		const sortedStats = [...statistics.dailyStats].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

		// For meaningful comparison, we need at least 4 data points
		if (sortedStats.length < 4) {
			return { change: "N/A", trend: "neutral" as const }
		}

		const totalDays = sortedStats.length
		const halfPoint = Math.floor(totalDays / 2)

		// Compare first half vs second half of the period
		const firstHalf = sortedStats.slice(0, halfPoint)
		const secondHalf = sortedStats.slice(halfPoint)

		let firstHalfTotal = 0
		let secondHalfTotal = 0

		// Calculate totals based on metric type
		switch (type) {
			case 'grossRevenue':
				firstHalfTotal = firstHalf.reduce((sum, stat) => sum + stat.revenueDirectGross, 0)
				secondHalfTotal = secondHalf.reduce((sum, stat) => sum + stat.revenueDirectGross, 0)
				break
			case 'netRevenue':
				firstHalfTotal = firstHalf.reduce((sum, stat) => sum + stat.revenueDirectNet, 0)
				secondHalfTotal = secondHalf.reduce((sum, stat) => sum + stat.revenueDirectNet, 0)
				break
			case 'totalBookings':
				firstHalfTotal = firstHalf.reduce((sum, stat) => sum + stat.bookingsAll, 0)
				secondHalfTotal = secondHalf.reduce((sum, stat) => sum + stat.bookingsAll, 0)
				break
			case 'directBookings':
				firstHalfTotal = firstHalf.reduce((sum, stat) => sum + stat.bookingsDirect, 0)
				secondHalfTotal = secondHalf.reduce((sum, stat) => sum + stat.bookingsDirect, 0)
				break
		}

		// Calculate average per day for more accurate comparison
		const firstHalfAvg = firstHalfTotal / firstHalf.length
		const secondHalfAvg = secondHalfTotal / secondHalf.length

		if (firstHalfAvg === 0 && secondHalfAvg === 0) {
			return { change: "0%", trend: "neutral" as const }
		}

		if (firstHalfAvg === 0) {
			return { change: "+∞", trend: "up" as const }
		}

		const percentChange = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100

		// Only show significant changes (> 1%)
		if (Math.abs(percentChange) < 1) {
			return { change: "~0%", trend: "neutral" as const }
		}

		const change = `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}%`
		const trend = percentChange > 5 ? "up" as const : percentChange < -5 ? "down" as const : "neutral" as const

		return { change, trend }
	}

	// Calculate trends for each metric
	const revenueTrend = calculateTrend('grossRevenue')
	const netRevenueTrend = calculateTrend('netRevenue')
	const bookingTrend = calculateTrend('totalBookings')
	const directBookingTrend = calculateTrend('directBookings')

	// Generate dynamic descriptions based on data analysis
	const getSmartDescription = (trend: ReturnType<typeof calculateTrend>, type: string) => {
		if (trend.change === "N/A") return "Cần thêm dữ liệu"
		if (trend.change === "0%" || trend.change === "~0%") return "Ổn định so với kỳ trước"

		const isPositive = trend.trend === 'up'
		const changeValue = parseFloat(trend.change.replace(/[+%∞~]/g, ''))

		if (type === 'revenue') {
			if (isPositive) {
				return changeValue > 20 ? "Tăng trưởng mạnh" : changeValue > 10 ? "Tăng trưởng tốt" : "Tăng trưởng ổn định"
			} else {
				return changeValue < -20 ? "Cần xem xét lại" : changeValue < -10 ? "Đang giảm" : "Giảm nhẹ"
			}
		} else {
			if (isPositive) {
				return changeValue > 30 ? "Đặt booking tăng mạnh" : changeValue > 15 ? "Xu hướng tích cực" : "Tăng nhẹ"
			} else {
				return changeValue < -30 ? "Cần cải thiện marketing" : changeValue < -15 ? "Booking đang giảm" : "Giảm nhẹ"
			}
		}
	}

	// Create stats cards from statistics data with calculated trends
	const statsCards = [
		{
			title: "Tổng Doanh Thu",
			value: formatCurrency(statistics?.grossRevenueDirect || 0),
			change: revenueTrend.change,
			trend: revenueTrend.trend,
			icon: CiMoneyBill,
			description: getSmartDescription(revenueTrend, 'revenue')
		},
		{
			title: "Doanh Thu Ròng",
			value: formatCurrency(statistics?.netRevenueDirect || 0),
			change: netRevenueTrend.change,
			trend: netRevenueTrend.trend,
			icon: TrendingUp,
			description: getSmartDescription(netRevenueTrend, 'revenue')
		},
		{
			title: "Tổng lượt đặt",
			value: (statistics?.bookingsAllCount || 0).toString(),
			change: bookingTrend.change,
			trend: bookingTrend.trend,
			icon: Users,
			description: getSmartDescription(bookingTrend, 'booking')
		},
		{
			title: "Đặt HDV Trực Tiếp",
			value: (statistics?.bookingsDirectCount || 0).toString(),
			change: directBookingTrend.change,
			trend: directBookingTrend.trend,
			icon: Calendar,
			description: getSmartDescription(directBookingTrend, 'booking')
		}
	]

	// Auto-generate business insights from the data
	const generateInsights = () => {
		const insights: string[] = []

		if (!statistics?.dailyStats || statistics.dailyStats.length < 2) {
			return ["Cần thêm dữ liệu để phân tích xu hướng"]
		}

		// Revenue analysis
		if (revenueTrend.trend === 'up' && parseFloat(revenueTrend.change.replace(/[+%∞~]/g, '')) > 15) {
			insights.push("🚀 Doanh thu đang tăng trưởng mạnh - tiếp tục duy trì chiến lược hiện tại")
		} else if (revenueTrend.trend === 'down' && parseFloat(revenueTrend.change.replace(/[+\-~%∞]/g, '')) > 15) {
			insights.push("⚠️ Doanh thu giảm đáng kể - cần xem xét lại giá cả và marketing")
		}

		// Booking efficiency analysis
		const directBookingRate = statistics.bookingsDirectCount / (statistics.bookingsAllCount || 1)
		if (directBookingRate > 0.7) {
			insights.push("💪 Tỷ lệ booking trực tiếp cao - bạn có thương hiệu cá nhân mạnh")
		} else if (directBookingRate < 0.3) {
			insights.push("📈 Cơ hội phát triển booking trực tiếp để tăng lợi nhuận")
		}

		// Revenue vs Booking correlation
		const avgRevenuePerBooking = (statistics.grossRevenueDirect || 0) / (statistics.bookingsAllCount || 1)
		if (avgRevenuePerBooking > 2000000) {
			insights.push("💰 Doanh thu trung bình cao - tập trung vào khách hàng chất lượng")
		}

		// Weekly pattern analysis
		const dailyStats = statistics.dailyStats
		const weekendRevenue = dailyStats.filter(stat => {
			const day = new Date(stat.date).getDay()
			return day === 0 || day === 6 // Sunday or Saturday
		}).reduce((sum, stat) => sum + stat.revenueDirectGross, 0)

		const weekdayRevenue = dailyStats.filter(stat => {
			const day = new Date(stat.date).getDay()
			return day >= 1 && day <= 5 // Monday to Friday
		}).reduce((sum, stat) => sum + stat.revenueDirectGross, 0)

		if (weekendRevenue > weekdayRevenue * 1.5) {
			insights.push("🎯 Cuối tuần là thời điểm vàng - tối ưu hóa lịch trình cuối tuần")
		}

		return insights.length > 0 ? insights.slice(0, 3) : ["Dashboard đang phân tích dữ liệu để đưa ra insights"]
	}

	const businessInsights = generateInsights()

	const pieChartData = [
		{ name: 'Booking Trực Tiếp', value: statistics?.bookingsDirectCount || 0 },
		{ name: 'Booking Từ Tour', value: statistics?.bookingsFromToursCount || 0 },
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
									) : card.trend === 'down' ? (
										<TrendingDown className="h-3 w-3 text-red-500 mr-1" />
									) : (
										<Activity className="h-3 w-3 text-gray-500 mr-1" />
									)}
									<span className={
										card.trend === 'up' ? 'text-green-500' :
											card.trend === 'down' ? 'text-red-500' : 'text-gray-500'
									}>
										{card.change}
									</span>
									<span className="ml-1">{card.description}</span>
								</div>
							</CardContent>
						</Card>
					)
				})}
			</div>

			{/* Business Insights */}
			<Card className="border-l-4 border-l-blue-500">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Activity className="h-5 w-5" />
						Business Insights
					</CardTitle>
					<CardDescription>
						Phân tích tự động từ dữ liệu của bạn
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{businessInsights.map((insight, index) => (
							<div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
								<div className="h-2 w-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
								<p className="text-sm text-gray-700 leading-relaxed">{insight}</p>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

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
									data={statistics?.dailyStats || []}
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
							<TableRow>
								<TableCell colSpan={8} className="text-center text-muted-foreground py-8">
									<div className="space-y-2">
										<p>Danh sách booking chi tiết sẽ có ở phiên bản tới</p>
										<p className="text-sm">Hiện tại chỉ hiển thị thống kê tổng hợp từ dailyStats</p>
									</div>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<BookingDetailDialog
				open={isBookingDialogOpen}
				onOpenChange={setIsBookingDialogOpen}
				bookingId={selectedBookingId}
			/>

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
								{/* TODO: Add individual bookings when available from API */}
								<TableRow>
									<TableCell colSpan={5} className="text-center text-muted-foreground py-8">
										Dữ liệu booking chi tiết sẽ có ở phiên bản tới
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default DashboardTourguide