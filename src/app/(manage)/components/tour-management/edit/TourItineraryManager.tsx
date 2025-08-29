'use client';

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Clock, Calendar, Edit, Trash2, Plus, AlertCircle, CheckCircle, Car, Route } from "lucide-react"
import type { TourDetail, TourDay, TourLocationBulkRequest } from "@/types/Tour"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useTour } from "@/services/tour"
import TourLocationUpdateForm from "./TourLocationUpdateForm";
import { TourLocationForm } from "../wizard/TourLocationForm";


interface TourItineraryManagerProps {
	tour: TourDetail
	onUpdate: (updatedTour: TourDetail) => void
}

export function TourItineraryManager({ tour, onUpdate }: TourItineraryManagerProps) {
	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const { createTourBulk, getTourDetail } = useTour()
	const [isEditOpen, setIsEditOpen] = useState(false)
	const [editing, setEditing] = useState<{ dayNumber: number; activityIndex: number } | null>(null)


	const openEditDialog = (dayNumber: number, activityIndex: number) => {
		setEditing({ dayNumber, activityIndex })
		setIsEditOpen(true)
	}

	const getActivityInitialPayload = (): (TourLocationBulkRequest & { prevOfDay?: { locationId: string } | null }) | null => {
		if (!editing) return null
		const day = tour.days.find(d => d.dayNumber === editing.dayNumber)
		if (!day) return null
		const acts = [...day.activities].sort((a, b) => a.startTime.localeCompare(b.startTime))
		const activity = acts[editing.activityIndex]
		if (!activity) return null
		const initial: TourLocationBulkRequest = {
			tourPlanLocationId: activity.tourPlanLocationId,
			locationId: (activity as any).locationId || activity.id,
			dayOrder: editing.dayNumber,
			startTime: (activity as any).startTime || activity.startTimeFormatted,
			endTime: (activity as any).endTime || activity.endTimeFormatted,
			notes: activity.notes || "",
			travelTimeFromPrev: activity.travelTimeFromPrev || 0,
			distanceFromPrev: activity.distanceFromPrev || 0,
			estimatedStartTime: 0,
			estimatedEndTime: 0,
		}
		const prev = acts[editing.activityIndex - 1]
		const prevOfDay = prev ? { locationId: (prev as any).locationId || prev.id } : null
		return Object.assign(initial, { prevOfDay })
	}

	const handleSingleUpdate = async (payload: TourLocationBulkRequest) => {
		try {
			setIsSaving(true)
			setError("")
			setSuccess("")
			await createTourBulk(tour.tourId, [payload])
			const updated = await getTourDetail(tour.tourId)
			onUpdate(updated)
			setSuccess("Cập nhật địa điểm thành công!")
			setIsEditOpen(false)
			setEditing(null)
		} catch (e: any) {
			setError(e?.response?.data?.message || e.message || "Có lỗi khi cập nhật địa điểm")
		} finally {
			setIsSaving(false)
		}
	}

	const formatTime = (time: string) => {
		return time.substring(0, 5) // HH:MM format
	}

	const calculateDuration = (startTime: string, endTime: string) => {
		if (!startTime || !endTime) return ""

		const start = new Date(`2000-01-01T${startTime}`)
		const end = new Date(`2000-01-01T${endTime}`)
		const diffMs = end.getTime() - start.getTime()
		const diffMins = Math.floor(diffMs / 60000)

		if (diffMins < 60) {
			return `${diffMins} phút`
		} else {
			const hours = Math.floor(diffMins / 60)
			const mins = diffMins % 60
			return `${hours}h${mins > 0 ? ` ${mins}m` : ""}`
		}
	}

	const getTotalActivities = () => {
		return tour.days.reduce((total, day) => total + day.activities.length, 0)
	}

	const getDayStats = (day: TourDay) => {
		const totalDuration = day.activities.reduce((total, activity) => {
			const duration = calculateDuration(activity.startTime, activity.endTime)
			const minutes = duration.includes("h")
				? Number.parseInt(duration.split("h")[0]) * 60 + (Number.parseInt(duration.split("h")[1]) || 0)
				: Number.parseInt(duration) || 0
			return total + minutes
		}, 0)

		const hours = Math.floor(totalDuration / 60)
		const mins = totalDuration % 60
		const formattedDuration = hours > 0 ? `${hours}h${mins > 0 ? ` ${mins}m` : ""}` : `${mins}m`

		return {
			activities: day.activities.length,
			duration: formattedDuration,
			totalDistance: day.activities.reduce((total, activity) => total + activity.distanceFromPrev, 0),
			totalTravelTime: day.activities.reduce((total, activity) => total + activity.travelTimeFromPrev, 0),
		}
	}

	const initialBulkData: TourLocationBulkRequest[] = useMemo(() => {
		const items: TourLocationBulkRequest[] = []
		tour.days.forEach((day) => {
			day.activities.forEach((act) => {
				items.push({
					tourPlanLocationId: act.tourPlanLocationId,
					locationId: (act as any).locationId || act.id,
					dayOrder: day.dayNumber,
					startTime: act.startTime || act.startTimeFormatted,
					endTime: act.endTime || act.endTimeFormatted,
					notes: act.notes || "",
					travelTimeFromPrev: act.travelTimeFromPrev || 0,
					distanceFromPrev: act.distanceFromPrev || 0,
					estimatedStartTime: 0,
					estimatedEndTime: 0,
				})
			})
		})
		return items
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tour.tourId, tour.totalDays, tour.days])

	const handleBulkSubmit = async (data: TourLocationBulkRequest[]) => {
		try {
			setIsSaving(true)
			setError("")
			setSuccess("")
			await createTourBulk(tour.tourId, data)
			const updated = await getTourDetail(tour.tourId)
			onUpdate(updated)
			setSuccess("Cập nhật địa điểm của chuyến đi thành công!")
			setIsDialogOpen(false)
		} catch (e: any) {
			setError(e?.response?.data?.message || e.message || "Có lỗi khi cập nhật địa điểm của chuyến đi")
		} finally {
			setIsSaving(false)
		}
	}

	const handleDeleteActivity = (dayNumber: number, index: number) => {
		const day = tour.days.find(d => d.dayNumber === dayNumber)
		if (!day) return
		const activity = day.activities[index]
		if (!activity) return
		const newActivities = day.activities.filter((_, i) => i !== index)
		const newDays = tour.days.map(d => d.dayNumber === dayNumber ? { ...d, activities: newActivities } : d)
		const newTour = { ...tour, days: newDays }
		onUpdate(newTour)
		setSuccess("Xóa địa điểm của chuyến đi thành công!")
		setIsDialogOpen(false)
	}

	return (
		<div className="space-y-6">
			<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Chỉnh sửa địa điểm</DialogTitle>
					</DialogHeader>
					{(() => {
						const init = getActivityInitialPayload()
						if (!init) return null
						const { prevOfDay, ...initialData } = init
						return (
							<TourLocationUpdateForm
								tourDays={tour.totalDays}
								initial={initialData}
								prevOfDay={prevOfDay}
								onCancel={() => setIsEditOpen(false)}
								onSubmit={handleSingleUpdate}
							/>
						)
					})()}
				</DialogContent>
			</Dialog>
			{error && (
				<Alert className="border-red-200 bg-red-50">
					<AlertCircle className="h-4 w-4 text-red-600" />
					<AlertDescription className="text-red-800">{error}</AlertDescription>
				</Alert>
			)}

			{success && (
				<Alert className="border-green-200 bg-green-50">
					<CheckCircle className="h-4 w-4 text-green-600" />
					<AlertDescription className="text-green-800">{success}</AlertDescription>
				</Alert>
			)}

			{/* Overview Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center gap-2">
							<Calendar className="w-5 h-5 text-blue-500" />
							<div>
								<p className="text-sm text-gray-600">Tổng số ngày</p>
								<p className="text-2xl font-bold">{tour.totalDays}</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center gap-2">
							<MapPin className="w-5 h-5 text-green-500" />
							<div>
								<p className="text-sm text-gray-600">Tổng địa điểm</p>
								<p className="text-2xl font-bold">{getTotalActivities()}</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center gap-2">
							<Route className="w-5 h-5 text-purple-500" />
							<div>
								<p className="text-sm text-gray-600">Tổng khoảng cách</p>
								<p className="text-2xl font-bold">
									{tour.days.reduce(
										(total, day) =>
											total + day.activities.reduce((dayTotal, activity) => dayTotal + activity.distanceFromPrev, 0),
										0,
									)}
									km
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center gap-2">
							<Car className="w-5 h-5 text-orange-500" />
							<div>
								<p className="text-sm text-gray-600">Thời gian di chuyển</p>
								<p className="text-2xl font-bold">
									{Math.floor(
										tour.days.reduce(
											(total, day) =>
												total +
												day.activities.reduce((dayTotal, activity) => dayTotal + activity.travelTimeFromPrev, 0),
											0,
										) / 60,
									)}
									h
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Itinerary by Days */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Hành Trình Chi Tiết của chuyến đi</CardTitle>
						<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
							<DialogTrigger asChild>
								<Button>
									<Plus className="w-4 h-4 mr-2" />
									Cập Nhật Địa Điểm của chuyến đi
								</Button>
							</DialogTrigger>
							<DialogContent className="overflow-y-scroll max-h-[90vh] max-w-4xl">
								<DialogHeader>
									<DialogTitle>Cập Nhật Địa Điểm chuyến đi</DialogTitle>
								</DialogHeader>
								<TourLocationForm
									tourId={tour.tourId}
									tourDays={tour.totalDays}
									initialData={initialBulkData}
									onSubmit={handleBulkSubmit}
									onPrevious={() => setIsDialogOpen(false)}
									onCancel={() => setIsDialogOpen(false)}
									isLoading={isSaving}
								/>
							</DialogContent>
						</Dialog>
					</div>
				</CardHeader>
				<CardContent>
					{tour.days.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							<MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
							<p>Chưa có hành trình nào</p>
							<p className="text-sm">Thêm địa điểm đầu tiên cho chuyến đi này</p>
						</div>
					) : (
						<Accordion type="multiple" className="w-full">
							{tour.days.map((day) => {
								const stats = getDayStats(day)
								return (
									<AccordionItem key={day.dayNumber} value={`day-${day.dayNumber}`}>
										<AccordionTrigger className="hover:no-underline">
											<div className="flex items-center gap-4 w-full">
												<Badge variant="outline" className="bg-blue-50 text-blue-700">
													Ngày {day.dayNumber}
												</Badge>
												<div className="flex items-center gap-4 text-sm text-gray-600">
													<span className="flex items-center gap-1">
														<MapPin className="w-3 h-3" />
														{stats.activities} địa điểm
													</span>
													<span className="flex items-center gap-1">
														<Clock className="w-3 h-3" />
														{stats.duration}
													</span>
													<span className="flex items-center gap-1">
														<Route className="w-3 h-3" />
														{stats.totalDistance}km
													</span>
													<span className="flex items-center gap-1">
														<Car className="w-3 h-3" />
														{stats.totalTravelTime}min
													</span>
												</div>
											</div>
										</AccordionTrigger>
										<AccordionContent>
											{day.activities.length === 0 ? (
												<p className="text-gray-500 text-sm py-4">Chưa có hoạt động nào cho ngày này</p>
											) : (
												<div className="space-y-4">
													{day.activities
														.sort((a, b) => a.startTime.localeCompare(b.startTime))
														.map((activity, index) => (
															<div key={activity.tourPlanLocationId} className="border rounded-lg p-4 bg-gray-50">
																<div className="flex items-start justify-between">
																	<div className="flex-1">
																		<div className="flex items-center gap-2 mb-2">
																			<MapPin className="w-4 h-4 text-blue-500" />
																			<h4 className="font-semibold">{activity.name}</h4>
																			<Badge variant="outline" className="text-xs">
																				<Clock className="w-3 h-3 mr-1" />
																				{formatTime(activity.startTime)} - {formatTime(activity.endTime)}
																			</Badge>
																			<Badge variant="secondary" className="text-xs">
																				{activity.duration}
																			</Badge>
																		</div>

																		<p className="text-sm text-gray-600 mb-2">{activity.description}</p>
																		<p className="text-sm text-gray-500 mb-2">📍 {activity.address}</p>

																		{activity.notes && (
																			<p className="text-sm text-blue-600 italic mb-2">💡 {activity.notes}</p>
																		)}

																		<div className="flex gap-4 text-xs text-gray-500">
																			{activity.travelTimeFromPrev > 0 && (
																				<span className="flex items-center gap-1">
																					<Car className="w-3 h-3" />
																					Di chuyển: {activity.travelTimeFromPrev} phút
																				</span>
																			)}
																			{activity.distanceFromPrev > 0 && (
																				<span className="flex items-center gap-1">
																					<Route className="w-3 h-3" />
																					Khoảng cách: {activity.distanceFromPrev} km
																				</span>
																			)}
																		</div>
																	</div>

																	<div className="flex items-center gap-2 ml-4">
																		{activity.imageUrl && (
																			<img
																				src={activity.imageUrl || "/placeholder.svg"}
																				alt={activity.name}
																				className="w-16 h-16 object-cover rounded-lg"
																			/>
																		)}
																		<div className="flex flex-col gap-1">
																			<Button variant="ghost" size="sm" onClick={() => openEditDialog(day.dayNumber, index)}>
																				<Edit className="w-4 h-4" />
																			</Button>
																			<Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteActivity(day.dayNumber, index)}>
																				<Trash2 className="w-4 h-4" />
																			</Button>
																		</div>
																	</div>
																</div>
															</div>
														))}
												</div>
											)}
										</AccordionContent>
									</AccordionItem>
								)
							})}
						</Accordion>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
