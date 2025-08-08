"use client"

import { useEffect, useMemo, useState } from "react"
import type { TripPlan } from "@/types/TripPlan"
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

const MOCK_PLANS: TripPlan[] = [
	{
		id: "TP-1001",
		customerName: "Nguyễn Văn A",
		customerEmail: "a@example.com",
		phone: "0901234567",
		startDate: "2025-08-12T08:00:00Z",
		endDate: "2025-08-14T18:00:00Z",
		participants: 4,
		title: "Tây Ninh 3N2Đ - Gia đình",
		notes: "Yêu cầu phòng gần nhau",
		status: "pending",
		createdAt: new Date().toISOString(),
		totalPrice: 5600000,
	},
	{
		id: "TP-1002",
		customerName: "Trần Thị B",
		customerEmail: "b@example.com",
		phone: "0912345678",
		startDate: "2025-08-20T08:00:00Z",
		endDate: "2025-08-21T18:00:00Z",
		participants: 2,
		title: "Núi Bà Đen - Cặp đôi",
		status: "confirmed",
		createdAt: new Date().toISOString(),
		totalPrice: 2400000,
	},
]

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
		getTourGuideSchedule().then((res) => {
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
				p.customer?.name?.toLowerCase().includes(s) ||
				p.title?.toLowerCase().includes(s) ||
				p.customer?.email?.toLowerCase().includes(s) ||
				p.customer?.phone?.toLowerCase().includes(s)
			const statusOk = status === "all" || p.status === status
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
							{filtered.map((p) => (
								<tr key={p.id} className="border-b last:border-0">
									<td className="py-2 pr-4 font-medium">{p.id}</td>
									<td className="py-2 pr-4">
										<div className="flex flex-col">
											<span className="font-medium">{p.customerName}</span>
											<span className="text-xs text-gray-500">{p.customerEmail}</span>
										</div>
									</td>
									<td className="py-2 pr-4">{p.title}</td>
									<td className="py-2 pr-4">
										{formatDate(p.startDate)} - {formatDate(p.endDate)}
									</td>
									<td className="py-2 pr-4">{p.participants}</td>
									<td className="py-2 pr-4">{p.totalPrice ? formatPrice(p.totalPrice) : "-"}</td>
									<td className="py-2 pr-4">
										<span className={`px-2 py-1 rounded-md text-xs ${statusBadge(p.status)}`}>{p.status}</span>
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
											<div className="font-medium">{selected.customerName}</div>
											<div className="text-gray-500">{selected.customerEmail}</div>
											{selected.phone && <div className="text-gray-500">{selected.phone}</div>}
										</div>
									</div>
									<div>
										<Label>Thời gian</Label>
										<div className="text-sm">
											{formatDate(selected.startDate)} - {formatDate(selected.endDate)}
										</div>
									</div>
									<div>
										<Label>Khách</Label>
										<div className="text-sm">{selected.participants} người</div>
									</div>
								</div>

								<div>
									<Label>Tiêu đề</Label>
									<div className="text-sm font-medium">{selected.title}</div>
								</div>

								<div>
									<Label>Ghi chú</Label>
									<Textarea defaultValue={selected.notes || ""} placeholder="Ghi chú nội bộ..." />
								</div>

								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Badge variant="outline" className="text-xs">Trạng thái: {selected.status}</Badge>
									</div>
									<div className="flex gap-2">
										<StatusButton status="pending" current={selected.status} onChange={(s) => setSelected({ ...selected, status: s })} />
										<StatusButton status="confirmed" current={selected.status} onChange={(s) => setSelected({ ...selected, status: s })} />
										<StatusButton status="completed" current={selected.status} onChange={(s) => setSelected({ ...selected, status: s })} />
										<StatusButton status="cancelled" current={selected.status} onChange={(s) => setSelected({ ...selected, status: s })} />
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
