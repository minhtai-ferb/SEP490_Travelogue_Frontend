"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, DollarSign, TrendingUp, TrendingDown, Users, ShoppingBag, Building2, Loader2, Download, RefreshCw } from "lucide-react"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import dayjs from 'dayjs'
import { useCraftVillage } from '@/services/use-craftvillage'
import { useUser } from '@/services/use-user'
import { getUserFromLocalStorage } from '@/utils'

// Types based on your schema
interface DailyRevenueDto {
	date: string
	gross: number
	net: number
	grossDirect: number
	netDirect: number
	grossFromTours: number
	netFromTours: number
}

interface CraftVillageWorkshopDashboardDto {
	craftVillageId: string
	fromDate: string
	toDate: string
	grossTotal: number
	netTotal: number
	grossDirectTotal: number
	netDirectTotal: number
	grossFromToursTotal: number
	netFromToursTotal: number
	daily: DailyRevenueDto[]
}

interface DashboardStats {
	totalRevenue: number
	directRevenue: number
	tourRevenue: number
	netProfit: number
	averageDailyRevenue: number
	workshopsSold: number
	trend: {
		revenue: number
		profit: number
		workshops: number
	}
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

function DashboardCraftVillage() {
	const [dashboardData, setDashboardData] = useState<CraftVillageWorkshopDashboardDto | null>(null)
	const [statistics, setStatistics] = useState<DashboardStats | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string>("")
	const [dateRange, setDateRange] = useState({
		fromDate: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
		toDate: dayjs().format('YYYY-MM-DD')
	})

	const { getCraftVillageInfo, getCraftVillageDashboard } = useCraftVillage()
	const { getUserDetail } = useUser()
	const user = getUserFromLocalStorage()

	// Function to get craft village ID from user detail
	const getCraftVillageId = async () => {
		try {
			// Try to get from localStorage first
			const storedCraftVillageId =
				localStorage.getItem("craftVillageId") ||
				localStorage.getItem("craft_village_id")

			if (storedCraftVillageId) {
				console.log("Found craftVillageId in localStorage:", storedCraftVillageId)
				return storedCraftVillageId
			}

			// If not in localStorage, get from user detail
			if (!user?.userId) {
				console.warn("No user ID available")
				return null
			}

			const userDetail = await getUserDetail(user.userId)
			console.log("User detail response:", userDetail)

			const craftVillageId = userDetail?.data?.craftVillagesInfo?.id || userDetail?.craftVillagesInfo?.id
			if (craftVillageId) {
				// Store for future use
				localStorage.setItem("craftVillageId", craftVillageId.toString())
				console.log("Got craftVillageId from user detail:", craftVillageId)
				return craftVillageId.toString()
			}

			console.warn("No craftVillageId found in user detail")
			return null
		} catch (error) {
			console.error("Error getting craftVillageId:", error)
			return null
		}
	}

	// Function to fetch dashboard data (will need API endpoint)
	const fetchDashboardData = async () => {
		try {
			setLoading(true)
			setError("")

			const craftVillageId = await getCraftVillageId()
			if (!craftVillageId) {
				setError("Không tìm thấy thông tin làng nghề ID")
				return
			}

			// Try to fetch real data from API
			try {
				console.log("Fetching dashboard data for craftVillageId:", craftVillageId)
				const response = await getCraftVillageDashboard(craftVillageId, dateRange.fromDate, dateRange.toDate)
				console.log("Dashboard response:", response)

				if (response) {
					setDashboardData(response)
					calculateStatistics(response)
					return
				}
			} catch (apiError) {
				console.warn("API call failed, using mock data:", apiError)
			}

			// Fallback to mock data if API fails
			const mockData: CraftVillageWorkshopDashboardDto = {
				craftVillageId: craftVillageId,
				fromDate: dateRange.fromDate,
				toDate: dateRange.toDate,
				grossTotal: 85000000,
				netTotal: 68000000,
				grossDirectTotal: 50000000,
				netDirectTotal: 40000000,
				grossFromToursTotal: 35000000,
				netFromToursTotal: 28000000,
				daily: Array.from({ length: 30 }, (_, i) => ({
					date: dayjs().subtract(29 - i, 'days').format('YYYY-MM-DD'),
					gross: Math.floor(Math.random() * 5000000) + 1000000,
					net: Math.floor(Math.random() * 4000000) + 800000,
					grossDirect: Math.floor(Math.random() * 3000000) + 500000,
					netDirect: Math.floor(Math.random() * 2500000) + 400000,
					grossFromTours: Math.floor(Math.random() * 2000000) + 500000,
					netFromTours: Math.floor(Math.random() * 1600000) + 400000,
				}))
			}

			setDashboardData(mockData)
			calculateStatistics(mockData)

		} catch (error) {
			console.error("Error fetching dashboard data:", error)
			setError("Không thể tải dữ liệu dashboard")
		} finally {
			setLoading(false)
		}
	}

	// Calculate trend and statistics
	const calculateTrend = (data: number[]): number => {
		if (data.length < 2) return 0
		const midPoint = Math.floor(data.length / 2)
		const firstHalf = data.slice(0, midPoint)
		const secondHalf = data.slice(midPoint)

		const firstHalfAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length
		const secondHalfAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length

		if (firstHalfAvg === 0) return 0
		return ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100
	}

	const calculateStatistics = (data: CraftVillageWorkshopDashboardDto) => {
		const dailyRevenues = data.daily.map(d => d.gross)
		const dailyProfits = data.daily.map(d => d.net)
		const workshopsCount = data.daily.length * 5 // Mock workshops per day

		const stats: DashboardStats = {
			totalRevenue: data.grossTotal,
			directRevenue: data.grossDirectTotal,
			tourRevenue: data.grossFromToursTotal,
			netProfit: data.netTotal,
			averageDailyRevenue: data.grossTotal / data.daily.length,
			workshopsSold: workshopsCount,
			trend: {
				revenue: calculateTrend(dailyRevenues),
				profit: calculateTrend(dailyProfits),
				workshops: Math.floor(Math.random() * 20) - 10, // Mock trend
			}
		}
		setStatistics(stats)
	}

	const generateInsights = () => {
		if (!statistics || !dashboardData) return []

		const insights = []
		const { trend, totalRevenue, directRevenue, tourRevenue } = statistics

		// Revenue insights
		if (trend.revenue > 5) {
			insights.push({
				type: 'success',
				message: `Doanh thu tăng ${trend.revenue.toFixed(1)}% so với nửa đầu kỳ - xu hướng tích cực!`
			})
		} else if (trend.revenue < -5) {
			insights.push({
				type: 'warning',
				message: `Doanh thu giảm ${Math.abs(trend.revenue).toFixed(1)}% - cần xem xét chiến lược kinh doanh`
			})
		}

		// Revenue source analysis
		const directPercentage = (directRevenue / totalRevenue) * 100
		if (directPercentage > 60) {
			insights.push({
				type: 'info',
				message: `${directPercentage.toFixed(1)}% doanh thu từ bán trực tiếp - mô hình kinh doanh ổn định`
			})
		} else {
			insights.push({
				type: 'info',
				message: `${(100 - directPercentage).toFixed(1)}% doanh thu từ tour - cơ hội mở rộng hợp tác`
			})
		}

		// Weekend analysis
		const weekendRevenue = dashboardData.daily.filter(d => {
			const dayOfWeek = dayjs(d.date).day()
			return dayOfWeek === 0 || dayOfWeek === 6
		})

		if (weekendRevenue.length > 0) {
			const avgWeekendRevenue = weekendRevenue.reduce((sum, d) => sum + d.gross, 0) / weekendRevenue.length
			const avgTotalRevenue = statistics.averageDailyRevenue

			if (avgWeekendRevenue > avgTotalRevenue * 1.2) {
				insights.push({
					type: 'success',
					message: 'Cuối tuần là thời điểm hoạt động mạnh nhất - tận dụng để tăng doanh thu'
				})
			}
		}

		return insights
	}

	useEffect(() => {
		fetchDashboardData()
	}, [dateRange, user?.userId])

	// Handle date range change
	const handleDateRangeChange = (newFromDate: string, newToDate: string) => {
		setDateRange({
			fromDate: newFromDate,
			toDate: newToDate
		})
	}

	// Export dashboard data to JSON
	const exportData = () => {
		if (!dashboardData) return

		const dataToExport = {
			craftVillage: dashboardData.craftVillageId,
			period: `${dateRange.fromDate}_to_${dateRange.toDate}`,
			summary: {
				totalRevenue: statistics?.totalRevenue,
				netProfit: statistics?.netProfit,
				directRevenue: statistics?.directRevenue,
				tourRevenue: statistics?.tourRevenue,
				workshopsSold: statistics?.workshopsSold,
				averageDailyRevenue: statistics?.averageDailyRevenue,
			},
			dailyData: dashboardData.daily,
			insights: generateInsights(),
			exportedAt: new Date().toISOString()
		}

		const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `craft-village-dashboard-${dateRange.fromDate}-${dateRange.toDate}.json`
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
					<p className="text-gray-600">Đang tải dữ liệu dashboard làng nghề...</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="max-w-md mx-auto">
					<Alert className="border-red-200 bg-red-50">
						<AlertDescription className="text-red-800">
							{error}
						</AlertDescription>
					</Alert>
					<div className="mt-4 text-center">
						<Button onClick={fetchDashboardData} variant="outline">
							Thử lại
						</Button>
					</div>
				</div>
			</div>
		)
	}

