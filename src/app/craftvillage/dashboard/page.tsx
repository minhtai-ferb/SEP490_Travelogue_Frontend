"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import WorkshopFilterBar from "./workshop/molecules/WorkshopFilterBar"
import WorkshopList from "./workshop/organisms/WorkshopList"
import WorkshopStats from "./workshop/molecules/WorkshopStats"
import { useWorkshop } from "@/services/use-workshop"
import Link from "next/link"
import { WorkshopFilterParams } from "@/types/Workshop"
import { userAtom } from "@/store/auth"
import { useAtomValue } from "jotai"
import BreadcrumbHeader from "@/components/common/breadcrumb-header"
import { getUserFromLocalStorage } from "@/app/moderator/components/app-sidebar"

export default function DashboardPage() {
	const { getWorkshops, loading } = useWorkshop()
	const [status, setStatus] = useState<string | number>("all")
	const [keyword, setKeyword] = useState("")
	const [items, setItems] = useState<any[]>([])
	const user = useAtomValue(userAtom)

	const fetchWorkshops = useCallback(async () => {
		const res = await getWorkshops({
			craftVillageId: user?.id || getUserFromLocalStorage()?.id,
			name: keyword || "",
		})
		setItems(Array.isArray(res) ? res : (res?.items || []))
	}, [getWorkshops, keyword, user?.id])

	const breadcrumbItems = {
		items: [
			{
				label: "Dashboard",
				href: "/craftvillage/dashboard",
			},
		],
	}

	return (
		<div className="space-y-6">
			<BreadcrumbHeader items={breadcrumbItems.items} />
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle>Danh sách workshop</CardTitle>
					<div className="flex items-center gap-3">
						<Link href="/craftvillage/dashboard/workshop/create" className="text-sm text-blue-600 hover:underline">Tạo workshop</Link>
						<Link href="/craftvillage/dashboard/workshop" className="text-sm text-blue-600 hover:underline">Quản lý</Link>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<WorkshopStats items={items} />
					<WorkshopFilterBar
						status={status}
						keyword={keyword}
						onChangeStatus={setStatus}
						onChangeKeyword={setKeyword}
						onSearch={fetchWorkshops}
						loading={loading}
					/>
					<WorkshopList items={items} />
				</CardContent>
			</Card>
		</div>
	)
}
