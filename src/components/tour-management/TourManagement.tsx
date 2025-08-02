"use client"
import type React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, Eye, Edit, Trash2, Plus, AlertCircle } from "lucide-react"
import type { Tour, TourDetail } from "@/types/Tour"
import { useTour } from "@/services/tour"
import { DeleteConfirmation } from "./DeleteConfirmation"

const columns = [
	{ name: "Tên Tour", uid: "name" },
	{ name: "Loại Tour", uid: "tourTypeText" },
	{ name: "Thời Gian", uid: "totalDaysText" },
	{ name: "Giá Người Lớn", uid: "adultPrice" },
	{ name: "Giá Trẻ Em", uid: "childrenPrice" },
	{ name: "Trạng Thái", uid: "statusText" },
	{ name: "Hành Động", uid: "actions" },
]

const statusColorMap: Record<string, string> = {
	Draft: "bg-yellow-100 text-yellow-800",
	Published: "bg-green-100 text-green-800",
	Active: "bg-blue-100 text-blue-800",
	Cancelled: "bg-red-100 text-red-800",
}

const statusOptions = [
	{ key: "all", label: "Tất cả trạng thái" },
	{ key: "Draft", label: "Nháp" },
	{ key: "Published", label: "Đã xuất bản" },
	{ key: "Active", label: "Hoạt động" },
	{ key: "Cancelled", label: "Đã hủy" },
]

const tourTypeOptions = [
	{ key: "all", label: "Tất cả loại tour" },
	{ key: "Du lịch trong nước", label: "Du lịch trong nước" },
	{ key: "Du lịch nước ngoài", label: "Du lịch nước ngoài" },
	{ key: "Tour phiêu lưu", label: "Tour phiêu lưu" },
	{ key: "Tour văn hóa", label: "Tour văn hóa" },
	{ key: "Tour thiên nhiên", label: "Tour thiên nhiên" },
	{ key: "Tour lịch sử", label: "Tour lịch sử" },
]

