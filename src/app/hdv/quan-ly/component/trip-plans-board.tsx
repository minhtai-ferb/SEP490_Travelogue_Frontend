"use client"

import { useMemo, useState } from "react"
import type { TripPlan, TripPlanStatus } from "@/types/Tripplan"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { CalendarCheck2, Search } from 'lucide-react'

const MOCK: TripPlan[] = [
	{
		id: "TP-1001",
		customerName: "Nguyễn Văn A",
		customerEmail: "a@example.com",
		startDate: new Date("2025-08-12T08:00:00Z"),
		endDate: new Date("2025-08-14T16:00:00Z"),
		participants: 4,
		title: "Gia đình tham quan Tây Ninh 3N2Đ",
		status: "pending",
		createdAt: new Date().toISOString(),
		totalPrice: 5600000,
	},
	{
		id: "TP-1002",
		customerName: "Trần Thị B",
		customerEmail: "b@example.com",
		startDate: "2025-08-20T08:00:00Z",
		endDate: "2025-08-21T16:00:00Z",
		participants: 2,
		title: "Núi Bà Đen - Cặp đôi",
		status: "confirmed",
		createdAt: new Date().toISOString(),
		totalPrice: 2400000,
	},
]

function statusClass(s: TripPlanStatus) {
	switch (s) {
		case "pending":
			return "bg-yellow-100 text-yellow-700"
		case "confirmed":
			return "bg-blue-100 text-blue-700"
		case "completed":
			return "bg-green-100 text-green-700"
		case "cancelled":
			return "bg-red-100 text-red-700"
	}
}

export default function TripPlansBoard() {
	const [search, setSearch] = useState("")
	const [status, setStatus] = useState<TripPlanStatus | "all">("all")

	const filtered = useMemo(() => {
		return MOCK.filter((p) => {
			const s = search.toLowerCase()
			const ok =
				p.id.toLowerCase().includes(s) ||
				p.customerName.toLowerCase().includes(s) ||
				p.title.toLowerCase().includes(s)
			const st = status === "all" || p.status === status
			return ok && st
		})
	}, [search, status])

	const done = filtered.filter((p) => p.status === "completed").length
	const ratio = Math.round((done / Math.max(filtered.length, 1)) * 100)

	return (
		<div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
			{/* Center board like Study Plan grid */}
			<div className="space-y-4">
				<div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
						<Input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Tìm theo mã, tên khách, tiêu đề..."
							className="pl-9"
						/>
					</div>
					<Select value={status} onValueChange={(v) => setStatus(v as any)}>
						<SelectTrigger className="sm:w-56">
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

				{/* Grid of cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
					{filtered.map((p) => (
						<Card key={p.id} className="border-green-200 bg-green-50/40">
							<CardContent className="p-4">
								<div className="flex items-start justify-between">
									<div className="font-semibold">Yêu cầu {p.id}</div>
									<Badge className={statusClass(p.status)} variant="secondary">
										{p.status}
									</Badge>
								</div>
								<div className="mt-2 text-sm text-gray-700">{p.title}</div>
								<div className="mt-2 text-xs text-gray-600">
									{new Date(p.startDate).toLocaleDateString("vi-VN")} -{" "}
									{new Date(p.endDate).toLocaleDateString("vi-VN")} • {p.participants} khách
								</div>
								<div className="mt-3 flex justify-between items-center">
									<div className="text-xs text-gray-500">{p.customerName}</div>
									<Button size="sm" variant="outline">
										Xử lý
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
					{filtered.length === 0 && (
						<div className="col-span-full text-center text-gray-500 py-16">Không có bản ghi</div>
					)}
				</div>
			</div>

			{/* Right progress panel like PREP */}
			<div className="space-y-4">
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div className="font-semibold">Tiến độ xử lý</div>
							<CalendarCheck2 className="w-4 h-4 text-gray-500" />
						</div>
						<div className="mt-3">
							<div className="text-sm text-gray-700">Tỉ lệ hoàn thành</div>
							<Progress value={ratio} className="h-2 mt-2" />
							<div className="text-xs text-gray-500 mt-1">
								{done}/{filtered.length} yêu cầu đã hoàn thành
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-blue-50">
					<CardContent className="p-4">
						<div className="font-semibold">Gợi ý hôm nay</div>
						<div className="text-sm text-blue-900 mt-1">
							Không có yêu cầu nào cần xử lý gấp. Hãy xem lại tiến độ và chuẩn bị cho tuần tới nhé!
						</div>
						<img
							src="/reference/prep-study-plan.png"
							alt="study plan reference"
							className="mt-3 rounded-md border object-cover"
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
