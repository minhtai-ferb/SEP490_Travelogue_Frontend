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

function CraftVillageClient() {
	const router = useRouter()

	const [dataTable, setDataTable] = useState<CraftVillageRequestResponse[]>([])
	const [isReviewOpen, setIsReviewOpen] = useState(false)
	const [reviewAction, setReviewAction] = useState<"approve" | "reject">("approve")
	const [reviewReason, setReviewReason] = useState("")
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [submitting, setSubmitting] = useState(false)

	const { getCraftVillageRequest, loading, reviewCraftVillageRequest } = useCraftVillage()

	const fetchData = async () => {
		const data = await getCraftVillageRequest()
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
		router.push(`/admin/user/requests/craftvillage/${id}`)
	}

	const columns: ColumnDef<CraftVillageRequestResponse>[] = [
		{
			header: "Tên làng nghề",
			accessorKey: "Name",
		},
		{
			header: "Tên người đăng ký",
			accessorKey: "OwnerFullName",
		},
		{
			header: "Email",
			accessorKey: "OwnerEmail",
		},
		{
			header: "Trạng thái",
			accessorKey: "Status",
			cell: ({ row }) => {
				const status = row.original.Status
				return <Badge variant="outline">{status === CraftVillageRequestStatus.Pending ? "Chờ duyệt" : status === CraftVillageRequestStatus.Approved ? "Đã duyệt" : "Từ chối"}</Badge>
			}
		},
		{
			header: "Ngày đăng ký",
			accessorKey: "ReviewedAt",
			cell: ({ row }) => {
				const reviewedAt = row.original.ReviewedAt
				return <Badge variant="outline">{reviewedAt?.ticks ? new Date(reviewedAt.ticks).toLocaleDateString() : "Chưa duyệt"}</Badge>
			}
		},
		{
			header: "Hành động",
			accessorKey: "Action",
			cell: ({ row }) => {
				return (
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								setSelectedId(row.original.Id)
								setReviewAction("approve")
								setReviewReason("")
								setIsReviewOpen(true)
							}}
						>
							Duyệt
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								setSelectedId(row.original.Id)
								setReviewAction("reject")
								setReviewReason("")
								setIsReviewOpen(true)
							}}
						>
							Từ chối
						</Button>
						<Button variant="outline" size="sm" onClick={() => handleView(row.original.Id)}>Xem</Button>
					</div>
				)
			}
		},
	]

	useEffect(() => {
		fetchData()
	}, [])

	const confirmDisabled = submitting || (reviewAction === "reject" && reviewReason.trim().length === 0)

	return (
		<div className="space-y-3">
			<div className="flex flex-col gap-3 p-4">
				<CraftVillageTable columns={columns} data={dataTable} />
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

export default CraftVillageClient
