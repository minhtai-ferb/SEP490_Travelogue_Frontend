"use client"

import { useEffect, useMemo, useState } from "react"
import type { TripPlan } from "@/types/Tripplan"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatDate, formatPrice } from "@/utils/format"
import { TripPlanStatus } from "@/types/Tripplan"
import { useTourguideAssign } from "@/services/tourguide"

function statusBadge(status: TripPlanStatus) {
	switch (status) {
		case "pending":
			return "bg-yellow-100 text-yellow-700"
		case "confirmed":
			return "bg-blue-100 text-blue-700"
		case "completed":
			return "bg-green-100 text-green-700"
		case "cancelled":
			return "bg-red-100 text-red-700"
		default:
			return "bg-gray-100 text-gray-700"
	}
}

export function TripPlansSection() {
	const [search, setSearch] = useState("")
	const [status, setStatus] = useState<TripPlanStatus | "all">("all")
	const [open, setOpen] = useState(false)
	const [selected, setSelected] = useState<TripPlan | null>(null)
	const { getTourGuideSchedule, loading } = useTourguideAssign()
	const [plans, setPlans] = useState<TripPlan[]>([])
	useEffect(() => {
		getTourGuideSchedule(1, "2024-01-01", "2024-12-31", 1, 10).then((res: any) => {
			setPlans(res)
		}).catch((err) => {
			console.log(err)
		})
	}, [getTourGuideSchedule])
	console.log(plans)
	const filtered = useMemo(() => {
		return plans.filter((p) => {
			const s = search.toLowerCase()
			const matches =
				p.id.toLowerCase().includes(s) ||
				p.title?.toLowerCase().includes(s)
			const statusOk = status === "all" || p.statusText === status
			return matches && statusOk
		})
	}, [plans, search, status])

	return (
		<Card>
			<CardHeader>
				<CardTitle>Trip Plans của khách đã đặt bạn</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex flex-col md:flex-row gap-3">
					<Input placeholder="Tìm theo mã, tên khách, tiêu đề..." value={search} onChange={(e) => setSearch(e.target.value)} />
					<Select value={status} onValueChange={(v) => setStatus(v as any)}>
						<SelectTrigger className="md:w-56">
							<SelectValue placeholder="Trạng thái" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Tất cả</SelectItem>
							<SelectItem value="pending">Chờ xác nhận</SelectItem>
							<SelectItem value="confirmed">Đã xác nhận</SelectItem>
							<SelectItem value="completed">Hoàn thành</SelectItem>
							<SelectItem value="cancelled">Đã hủy</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full text-sm">
						<thead>
							<tr className="text-left text-gray-600 border-b">
								<th className="py-2 pr-4">Mã</th>
								<th className="py-2 pr-4">Khách hàng</th>
								<th className="py-2 pr-4">Tiêu đề</th>
								<th className="py-2 pr-4">Thời gian</th>
								<th className="py-2 pr-4">Khách</th>
								<th className="py-2 pr-4">Giá trị</th>
								<th className="py-2 pr-4">Trạng thái</th>
								<th className="py-2 pr-4 text-right">Thao tác</th>
							</tr>
						</thead>
						<tbody>
							{filtered.map((p: any) => (
								<tr key={p.id} className="border-b last:border-0">
									<td className="py-2 pr-4 font-medium">{p.id}</td>
									<td className="py-2 pr-4">
										<div className="flex flex-col">
											<span className="font-medium">{p?.ownerName || "Khách hàng"}</span>
										</div>
									</td>
									<td className="py-2 pr-4">{p.title}</td>
									<td className="py-2 pr-4">
										{formatDate(p.startDate as any)} - {formatDate(p.duration as any)}
									</td>
									<td className="py-2 pr-4">{p.travelers}</td>
									<td className="py-2 pr-4">{p.budget ? formatPrice(p.budget) : "-"}</td>
									<td className="py-2 pr-4">
										<span className={`px-2 py-1 rounded-md text-xs ${statusBadge(p.statusText as any)}`}>{p.statusText}</span>
									</td>
									<td className="py-2 pr-4 text-right">
										<Button
											size="sm"
											variant="outline"
											onClick={() => {
												setSelected(p)
												setOpen(true)
											}}
										>
											Xem
										</Button>
									</td>
								</tr>
							))}
							{filtered.length === 0 && (
								<tr>
									<td colSpan={8} className="py-6 text-center text-gray-500">
										Không có kết quả
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				<Dialog open={open} onOpenChange={setOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Chi tiết Trip Plan</DialogTitle>
							<DialogDescription>Xem và cập nhật trạng thái</DialogDescription>
						</DialogHeader>

						{selected && (
							<div className="space-y-3">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
									<div>
										<Label>Mã</Label>
										<div className="text-sm font-medium">{selected.id}</div>
									</div>
									<div>
										<Label>Khách hàng</Label>
										<div className="text-sm">
											<div className="font-medium">{selected?.ownerName || "Khách hàng"}</div>
										</div>
									</div>
									<div>
										<Label>Thời gian</Label>
										<div className="text-sm">
											{formatDate(selected.startDate as any)} - {formatDate(selected.duration as any)}
										</div>
									</div>
									<div>
										<Label>Khách</Label>
										<div className="text-sm">{selected.travelers} người</div>
									</div>
								</div>

								<div>
									<Label>Tiêu đề</Label>
									<div className="text-sm font-medium">{selected.title}</div>
								</div>

								<div>
									<Label>Ghi chú</Label>
									<Textarea defaultValue={selected?.preferences || ""} placeholder="Ghi chú nội bộ..." />
								</div>

								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Badge variant="outline" className="text-xs">Trạng thái: {selected.statusText as any}</Badge>
									</div>
									<div className="flex gap-2">
										<StatusButton status="pending" current={selected.statusText as any} onChange={(s) => setSelected({ ...selected, statusText: s as any })} />
										<StatusButton status="confirmed" current={selected.statusText as any} onChange={(s) => setSelected({ ...selected, statusText: s as any })} />
										<StatusButton status="completed" current={selected.statusText as any} onChange={(s) => setSelected({ ...selected, statusText: s as any })} />
										<StatusButton status="cancelled" current={selected.statusText as any} onChange={(s) => setSelected({ ...selected, statusText: s as any })} />
									</div>
								</div>

								<div className="flex justify-end gap-2 pt-2">
									<Button variant="outline" onClick={() => setOpen(false)}>Đóng</Button>
									<Button onClick={() => setOpen(false)}>Lưu</Button>
								</div>
							</div>
						)}
					</DialogContent>
				</Dialog>
			</CardContent>
		</Card>
	)
}

function StatusButton({
	status,
	current,
	onChange,
}: {
	status: TripPlanStatus
	current: TripPlanStatus
	onChange: (s: TripPlanStatus) => void
}) {
	const isActive = status === current
	return (
		<Button size="sm" variant={isActive ? "default" : "outline"} onClick={() => onChange(status)}>
			{status}
		</Button>
	)
}
