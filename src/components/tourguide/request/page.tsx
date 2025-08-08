"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
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
import { Check, Eye, X } from "lucide-react"

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
	const [openId, setOpenId] = useState<string | null>(null)

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

	const handleApprove = async (id: string) => {
		try {
			await requestReview(id, { status: TourguideRequestStatus.Approved })
			await fetchData()
		} catch (e) {
			console.error(e)
		}
	}

	const handleReject = async () => {
		if (!rejectingId) return
		try {
			await requestReview(rejectingId, { status: TourguideRequestStatus.Rejected, rejectionReason: rejectReason })
			setRejectingId(null)
			setRejectReason("")
			await fetchData()
		} catch (e) {
			console.error(e)
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

	return (
		<div className="max-w-full mx-auto space-y-4">
			<div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
				<div className="relative flex-1">
					<Input
						placeholder="Tìm theo tên hoặc email hướng dẫn viên"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
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

			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
				{loading && items.length === 0 && Array.from({ length: 6 }).map((_, i) => (
					<Card key={`sk-${i}`}>
						<CardContent className="p-4 space-y-3">
							<div className="flex items-center gap-3">
								<Skeleton className="h-10 w-10 rounded-full" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-4 w-1/2" />
									<Skeleton className="h-3 w-1/3" />
								</div>
							</div>
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-2/3" />
							<div className="flex justify-end gap-2 pt-2">
								<Skeleton className="h-8 w-20" />
								<Skeleton className="h-8 w-20" />
							</div>
						</CardContent>
					</Card>
				))}

				{!loading && items.map((it) => (
					<Card key={it.id} className="hover:shadow-md transition-shadow">
						<CardContent className="p-4">
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-3">
									<Avatar>
										<AvatarFallback>{initials(it.fullName)}</AvatarFallback>
									</Avatar>
									<div>
										<div className="font-semibold text-gray-900">{it.fullName}</div>
										<div className="text-xs text-gray-500">{it.email}</div>
									</div>
								</div>
								<div className="text-xs">{statusBadge(it.status as TourguideRequestStatus)}</div>
							</div>

							{it.introduction && (
								<div className="mt-3 text-sm text-gray-700 line-clamp-3">{it.introduction}</div>
							)}

							<div className="mt-3 text-xs text-gray-500">Mức giá đề xuất: {displayPrice(it.price)}</div>

							{it.certifications?.length > 0 && (
								<div className="mt-3">
									<div className="text-xs font-medium text-gray-700 mb-1">Chứng chỉ</div>
									<ul className="text-xs text-gray-600 list-disc pl-5 space-y-1">
										{it.certifications.map((c, idx) => (
											<li key={idx} className="truncate">
												<span className="font-medium">{c.name}</span>
												{c.certificateUrl ? (
													<a className="ml-2 text-emerald-700 hover:underline" href={c.certificateUrl} target="_blank" rel="noreferrer">Xem</a>
												) : null}
											</li>
										))}
									</ul>
								</div>
							)}

							<div className="mt-4 flex items-center justify-end gap-2">
								<Button size="sm" variant="secondary" onClick={() => setOpenId(it.id)}>
									<Eye className="w-4 h-4 mr-1" /> Xem chi tiết
								</Button>
								<Button size="sm" variant="outline" onClick={() => handleApprove(it.id)}>
									<Check className="w-4 h-4 mr-1" /> Chấp nhận
								</Button>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button size="sm" variant="destructive" onClick={() => { setRejectingId(it.id); setRejectReason("") }}>
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
						</CardContent>
					</Card>
				))}

				{!loading && items.length === 0 && (
					<div className="col-span-full">
						<Card className="bg-muted/30">
							<CardContent className="py-12 text-center">
								<div className="text-base font-medium text-gray-900">Không có yêu cầu nào</div>
								<div className="text-sm text-gray-500 mt-1">Thử đổi bộ lọc hoặc từ khóa tìm kiếm.</div>
							</CardContent>
						</Card>
					</div>
				)}
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
														<a className="ml-2 text-emerald-700 hover:underline" href={c.certificateUrl} target="_blank" rel="noreferrer">Xem</a>
													) : null}
												</li>
											))}
										</ul>
									) : (
										<div className="mt-1">—</div>
									)}
								</div>
								<div className="flex items-center justify-end gap-2 pt-2">
									<Button size="sm" variant="outline" onClick={() => it && handleApprove(it.id)}>
										<Check className="w-4 h-4 mr-1" /> Chấp nhận
									</Button>
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

			{/* Simple pagination (client-side) */}
			{/* For now, list uses full response without server paging; you can wire page & pageSize when backend supports. */}
		</div>
	)
}


