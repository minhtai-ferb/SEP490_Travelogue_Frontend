"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import WorkshopFilterBar from "./workshop/molecules/WorkshopFilterBar"
import WorkshopList from "./workshop/organisms/WorkshopList"
import WorkshopStats from "./workshop/molecules/WorkshopStats"
import { useWorkshop } from "@/services/use-workshop"
import Link from "next/link"
import { userAtom } from "@/store/auth"
import { useAtomValue } from "jotai"
import BreadcrumbHeader from "@/components/common/breadcrumb-header"
import DashboardCraftVillage from "./components/DashboardCraftVillage"

export default function DashboardPage() {
	const { getWorkshops, loading } = useWorkshop()
	const [status, setStatus] = useState<string | number>("all")
	const [keyword, setKeyword] = useState("")
	const [items, setItems] = useState<any[]>([])
	const user = useAtomValue(userAtom)

	const fetchWorkshops = useCallback(async () => {
		const res = await getWorkshops({
			craftVillageId: user?.id || "",
			name: keyword || "",
		})
		setItems(Array.isArray(res) ? res : (res?.items || []))
	}, [getWorkshops, keyword, user?.id])

	useEffect(() => {
		fetchWorkshops()
	}, [])

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
			<DashboardCraftVillage />
		</div>
	)
}
