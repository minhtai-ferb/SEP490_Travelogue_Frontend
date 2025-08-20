"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from "@/utils/format"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Eye, Check, X, Star, MessageSquare, AlertTriangle, User, Calendar } from "lucide-react"
import { toast } from "react-hot-toast"
import { useReport } from "@/services/use-report"

interface Report {
	id: string
	userId: string
	reviewId: string
	reason: string
	status: 1 | 2 | 3
	reportedAt: string
	createdTime: string
	lastUpdatedTime: string
	createdBy: string
	createdByName: string | null
	lastUpdatedBy: string
	lastUpdatedByName: string | null
}

interface ReviewWithReports {
	reviewId: string
	comment: string
	rating: number
	userId: string
	userName: string
	finalReportStatus: number | null
	handledBy: string | null
	handledAt: string | null
	moderatorNote: string | null
	reports: Report[]
}

interface ReviewReportsData {
	items: ReviewWithReports[]
	totalCount: number
	pageNumber: number
	pageSize: number
}

const getStatusBadge = (status: number) => {
	switch (status) {
		case 1:
			return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Chờ xử lý</Badge>
		case 2:
			return <Badge className="bg-green-100 text-green-800 border-green-200">Đã duyệt</Badge>
		case 3:
			return <Badge className="bg-red-100 text-red-800 border-red-200">Từ chối</Badge>
		default:
			return <Badge variant="outline">Không xác định</Badge>
	}
}

const getFinalStatusBadge = (status: number | null) => {
	if (status === null) return <Badge variant="outline">Chưa xử lý</Badge>
	switch (status) {
		case 1:
			return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Đang xử lý</Badge>
		case 2:
			return <Badge className="bg-green-100 text-green-800 border-green-200">Đã xử lý</Badge>
		case 3:
			return <Badge className="bg-red-100 text-red-800 border-red-200">Bị từ chối</Badge>
		default:
			return <Badge variant="outline">Không xác định</Badge>
	}
}

