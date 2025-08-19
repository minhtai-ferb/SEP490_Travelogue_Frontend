"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWorkshop } from "@/services/use-workshop"
import { useEffect, useMemo, useState } from "react"
import WorkshopFilterBar from "./molecules/WorkshopFilterBar"
import WorkshopList from "./organisms/WorkshopList"
import { userAtom } from "@/store/auth"
import { useAtomValue } from "jotai"
import { WorkshopFilterParams } from "@/types/Workshop"
import BreadcrumbHeader from "@/components/common/breadcrumb-header"
import WorkshopDataTable from "@/app/moderator/craft-village/workshop/components/WorkshopDataTable"
import WorkshopTable from "./components/WorkshopTable"

export default function WorkshopPage() {
	const { getWorkshops, loading } = useWorkshop()
	const [status, setStatus] = useState<string | number>("all")
	const [keyword, setKeyword] = useState("")
	const [items, setItems] = useState<any[]>([])
	const user = useAtomValue(userAtom)
	const filters = useMemo(() => ({
		craftVillageId: user?.id,
		name: keyword || undefined,
	}), [user?.id, keyword])

	useEffect(() => {
		const fetch = async () => {
			const res = await getWorkshops(filters as WorkshopFilterParams)
			setItems(Array.isArray(res) ? res : (res?.items || []))
		}
		fetch()
	}, [getWorkshops, filters])

	const breadcrumbItems = {
		items: [
			{
				label: "Dashboard",
				href: "/craftvillage/dashboard",
			},
			{
				label: "Workshop",
				href: "/craftvillage/dashboard/workshop",
			},
			{
				label: "Danh sách workshop",
			},
		],
	}

	return (
		<>
			<BreadcrumbHeader items={breadcrumbItems.items} />
			<div className="p-4">
				<Card className="">
					<CardHeader>
						<CardTitle>Danh sách workshop</CardTitle>
					</CardHeader>
					<CardContent>
						<WorkshopFilterBar
							status={status}
							keyword={keyword}
							onChangeStatus={setStatus}
							onChangeKeyword={setKeyword}
							onSearch={() => getWorkshops(filters as WorkshopFilterParams).then((res) => setItems(Array.isArray(res) ? res : (res?.items || [])))}
							loading={loading}
						/>
						<WorkshopTable
							items={items}
						/>
						<WorkshopList items={items} />
					</CardContent>
				</Card>
			</div>
		</>
	)
}
