"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useTripPlan } from "@/services/trip-plan"
import type { TourGuideTripplan, TripPlanStatus } from "@/types/Tripplan"
import { CalendarCheck2, Search } from 'lucide-react'
import { useEffect, useState } from "react"

export default function TripPlansBoard() {
	const [search, setSearch] = useState("")
	const [query, setQuery] = useState("")
	const [status, setStatus] = useState<TripPlanStatus | "all">("all")
	const { getTripPlanSearch } = useTripPlan()
	const [loading, setLoading] = useState(false)
	const [items, setItems] = useState<TourGuideTripplan[]>([])
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const skeletonCount = 6

	const fetchData = async () => {
		setLoading(true)
		try {
			const response = await getTripPlanSearch({
				pageNumber: page,
				pageSize: pageSize,
				title: search,
			})
			const raw: any = response?.items
			const data: TourGuideTripplan[] = Array.isArray(raw)
				? raw
				: []
			setItems(data)
		} catch (error) {
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	// Debounce search input for better UX
	useEffect(() => {
		const handler = setTimeout(() => {
			setSearch(query)
			setPage(1)
		}, 400)
		return () => clearTimeout(handler)
	}, [query])

	useEffect(() => {
		fetchData()
	}, [search, status, page, pageSize])

	const formatDate = (d?: string | Date) => {
		if (!d) return "—"
		const date = typeof d === "string" ? new Date(d) : d
		if (isNaN(date.getTime())) return "—"
		return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
	}

	const getInitials = (name?: string | null) => {
		if (!name) return "?"
		const parts = name.trim().split(/\s+/)
		const first = parts[0]?.[0] ?? ""
		const last = parts.length > 1 ? parts[parts.length - 1][0] : ""
		return (first + last).toUpperCase()
	}

	return (
		<div className="gap-6">
			{/* Center board like Study Plan grid */}
			<div className="space-y-4 max-w-full mx-auto">
				<div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
						<Input
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Tìm theo mã, tên khách, tiêu đề..."
							className="pl-9"
						/>
					</div>
					<Select value={status} onValueChange={(v) => setStatus(v as any)}>
						<SelectTrigger className="sm:w-56">
							<SelectValue placeholder="Trạng thái" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Tất cả</SelectItem>
							<SelectItem value="pending">Chờ xác nhận</SelectItem>
							<SelectItem value="confirmed">Đã xác nhận</SelectItem>
							<SelectItem value="completed">Hoàn thành</SelectItem>
							<SelectItem value="cancelled">Đã hủy</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Grid of cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
					{loading && items.length === 0 && Array.from({ length: skeletonCount }).map((_, idx) => (
						<Card key={`skeleton-${idx}`}>
							<CardContent className="p-0">
								<Skeleton className="h-36 w-full rounded-t-md" />
								<div className="p-4 space-y-3">
									<Skeleton className="h-5 w-3/4" />
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-2/3" />
									<div className="flex items-center justify-between pt-2">
										<div className="flex items-center gap-2">
											<Skeleton className="h-8 w-8 rounded-full" />
											<Skeleton className="h-4 w-24" />
										</div>
										<Skeleton className="h-8 w-20" />
									</div>
								</div>
							</CardContent>
						</Card>
					))}

					{!loading && items.map((p) => {
						const hasImage = !!p.imageUrl
						return (
							<Card key={p.id} className="overflow-hidden hover:shadow-md transition-shadow">
								<CardContent className="p-0">
									{hasImage ? (
										<img
											src={p.imageUrl as string}
											alt={p.name}
											className="h-36 w-full object-cover"
										/>
									) : (
										<div className="h-36 w-full bg-gradient-to-br from-emerald-50 to-teal-100" />
									)}
									<div className="p-4">
										<div className="flex items-start justify-between gap-2">
											<div className="font-semibold text-gray-900 line-clamp-1">{p.name || `Yêu cầu ${p.id}`}</div>
										</div>
										{p.description && (
											<div className="mt-1 text-sm text-gray-600 line-clamp-2">{p.description}</div>
										)}
										<div className="mt-3 text-xs text-gray-500">
											{formatDate(p.startDate)} – {formatDate(p.endDate)}
										</div>
										<div className="mt-4 flex items-center justify-between">
											<div className="flex items-center gap-2">
												<Avatar className="h-8 w-8">
													<AvatarImage src={undefined} alt={p.ownerName} />
													<AvatarFallback>{getInitials(p.ownerName)}</AvatarFallback>
												</Avatar>
												<div className="text-xs text-gray-600 line-clamp-1">{p.ownerName || "Chưa rõ chủ sở hữu"}</div>
											</div>
											{/* <Button size="sm" variant="outline">Xử lý</Button> */}
										</div>
									</div>
								</CardContent>
							</Card>
						)
					})}

					{!loading && items.length === 0 && (
						<div className="col-span-full">
							<Card className="bg-muted/30">
								<CardContent className="py-12 text-center">
									<div className="text-base font-medium text-gray-900">Không có kế hoạch phù hợp</div>
									<div className="text-sm text-gray-500 mt-1">Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.</div>
								</CardContent>
							</Card>
						</div>
					)}
				</div>

				{/* Pagination */}
				<div className="flex items-center justify-end gap-2 pt-2">
					<Button variant="outline" size="sm" disabled={page === 1 || loading} onClick={() => setPage((p) => Math.max(1, p - 1))}>
						Trang trước
					</Button>
					<Button variant="outline" size="sm" disabled={loading || items.length < pageSize} onClick={() => setPage((p) => p + 1)}>
						Trang sau
					</Button>
				</div>
			</div>
		</div>
	)
}
