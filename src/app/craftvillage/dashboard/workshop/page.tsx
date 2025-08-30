"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useWorkshop } from "@/services/use-workshop"
import { useEffect, useMemo, useState } from "react"
import WorkshopFilterBar from "./molecules/WorkshopFilterBar"
import WorkshopList from "./organisms/WorkshopList"
import { userAtom } from "@/store/auth"
import { useAtomValue } from "jotai"
import { WorkshopDetail, WorkshopFilterParams } from "@/types/Workshop"
import BreadcrumbHeader from "@/components/common/breadcrumb-header"
import WorkshopTable from "./components/WorkshopTable"
import { useSearchParams } from "next/navigation"

export default function WorkshopPage() {
	const { getWorkshops, loading } = useWorkshop()
	const [status, setStatus] = useState<string | number>("all")
	const [keyword, setKeyword] = useState("")
	const searchParams = useSearchParams()
	const useMock = searchParams.get('mock') === '1'

	const mockItems: WorkshopDetail[] = [
		{
			id: "ws_001",
			name: "Trải nghiệm làm gốm",
			description: "Hướng dẫn nặn gốm cơ bản cho người mới.",
			content: "Nội dung chi tiết về các bước nặn gốm và trang trí sản phẩm.",
			status: "Approved",
			statusText: "Đã duyệt",
			mediaDtos: [],
			schedules: [],
			createdAt: "2024-07-01",
			updatedAt: "2024-07-15",
		},
		{
			id: "ws_002",
			name: "Dệt thổ cẩm",
			description: "Khám phá quy trình dệt và nhuộm vải truyền thống.",
			content: "Học cách dựng khung cửi và dệt hoa văn cơ bản.",
			status: "Pending",
			statusText: "Chờ duyệt",
			mediaDtos: [],
			schedules: [],
			createdAt: "2024-06-20",
			updatedAt: "2024-06-25",
		},
		{
			id: "ws_003",
			name: "Đan lát Tre Trúc",
			description: "Tự tay đan giỏ từ tre trúc địa phương.",
			content: "Giới thiệu nguyên liệu, kỹ thuật đan cơ bản và hoàn thiện sản phẩm.",
			status: "Draft",
			statusText: "Bản nháp",
			mediaDtos: [],
			schedules: [],
			createdAt: "2024-05-10",
			updatedAt: "2024-05-12",
		},
		{
			id: "ws_004",
			name: "Làm bánh tráng phơi sương",
			description: "Trải nghiệm làm và nướng bánh tráng truyền thống.",
			content: "Tìm hiểu bí quyết làm bánh tráng đặc sản Tây Ninh.",
			status: "Approved",
			statusText: "Đã duyệt",
			mediaDtos: [],
			schedules: [],
			createdAt: "2024-04-02",
			updatedAt: "2024-04-18",
		},
		{
			id: "ws_005",
			name: "Chạm khắc gỗ",
			description: "Khóa học chạm khắc hoa văn cơ bản trên gỗ.",
			content: "Hướng dẫn sử dụng dụng cụ và an toàn khi thao tác.",
			status: "Rejected",
			statusText: "Bị từ chối",
			mediaDtos: [],
			schedules: [],
			createdAt: "2024-03-08",
			updatedAt: "2024-03-20",
		},
	]

	const [items, setItems] = useState<WorkshopDetail[]>(useMock ? mockItems : [])
	const user = useAtomValue(userAtom)
	const filters = useMemo(() => ({
		craftVillageId: user?.id,
		name: keyword || undefined,
		status: status === "all" ? undefined : status,
	}), [user?.id, keyword, status])

	const fetchWorkshops = async () => {
		const res = await getWorkshops(filters as WorkshopFilterParams)
		setItems(Array.isArray(res) ? res : (res?.items || mockItems))
	}

	useEffect(() => {
		if (useMock) return
		if (!user?.id) return
		fetchWorkshops()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user?.id, status, useMock])



	const breadcrumbItems = {
		items: [
			{
				label: "Dashboard",
				href: "/craftvillage/dashboard",
			},
			{
				label: "Trải nghiệm",
				href: "/craftvillage/dashboard/workshop",
			},
			{
				label: "Trải nghiệm làng nghề",
			},
		],
	}

	return (
		<>
			<BreadcrumbHeader items={breadcrumbItems.items} />
			<div className="p-4">
				<Card className="">
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle>Trải nghiệm làng nghề</CardTitle>
						<Link href="/craftvillage/dashboard/workshop/create">
							<Button>Tạo trải nghiệm</Button>
						</Link>
					</CardHeader>
					<CardContent>
						<WorkshopFilterBar
							status={status}
							keyword={keyword}
							onChangeStatus={setStatus}
							onChangeKeyword={setKeyword}
							onSearch={fetchWorkshops}
							loading={loading}
						/>
						<WorkshopTable items={items} />
					</CardContent>
				</Card>
			</div>
		</>
	)
}
