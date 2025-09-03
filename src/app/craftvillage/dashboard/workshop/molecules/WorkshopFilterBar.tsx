"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"
import { X, Search, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type Props = {
	status: string | number
	keyword: string
	dateRange?: DateRange
	onChangeStatus: (status: string | number) => void
	onChangeKeyword: (keyword: string) => void
	onChangeDateRange?: (dateRange: DateRange | undefined) => void
	onSearch: () => void
	onClear?: () => void
	loading?: boolean
}

export default function WorkshopFilterBar({
	status,
	keyword,
	dateRange,
	onChangeStatus,
	onChangeKeyword,
	onChangeDateRange,
	onSearch,
	onClear,
	loading
}: Props) {
	// Check if any filters are active
	const hasActiveFilters = Boolean(
		(status !== "all" && status !== "") ||
		keyword.trim() ||
		dateRange?.from ||
		dateRange?.to
	)

	// Count active filters
	const getActiveFilterCount = () => {
		let count = 0
		if (status !== "all" && status !== "") count++
		if (keyword.trim()) count++
		if (dateRange?.from || dateRange?.to) count++
		return count
	}

	const activeFilterCount = getActiveFilterCount()

	// Handle clear filters
	const handleClearFilters = () => {
		onChangeStatus("all")
		onChangeKeyword("")
		if (onChangeDateRange) {
			onChangeDateRange(undefined)
		}
		if (onClear) {
			onClear()
		}
		// Auto trigger search after clearing
		setTimeout(() => {
			onSearch()
		}, 100)
	}

	// Handle search with Enter key
	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			onSearch()
		}
	}

	return (
		<div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
			{/* Filter Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Filter className="h-5 w-5 text-gray-500" />
					<h3 className="font-medium text-gray-900">Bộ lọc tìm kiếm</h3>
					{activeFilterCount > 0 && (
						<Badge variant="secondary" className="text-xs">
							{activeFilterCount} bộ lọc
						</Badge>
					)}
				</div>
				{hasActiveFilters && (
					<Button
						variant="outline"
						size="sm"
						onClick={handleClearFilters}
						disabled={loading}
						className="text-red-600 border-red-200 hover:bg-red-50"
					>
						<X className="h-4 w-4 mr-1" />
						Xóa tất cả
					</Button>
				)}
			</div>

			{/* Filter Controls */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{/* Search Input */}
				<div className="space-y-2">
					<label className="text-sm font-medium text-gray-700">Tên workshop</label>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						<Input
							placeholder="Nhập tên workshop..."
							value={keyword}
							onChange={(e) => onChangeKeyword(e.target.value)}
							onKeyPress={handleKeyPress}
							className="pl-10"
							disabled={loading}
						/>
						{keyword && (
							<Button
								variant="ghost"
								size="sm"
								className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-200"
								onClick={() => onChangeKeyword("")}
							>
								<X className="h-3 w-3" />
							</Button>
						)}
					</div>
				</div>

				{/* Status Select */}
				<div className="space-y-2">
					<label className="text-sm font-medium text-gray-700">Trạng thái</label>
					<Select
						value={String(status)}
						onValueChange={(v) => onChangeStatus(v === "all" ? "all" : Number(v))}
						disabled={loading}
					>
						<SelectTrigger>
							<SelectValue placeholder="Chọn trạng thái" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 rounded-full bg-gray-400"></div>
									Tất cả trạng thái
								</div>
							</SelectItem>
							<SelectItem value="0">
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 rounded-full bg-yellow-500"></div>
									Chờ duyệt
								</div>
							</SelectItem>
							<SelectItem value="1">
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 rounded-full bg-green-500"></div>
									Đã duyệt
								</div>
							</SelectItem>
							<SelectItem value="2">
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 rounded-full bg-red-500"></div>
									Bị từ chối
								</div>
							</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Date Range Picker */}
				<div className="space-y-2">
					<label className="text-sm font-medium text-gray-700">Thời gian tạo</label>
					<div className={loading ? "pointer-events-none opacity-50" : ""}>
						<DatePickerWithRange
							date={dateRange}
							onSelect={onChangeDateRange}
							placeholder="Chọn khoảng thời gian"
						/>
					</div>
				</div>

				{/* Search Button */}
				<div className="space-y-2">
					<label className="text-sm font-medium text-gray-700 opacity-0">Action</label>
					<Button
						onClick={onSearch}
						disabled={loading}
						className="w-full bg-blue-600 hover:bg-blue-700"
						size="default"
					>
						<Search className="h-4 w-4 mr-2" />
						{loading ? "Đang lọc..." : "Tìm kiếm"}
					</Button>
				</div>
			</div>

			{/* Active Filters Display */}
			{hasActiveFilters && (
				<div className="flex flex-wrap gap-2">
					<span className="text-sm text-gray-600">Đang lọc:</span>

					{status !== "all" && status !== "" && (
						<Badge variant="outline" className="flex items-center gap-1">
							Trạng thái: {
								status === 0 ? "Chờ duyệt" :
									status === 1 ? "Đã duyệt" :
										status === 2 ? "Bị từ chối" : "Không xác định"
							}
							<X
								className="h-3 w-3 cursor-pointer"
								onClick={() => onChangeStatus("all")}
							/>
						</Badge>
					)}

					{keyword.trim() && (
						<Badge variant="outline" className="flex items-center gap-1">
							Tên: "{keyword}"
							<X
								className="h-3 w-3 cursor-pointer"
								onClick={() => onChangeKeyword("")}
							/>
						</Badge>
					)}

					{(dateRange?.from || dateRange?.to) && (
						<Badge variant="outline" className="flex items-center gap-1">
							Thời gian: {dateRange?.from?.toLocaleDateString('vi-VN')} - {dateRange?.to?.toLocaleDateString('vi-VN')}
							<X
								className="h-3 w-3 cursor-pointer"
								onClick={() => onChangeDateRange?.(undefined)}
							/>
						</Badge>
					)}
				</div>
			)}
		</div>
	)
}


