"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
	ArrowLeft,
	Plus,
	Trash2,
	MapPin,
	Clock,
	Calendar,
	CheckCircle,
	Loader2,
	AlertTriangle,
	Search,
} from "lucide-react"
import type { TourLocationBulkRequest, Location } from "@/types/Tour"
import { useLocationController } from "@/services/location-controller"

interface TourLocationFormProps {
	tourId: string
	tourDays: number
	onSubmit: (data: TourLocationBulkRequest[]) => void
	onPrevious: () => void
	onCancel: () => void
	isLoading?: boolean
}

export function TourLocationForm({
	tourId,
	tourDays,
	onSubmit,
	onPrevious,
	onCancel,
	isLoading = false,
}: TourLocationFormProps) {
	const [locations, setLocations] = useState<TourLocationBulkRequest[]>([])
	const [availableLocations, setAvailableLocations] = useState<Location[]>([])
	const [loadingLocations, setLoadingLocations] = useState(true)
	const [searchTerm, setSearchTerm] = useState("")
	const [newLocation, setNewLocation] = useState<TourLocationBulkRequest>({
		locationId: "",
		dayOrder: 1,
		startTime: "",
		endTime: "",
		notes: "",
		travelTimeFromPrev: 0,
		distanceFromPrev: 0,
		estimatedStartTime: 0,
		estimatedEndTime: 0,
	})
	const [errors, setErrors] = useState<Record<string, string>>({})

	const { getAllLocation } = useLocationController()

	useEffect(() => {
		const fetchLocations = async () => {
			try {
				setLoadingLocations(true)
				const response = await getAllLocation()
				if (response) {
					setAvailableLocations(response)
				}
			} catch (error) {
				console.error("Error fetching locations:", error)
			} finally {
				setLoadingLocations(false)
			}
		}

		fetchLocations()
	}, [getAllLocation])

	const validateNewLocation = () => {
		const newErrors: Record<string, string> = {}

		if (!newLocation.locationId) {
			newErrors.locationId = "Địa điểm là bắt buộc"
		}

		if (!newLocation.startTime) {
			newErrors.startTime = "Thời gian bắt đầu là bắt buộc"
		}

		if (!newLocation.endTime) {
			newErrors.endTime = "Thời gian kết thúc là bắt buộc"
		}

		if (newLocation.startTime && newLocation.endTime) {
			if (newLocation.startTime >= newLocation.endTime) {
				newErrors.endTime = "Thời gian kết thúc phải sau thời gian bắt đầu"
			}
		}

		if (newLocation.dayOrder < 1 || newLocation.dayOrder > tourDays) {
			newErrors.dayOrder = `Ngày phải từ 1 đến ${tourDays}`
		}

		if (newLocation.travelTimeFromPrev < 0) {
			newErrors.travelTimeFromPrev = "Thời gian di chuyển không được âm"
		}

		if (newLocation.distanceFromPrev < 0) {
			newErrors.distanceFromPrev = "Khoảng cách không được âm"
		}

		// Check for time conflicts on the same day
		const sameDay = locations.filter((loc) => loc.dayOrder === newLocation.dayOrder)
		const hasTimeConflict = sameDay.some((loc) => {
			const existingStart = loc.startTime
			const existingEnd = loc.endTime
			const newStart = newLocation.startTime
			const newEnd = newLocation.endTime

			return (
				(newStart >= existingStart && newStart < existingEnd) ||
				(newEnd > existingStart && newEnd <= existingEnd) ||
				(newStart <= existingStart && newEnd >= existingEnd)
			)
		})

		if (hasTimeConflict) {
			newErrors.startTime = "Thời gian bị trùng với địa điểm khác trong cùng ngày"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleAddLocation = () => {
		if (validateNewLocation()) {
			setLocations([...locations, { ...newLocation }])
			setNewLocation({
				locationId: "",
				dayOrder: 1,
				startTime: "",
				endTime: "",
				notes: "",
				travelTimeFromPrev: 0,
				distanceFromPrev: 0,
				estimatedStartTime: 0,
				estimatedEndTime: 0,
			})
			setErrors({})
		}
	}

	const handleRemoveLocation = (index: number) => {
		setLocations(locations.filter((_, i) => i !== index))
	}

	const handleSubmit = () => {
		if (locations.length === 0) {
			setErrors({ general: "Vui lòng thêm ít nhất một địa điểm" })
			return
		}
		onSubmit(locations)
	}

	const getLocationsByDay = (day: number) => {
		return locations.filter((loc) => loc.dayOrder === day)
	}

	const getDayArray = () => {
		return Array.from({ length: tourDays }, (_, i) => i + 1)
	}

	const getLocationName = (locationId: string) => {
		const location = availableLocations.find((loc) => loc.id === locationId)
		return location?.name || "Unknown Location"
	}

	const getLocationDetails = (locationId: string) => {
		return availableLocations.find((loc) => loc.id === locationId)
	}

	const filteredLocations = availableLocations.filter(
		(location) =>
			location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
			location.category.toLowerCase().includes(searchTerm.toLowerCase()),
	)

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

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="text-center">
				<h2 className="text-2xl font-bold">Địa Điểm Tour</h2>
				<p className="text-gray-600 mt-2">Thêm các địa điểm tham quan cho tour {tourDays} ngày</p>
			</div>

			{/* Add New Location */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Plus className="w-5 h-5" />
						Thêm Địa Điểm Mới
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label className="flex items-center gap-2">
								<MapPin className="w-4 h-4" />
								Chọn Địa Điểm *
							</Label>
							<div className="space-y-2">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
									<Input
										placeholder="Tìm kiếm địa điểm..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="pl-10"
										disabled={isLoading}
									/>
								</div>
								<Select
									value={newLocation.locationId}
									onValueChange={(value) => setNewLocation({ ...newLocation, locationId: value })}
									disabled={isLoading || loadingLocations}
								>
									<SelectTrigger className={errors.locationId ? "border-red-500" : ""}>
										<SelectValue placeholder={loadingLocations ? "Đang tải..." : "Chọn địa điểm"} />
									</SelectTrigger>
									<SelectContent>
										{filteredLocations.map((location) => (
											<SelectItem key={location.id} value={location.id}>
												<div className="flex flex-col h-full">
													<span className="font-medium">{location.name}</span>
													<span className="text-xs text-gray-500">{location.address}</span>
													<Badge variant="outline" className="text-xs w-fit mt-1">
														{location.category}
													</Badge>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							{errors.locationId && <p className="text-sm text-red-500">{errors.locationId}</p>}
						</div>

						<div className="space-y-2">
							<Label className="flex items-center gap-2">
								<Calendar className="w-4 h-4" />
								Ngày Thứ *
							</Label>
							<Select
								value={newLocation.dayOrder.toString()}
								onValueChange={(value) => setNewLocation({ ...newLocation, dayOrder: Number.parseInt(value) })}
								disabled={isLoading}
							>
								<SelectTrigger className={errors.dayOrder ? "border-red-500" : ""}>
									<SelectValue placeholder="Chọn ngày" />
								</SelectTrigger>
								<SelectContent>
									{getDayArray().map((day) => (
										<SelectItem key={day} value={day.toString()}>
											Ngày {day}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.dayOrder && <p className="text-sm text-red-500">{errors.dayOrder}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="startTime" className="flex items-center gap-2">
								<Clock className="w-4 h-4" />
								Thời Gian Bắt Đầu *
							</Label>
							<Input
								id="startTime"
								type="time"
								value={newLocation.startTime}
								onChange={(e) => setNewLocation({ ...newLocation, startTime: e.target.value })}
								className={errors.startTime ? "border-red-500" : ""}
								disabled={isLoading}
							/>
							{errors.startTime && <p className="text-sm text-red-500">{errors.startTime}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="endTime" className="flex items-center gap-2">
								<Clock className="w-4 h-4" />
								Thời Gian Kết Thúc *
							</Label>
							<Input
								id="endTime"
								type="time"
								value={newLocation.endTime}
								onChange={(e) => setNewLocation({ ...newLocation, endTime: e.target.value })}
								className={errors.endTime ? "border-red-500" : ""}
								disabled={isLoading}
							/>
							{errors.endTime && <p className="text-sm text-red-500">{errors.endTime}</p>}
							{newLocation.startTime && newLocation.endTime && (
								<p className="text-xs text-blue-600">
									Thời gian: {calculateDuration(newLocation.startTime, newLocation.endTime)}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="travelTimeFromPrev">Thời Gian Di Chuyển (phút)</Label>
							<Input
								id="travelTimeFromPrev"
								type="number"
								min="0"
								placeholder="0"
								value={newLocation.travelTimeFromPrev}
								onChange={(e) =>
									setNewLocation({ ...newLocation, travelTimeFromPrev: Number.parseInt(e.target.value) || 0 })
								}
								className={errors.travelTimeFromPrev ? "border-red-500" : ""}
								disabled={isLoading}
							/>
							{errors.travelTimeFromPrev && <p className="text-sm text-red-500">{errors.travelTimeFromPrev}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="distanceFromPrev">Khoảng Cách (km)</Label>
							<Input
								id="distanceFromPrev"
								type="number"
								min="0"
								placeholder="0"
								value={newLocation.distanceFromPrev}
								onChange={(e) =>
									setNewLocation({ ...newLocation, distanceFromPrev: Number.parseInt(e.target.value) || 0 })
								}
								className={errors.distanceFromPrev ? "border-red-500" : ""}
								disabled={isLoading}
							/>
							{errors.distanceFromPrev && <p className="text-sm text-red-500">{errors.distanceFromPrev}</p>}
						</div>

						<div className="md:col-span-2 space-y-2">
							<Label htmlFor="notes">Ghi Chú</Label>
							<Textarea
								id="notes"
								placeholder="Nhập ghi chú về địa điểm (tùy chọn)"
								value={newLocation.notes}
								onChange={(e) => setNewLocation({ ...newLocation, notes: e.target.value })}
								rows={3}
								disabled={isLoading}
							/>
						</div>
					</div>

					{/* Location Preview */}
					{newLocation.locationId && (
						<div className="mt-4 p-4 bg-blue-50 rounded-lg">
							<h4 className="font-medium text-blue-900 mb-2">Xem Trước Địa Điểm</h4>
							{(() => {
								const locationDetails = getLocationDetails(newLocation.locationId)
								return locationDetails ? (
									<div className="space-y-2 text-sm text-blue-800">
										<p>
											<strong>Tên:</strong> {locationDetails.name}
										</p>
										<p>
											<strong>Địa chỉ:</strong> {locationDetails.address}
										</p>
										<p>
											<strong>Loại:</strong> {locationDetails.category}
										</p>
										<p>
											<strong>Mô tả:</strong> {locationDetails.description}
										</p>
										{locationDetails.openTime && locationDetails.closeTime && (
											<p>
												<strong>Giờ mở cửa:</strong> {formatTime(locationDetails.openTime)} -{" "}
												{formatTime(locationDetails.closeTime)}
											</p>
										)}
									</div>
								) : null
							})()}
						</div>
					)}

					<div className="flex justify-end mt-4">
						<Button onClick={handleAddLocation} className="flex items-center gap-2" disabled={isLoading}>
							<Plus className="w-4 h-4" />
							Thêm Địa Điểm
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Locations by Day */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<span>Lịch Trình Theo Ngày ({locations.length} địa điểm)</span>
						{locations.length > 0 && (
							<Badge variant="secondary" className="bg-green-100 text-green-800">
								{locations.length} địa điểm
							</Badge>
						)}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{locations.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							<MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
							<p>Chưa có địa điểm nào</p>
							<p className="text-sm">Vui lòng thêm ít nhất một địa điểm để tiếp tục</p>
						</div>
					) : (
						<Accordion type="multiple" className="w-full">
							{getDayArray().map((day) => {
								const dayLocations = getLocationsByDay(day).sort((a, b) => a.startTime.localeCompare(b.startTime))
								return (
									<AccordionItem key={day} value={`day-${day}`}>
										<AccordionTrigger className="hover:no-underline">
											<div className="flex items-center gap-3">
												<Badge variant="outline" className="bg-blue-50 text-blue-700">
													Ngày {day}
												</Badge>
												<span className="text-sm text-gray-600">{dayLocations.length} địa điểm</span>
												{dayLocations.length > 0 && <CheckCircle className="w-4 h-4 text-green-500" />}
											</div>
										</AccordionTrigger>
										<AccordionContent>
											{dayLocations.length === 0 ? (
												<p className="text-gray-500 text-sm py-4">Chưa có địa điểm nào cho ngày này</p>
											) : (
												<div className="space-y-3">
													{dayLocations.map((location, index) => {
														const globalIndex = locations.findIndex((loc) => loc === location)
														const locationDetails = getLocationDetails(location.locationId)
														return (
															<div key={index} className="border rounded-lg p-4 bg-gray-50">
																<div className="flex items-start justify-between">
																	<div className="flex-1">
																		<div className="flex items-center gap-2 mb-2">
																			<MapPin className="w-4 h-4 text-blue-500" />
																			<h4 className="font-semibold">{getLocationName(location.locationId)}</h4>
																			<Badge variant="outline" className="text-xs">
																				<Clock className="w-3 h-3 mr-1" />
																				{formatTime(location.startTime)} - {formatTime(location.endTime)}
																			</Badge>
																			<Badge variant="secondary" className="text-xs">
																				{calculateDuration(location.startTime, location.endTime)}
																			</Badge>
																		</div>
																		{locationDetails && (
																			<p className="text-sm text-gray-600 mb-2">{locationDetails.description}</p>
																		)}
																		{location.notes && (
																			<p className="text-sm text-blue-600 italic">Ghi chú: {location.notes}</p>
																		)}
																		<div className="flex gap-4 mt-2 text-xs text-gray-500">
																			{location.travelTimeFromPrev > 0 && (
																				<span>Di chuyển: {location.travelTimeFromPrev} phút</span>
																			)}
																			{location.distanceFromPrev > 0 && (
																				<span>Khoảng cách: {location.distanceFromPrev} km</span>
																			)}
																		</div>
																	</div>
																	<Button
																		variant="ghost"
																		size="sm"
																		onClick={() => handleRemoveLocation(globalIndex)}
																		className="text-red-500 hover:text-red-700"
																		disabled={isLoading}
																	>
																		<Trash2 className="w-4 h-4" />
																	</Button>
																</div>
															</div>
														)
													})}
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

			{errors.general && (
				<Alert className="border-red-200 bg-red-50">
					<AlertTriangle className="h-4 w-4 text-red-600" />
					<AlertDescription className="text-red-800">{errors.general}</AlertDescription>
				</Alert>
			)}

			{/* Action Buttons */}
			<div className="flex justify-between items-center pt-6 border-t">
				<Button
					variant="outline"
					onClick={onPrevious}
					className="flex items-center gap-2 bg-transparent"
					disabled={isLoading}
				>
					<ArrowLeft className="w-4 h-4" />
					Quay lại
				</Button>
				<div className="flex gap-3">
					<Button variant="ghost" onClick={onCancel} disabled={isLoading}>
						Hủy
					</Button>
					<Button onClick={handleSubmit} disabled={isLoading} className="flex items-center gap-2">
						{isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
						Hoàn thành
					</Button>
				</div>
			</div>
		</div>
	)
}
