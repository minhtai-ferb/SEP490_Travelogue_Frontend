'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/utils/format"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Eye, Check, X } from "lucide-react"
import { useReport } from "@/services/use-report"
import { ReportItem, ReportStatus, getReportStatusDisplay } from "@/types/report"
import { toast } from "react-hot-toast"


function Datatable() {
	const { getReport, getReportDetail, adminProcessReport, loading } = useReport()
	const [reports, setReports] = useState<ReportItem[]>([])
	const [statusFilter, setStatusFilter] = useState<string>("all")
	const [search, setSearch] = useState("")
	const [detailOpen, setDetailOpen] = useState(false)
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [processing, setProcessing] = useState(false)
	const [detailData, setDetailData] = useState<ReportItem>()

	const fetchReports = useCallback(async () => {
		const res = await getReport()
		setReports(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [])
	}, [getReport])

	useEffect(() => {
		void fetchReports()
	}, [])

	const filteredReports = useMemo(() => {
		const query = search.trim().toLowerCase()
		return (reports || []).filter((r) => {
			const matchStatus =
				statusFilter === "all" ||
				(statusFilter === "pending" && Number(r.status) === Number(ReportStatus.Pending)) ||
				(statusFilter === "approved" && Number(r.status) === Number(ReportStatus.Approved)) ||
				(statusFilter === "rejected" && Number(r.status) === Number(ReportStatus.Rejected))
			if (!matchStatus) return false
			if (!query) return true
			const haystack = `${r.id} ${r.userId} ${r.reviewId} ${r.reason}`.toLowerCase()
			return haystack.includes(query)
		})
	}, [reports, statusFilter, search])

	const statusBadge = (status: number) => {
		switch (Number(status)) {
			case ReportStatus.Pending:
				return <Badge className="border-amber-200 bg-amber-100 text-amber-800">{getReportStatusDisplay(status)}</Badge>
			case ReportStatus.Approved:
				return <Badge className="border-emerald-200 bg-emerald-100 text-emerald-800">{getReportStatusDisplay(status)}</Badge>
			case ReportStatus.Rejected:
				return <Badge className="border-rose-200 bg-rose-100 text-rose-800">{getReportStatusDisplay(status)}</Badge>
			default:
				return <Badge variant="outline">{getReportStatusDisplay(status)}</Badge>
		}
	}

	const openDetail = useCallback(async (reviewId: string) => {
		setDetailOpen(true)
		setSelectedId(null)
		setDetailData(undefined)
		try {
			const body = await getReportDetail(reviewId)
			const maybeWrapped = (body as any)?.data ?? body
			const item: ReportItem | undefined = Array.isArray(maybeWrapped) ? maybeWrapped[0] : maybeWrapped
			if (item) {
				setDetailData(item)
				setSelectedId(item.id ?? null)
			} else {
				setDetailData(undefined)
			}
		} catch {
			setDetailData(undefined)
		}
	}, [getReportDetail])

	const handleProcess = useCallback(async (action: "approve" | "reject") => {
		const idToProcess = detailData?.id ?? selectedId
		if (!idToProcess) return
		setProcessing(true)
		try {
			const status = action === "approve" ? ReportStatus.Approved : ReportStatus.Rejected
			const res = await adminProcessReport(idToProcess, status, "")
			if (res) {
				toast.success(action === "approve" ? "Đã duyệt báo cáo" : "Đã từ chối báo cáo")
				void fetchReports()
				setDetailOpen(false)
			}
		} catch (e) {
			toast.error(action === "approve" ? "Duyệt báo cáo thất bại" : "Từ chối báo cáo thất bại")
		} finally {
			setProcessing(false)
		}
	}, [adminProcessReport, selectedId, detailData, fetchReports])

	return (
		<div className="space-y-3">
			<div className="flex flex-col md:flex-row md:items-center gap-3">
				<div className="flex-1">
					<Input placeholder="Tìm kiếm theo lý do, người dùng, đánh giá..." value={search} onChange={(e) => setSearch(e.target.value)} />
				</div>
				<div className="w-full md:w-56">
					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger>
							<SelectValue placeholder="Lọc theo trạng thái" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Tất cả trạng thái</SelectItem>
							<SelectItem value="pending">Chờ duyệt</SelectItem>
							<SelectItem value="approved">Đã duyệt</SelectItem>
							<SelectItem value="rejected">Từ chối</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<Button variant="outline" onClick={() => { setSearch(""); setStatusFilter("all") }}>Xóa lọc</Button>
			</div>

			<div className="text-sm text-muted-foreground">Tổng: {filteredReports.length} mục</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>User</TableHead>
						<TableHead>Lý do</TableHead>
						<TableHead>Trạng thái</TableHead>
						<TableHead>Báo cáo lúc</TableHead>
						<TableHead>Hành động</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredReports.map((r) => (
						<TableRow key={r.id}>
							<TableCell>{r.createdByName ?? r.createdBy ?? r.userId}</TableCell>
							<TableCell>{r.reason}</TableCell>
							<TableCell>{statusBadge(Number(r.status))}</TableCell>
							<TableCell>{r.reportedAt ? formatDate(r.reportedAt) : "-"}</TableCell>
							<TableCell>
								<div className="flex gap-2">
									<Button variant="outline" size="sm" onClick={() => openDetail(r?.reviewId)} disabled={!r?.reviewId}>
										<Eye className="w-4 h-4 mr-2" /> Xem chi tiết
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<Dialog open={detailOpen} onOpenChange={(o) => { setDetailOpen(o); if (!o) { setSelectedId(null); setDetailData(undefined) } }}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Chi tiết báo cáo</DialogTitle>
					</DialogHeader>
					<div className="space-y-2 text-sm">
						<div><span className="text-muted-foreground">Trạng thái:</span> {detailData ?
							<Badge className={`
							border-${getReportStatusDisplay(Number(detailData?.status))
									.toLowerCase()}-200 bg-
									${getReportStatusDisplay(Number(detailData?.status))
									.toLowerCase()}-100 
									text-${getReportStatusDisplay(
										Number(detailData?.status))
									.toLowerCase()}-800`}>
								{getReportStatusDisplay(Number(detailData?.status))}
							</Badge> : "-"}</div>
						<div><span className="text-muted-foreground">Lý do:</span> {detailData?.reason ?? "-"}</div>
						<div><span className="text-muted-foreground">Người báo cáo:</span> {detailData?.createdByName ?? "-"}</div>
						{detailData?.reportedAt && <div><span className="text-muted-foreground">Thời gian:</span> {formatDate(detailData.reportedAt)}</div>}
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDetailOpen(false)}>Đóng</Button>
						{Number(detailData?.status) === Number(ReportStatus.Pending) && (
							<>
								<Button onClick={() => handleProcess("approve")} disabled={processing} className="bg-green-600 hover:bg-green-700">
									<Check className="w-4 h-4 mr-2" /> Duyệt
								</Button>
								<Button variant="destructive" onClick={() => handleProcess("reject")} disabled={processing}>
									<X className="w-4 h-4 mr-2" /> Từ chối
								</Button>
							</>
						)}
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default Datatable
