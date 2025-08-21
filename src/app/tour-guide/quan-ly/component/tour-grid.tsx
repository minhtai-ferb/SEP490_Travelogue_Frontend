"use client"

import { useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTourguideAssign } from "@/services/tourguide"
import { Search } from 'lucide-react'
import toast from "react-hot-toast"
import TourCard from "./tour-card"
import { isValidDateIso } from "@/utils/validation"
import { GuideScheduleItem, ScheduleType } from "@/types/Tourguide"
import DatePicker from "antd/es/date-picker"
import dayjs from "dayjs"
import { PaginationBar } from "@/app/(manage)/components/tour-management/PaginationBar"


export default function ToursGrid({ view = "current" as "current" | "history" }) {
	const { getTourGuideSchedule } = useTourguideAssign()
	const [items, setItems] = useState<GuideScheduleItem[]>([])
	const [search, setSearch] = useState("")
	const [filterTime, setFilterTime] = useState<"all" | "upcoming" | "past">("all")
	const [filterType, setFilterType] = useState<"all" | ScheduleType>("all")
	const [loading, setLoading] = useState(false)
	const [page, setPage] = useState<number>(1)
	const [pageSize, setPageSize] = useState<number>(5)
	const [startDate, setStartDate] = useState<string>("")
	const [endDate, setEndDate] = useState<string>("")

	const fetchData = async () => {
		setLoading(true)
		try {
			// Fetch rộng để các filter client (search, type, range) hoạt động ổn định
			const response = await getTourGuideSchedule(1, startDate, endDate, 1, 1000)
			const raw: any = response
			const data: GuideScheduleItem[] = Array.isArray(raw)
				? raw
				: Array.isArray(raw?.data)
					? raw.data
					: []
			setItems(data)
		} catch (error) {
			console.error(error)
			toast.error("Lỗi: " + (error as any)?.message || "Không thể tải dữ liệu")
			setItems([])
		} finally {
			setLoading(false)
		}
	}


	useEffect(() => {
		fetchData()
	}, [startDate, endDate])

	const filtered = useMemo(() => {
		const now = new Date()
		const q = search.trim().toLowerCase()
		const start = startDate ? new Date(startDate) : null
		const end = endDate ? new Date(endDate) : null
		if (end) end.setHours(23, 59, 59, 999)

		return items.filter((it) => {
			const matchesType = filterType === "all" || it.scheduleType === filterType
			const matchesSearch =
				!q ||
				it.customerName?.toLowerCase().includes(q) ||
				it.tourName?.toLowerCase().includes(q) ||
				it.scheduleType.toLowerCase().includes(q)

			let matchesTime = true
			const hasDate = isValidDateIso(it.date)
			if (hasDate) {
				const d = new Date(it.date)
				// Tab view overrides filterTime for clarity
				const effectiveFilter = view === "history" ? "past" : view === "current" ? "upcoming" : filterTime
				if (effectiveFilter !== "all") {
					if (effectiveFilter === "upcoming") matchesTime = d >= new Date(now.toDateString())
					if (effectiveFilter === "past") matchesTime = d < new Date(now.toDateString())
				}
				if (matchesTime && start && d < start) matchesTime = false
				if (matchesTime && end && d > end) matchesTime = false
			}

			return matchesType && matchesSearch && matchesTime
		})
	}, [items, search, filterTime, filterType, startDate, endDate, view])

	const sorted = useMemo(() => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		return [...filtered].sort((a, b) => {
			const da = isValidDateIso(a.date) ? new Date(a.date) : null;
			const db = isValidDateIso(b.date) ? new Date(b.date) : null;

			// đẩy bản ghi không có/không hợp lệ ngày xuống cuối
			if (!da && !db) return 0;
			if (!da) return 1;
			if (!db) return -1;

			const aFuture = da >= today;
			const bFuture = db >= today;

			// ưu tiên tương lai trước
			if (aFuture !== bFuture) return aFuture ? -1 : 1;

			// cùng nhóm: tương lai ↑ (gần nhất trước), quá khứ ↓ (gần nhất trước)
			return aFuture ? da.getTime() - db.getTime() : db.getTime() - da.getTime();
		});
	}, [filtered]);

	useEffect(() => {
		setPage(1)
	}, [search, filterTime, filterType, startDate, endDate])

	const totalCount = sorted.length
	const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
	const startIndex = (page - 1) * pageSize
	const currentItems = sorted.slice(startIndex, startIndex + pageSize)

	return (
		<div className="space-y-4">
			<div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
					<Input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Tìm theo tên khách/tour, loại lịch..."
						className="pl-9"
					/>
				</div>
				<Select value={filterType} onValueChange={(v) => setFilterType(v as any)}>
					<SelectTrigger className="lg:w-48"><SelectValue placeholder="Loại lịch" /></SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Tất cả loại</SelectItem>
						<SelectItem value="Booking">Người dùng đặt</SelectItem>
						<SelectItem value="TourSchedule">Lịch trình</SelectItem>
					</SelectContent>
				</Select>
				<DatePicker
					className="w-48 bg-white rounded-md"
					placeholder="Chọn ngày bắt đầu"
					value={startDate ? dayjs(startDate) : null}
					onChange={(date) => setStartDate(date?.toISOString() ?? "")}
				/>
				<DatePicker
					className="w-48 bg-white rounded-md"
					value={endDate ? dayjs(endDate) : null}
					onChange={(date) => setEndDate(date?.toISOString() ?? "")}
					placeholder="Chọn ngày kết thúc"
				/>
			</div>

			{/* rows like course cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{currentItems.map((item) => (
					<TourCard
						key={item?.id}
						item={item}
					/>
				))}
			</div>

			{/* Pagination controls */}
			<div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
				<div className="flex items-center gap-2 text-sm text-gray-600">
					<span>Hiển thị</span>
					<Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
						<SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
						<SelectContent>
							<SelectItem value="5">5</SelectItem>
							<SelectItem value="10">10</SelectItem>
							<SelectItem value="20">20</SelectItem>
							<SelectItem value="50">50</SelectItem>
						</SelectContent>
					</Select>
					<span>mục/trang</span>
				</div>
				<PaginationBar
					page={Math.min(page, totalPages)}
					pages={totalPages}
					pageSize={pageSize}
					totalCount={totalCount}
					onPageChange={setPage}
				/>
			</div>

		</div>
	)
}
