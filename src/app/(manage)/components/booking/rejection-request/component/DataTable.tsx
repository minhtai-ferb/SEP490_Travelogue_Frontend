import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useTourguideAssign } from '@/services/tourguide'
import { RejectionRequestDetail } from '@/types/Tourguide'
import { ColumnDef } from '@tanstack/react-table'
import { Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
interface DataTableProps {
	columns: ColumnDef<RejectionRequestDetail>[]
	data: RejectionRequestDetail[]
	loading: boolean
	total: number
	page: number
	pageSize: number
	onPageChange: (page: number) => void
	onPageSizeChange: (pageSize: number) => void
}

function DataTable({ columns, data, loading, total, page, pageSize, onPageChange, onPageSizeChange }: DataTableProps) {
	const { getTourguideProfile } = useTourguideAssign()

	const [guideById, setGuideById] = useState<Record<string, { name: string; email: string }>>({})

	useEffect(() => {
		const ids = Array.from(new Set(data.map(d => d.tourGuideId).filter(Boolean) as string[]))
		const missing = ids.filter(id => !(id in guideById))
		if (missing.length === 0) return
		let cancelled = false

			; (async () => {
				const entries = await Promise.all(missing.map(async (id) => {
					try {
						const p = await getTourguideProfile(id)
						console.log("ppppp", p)
						return [id, {
							name: p?.userName ?? p?.fullName ?? p?.name ?? p?.email ?? id,
							email: p?.email ?? ''
						}] as any
					} catch {
						return [id, { name: id, email: '' }] as any
					}
				}))
				if (!cancelled) {
					setGuideById(prev => {
						const next = { ...prev }
						entries.forEach(([id, info]) => { next[id] = info })
						return next
					})
				}
			})()

		return () => { cancelled = true }
	}, [data, getTourguideProfile])

	return (
		<div className="space-y-4">
			{/* Header with total count */}
			<div className="flex justify-between items-center">
				<div className="text-sm text-gray-600 font-medium">
					Tổng cộng {total.toLocaleString()} kết quả
				</div>
				<div className="text-xs text-gray-500">
					Trang {page} / {Math.ceil(total / pageSize)}
				</div>
			</div>

			{/* Table */}
			<div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
				<Table>
					<TableHeader>
						<TableRow className="bg-gray-50/80 hover:bg-gray-50">
							{columns.map((column, idx) => (
								<TableHead key={(column as any).accessorKey ?? column.id ?? idx} className="font-semibold text-gray-700">
									{typeof column.header === 'string' ? column.header : null}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					{loading ? (
						<TableBody>
							<TableRow>
								<TableCell colSpan={columns.length} className="text-center py-12">
									<div className="flex flex-col items-center gap-2">
										<Loader2 className="w-6 h-6 animate-spin text-blue-500" />
										<span className="text-sm text-gray-500">Đang tải dữ liệu...</span>
									</div>
								</TableCell>
							</TableRow>
						</TableBody>
					) : (
						<TableBody>
							{data.length === 0 ? (
								<TableRow>
									<TableCell colSpan={columns.length} className="text-center py-12">
										<div className="flex flex-col items-center gap-2">
											<div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
												<span className="text-gray-400 text-xl">📄</span>
											</div>
											<span className="text-sm text-gray-500 font-medium">Không có dữ liệu</span>
											<span className="text-xs text-gray-400">Thử thay đổi bộ lọc hoặc tìm kiếm khác</span>
										</div>
									</TableCell>
								</TableRow>
							) : (
								data.map((item, index) => (
									<TableRow key={item.id} className={`hover:bg-blue-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
										{columns.map((column, cidx) => {
											const key = (column as any).accessorKey as string | undefined
											const value = key ? (item as any)[key] : undefined
											let content: any = value
											if (typeof (column as any).cell === 'function') {
												try {
													content = (column as any).cell({ row: { original: item }, getValue: () => value })
												} catch {
													content = value
												}
											}
											if (key === 'tourGuideId') content = guideById[value]?.name ?? value
											if (key === 'tourGuideEmail') content = guideById[value]?.email ?? ''
											return (
												<TableCell key={key ?? column.id ?? cidx} className="text-gray-700">
													{content ?? ''}
												</TableCell>
											)
										})}
									</TableRow>
								))
							)}
						</TableBody>
					)}
				</Table>
			</div>

			{/* Pagination Controls */}
			<div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
				{/* Page Size Selector */}
				<div className="flex items-center gap-2 text-sm">
					<span className="text-gray-600 whitespace-nowrap">Hiển thị</span>
					<Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
						<SelectTrigger className="w-[80px] h-8">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{[5, 10, 20, 50, 100].map((size) => (
								<SelectItem key={size} value={size.toString()}>
									{size}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<span className="text-gray-600 whitespace-nowrap">mục mỗi trang</span>
				</div>

				{/* Page Info and Navigation */}
				<div className="flex items-center gap-6">
					{/* Page Range Info */}
					<div className="text-sm text-gray-600 hidden sm:block">
						{total === 0 ? (
							"Không có dữ liệu"
						) : (
							`${((page - 1) * pageSize + 1).toLocaleString()}-${Math.min(page * pageSize, total).toLocaleString()} trong ${total.toLocaleString()}`
						)}
					</div>

					{/* Navigation Buttons */}
					<div className="flex items-center gap-1">
						<Button
							variant="outline"
							size="sm"
							onClick={() => onPageChange(1)}
							disabled={page <= 1}
							className="h-8 w-8 p-0 hover:bg-blue-50 disabled:opacity-50"
							title="Trang đầu"
						>
							<ChevronsLeft className="h-4 w-4" />
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={() => onPageChange(page - 1)}
							disabled={page <= 1}
							className="h-8 w-8 p-0 hover:bg-blue-50 disabled:opacity-50"
							title="Trang trước"
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>

						{/* Page Numbers */}
						<div className="flex items-center gap-1">
							{(() => {
								const totalPages = Math.ceil(total / pageSize)
								const showPages = []

								// Logic for showing page numbers (Google-style)
								if (totalPages <= 7) {
									// Show all pages if total <= 7
									for (let i = 1; i <= totalPages; i++) {
										showPages.push(i)
									}
								} else {
									// Always show page 1
									showPages.push(1)

									if (page <= 4) {
										// Show 1,2,3,4,5...last
										for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
											showPages.push(i)
										}
										if (totalPages > 6) showPages.push('...')
										showPages.push(totalPages)
									} else if (page >= totalPages - 3) {
										// Show 1...last-4,last-3,last-2,last-1,last
										if (totalPages > 6) showPages.push('...')
										for (let i = Math.max(totalPages - 4, 2); i <= totalPages; i++) {
											showPages.push(i)
										}
									} else {
										// Show 1...current-1,current,current+1...last
										showPages.push('...')
										for (let i = page - 1; i <= page + 1; i++) {
											showPages.push(i)
										}
										showPages.push('...')
										showPages.push(totalPages)
									}
								}

								return showPages.map((pageNum, index) => (
									pageNum === '...' ? (
										<span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
									) : (
										<Button
											key={pageNum}
											variant={pageNum === page ? "default" : "outline"}
											size="sm"
											onClick={() => onPageChange(pageNum as number)}
											className={`h-8 w-8 p-0 ${pageNum === page
												? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
												: "hover:bg-blue-50"
												}`}
										>
											{pageNum}
										</Button>
									)
								))
							})()}
						</div>

						<Button
							variant="outline"
							size="sm"
							onClick={() => onPageChange(page + 1)}
							disabled={page >= Math.ceil(total / pageSize)}
							className="h-8 w-8 p-0 hover:bg-blue-50 disabled:opacity-50"
							title="Trang sau"
						>
							<ChevronRight className="h-4 w-4" />
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={() => onPageChange(Math.ceil(total / pageSize))}
							disabled={page >= Math.ceil(total / pageSize)}
							className="h-8 w-8 p-0 hover:bg-blue-50 disabled:opacity-50"
							title="Trang cuối"
						>
							<ChevronsRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
export default DataTable