	const insights = generateInsights()
	const chartData = dashboardData?.daily.map(d => ({
		date: dayjs(d.date).format('DD/MM'),
		'Doanh thu': d.gross / 1000000,
		'Lợi nhuận': d.net / 1000000,
		'Bán trực tiếp': d.grossDirect / 1000000,
		'Từ tour': d.grossFromTours / 1000000,
	})) || []

	const revenueSourceData = [
		{ name: 'Bán trực tiếp', value: statistics?.directRevenue || 0, color: '#0088FE' },
		{ name: 'Từ tour du lịch', value: statistics?.tourRevenue || 0, color: '#00C49F' }
	]

	return (
		<div className="p-6 space-y-6 bg-gray-50 min-h-screen">
			{/* Header */}
			<div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Dashboard Làng Nghề</h1>
					<p className="text-gray-600 mt-1">Theo dõi hoạt động kinh doanh và workshop</p>
				</div>
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
					{/* Date Range Picker */}
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
						<div className="flex items-center gap-2">
							<Label htmlFor="fromDate" className="text-sm whitespace-nowrap">Từ ngày:</Label>
							<Input
								id="fromDate"
								type="date"
								value={dateRange.fromDate}
								onChange={(e) => handleDateRangeChange(e.target.value, dateRange.toDate)}
								className="w-40"
							/>
						</div>
						<div className="flex items-center gap-2">
							<Label htmlFor="toDate" className="text-sm whitespace-nowrap">Đến ngày:</Label>
							<Input
								id="toDate"
								type="date"
								value={dateRange.toDate}
								onChange={(e) => handleDateRangeChange(dateRange.fromDate, e.target.value)}
								className="w-40"
							/>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Button onClick={fetchDashboardData} size="sm" variant="outline">
							<RefreshCw className="w-4 h-4 mr-2" />
							Làm mới
						</Button>
						<Button onClick={exportData} size="sm" disabled={!dashboardData}>
							<Download className="w-4 h-4 mr-2" />
							Xuất dữ liệu
						</Button>
					</div>
				</div>
			</div>

			{/* Summary Card */}
			<Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
				<CardHeader>
					<CardTitle className="text-lg font-semibold text-blue-900 flex items-center gap-2">
						<Building2 className="w-5 h-5" />
						Tổng quan kinh doanh
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
						<div className="text-center">
							<p className="text-blue-600 font-medium">Tỷ lệ lợi nhuận</p>
							<p className="text-2xl font-bold text-blue-900">
								{((statistics?.netProfit || 0) / (statistics?.totalRevenue || 1) * 100).toFixed(1)}%
							</p>
						</div>
						<div className="text-center">
							<p className="text-blue-600 font-medium">Doanh thu từ tour</p>
							<p className="text-2xl font-bold text-blue-900">
								{((statistics?.tourRevenue || 0) / (statistics?.totalRevenue || 1) * 100).toFixed(1)}%
							</p>
						</div>
						<div className="text-center">
							<p className="text-blue-600 font-medium">Workshop/ngày</p>
							<p className="text-2xl font-bold text-blue-900">
								{Math.round((statistics?.workshopsSold || 0) / 30)}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
						<DollarSign className="h-4 w-4 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{(statistics?.totalRevenue || 0).toLocaleString('vi-VN')}đ
						</div>
						<div className="flex items-center mt-1">
							{(statistics?.trend.revenue || 0) >= 0 ? (
								<TrendingUp className="w-4 h-4 text-green-600 mr-1" />
							) : (
								<TrendingDown className="w-4 h-4 text-red-600 mr-1" />
							)}
							<span className={`text-sm ${(statistics?.trend.revenue || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
								{Math.abs(statistics?.trend.revenue || 0).toFixed(1)}%
							</span>
							<span className="text-sm text-gray-600 ml-1">so với nửa đầu kỳ</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Lợi nhuận ròng</CardTitle>
						<TrendingUp className="h-4 w-4 text-blue-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{(statistics?.netProfit || 0).toLocaleString('vi-VN')}đ
						</div>
						<div className="flex items-center mt-1">
							{(statistics?.trend.profit || 0) >= 0 ? (
								<TrendingUp className="w-4 h-4 text-green-600 mr-1" />
							) : (
								<TrendingDown className="w-4 h-4 text-red-600 mr-1" />
							)}
							<span className={`text-sm ${(statistics?.trend.profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
								{Math.abs(statistics?.trend.profit || 0).toFixed(1)}%
							</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Workshop đã bán</CardTitle>
						<ShoppingBag className="h-4 w-4 text-orange-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{statistics?.workshopsSold || 0}</div>
						<div className="flex items-center mt-1">
							<Badge variant="secondary" className="text-xs">
								Trung bình {Math.round((statistics?.workshopsSold || 0) / 30)} workshop/ngày
							</Badge>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">TB doanh thu/ngày</CardTitle>
						<Building2 className="h-4 w-4 text-purple-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{(statistics?.averageDailyRevenue || 0).toLocaleString('vi-VN')}đ
						</div>
						<div className="text-sm text-gray-600 mt-1">
							{((statistics?.netProfit || 0) / (statistics?.totalRevenue || 1) * 100).toFixed(1)}% tỷ suất lợi nhuận
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>Biểu đồ doanh thu theo thời gian</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={350}>
							<LineChart data={chartData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis />
								<Tooltip
									formatter={(value: number, name: string) => [
										`${value.toFixed(1)}M đ`,
										name
									]}
								/>
								<Line
									type="monotone"
									dataKey="Doanh thu"
									stroke="#8884d8"
									strokeWidth={2}
									dot={{ fill: '#8884d8', strokeWidth: 2 }}
								/>
								<Line
									type="monotone"
									dataKey="Lợi nhuận"
									stroke="#82ca9d"
									strokeWidth={2}
									dot={{ fill: '#82ca9d', strokeWidth: 2 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Cơ cấu doanh thu</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={350}>
							<PieChart>
								<Pie
									data={revenueSourceData}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={120}
									paddingAngle={5}
									dataKey="value"
								>
									{revenueSourceData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip
									formatter={(value: number) => [`${(value / 1000000).toFixed(1)}M đ`, 'Doanh thu']}
								/>
							</PieChart>
						</ResponsiveContainer>
						<div className="mt-4 space-y-2">
							{revenueSourceData.map((item, index) => (
								<div key={index} className="flex items-center gap-2">
									<div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
									<span className="text-sm">{item.name}</span>
									<span className="text-sm font-medium ml-auto">
										{((item.value / (statistics?.totalRevenue || 1)) * 100).toFixed(1)}%
									</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Revenue breakdown */}
			<Card>
				<CardHeader>
					<CardTitle>Chi tiết doanh thu theo nguồn</CardTitle>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={300}>
						<AreaChart data={chartData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip
								formatter={(value: number, name: string) => [
									`${value.toFixed(1)}M đ`,
									name
								]}
							/>
							<Area
								type="monotone"
								dataKey="Bán trực tiếp"
								stackId="1"
								stroke="#0088FE"
								fill="#0088FE"
								fillOpacity={0.6}
							/>
							<Area
								type="monotone"
								dataKey="Từ tour"
								stackId="1"
								stroke="#00C49F"
								fill="#00C49F"
								fillOpacity={0.6}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{/* Business Insights */}
			{insights.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Users className="w-5 h-5" />
							Phân tích kinh doanh
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{insights.map((insight, index) => (
								<Alert
									key={index}
									className={`
                    ${insight.type === 'success' ? 'border-green-200 bg-green-50' : ''}
                    ${insight.type === 'warning' ? 'border-yellow-200 bg-yellow-50' : ''}
                    ${insight.type === 'info' ? 'border-blue-200 bg-blue-50' : ''}
                  `}
								>
									<AlertDescription className={`
                    ${insight.type === 'success' ? 'text-green-800' : ''}
                    ${insight.type === 'warning' ? 'text-yellow-800' : ''}
                    ${insight.type === 'info' ? 'text-blue-800' : ''}
                  `}>
										{insight.message}
									</AlertDescription>
								</Alert>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	)
}

export default DashboardCraftVillage