function TourManagement() {
	const router = useRouter()
	const [tours, setTours] = useState<TourDetail[]>([])
	const [filteredTours, setFilteredTours] = useState<TourDetail[]>([])
	const [page, setPage] = useState(1)
	const [searchValue, setSearchValue] = useState("")
	const [statusFilter, setStatusFilter] = useState("all")
	const [typeFilter, setTypeFilter] = useState("all")
	const [selectedTour, setSelectedTour] = useState<TourDetail | null>(null)
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)
	const [actionLoading, setActionLoading] = useState(false)
	const [isDeleteOpen, setIsDeleteOpen] = useState(false)

	const rowsPerPage = 10
	const pages = Math.ceil(filteredTours.length / rowsPerPage)

	const { getAllTour, deleteTour } = useTour()

	const fetchAllTours = async () => {
		try {
			setError("")
			setLoading(true)
			const response = await getAllTour()
			setTours(response)
			setFilteredTours(response)
		} catch (error) {
			setError("Có lỗi khi tải dữ liệu")
			console.error("Lỗi fetch tours", error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchAllTours()
	}, [])

	// Filter tours based on search and filters
	useEffect(() => {
		let filtered = tours

		// Search filter
		if (searchValue) {
			filtered = filtered.filter(
				(tour) =>
					tour.name.toLowerCase().includes(searchValue.toLowerCase()) ||
					tour.description.toLowerCase().includes(searchValue.toLowerCase()),
			)
		}

		// Status filter
		if (statusFilter !== "all") {
			filtered = filtered.filter((tour) => tour.statusText === statusFilter)
		}

		// Type filter
		if (typeFilter !== "all") {
			filtered = filtered.filter((tour) => tour.tourTypeText === typeFilter)
		}

		setFilteredTours(filtered)
		setPage(1) // Reset to first page when filtering
	}, [tours, searchValue, statusFilter, typeFilter])

	const items = useMemo(() => {
		const start = (page - 1) * rowsPerPage
		const end = start + rowsPerPage
		return filteredTours.slice(start, end)
	}, [page, filteredTours])

	// Actions
	const handleView = (tour: TourDetail) => {
		router.push(`/tour/${tour.tourId}`)
	}

	const handleEdit = (tour: TourDetail) => {
		router.push(`/tour/${tour.tourId}/edit`)
	}

	const handleDelete = (tour: TourDetail) => {
		setSelectedTour(tour)
		setIsDeleteOpen(true)
	}

	const handleCreate = () => {
		router.push("/tour/create")
	}

	const handleConfirmDelete = async () => {
		if (!selectedTour) return

		try {
			setActionLoading(true)
			await deleteTour(selectedTour.tourId)
			await fetchAllTours()
			setIsDeleteOpen(false)
			setSelectedTour(null)
		} catch (error) {
			console.error("Error deleting tour:", error)
			setError("Có lỗi khi xóa tour")
		} finally {
			setActionLoading(false)
		}
	}

	const renderCell = useCallback((tour: TourDetail, columnKey: string) => {
		switch (columnKey) {
			case "name":
				return (
					<div className="flex flex-col">
						<p className="font-medium text-sm">{tour.name}</p>
						<p className="text-sm text-gray-500">{tour.description?.substring(0, 50)}...</p>
					</div>
				)
			case "tourTypeText":
				return <span className="text-sm">{tour.tourTypeText}</span>
			case "totalDaysText":
				return <span className="text-sm">{tour.totalDaysText}</span>
			case "adultPrice":
				return <span className="text-sm font-semibold text-green-600">{tour.adultPrice?.toLocaleString()} VNĐ</span>
			case "childrenPrice":
				return <span className="text-sm font-semibold text-blue-600">{tour.childrenPrice?.toLocaleString()} VNĐ</span>
			case "statusText":
				return (
					<Badge className={`${statusColorMap[tour.statusText] || "bg-gray-100 text-gray-800"} text-xs`}>
						{tour.statusText}
					</Badge>
				)
			case "actions":
				return (
					<div className="flex items-center justify-center gap-2">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="ghost" size="sm" onClick={() => handleView(tour)}>
										<Eye className="w-4 h-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Xem chi tiết</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="ghost" size="sm" onClick={() => handleEdit(tour)}>
										<Edit className="w-4 h-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Chỉnh sửa</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleDelete(tour)}
										className="text-red-500 hover:text-red-700"
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Xóa tour</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				)
			default:
				return tour[columnKey as keyof TourDetail] as React.ReactNode
		}
	}, [])

	if (error) {
		return (
			<Card className="max-w-md mx-auto mt-8">
				<CardContent className="text-center p-6">
					<Alert className="mb-4">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
					<Button onClick={fetchAllTours}>Thử lại</Button>
				</CardContent>
			</Card>
		)
	}

	return (
		<div className="p-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl font-bold">Quản Lý Tour</CardTitle>
				</CardHeader>
				<CardContent>
					{/* Top Content */}
					<div className="flex flex-col gap-4 mb-6">
						<div className="flex justify-between gap-3 items-end">
							<div className="relative w-full sm:max-w-[44%]">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<Input
									placeholder="Tìm kiếm theo tên tour..."
									value={searchValue}
									onChange={(e) => setSearchValue(e.target.value)}
									className="pl-10"
								/>
							</div>
							<div className="flex gap-3">
								<Select value={statusFilter} onValueChange={setStatusFilter}>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="Lọc theo trạng thái" />
									</SelectTrigger>
									<SelectContent>
										{statusOptions.map((status) => (
											<SelectItem key={status.key} value={status.key}>
												{status.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Select value={typeFilter} onValueChange={setTypeFilter}>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="Lọc theo loại tour" />
									</SelectTrigger>
									<SelectContent>
										{tourTypeOptions.map((type) => (
											<SelectItem key={type.key} value={type.key}>
												{type.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Button onClick={handleCreate} className="flex items-center gap-2">
									<Plus className="w-4 h-4" />
									Tạo Tour Mới
								</Button>
							</div>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-gray-500">Tổng cộng {filteredTours.length} tour</span>
						</div>
					</div>

					{/* Table */}
					<div className="border rounded-lg">
						<Table>
							<TableHeader>
								<TableRow>
									{columns.map((column) => (
										<TableHead key={column.uid} className={column.uid === "actions" ? "text-center" : ""}>
											{column.name}
										</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								{loading ? (
									<TableRow>
										<TableCell colSpan={columns.length} className="text-center py-8">
											Đang tải...
										</TableCell>
									</TableRow>
								) : items.length === 0 ? (
									<TableRow>
										<TableCell colSpan={columns.length} className="text-center py-8">
											Không có tour nào
										</TableCell>
									</TableRow>
								) : (
									items.map((item) => (
										<TableRow key={item.tourId}>
											{columns.map((column) => (
												<TableCell key={column.uid}>{renderCell(item, column.uid)}</TableCell>
											))}
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>

					{/* Bottom Content */}
					{pages > 1 && (
						<div className="flex justify-between items-center mt-4">
							<span className="text-sm text-gray-500">
								{filteredTours.length > 0
									? `${(page - 1) * rowsPerPage + 1}-${Math.min(page * rowsPerPage, filteredTours.length)} của ${filteredTours.length}`
									: "0 tour"}
							</span>
							<Pagination>
								<PaginationContent>
									<PaginationItem>
										<PaginationPrevious
											onClick={() => setPage(Math.max(1, page - 1))}
											className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
										/>
									</PaginationItem>
									{Array.from({ length: Math.min(5, pages) }, (_, i) => {
										const pageNum = i + 1
										return (
											<PaginationItem key={pageNum}>
												<PaginationLink
													onClick={() => setPage(pageNum)}
													isActive={page === pageNum}
													className="cursor-pointer"
												>
													{pageNum}
												</PaginationLink>
											</PaginationItem>
										)
									})}
									<PaginationItem>
										<PaginationNext
											onClick={() => setPage(Math.min(pages, page + 1))}
											className={page === pages ? "pointer-events-none opacity-50" : "cursor-pointer"}
										/>
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Delete Confirmation Modal */}
			<Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Xác Nhận Xóa</DialogTitle>
					</DialogHeader>
					{selectedTour && (
						<DeleteConfirmation
							tour={selectedTour}
							onConfirm={handleConfirmDelete}
							onCancel={() => setIsDeleteOpen(false)}
							isLoading={actionLoading}
						/>
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default TourManagement
