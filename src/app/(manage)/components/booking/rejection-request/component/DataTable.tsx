import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useTourguideAssign } from '@/services/tourguide'
import { RejectionRequestDetail } from '@/types/Tourguide'
import { ColumnDef } from '@tanstack/react-table'
import { Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TableSkeleton } from './Skeleton'
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

			{/* Table */}
			<div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
				<Table>
					<TableHeader>
						<TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 border-b-2 border-gray-200">
							{columns.map((column, idx) => (
								<TableHead key={(column as any).accessorKey ?? column.id ?? idx} className="font-semibold text-gray-800 py-4 text-sm">
									{typeof column.header === 'string' ? column.header : null}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					{loading ? (
						<TableBody>
							<TableRow>
								<TableCell colSpan={columns.length} className="text-center py-16">
									<div className="flex flex-col items-center gap-3">
										<div className="relative">
											<Loader2 className="w-8 h-8 animate-spin text-blue-500" />
											<div className="absolute inset-0 w-8 h-8 border-2 border-blue-200 rounded-full animate-pulse"></div>
										</div>
										<div className="space-y-1">
											<span className="text-base font-medium text-gray-700">Đang tải dữ liệu...</span>
											<span className="text-sm text-gray-500">Vui lòng chờ trong giây lát</span>
										</div>
									</div>
								</TableCell>
							</TableRow>
						</TableBody>
					) : (
						<TableBody>
							{data.length === 0 ? (
								<TableRow>
									<TableCell colSpan={columns.length} className="text-center py-16">
										<div className="flex flex-col items-center gap-4">
											<div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-sm">
												<span className="text-gray-400 text-2xl">📄</span>
											</div>
											<div className="space-y-2">
												<span className="text-lg font-semibold text-gray-700">Không có dữ liệu</span>
												<p className="text-sm text-gray-500 max-w-md">
													Không tìm thấy yêu cầu nào khớp với bộ lọc hiện tại. 
													Hãy thử thay đổi các tiêu chí tìm kiếm.
												</p>
											</div>
										</div>
									</TableCell>
								</TableRow>
							) : (
								data.map((item, index) => (
									<TableRow 
										key={item.id} 
										className={`hover:bg-blue-50/70 transition-all duration-200 border-b border-gray-100 group ${
											index % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
										}`}
									>
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
												<TableCell key={key ?? column.id ?? cidx} className="text-gray-700 py-4 group-hover:bg-transparent transition-colors">
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
			<div className="flex flex-col lg:flex-row items-center justify-between gap-4 pt-4 px-2">
				{/* Page Size Selector */}
				<div className="flex items-center gap-3 text-sm">
					<span className="text-gray-600 whitespace-nowrap font-medium">Hiển thị</span>
					<Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
						<SelectTrigger className="w-[80px] h-9 border-gray-300 bg-white hover:border-blue-400 transition-colors">
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
				<div className="flex flex-col lg:flex-row items-center gap-4">
					{/* Page Range Info */}
					<div className="text-sm text-gray-600 font-medium bg-gray-50 px-3 py-2 rounded-lg hidden lg:block">
						{total === 0 ? (
							"Không có dữ liệu"
						) : (
							<span>
								<span className="font-semibold text-blue-600">{((page - 1) * pageSize + 1).toLocaleString()}</span>
								{" - "}
								<span className="font-semibold text-blue-600">{Math.min(page * pageSize, total).toLocaleString()}</span>
								{" trong "}
								<span className="font-semibold">{total.toLocaleString()}</span>
							</span>
						)}
					</div>

					{/* Navigation Buttons */}
					<div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onPageChange(1)}
							disabled={page <= 1}
							className="h-8 w-8 p-0 hover:bg-blue-50 disabled:opacity-50 transition-colors"
							title="Trang đầu"
						>
							<ChevronsLeft className="h-4 w-4" />
						</Button>

						<Button
							variant="ghost"
							size="sm"
							onClick={() => onPageChange(page - 1)}
							disabled={page <= 1}
							className="h-8 w-8 p-0 hover:bg-blue-50 disabled:opacity-50 transition-colors"
							title="Trang trước"
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>

						{/* Page Numbers */}
						<div className="flex items-center gap-1 mx-1">
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
											variant={pageNum === page ? "default" : "ghost"}
											size="sm"
											onClick={() => onPageChange(pageNum as number)}
											className={`h-8 w-8 p-0 transition-all duration-200 ${pageNum === page
													? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-sm"
													: "hover:bg-blue-50 text-gray-700"
												}`}
										>
											{pageNum}
										</Button>
									)
								))
							})()}
						</div>

						<Button
							variant="ghost"
							size="sm"
							onClick={() => onPageChange(page + 1)}
							disabled={page >= Math.ceil(total / pageSize)}
							className="h-8 w-8 p-0 hover:bg-blue-50 disabled:opacity-50 transition-colors"
							title="Trang sau"
						>
							<ChevronRight className="h-4 w-4" />
						</Button>

						<Button
							variant="ghost"
							size="sm"
							onClick={() => onPageChange(Math.ceil(total / pageSize))}
							disabled={page >= Math.ceil(total / pageSize)}
							className="h-8 w-8 p-0 hover:bg-blue-50 disabled:opacity-50 transition-colors"
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