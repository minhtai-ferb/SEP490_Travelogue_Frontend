"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/utils/format"
import { CalendarDays, Edit3, MapPin, Trophy, Users } from 'lucide-react'
import Link from "next/link"
import { GuideScheduleItem } from "@/types/Tourguide"
import { isValidDateIso } from "@/utils/validation"
import { Badge } from "@/components/ui/badge"

export interface TourCardProps {
	item: GuideScheduleItem
	onManageSchedules?: () => void
}

export default function TourCard({
	item,
	onManageSchedules,
}: TourCardProps) {

	const isSoon = (() => {
		if (!isValidDateIso(item?.date)) return false
		const today = new Date();
		today.setHours(0, 0, 0, 0)
		const d = new Date(item.date)
		const diffMs = d.getTime() - today.getTime()
		if (diffMs < 0) return false
		const diffDays = diffMs / (1000 * 60 * 60 * 24)
		return diffDays <= 7
	})()

	return (
		<Card className={`overflow-hidden hover:shadow-md transition-shadow ${isSoon ? 'border-amber-300 ring-1 ring-amber-200' : ''}`}>
			<div className="relative">
				<img src={item?.tourName || "/placeholder.svg"} alt={item?.tourName ?? ""} className="w-full h-36 object-cover" />
				{isSoon && (
					<Badge className="absolute top-2 left-2 bg-amber-500 text-white shadow-sm">Sắp tới</Badge>
				)}
			</div>
			<CardContent className="p-4">
				<div className="flex items-start justify-between gap-2">
					<div>
						<h3 className="font-semibold">{item?.tourName ?? "Không có tên"}</h3>
						{item?.note && <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item?.note}</p>}
					</div>
				</div>
				<div className="flex items-center gap-1">
					<Badge variant="destructive" className={`bg-blue-500 text-white rounded-md px-2 py-1 ${item?.scheduleType === "Booking" ? "bg-blue-500" : "bg-green-500"}`}>
						<span>{item?.scheduleType === "Booking" ? "Người dùng đặt" : "Lịch trình"}</span>
					</Badge>
				</div>
				<div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
					<div className="flex items-center gap-1">
						<CalendarDays className="w-4 h-4" />
						<span>Lịch: {formatDate(item?.date ?? "")}</span>
					</div>
					<div className="flex items-center gap-1">
						<Users className="w-4 h-4" />
						<span>Khách: {item?.customerName ?? "-"}</span>
					</div>
				</div>

				{/* <div className="mt-4 flex items-center justify-between">
					<Button variant="outline" onClick={onManageSchedules}>
						Quản lý lịch
					</Button>
					<Link href={`/dashboard/tours/${item?.id}/edit`}>
						<Button>
							<Edit3 className="w-4 h-4 mr-2" />
							Chỉnh sửa tour
						</Button>
					</Link>
				</div> */}
			</CardContent>
		</Card>
	)
}
