"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCraftVillage } from "@/services/use-craftvillage";
import { CraftVillageRequestResponse, CraftVillageRequestStatus, ReviewCraftVillageRequest } from "@/types/CraftVillage";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { CraftVillageTable } from "./component/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo } from "react";
import { Check, Eye, X } from "lucide-react";
import dayjs from "dayjs";

function CraftVillageRequestTable({ href }: { href: string }) {
	const router = useRouter()

	const [dataTable, setDataTable] = useState<CraftVillageRequestResponse[]>([])
	const [isReviewOpen, setIsReviewOpen] = useState(false)
	const [reviewAction, setReviewAction] = useState<"approve" | "reject">("approve")
	const [reviewReason, setReviewReason] = useState("")
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [submitting, setSubmitting] = useState(false)
	const [search, setSearch] = useState("")
	const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")

	const { getCraftVillageRequest, loading, reviewCraftVillageRequest } = useCraftVillage()

	const fetchData = async () => {
		const data = await getCraftVillageRequest()
		// const filteredData = data.filter((a: CraftVillageRequestResponse, b: CraftVillageRequestResponse) => dayjs(b?.reviewedAt).diff(dayjs(a?.reviewedAt)) > 0)
		setDataTable(Array.isArray(data) ? data : [])
	}

	const handleReview = async (id: string, data: ReviewCraftVillageRequest) => {
		try {
			const response = await reviewCraftVillageRequest(id, data)
			if (response) {
				toast.success(data.status === CraftVillageRequestStatus.Approved ? "Đã duyệt đơn đăng ký" : "Đã từ chối đơn đăng ký")
				fetchData()
			}
		} catch (error: any) {
			console.log(error)
			toast.error(data.status === CraftVillageRequestStatus.Approved ? "Duyệt đơn đăng ký thất bại" : "Từ chối đơn đăng ký thất bại")
		}
	}

	const handleView = (id: string) => {
		router.push(`${href}/craftvillage/request/${id}`)
	}

	const columns: ColumnDef<CraftVillageRequestResponse>[] = [
		{
			header: "Tên làng nghề",
			accessorKey: "name",
		},
		{
			header: "Tên người đăng ký",
			accessorKey: "ownerFullName",
		},
		{
			header: "Email",
			accessorKey: "ownerEmail",
		},
		{
			header: "Trạng thái",
			accessorKey: "status",
			cell: ({ row }) => {
				const status = row.original.status
				return <Badge variant="outline" className={status === CraftVillageRequestStatus.Pending ? "bg-yellow-500 text-white" : status === CraftVillageRequestStatus.Approved ? "bg-green-500 text-white" : "bg-red-500 text-white"}>{status === CraftVillageRequestStatus.Pending ? "Chờ duyệt" : status === CraftVillageRequestStatus.Approved ? "Đã duyệt" : "Từ chối"}</Badge>
			}
		},
		{
			header: "Ngày đăng ký",
			accessorKey: "ReviewedAt",
			cell: ({ row }) => {
				const reviewedAt = row.original.reviewedAt
				return <Badge variant="outline">{reviewedAt ? new Date(reviewedAt).toLocaleDateString() : "Chưa duyệt"}</Badge>
			}
		},
		{
			header: "Hành động",
			accessorKey: "Action",
			cell: ({ row }) => {
				return (
					<div className="flex gap-2 justify-start">
						{row.original.status === CraftVillageRequestStatus.Pending && (
							<>
								<Button
									variant="default"
									size="sm"
									onClick={() => {
										setSelectedId(row.original.id)
										setReviewAction("approve")
										setReviewReason("")
										setIsReviewOpen(true)
									}}
								>
									<Check className="w-4 h-4 mr-2" />
									Duyệt
								</Button>
								<Button
									variant="destructive"
									size="sm"
									onClick={() => {
										setSelectedId(row.original.id)
										setReviewAction("reject")
										setReviewReason("")
										setIsReviewOpen(true)
									}}
								>
									<X className="w-4 h-4 mr-2" />
									Từ chối
								</Button>
							</>
						)}
						<Button variant="outline" size="sm" onClick={() => handleView(row.original.id)}>
							<Eye className="w-4 h-4 mr-2" />
							Xem
						</Button>
					</div>
				)
			}
		},
	]

	useEffect(() => {
		fetchData()
	}, [])

	const confirmDisabled = submitting || (reviewAction === "reject" && reviewReason.trim().length === 0)

	const filteredData = useMemo(() => {
		const query = search.trim().toLowerCase()
		return (dataTable || []).filter((row) => {
			const matchStatus =
				statusFilter === "all" ||
				(statusFilter === "pending" && row.status === CraftVillageRequestStatus.Pending) ||
				(statusFilter === "approved" && row.status === CraftVillageRequestStatus.Approved) ||
				(statusFilter === "rejected" && row.status === CraftVillageRequestStatus.Rejected)
			if (!matchStatus) return false
			if (!query) return true
			const haystack = `${row.name || ""} ${row.ownerFullName || ""} ${row.ownerEmail || ""} ${row.address || ""}`.toLowerCase()
			return haystack.includes(query)
		})
	}, [dataTable, search, statusFilter])

	return (
		<div className="space-y-3">
			<div className="flex flex-col gap-3 p-4">
				<div className="flex flex-col md:flex-row md:items-center gap-3">
					<div className="flex-1">
						<Input
							placeholder="Tìm kiếm theo tên làng nghề, người đăng ký, email, địa chỉ..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							disabled={loading}
						/>
					</div>
					<div className="w-full md:w-56">
						<Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
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
					<Button variant="outline" onClick={() => { setSearch(""); setStatusFilter("all") }} disabled={loading}>
						Xóa lọc
					</Button>
				</div>

				<div className="text-sm text-muted-foreground">Tổng: {filteredData.length} mục</div>

				<CraftVillageTable columns={columns} data={filteredData} />
			</div>

			<Dialog open={isReviewOpen} onOpenChange={(o) => {
				setIsReviewOpen(o)
				if (!o) {
					setReviewReason("")
					setSelectedId(null)
				}
			}}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{reviewAction === "approve" ? "Duyệt đơn đăng ký" : "Từ chối đơn đăng ký"}</DialogTitle>
					</DialogHeader>
					<div className="space-y-3">
						<label className="text-sm font-medium">
							Lý do {reviewAction === "reject" ? "(bắt buộc)" : "(không bắt buộc)"}
						</label>
						<Textarea
							rows={4}
							placeholder={reviewAction === "reject" ? "Nhập lý do từ chối..." : "Nhập ghi chú khi duyệt (tuỳ chọn)..."}
							value={reviewReason}
							onChange={(e) => setReviewReason(e.target.value)}
						/>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsReviewOpen(false)} disabled={submitting}>Hủy</Button>
						<Button
							onClick={async () => {
								if (!selectedId) return
								setSubmitting(true)
								try {
									await handleReview(selectedId, {
										status: reviewAction === "approve" ? CraftVillageRequestStatus.Approved : CraftVillageRequestStatus.Rejected,
										rejectionReason: reviewReason.trim() || undefined,
									})
									setIsReviewOpen(false)
								} finally {
									setSubmitting(false)
									setSelectedId(null)
									setReviewReason("")
								}
							}}
							disabled={confirmDisabled}
							className={reviewAction === "approve" ? "bg-green-600 hover:bg-green-700" : ""}
						>
							{reviewAction === "approve" ? "Duyệt" : "Từ chối"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default CraftVillageRequestTable
