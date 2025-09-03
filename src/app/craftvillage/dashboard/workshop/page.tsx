"use client"

import BreadcrumbHeader from "@/components/common/breadcrumb-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/services/use-user"
import { useWorkshop } from "@/services/use-workshop"
import { WorkshopFilterParams } from "@/types/Workshop"
import { getUserFromLocalStorage } from "@/utils"
import { format } from "date-fns"
import { Grid, List, Plus } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { DateRange } from "react-day-picker"
import toast from "react-hot-toast"
import WorkshopCard from "./components/WorkshopCard"
import WorkshopTable from "./components/WorkshopTable"
import WorkshopFilterBar from "./molecules/WorkshopFilterBar"

// Updated interfaces based on API response
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

interface WorkshopResponseItem {
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

export default function WorkshopPage() {
	const { getWorkshops, loading } = useWorkshop()
	const { getUserDetail } = useUser()
	const [status, setStatus] = useState<string | number>("all")
	const [keyword, setKeyword] = useState("")
	const [dateRange, setDateRange] = useState<DateRange | undefined>()
	const [craftVillageId, setCraftVillageId] = useState<string | null>(null)
	const [loadingCraftVillageId, setLoadingCraftVillageId] = useState(true)
	const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')
	const searchParams = useSearchParams()
	const useMock = searchParams.get('mock') === '1'
	const user = getUserFromLocalStorage()

	const [items, setItems] = useState<WorkshopResponseItem[]>([])

	// Status mapping
	const getStatusInfo = (status: number) => {
		switch (status) {
			case 1:
				return { text: 'Đã duyệt', color: 'bg-green-100 text-green-800', variant: 'default' as const }
			case 0:
				return { text: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800', variant: 'secondary' as const }
			case 2:
				return { text: 'Bị từ chối', color: 'bg-red-100 text-red-800', variant: 'destructive' as const }
			default:
				return { text: 'Bản nháp', color: 'bg-gray-100 text-gray-800', variant: 'outline' as const }
		}
	}

	// Format price
	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND'
		}).format(price)
	}

	// Format date time
	const formatDateTime = (dateTime: string) => {
		return new Date(dateTime).toLocaleString('vi-VN', {
			weekday: 'short',
			day: '2-digit',
			month: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	// Get next upcoming schedules
	const getUpcomingSchedules = (schedules: WorkshopSchedule[]) => {
		const now = new Date()
		return schedules
			.filter(schedule => new Date(schedule.startTime) > now)
			.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
			.slice(0, 3)
	}

	// Function to get craft village ID from user detail
	const getCraftVillageId = async () => {
		try {
			setLoadingCraftVillageId(true)

			// If not in localStorage, get from user detail
			if (!user?.userId) {
				toast.error("Không tải được thông tin làng nghề !!!")
				return null
			}

			console.log("Fetching user detail for craftVillageId...")
			const userDetail = await getUserDetail(user.userId)
			console.log("User detail response:", userDetail)

			const craftVillageIdFromDetail = userDetail?.data?.craftVillagesInfo?.id || userDetail?.craftVillagesInfo?.id
			if (craftVillageIdFromDetail) {
				// Store for future use
				localStorage.setItem("craftVillageId", craftVillageIdFromDetail.toString())
				console.log("Got craftVillageId from user detail:", craftVillageIdFromDetail)
				setCraftVillageId(craftVillageIdFromDetail.toString())
				return craftVillageIdFromDetail.toString()
			}

			console.warn("No craftVillageId found in user detail")
			return null
		} catch (error) {
			console.error("Error getting craftVillageId:", error)
			return null
		} finally {
			setLoadingCraftVillageId(false)
		}
	}

	const filters = useMemo(() => {
		const baseFilters: any = {
			craftVillageId: craftVillageId,
		}

		// Add name filter if keyword is provided
		if (keyword && keyword.trim()) {
			baseFilters.name = keyword.trim()
		}

		// Add status filter if not "all"
		if (status !== "all" && status !== "" && status !== null && status !== undefined) {
			baseFilters.status = Number(status)
		}

		// Add date range filters if selected
		if (dateRange?.from) {
			baseFilters.fromDate = format(dateRange.from, 'yyyy-MM-dd')
		}
		if (dateRange?.to) {
			baseFilters.toDate = format(dateRange.to, 'yyyy-MM-dd')
		}

		console.log("Filter params:", baseFilters)
		return baseFilters
	}, [craftVillageId, keyword, status, dateRange])

	const fetchWorkshops = async (customFilters?: any) => {
		if (!craftVillageId) {
			console.warn("No craftVillageId available for fetching workshops")
			return
		}

		const filtersToUse = customFilters || filters
		console.log("Fetching workshops with filters:", filtersToUse)

		try {
			const res = await getWorkshops(filtersToUse as WorkshopFilterParams)
			console.log("Workshop API response:", res)

			if (Array.isArray(res)) {
				setItems(res)
			} else if (res?.data && Array.isArray(res.data)) {
				setItems(res.data)
			} else {
				setItems([])
			}
		} catch (error) {
			console.error("Error fetching workshops:", error)
			toast.error("Có lỗi khi tải danh sách workshop")
			setItems([])
		}
	}

	// useEffect to get craftVillageId on component mount
	useEffect(() => {
		if (user?.userId) {
			getCraftVillageId()
		}
	}, [user?.userId])

	// useEffect to fetch workshops when craftVillageId is available
	useEffect(() => {
		if (!craftVillageId || loadingCraftVillageId) return
		fetchWorkshops()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [craftVillageId, loadingCraftVillageId])

	// Handle manual search trigger
	const handleSearch = async () => {
		console.log("Manual search triggered with filters:", filters)
		await fetchWorkshops()
	}

	// Handle date range change with validation
	const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
		// Validate date range
		if (newDateRange?.from && newDateRange?.to && newDateRange.from > newDateRange.to) {
			toast.error("Ngày bắt đầu không thể lớn hơn ngày kết thúc")
			return
		}
		console.log("Date range changed:", newDateRange)
		setDateRange(newDateRange)
	}

	// Handle status change
	const handleStatusChange = (newStatus: string | number) => {
		console.log("Status changed:", newStatus)
		setStatus(newStatus)
	}

	// Handle keyword change
	const handleKeywordChange = (newKeyword: string) => {
		console.log("Keyword changed:", newKeyword)
		setKeyword(newKeyword)
	}

	// Clear all filters
	const clearFilters = () => {
		console.log("Clearing all filters")
		setStatus("all")
		setKeyword("")
		setDateRange(undefined)

		// Trigger search with cleared filters after state updates
		setTimeout(() => {
			const clearedFilters = {
				craftVillageId: craftVillageId,
			}
			fetchWorkshops(clearedFilters)
		}, 100)
	}

	// Auto-search when keyword changes with debounce (removed to prevent conflicts)
	// Removed auto-search on keyword change to prevent conflicts with manual search



	const breadcrumbItems = {
		items: [
			{
				label: "Dashboard",
				href: "/craftvillage/dashboard",
			},
			{
				label: "Trải nghiệm",
				href: "/craftvillage/dashboard/workshop",
			},
			{
				label: "Trải nghiệm làng nghề",
			},
		],
	}

	return (
		<>
			<BreadcrumbHeader items={breadcrumbItems.items} />
			<div className="p-4">
				<Card className="">
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle>Trải nghiệm làng nghề</CardTitle>
						<div className="flex items-center gap-2">
							{/* View Toggle */}
							<div className="flex items-center border rounded-lg p-1">
								<Button
									variant={viewMode === 'grid' ? 'default' : 'ghost'}
									size="sm"
									onClick={() => setViewMode('grid')}
									className="h-8 w-8 p-0"
								>
									<Grid className="h-4 w-4" />
								</Button>
								<Button
									variant={viewMode === 'table' ? 'default' : 'ghost'}
									size="sm"
									onClick={() => setViewMode('table')}
									className="h-8 w-8 p-0"
								>
									<List className="h-4 w-4" />
								</Button>
							</div>

							{/* <Link href="/craftvillage/dashboard/workshop/create">
								<Button disabled={loadingCraftVillageId || !craftVillageId}>
									<Plus className="h-4 w-4 mr-2" />
									Tạo trải nghiệm
								</Button>
							</Link> */}
						</div>
					</CardHeader>
					<CardContent>
						{loadingCraftVillageId ? (
							<div className="flex items-center justify-center py-8">
								<div className="text-center">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
									<p className="text-gray-600">Đang tải thông tin làng nghề...</p>
								</div>
							</div>
						) : !craftVillageId ? (
							<div className="flex items-center justify-center py-8">
								<div className="text-center">
									<p className="text-red-600 mb-4">Không tìm thấy thông tin làng nghề</p>
									<Button onClick={getCraftVillageId} variant="outline">
										Thử lại
									</Button>
								</div>
							</div>
						) : (
							<>
								<WorkshopFilterBar
									status={status}
									keyword={keyword}
									dateRange={dateRange}
									onChangeStatus={handleStatusChange}
									onChangeKeyword={handleKeywordChange}
									onChangeDateRange={handleDateRangeChange}
									onSearch={handleSearch}
									onClear={clearFilters}
									loading={loading}
								/>

								{viewMode === 'table' ? (
									<WorkshopTable items={items} />
								) : (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
										{items.map((workshop) => (
											<WorkshopCard
												key={workshop.id}
												workshop={workshop}
												onDelete={(id) => console.log('Delete workshop:', id)}
											/>
										))}
									</div>
								)}

								{items.length === 0 && !loading && (
									<div className="text-center py-8">
										<p className="text-gray-500">Không tìm thấy trải nghiệm nào</p>
									</div>
								)}
							</>
						)}
					</CardContent>
				</Card>
			</div>
		</>
	)
}
