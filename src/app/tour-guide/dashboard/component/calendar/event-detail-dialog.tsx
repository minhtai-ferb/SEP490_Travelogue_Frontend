"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, User2, DollarSign, LinkIcon } from "lucide-react"
import type { GuideScheduleItem } from "@/types/Tourguide"
import dayjs from "dayjs"
import 'dayjs/locale/vi';
import { CiMoneyBill } from "react-icons/ci"

export default function EventDetailDialog({
	open,
	onOpenChange,
	item,
}: {
	open: boolean
	onOpenChange: (v: boolean) => void
	item?: any
}) {
	if (!item) return null

	const statusColor: Record<string, string> = {
		Booking: "bg-sky-600",
		TourSchedule: "bg-amber-600",
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<div className="flex items-center gap-2">
							<Badge className={`${statusColor[item.eventKind || item.status || "Booking"]} text-white`}>
								{item.eventKind || item.status || "Booking"}
							</Badge>
						</div>
						{item.tourName || "Lịch"}
					</DialogTitle>
					<DialogDescription>Chi tiết lịch hướng dẫn viên</DialogDescription>
				</DialogHeader>

				<div className="space-y-3">
					<div className="flex items-center gap-2 text-sm">
						<CalendarDays className="w-4 h-4 text-muted-foreground" />
						<span>{dayjs(item.date).locale("vi").format("dddd, DD/MM/YYYY")}</span>
					</div>
					{item.location && (
						<div className="flex items-center gap-2 text-sm">
							<MapPin className="w-4 h-4 text-muted-foreground" />
							<span>{item.location}</span>
						</div>
					)}
					{item.customerName && (
						<div className="flex items-center gap-2 text-sm">
							<User2 className="w-4 h-4 text-muted-foreground" />
							<span>Khách: {item.customerName}</span>
						</div>
					)}
					{typeof item.price === "number" && (
						<div className="flex items-center gap-2 text-sm">
							<CiMoneyBill className="w-4 h-4 text-muted-foreground" />
							<span>Thu nhập dự kiến: {new Intl.NumberFormat("vi-VN").format(item.price)} đ</span>
						</div>
					)}

					{/* <div className="pt-2 flex flex-wrap gap-2">
						{item.bookingId && (
							<Button asChild>
								<a href={`/booking/${item.bookingId}`}>
									<LinkIcon className="w-4 h-4 mr-2" />
									Xem booking
								</a>
							</Button>
						)}
						{item.tripPlanId && (
							<Button variant="outline" asChild>
								<a href={`/trip-plan/${item.tripPlanId}`}>
									<LinkIcon className="w-4 h-4 mr-2" />
									Xem Trip plan
								</a>
							</Button>
						)}
					</div> */}
				</div>
			</DialogContent>
		</Dialog>
	)
}