export default function ReviewReportsTable() {
	// Mock data - replace with your API call
	const [data, setData] = useState<ReviewReportsData[]>([])
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const { adminProcessReport, getReport } = useReport()

	const [statusFilter, setStatusFilter] = useState<string>("all")
	const [search, setSearch] = useState("")
	const [detailOpen, setDetailOpen] = useState(false)
	const [selectedReview, setSelectedReview] = useState<ReviewWithReports | null>(null)
	const [processing, setProcessing] = useState(false)
	const [moderatorNote, setModeratorNote] = useState("")


	const fetchData = useCallback(async () => {
		const response = await getReport({ pageNumber: page, pageSize: pageSize, status: statusFilter === "all" ? undefined : Number(statusFilter) })
		setData(response?.items || [])
	}, [getReport, statusFilter, page, pageSize])

	const filteredReviews = useMemo(() => {
		const query = search.trim().toLowerCase()
		return data.filter((review: any) => {
			const matchStatus =
				statusFilter === "all" ||
				(statusFilter === "pending" && review.finalReportStatus === null) ||
				(statusFilter === "processing" && review.finalReportStatus === 1) ||
				(statusFilter === "handled" && review.finalReportStatus === 2) ||
				(statusFilter === "rejected" && review.finalReportStatus === 3)

			if (!matchStatus) return false
			if (!query) return true

			const haystack =
				`${review.comment} ${review.userName} ${review.reports.map((r: any) => r.reason).join(" ")}`.toLowerCase()
			return haystack.includes(query)
		})
	}, [data, statusFilter, search])

	const openDetail = useCallback((review: ReviewWithReports) => {
		setSelectedReview(review)
		setModeratorNote(review.moderatorNote || "")
		setDetailOpen(true)
	}, [])

	const handleProcess = useCallback(
		async (action: "approve" | "reject") => {
			if (!selectedReview) return
			setProcessing(true)
			try {
				if (action === "approve") {
					const response = await adminProcessReport(selectedReview?.reviewId, 2, moderatorNote)
					console.log("response_A", response);
				} else if (action === "reject") {
					const response = await adminProcessReport(selectedReview?.reviewId, 3, moderatorNote)
					console.log("response_R", response);
				} else {
					toast.error("Lỗi khi xử lý báo cáo")
					throw new Error("Lỗi khi xử lý báo cáo")
				}
				toast.success(action === "approve" ? "Đã duyệt báo cáo" : "Đã từ chối báo cáo")
				setDetailOpen(false)
				fetchData()
			} catch (e) {
				toast.error(action === "approve" ? "Duyệt báo cáo thất bại" : "Từ chối báo cáo thất bại")
			} finally {
				setProcessing(false)
			}
		},
		[selectedReview, moderatorNote, fetchData, adminProcessReport],
	)

	const renderStars = (rating: number) => {
		return (
			<div className="flex items-center gap-1">
				{[1, 2, 3, 4, 5].map((star) => (
					<Star
						key={star}
						className={`w-4 h-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
					/>
				))}
				<span className="ml-1 text-sm text-gray-600">({rating})</span>
			</div>
		)
	}

	useEffect(() => {
		fetchData()
	}, [])

	return (
		<div className="space-y-6">
			{/* Header */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<AlertTriangle className="w-5 h-5 text-orange-500" />
						Quản lý báo cáo đánh giá
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col md:flex-row md:items-center gap-3">
						<div className="flex-1">
							<Input
								placeholder="Tìm kiếm theo nội dung đánh giá, tên người dùng, lý do báo cáo..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>
						<div className="w-full md:w-56">
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger>
									<SelectValue placeholder="Lọc theo trạng thái" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Tất cả trạng thái</SelectItem>
									<SelectItem value="pending">Đang xử lý</SelectItem>
									<SelectItem value="handled">Đã xử lý</SelectItem>
									<SelectItem value="rejected">Từ chối</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<Button
							variant="destructive"
							onClick={() => {
								setSearch("")
								setStatusFilter("all")
							}}
						>
							Xóa lọc
						</Button>
					</div>
					<div className="mt-3 text-sm text-muted-foreground">Tổng: {filteredReviews.length} đánh giá bị báo cáo</div>
				</CardContent>
			</Card>

			{/* Table */}
			<Card>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Đánh giá</TableHead>
								<TableHead>Người đánh giá</TableHead>
								<TableHead>Số báo cáo</TableHead>
								<TableHead>Trạng thái xử lý</TableHead>
								<TableHead>Thời gian xử lý</TableHead>
								<TableHead>Hành động</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredReviews.map((review: any) => (
								<TableRow key={review.id}>
									<TableCell className="max-w-xs">
										<div className="space-y-2">
											{renderStars(review.rating)}
											<p className="text-sm text-gray-700 line-clamp-2">{review.comment}</p>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<User className="w-4 h-4 text-gray-400" />
											<span className="font-medium">{review.userName}</span>
										</div>
									</TableCell>
									<TableCell>
										<Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
											{review.reports.length} báo cáo
										</Badge>
									</TableCell>
									<TableCell>{getFinalStatusBadge(review.finalReportStatus)}</TableCell>
									<TableCell>
										{review.handledAt ? (
											<div className="flex items-center gap-1 text-sm text-gray-600">
												<Calendar className="w-4 h-4" />
												{formatDate(review.handledAt)}
											</div>
										) : (
											<span className="text-gray-400">-</span>
										)}
									</TableCell>
									<TableCell>
										<Button variant="outline" size="sm" onClick={() => openDetail(review)}>
											<Eye className="w-4 h-4 mr-2" />
											Chi tiết
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Detail Dialog */}
			<Dialog open={detailOpen} onOpenChange={setDetailOpen}>
				<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<MessageSquare className="w-5 h-5" />
							Chi tiết báo cáo đánh giá
						</DialogTitle>
					</DialogHeader>

					{selectedReview && (
						<div className="space-y-6">
							{/* Review Info */}
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Thông tin đánh giá</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="text-sm font-medium text-gray-500">Người đánh giá</label>
											<div className="flex items-center gap-2 mt-1">
												<User className="w-4 h-4 text-gray-400" />
												<span className="font-medium">{selectedReview.userName}</span>
											</div>
										</div>
										<div>
											<label className="text-sm font-medium text-gray-500">Đánh giá</label>
											<div className="mt-1">{renderStars(selectedReview.rating)}</div>
										</div>
									</div>
									<div>
										<label className="text-sm font-medium text-gray-500">Nội dung đánh giá</label>
										<div className="mt-1 p-3 bg-gray-50 rounded-lg">
											<p className="text-sm">{selectedReview.comment}</p>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Reports List */}
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Danh sách báo cáo ({selectedReview.reports.length})</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{selectedReview.reports.map((report, index) => (
											<div key={report.id} className="border rounded-lg p-4">
												<div className="flex items-start justify-between">
													<div className="flex-1">
														<div className="flex items-center gap-2 mb-2">
															<span className="text-sm font-medium">Báo cáo #{index + 1}</span>
															{getStatusBadge(report.status)}
														</div>
														<p className="text-sm text-gray-700 mb-2">{report.reason}</p>
														<div className="flex items-center gap-4 text-xs text-gray-500">
															<span>Báo cáo lúc: {formatDate(report.reportedAt)}</span>
															{report.createdByName && <span>Bởi: {report.createdByName}</span>}
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>

							{/* Moderator Section */}
							{selectedReview.finalReportStatus === null && (
								<Card>
									<CardHeader>
										<CardTitle className="text-lg">Xử lý báo cáo</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div>
											<label className="text-sm font-medium text-gray-700">Ghi chú của moderator</label>
											<Textarea
												placeholder="Nhập ghi chú về quyết định xử lý..."
												value={moderatorNote}
												onChange={(e) => setModeratorNote(e.target.value)}
												className="mt-1"
												rows={3}
											/>
										</div>
									</CardContent>
								</Card>
							)}

							{/* Handled Info */}
							{selectedReview.finalReportStatus !== null && (
								<Card>
									<CardHeader>
										<CardTitle className="text-lg">Thông tin xử lý</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<label className="text-sm font-medium text-gray-500">Trạng thái</label>
												<div className="mt-1">{getFinalStatusBadge(selectedReview.finalReportStatus)}</div>
											</div>
											<div>
												<label className="text-sm font-medium text-gray-500">Thời gian xử lý</label>
												<div className="mt-1 text-sm">
													{selectedReview.handledAt ? formatDate(selectedReview.handledAt) : "-"}
												</div>
											</div>
										</div>
										{selectedReview.moderatorNote && (
											<div>
												<label className="text-sm font-medium text-gray-500">Ghi chú của moderator</label>
												<div className="mt-1 p-3 bg-gray-50 rounded-lg">
													<p className="text-sm">{selectedReview.moderatorNote}</p>
												</div>
											</div>
										)}
									</CardContent>
								</Card>
							)}
						</div>
					)}

					<DialogFooter>
						<Button variant="outline" onClick={() => setDetailOpen(false)}>
							Đóng
						</Button>
						{selectedReview?.finalReportStatus === null && (
							<>
								<Button
									onClick={() => handleProcess("approve")}
									disabled={processing}
									className="bg-green-600 hover:bg-green-700"
								>
									<Check className="w-4 h-4 mr-2" />
									Duyệt báo cáo
								</Button>
								<Button variant="destructive" onClick={() => handleProcess("reject")} disabled={processing}>
									<X className="w-4 h-4 mr-2" />
									Từ chối báo cáo
								</Button>
							</>
						)}
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
