"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useAtom } from "jotai"
import { userAtom } from "@/store/auth"
import { useTourguideAssign } from "@/services/tourguide"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TourList } from "@/components/tourguide/tour-list"
import type { AssignedTour } from "@/types/Tour"
import { formatPrice } from "@/utils/format"
import { CalendarDays, MapPin, Users } from 'lucide-react'
import { LoadingSkeleton } from "@/components/common/loading-skeleton"

export function ToursSection() {
	const [user] = useAtom(userAtom)
	const { getTourAssign, loading } = useTourguideAssign()
	const [search, setSearch] = useState("")
	const [status, setStatus] = useState<string>("all")
	const [selectedTour, setSelectedTour] = useState<AssignedTour | null>(null)
	const [open, setOpen] = useState(false)
	const [tours, setTours] = useState<AssignedTour[]>([])
	useEffect(() => {
		if (user?.id) {
			getTourAssign(user.id).then((res) => {
				setTours(res)
			})
		}
	}, [user?.id, getTourAssign])

	const filtered = useMemo(() => {
		return tours.filter((t) => {
			const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase())
			const matchesStatus = status === "all" || t.status === status
			return matchesSearch && matchesStatus
		})
	}, [tours, search, status])

	const onViewDetails = useCallback((tour: AssignedTour) => {
		setSelectedTour(tour)
		setOpen(true)
	}, [])

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>Tour được phân công</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex flex-col md:flex-row gap-3">
						<Input placeholder="Tìm kiếm tour..." value={search} onChange={(e) => setSearch(e.target.value)} />
						<Select value={status} onValueChange={setStatus}>
							<SelectTrigger className="md:w-56">
								<SelectValue placeholder="Trạng thái" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Tất cả</SelectItem>
								<SelectItem value="upcoming">Sắp diễn ra</SelectItem>
								<SelectItem value="in_progress">Đang diễn ra</SelectItem>
								<SelectItem value="completed">Đã hoàn thành</SelectItem>
							</SelectContent>
						</Select>
						<Button variant="outline" onClick={() => { }}>Tải lại</Button>
					</div>

					{loading && <LoadingSkeleton />}
					{!loading && <TourList tours={filtered} onViewDetails={onViewDetails} />}
				</CardContent>
			</Card>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>{selectedTour?.name}</DialogTitle>
						<DialogDescription>Chi tiết tour</DialogDescription>
					</DialogHeader>
					{selectedTour && (
						<div className="space-y-3">
							<div className="flex items-center text-sm text-gray-600">
								<CalendarDays className="w-4 h-4 mr-2" />
								<span>
									{new Date(selectedTour.startDate).toLocaleString("vi-VN")} -{" "}
									{new Date(selectedTour.endDate).toLocaleString("vi-VN")}
								</span>
							</div>
							<div className="flex items-center text-sm text-gray-600">
								<MapPin className="w-4 h-4 mr-2" />
								<span>{selectedTour.meetingLocation}</span>
							</div>
							<div className="flex items-center text-sm text-gray-600">
								<Users className="w-4 h-4 mr-2" />
								<span>
									{selectedTour.participants}/{selectedTour.maxParticipants} khách
								</span>
							</div>
							<div className="text-sm">
								<span className="font-medium text-green-600">{formatPrice(selectedTour.price)}</span>
							</div>
							{selectedTour.notes && (
								<div className="p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">{selectedTour.notes}</div>
							)}

							<div className="flex justify-end gap-2 pt-2">
								<Button variant="outline" onClick={() => setOpen(false)}>
									Đóng
								</Button>
								<Button variant="outline">In thông tin</Button>
								<Button>Liên hệ khách hàng</Button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}
