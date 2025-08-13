"use client";

import { useEffect, useState } from "react";
import { CraftVillageTable } from "./component/table";
import { useCraftVillage } from "@/services/use-craftvillage";
import { CraftVillageRequestResponse, CraftVillageRequestStatus, ReviewCraftVillageRequest } from "@/types/CraftVillage";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

function CraftVillageClient() {
	const router = useRouter()

	const [dataTable, setDataTable] = useState<CraftVillageRequestResponse[]>([])

	const { getCraftVillageRequest, loading, reviewCraftVillageRequest } = useCraftVillage()

	const fetchData = async () => {
		const data = await getCraftVillageRequest()
		setDataTable(data)
	}

	const handleReview = async (id: string, data: ReviewCraftVillageRequest) => {
		try {
			const response = await reviewCraftVillageRequest(id, data)
			if (response) {
				toast.success(data.status === CraftVillageRequestStatus.Approved ? "Đã duyệt đơn đăng ký" : "Đã từ chối đơn đăng ký")
				fetchData()
			}
		} catch (error) {
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
						<Button variant="outline" size="sm" onClick={() => handleReview(row.original.Id, { status: CraftVillageRequestStatus.Approved })}>Duyệt</Button>
						<Button variant="outline" size="sm" onClick={() => handleReview(row.original.Id, { status: CraftVillageRequestStatus.Rejected })}>Từ chối</Button>
						<Button variant="outline" size="sm" onClick={() => handleView(row.original.Id)}>Xem</Button>
					</div>
				)
			}
		},
	]

	useEffect(() => {
		fetchData()
	}, [])

	return (
		<div>
			<div className="flex flex-col gap-3 p-4">
				<CraftVillageTable columns={columns} data={dataTable} />
			</div>
		</div>
	)
}

export default CraftVillageClient
