"use client"

import { useEffect, useMemo, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useTourguideAssign } from "@/services/tourguide"
import { TourguideRequestStatus, TourguideRequestStatusDisplay, type TourGuideRequestItem } from "@/types/Tourguide"
import { Banknote, Check, Eye, Search, X, ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react"
import toast from "react-hot-toast"

export default function TourguideRequestsPage() {
	const { getTourguideRequest, requestReview, loading } = useTourguideAssign()
	const [status, setStatus] = useState<TourguideRequestStatus | "all">("all")
	const [query, setQuery] = useState("")
	const [search, setSearch] = useState("")
	const [items, setItems] = useState<TourGuideRequestItem[]>([])
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(12)
	const [rejectingId, setRejectingId] = useState<string | null>(null)
	const [rejectReason, setRejectReason] = useState("")
	const [approvingId, setApprovingId] = useState<string | null>(null)
	const [approveReason, setApproveReason] = useState("")
	const [openId, setOpenId] = useState<string | null>(null)
	const [sortBy, setSortBy] = useState<"fullName" | "price" | "status">("fullName")
	const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

	// Debounce
	useEffect(() => {
		const t = setTimeout(() => {
			setSearch(query)
			setPage(1)
		}, 350)
		return () => clearTimeout(t)
	}, [query])

	const fetchData = async () => {
		try {
			const response: any = await getTourguideRequest(
				status === "all" ? TourguideRequestStatus.All : (status as TourguideRequestStatus)
			)
			const list: TourGuideRequestItem[] = Array.isArray(response) ? response : []
			const filtered = search
				? list.filter(
					(it) =>
						it.fullName?.toLowerCase().includes(search.toLowerCase()) ||
						it.email?.toLowerCase().includes(search.toLowerCase())
				)
				: list
			setItems(filtered)
		} catch (e) {
			console.error(e)
		}
	}

	useEffect(() => {
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search, status])

	const displayPrice = (price?: number) =>
		typeof price === "number" ? price.toLocaleString("vi-VN") + " đ" : "—"

	const initials = (name?: string) => {
		if (!name) return "?"
		const parts = name.trim().split(/\s+/)
		const f = parts[0]?.[0] ?? ""
		const l = parts.length > 1 ? parts[parts.length - 1][0] : ""
		return (f + l).toUpperCase()
	}

	const handleApproveConfirm = async () => {
		if (!approvingId) return
		try {
			const payload: any = { status: TourguideRequestStatus.Approved }
			if (approveReason?.trim()) payload.rejectionReason = approveReason.trim()
			await requestReview(approvingId, payload)
			setApprovingId(null)
			setApproveReason("")
			toast.success("Yêu cầu đã được chấp nhận")
			await fetchData()
		} catch (e) {
			console.error(e)
			toast.error("Lỗi khi thực hiện yêu cầu, hãy thử lại sau ít phút")
		}
	}

	const handleReject = async () => {
		if (!rejectingId) return
		try {
			await requestReview(rejectingId, { status: TourguideRequestStatus.Rejected, rejectionReason: rejectReason })
			setRejectingId(null)
			setRejectReason("")
			toast.success("Yêu cầu đã được từ chối")
			await fetchData()
		} catch (e) {
			console.error(e)
			toast.error("Lỗi khi thực hiện yêu cầu, hãy thử lại sau ít phút")
		}
	}

	const statusBadge = (s: TourguideRequestStatus | number | undefined) => {
		const status = (s as TourguideRequestStatus) ?? TourguideRequestStatus.Pending
		switch (status) {
			case TourguideRequestStatus.Pending:
				return <Badge className="border-amber-200 bg-amber-100 text-amber-800">{TourguideRequestStatusDisplay[TourguideRequestStatus.Pending]}</Badge>
			case TourguideRequestStatus.Approved:
				return <Badge className="border-emerald-200 bg-emerald-100 text-emerald-800">{TourguideRequestStatusDisplay[TourguideRequestStatus.Approved]}</Badge>
			case TourguideRequestStatus.Rejected:
				return <Badge className="border-rose-200 bg-rose-100 text-rose-800">{TourguideRequestStatusDisplay[TourguideRequestStatus.Rejected]}</Badge>
			default:
				return <Badge variant="secondary">Trạng thái</Badge>
		}
	}

	const resolveCertUrl = (url?: string) => {
		if (!url) return "#"
		if (/^https?:\/\//i.test(url)) return url
		const base = process.env.NEXT_PUBLIC_API_BASE_URL || ""
		if (!base) return url
		return `${base.replace(/\/$/, "")}/${url.replace(/^\//, "")}`
	}

	const isPending = (s?: TourguideRequestStatus | number) => Number(s) === Number(TourguideRequestStatus.Pending)

	const sortedItems = useMemo(() => {
		const list = [...items]
		list.sort((a, b) => {
			const dir = sortDir === "asc" ? 1 : -1
			if (sortBy === "fullName") {
				const av = (a.fullName || "").toLowerCase()
				const bv = (b.fullName || "").toLowerCase()
				return av.localeCompare(bv) * dir
			}
			if (sortBy === "price") {
				const av = typeof a.price === "number" ? a.price : Number.POSITIVE_INFINITY
				const bv = typeof b.price === "number" ? b.price : Number.POSITIVE_INFINITY
				return (av - bv) * dir
			}
			// status
			const av = Number(a.status ?? TourguideRequestStatus.Pending)
			const bv = Number(b.status ?? TourguideRequestStatus.Pending)
			return (av - bv) * dir
		})
		return list
	}, [items, sortBy, sortDir])

	const totalItems = sortedItems.length
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
	const pagedItems = useMemo(() => {
		const start = (page - 1) * pageSize
		return sortedItems.slice(start, start + pageSize)
	}, [sortedItems, page, pageSize])

	const toggleSort = (field: "fullName" | "price" | "status") => {
		if (sortBy === field) {
			setSortDir((d) => (d === "asc" ? "desc" : "asc"))
		} else {
			setSortBy(field)
			setSortDir("asc")
		}
		setPage(1)
	}

	return (
		<div className="w-full mx-auto px-4 space-y-6">
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Quản lý yêu cầu hướng dẫn viên</h1>
					<p className="text-sm text-muted-foreground">Duyệt, chấp nhận hoặc từ chối các yêu cầu đăng ký</p>
				</div>
			</div>

			{/* Toolbar */}
			<div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
					<Input
						placeholder="Tìm theo tên hoặc email hướng dẫn viên"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="pl-9"
					/>
				</div>
				<Select value={String(status)} onValueChange={(v) => setStatus(v === "all" ? "all" : Number(v) as TourguideRequestStatus)}>
					<SelectTrigger className="sm:w-56">
						<SelectValue placeholder="Trạng thái" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Tất cả</SelectItem>
						<SelectItem value={String(TourguideRequestStatus.Pending)}>{TourguideRequestStatusDisplay[TourguideRequestStatus.Pending]}</SelectItem>
						<SelectItem value={String(TourguideRequestStatus.Approved)}>{TourguideRequestStatusDisplay[TourguideRequestStatus.Approved]}</SelectItem>
						<SelectItem value={String(TourguideRequestStatus.Rejected)}>{TourguideRequestStatusDisplay[TourguideRequestStatus.Rejected]}</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="rounded-md border">
				<div className="overflow-x-auto">
					<Table className="min-w-[800px]">
						<TableHeader className="sticky top-0 z-10 bg-white">
							<TableRow>
								<TableHead className="w-[280px]">
									<button className="inline-flex items-center gap-1 font-medium" onClick={() => toggleSort("fullName")}
										title="Sắp xếp theo tên">
										<span>Hướng dẫn viên</span>
										{sortBy !== "fullName" ? (
											<ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
										) : sortDir === "asc" ? (
											<ArrowUp className="w-3.5 h-3.5 text-gray-600" />
										) : (
											<ArrowDown className="w-3.5 h-3.5 text-gray-600" />
										)}
									</button>
								</TableHead>
								<TableHead>Giới thiệu</TableHead>
								<TableHead className="w-[140px]">
									<button className="inline-flex items-center gap-1 font-medium" onClick={() => toggleSort("price")} title="Sắp xếp theo giá">
										<span>Giá đề xuất</span>
										{sortBy !== "price" ? (
											<ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
										) : sortDir === "asc" ? (
											<ArrowUp className="w-3.5 h-3.5 text-gray-600" />
										) : (
											<ArrowDown className="w-3.5 h-3.5 text-gray-600" />
										)}
									</button>
								</TableHead>
								<TableHead className="w-[150px]">
									<button className="inline-flex items-center gap-1 font-medium" onClick={() => toggleSort("status")} title="Sắp xếp theo trạng thái">
										<span>Trạng thái</span>
										{sortBy !== "status" ? (
											<ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
										) : sortDir === "asc" ? (
											<ArrowUp className="w-3.5 h-3.5 text-gray-600" />
										) : (
											<ArrowDown className="w-3.5 h-3.5 text-gray-600" />
										)}
									</button>
								</TableHead>
								<TableHead className="w-[120px]">Chứng chỉ</TableHead>
								<TableHead className="w-[260px] text-right">Hành động</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading && items.length === 0 && Array.from({ length: 6 }).map((_, i) => (
								<TableRow key={`sk-${i}`} className="hover:bg-transparent">
									<TableCell>
										<div className="flex items-center gap-3">
											<Skeleton className="h-10 w-10 rounded-full" />
											<div className="space-y-2">
												<Skeleton className="h-4 w-40" />
												<Skeleton className="h-3 w-28" />
											</div>
										</div>
									</TableCell>
									<TableCell><Skeleton className="h-4 w-64" /></TableCell>
									<TableCell><Skeleton className="h-4 w-16" /></TableCell>
									<TableCell><Skeleton className="h-6 w-24" /></TableCell>
									<TableCell><Skeleton className="h-4 w-10" /></TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end gap-2">
											<Skeleton className="h-8 w-24" />
											<Skeleton className="h-8 w-24" />
											<Skeleton className="h-8 w-20" />
										</div>
									</TableCell>
								</TableRow>
							))}

							{!loading && pagedItems.map((it) => (
								<TableRow key={it.id} className="hover:bg-muted/40">
									<TableCell>
										<div className="flex items-center gap-3">
											<Avatar>
												<AvatarFallback>{initials(it.fullName)}</AvatarFallback>
											</Avatar>
											<div>
												<div className="font-semibold text-gray-900">{it.fullName}</div>
												<div className="text-xs text-gray-500">{it.email}</div>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div className="max-w-[520px] text-sm text-gray-700 line-clamp-2">{it.introduction || "—"}</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-1 text-sm">
											<Banknote className="w-3.5 h-3.5 text-gray-500" /> {displayPrice(it.price)}
										</div>
									</TableCell>
									<TableCell>{statusBadge(it.status as TourguideRequestStatus)}</TableCell>
									<TableCell>
										<div className="text-sm text-gray-700">
											{it.certifications?.length ? (
												<span>{it.certifications.length} mục</span>
											) : (
												<span>—</span>
											)}
										</div>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex items-center justify-end gap-2">
											<Button size="sm" variant="secondary" onClick={() => setOpenId(it.id)}>
												<Eye className="w-4 h-4 mr-1" /> Xem chi tiết
											</Button>
											<AlertDialog>
												<AlertDialogTrigger asChild>
													{isPending(it.status) ? (
														<Button size="sm" variant="outline" onClick={() => { setApprovingId(it.id); setApproveReason("") }}>
															<Check className="w-4 h-4 mr-1" /> Chấp nhận
														</Button>
													) : (
														<Button size="sm" variant="outline" disabled className="hidden">
															<Check className="w-4 h-4 mr-1" /> Đã chấp nhận
														</Button>
													)}
												</AlertDialogTrigger>
												<AlertDialogContent>
													<AlertDialogHeader>
														<AlertDialogTitle>Lý do chấp nhận (tuỳ chọn)</AlertDialogTitle>
														<AlertDialogDescription>Bạn có thể ghi chú lý do chấp nhận yêu cầu này (không bắt buộc).</AlertDialogDescription>
													</AlertDialogHeader>
													<Textarea rows={3} placeholder="Nhập lý do (không bắt buộc)..." value={approveReason} onChange={(e) => setApproveReason(e.target.value)} />
													<AlertDialogFooter>
														<AlertDialogCancel onClick={() => { setApprovingId(null); setApproveReason("") }}>Hủy</AlertDialogCancel>
														<AlertDialogAction onClick={handleApproveConfirm}>Xác nhận</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog>
											<AlertDialog>
												<AlertDialogTrigger asChild>
													{isPending(it.status) ? (
														<Button size="sm" variant="destructive" onClick={() => { setRejectingId(it.id); setRejectReason("") }}>
															<X className="w-4 h-4 mr-1" /> Từ chối
														</Button>
													) : (
														<Button size="sm" variant="destructive" disabled className="hidden">
															<X className="w-4 h-4 mr-1" /> Đã từ chối
														</Button>
													)}
												</AlertDialogTrigger>
												<AlertDialogContent>
													<AlertDialogHeader>
														<AlertDialogTitle>Lý do từ chối</AlertDialogTitle>
														<AlertDialogDescription>Hãy cung cấp lý do để từ chối yêu cầu này.</AlertDialogDescription>
													</AlertDialogHeader>
													<Textarea rows={4} placeholder="Nhập lý do..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
													<AlertDialogFooter>
														<AlertDialogCancel onClick={() => { setRejectingId(null); setRejectReason("") }}>Hủy</AlertDialogCancel>
														<AlertDialogAction onClick={handleReject} disabled={!rejectingId || !rejectReason.trim()}>Xác nhận</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog>
										</div>
									</TableCell>
								</TableRow>
							))}

							{!loading && pagedItems.length === 0 && (
								<TableRow>
									<TableCell colSpan={6} className="h-24 text-center text-sm text-gray-600">Không có yêu cầu nào — thử đổi bộ lọc hoặc từ khóa.</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				{/* Pagination */}
				<div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3">
					<div className="text-sm text-gray-600">
						Hiển thị {(Math.min((page - 1) * pageSize + 1, totalItems))}-{Math.min(page * pageSize, totalItems)} trong {totalItems}
					</div>
					<div className="flex items-center gap-2">
						<Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1) }}>
							<SelectTrigger className="w-24"><SelectValue placeholder="Số dòng" /></SelectTrigger>
							<SelectContent>
								<SelectItem value="10">10 / trang</SelectItem>
								<SelectItem value="20">20 / trang</SelectItem>
								<SelectItem value="50">50 / trang</SelectItem>
							</SelectContent>
						</Select>
						<div className="flex items-center gap-2">
							<Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Trước</Button>
							<Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Sau</Button>
						</div>
					</div>
				</div>

				{/* Detail Sheet */}
				<Sheet open={!!openId} onOpenChange={(o) => !o && setOpenId(null)}>
					<SheetContent side="right" className="sm:max-w-md">
						<SheetHeader>
							<SheetTitle>Chi tiết yêu cầu</SheetTitle>
							<SheetDescription>Thông tin từ hướng dẫn viên</SheetDescription>
						</SheetHeader>
						{(() => {
							const it = items.find((x) => x.id === openId)
							if (!it) return null
							return (
								<div className="mt-4 space-y-4">
									<div className="flex items-center gap-3">
										<Avatar>
											<AvatarFallback>{initials(it.fullName)}</AvatarFallback>
										</Avatar>
										<div>
											<div className="font-semibold text-gray-900">{it.fullName}</div>
											<div className="text-xs text-gray-500">{it.email}</div>
										</div>
									</div>
									<div className="text-sm">
										<div className="text-gray-600">Giới thiệu</div>
										<div className="mt-1 whitespace-pre-wrap">{it.introduction || "—"}</div>
									</div>
									<div className="text-sm">
										<div className="text-gray-600">Mức giá đề xuất</div>
										<div className="mt-1">{displayPrice(it.price)}</div>
									</div>
									<div className="text-sm">
										<div className="text-gray-600">Trạng thái</div>
										<div className="mt-1">{statusBadge(it.status as TourguideRequestStatus)}</div>
									</div>
									<div className="text-sm">
										<div className="text-gray-600">Chứng chỉ</div>
										{it.certifications?.length ? (
											<ul className="mt-1 list-disc pl-5 space-y-1">
												{it.certifications.map((c, idx) => (
													<li key={idx}>
														<span className="font-medium">{c.name}</span>
														{c.certificateUrl ? (
															<a className="ml-2 text-emerald-700 hover:underline" href={resolveCertUrl(c.certificateUrl)} target="_blank" rel="noreferrer">Xem</a>
														) : null}
													</li>
												))}
											</ul>
										) : (
											<div className="mt-1">—</div>
										)}
									</div>
									<div className="flex items-center justify-end gap-2 pt-2">
										<AlertDialog open={approvingId === it.id}>
											<AlertDialogTrigger asChild>
												<Button size="sm" variant="outline" onClick={() => { setApprovingId(it.id); setApproveReason("") }}>
													<Check className="w-4 h-4 mr-1" /> Chấp nhận
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>Lý do chấp nhận (tuỳ chọn)</AlertDialogTitle>
													<AlertDialogDescription>Bạn có thể ghi chú lý do chấp nhận yêu cầu này (không bắt buộc).</AlertDialogDescription>
												</AlertDialogHeader>
												<Textarea rows={3} placeholder="Nhập lý do (không bắt buộc)..." value={approveReason} onChange={(e) => setApproveReason(e.target.value)} />
												<AlertDialogFooter>
													<AlertDialogCancel onClick={() => { setApprovingId(null); setApproveReason("") }}>Hủy</AlertDialogCancel>
													<AlertDialogAction onClick={handleApproveConfirm}>Xác nhận</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button size="sm" variant="destructive" onClick={() => { setRejectingId(it.id); setRejectReason(""); }}>
													<X className="w-4 h-4 mr-1" /> Từ chối
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>Lý do từ chối</AlertDialogTitle>
													<AlertDialogDescription>Hãy cung cấp lý do để từ chối yêu cầu này.</AlertDialogDescription>
												</AlertDialogHeader>
												<Textarea rows={4} placeholder="Nhập lý do..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
												<AlertDialogFooter>
													<AlertDialogCancel onClick={() => { setRejectingId(null); setRejectReason("") }}>Hủy</AlertDialogCancel>
													<AlertDialogAction onClick={handleReject} disabled={!rejectingId || !rejectReason.trim()}>Xác nhận</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</div>
								</div>
							)
						})()}
					</SheetContent>
				</Sheet>
			</div>
		</div>
	)
}