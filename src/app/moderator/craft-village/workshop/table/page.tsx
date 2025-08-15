'use client'

import BreadcrumbHeader from '@/components/common/breadcrumb-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWorkshop } from '@/services/use-workshop'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import WorkshopDataTable from '../components/WorkshopDataTable'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

const breadcrumbItems = {
	items: [
		{
			label: "Dashboard",
			href: "/moderator/craft-village/workshop/table",
		},
	],
}
function page() {
	const { getModeratorWorkshops, loading } = useWorkshop()
	const [workshops, setWorkshops] = useState<any[]>([])
	const [name, setName] = useState<string>("")
	const [status, setStatus] = useState<string | number>("all")
	const [craftVillageId, setCraftVillageId] = useState<string>("")

	const filters = useMemo(() => ({
		name: name || undefined,
		status: status === 'all' ? undefined : status,
		craftVillageId: craftVillageId || undefined,
	}), [name, status, craftVillageId])

	const fetchModeratorWorkshops = useCallback(async () => {
		try {
			const res = await getModeratorWorkshops(filters)
			const list = Array.isArray(res) ? res : (res?.data || res?.items || [])
			const sorted = [...list].sort((a: any, b: any) => {
				const aTime = new Date(a.createdAt || 0).getTime()
				const bTime = new Date(b.createdAt || 0).getTime()
				if (aTime && bTime && aTime !== bTime) return bTime - aTime
				return String(b.id || '').localeCompare(String(a.id || ''))
			})
			setWorkshops(sorted)
		} catch (error) {
			toast.error("Lỗi khi lấy danh sách workshop")
		}
	}, [getModeratorWorkshops, filters])

	useEffect(() => {
		fetchModeratorWorkshops()
	}, [fetchModeratorWorkshops])

	return (
		<>
			<BreadcrumbHeader items={breadcrumbItems.items} />
			<div className="p-4">
				<Card>
					<CardHeader>
						<CardTitle>Danh sách workshop</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-3">
							<Input placeholder="Tên workshop" value={name} onChange={(e) => setName(e.target.value)} />
							<Select value={String(status)} onValueChange={(v) => setStatus(v === 'all' ? 'all' : Number(v))}>
								<SelectTrigger><SelectValue placeholder="Trạng thái" /></SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Tất cả</SelectItem>
									<SelectItem value="0">Nháp</SelectItem>
									<SelectItem value="1">Chờ duyệt</SelectItem>
									<SelectItem value="2">Đã duyệt</SelectItem>
									<SelectItem value="3">Từ chối</SelectItem>
									<SelectItem value="4">Đã phê duyệt</SelectItem>
								</SelectContent>
							</Select>
							<Input placeholder="CraftVillageId" value={craftVillageId} onChange={(e) => setCraftVillageId(e.target.value)} />
							<div className="flex gap-2">
								<Button onClick={fetchModeratorWorkshops} disabled={loading}>Lọc</Button>
								<Button variant="outline" onClick={() => { setName(''); setStatus('all'); setCraftVillageId(''); }} disabled={loading}>Reset</Button>
							</div>
						</div>
						<WorkshopDataTable workshops={workshops} loading={loading} />
					</CardContent>
				</Card>
			</div>
		</>
	)
}

export default page
