"use client"
import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Plus, Edit, Trash2, MapPin, Clock, Navigation, Loader2, AlertCircle } from "lucide-react"
import { Spin } from "antd"
import type { TourLocationRequest, Location, LocationResponse } from "@/types/Tour"
import { useLocationController } from "@/services/location-controller"

interface TourLocationFormProps {
	initialData: TourLocationRequest[]
	totalDays: number
	onSubmit: (data: TourLocationRequest[]) => void
	onPrevious: () => void
	isLoading: boolean
}

interface LocationFormData {
	locationId: string
	dayOrder: number
	startTime: string
	endTime: string
	notes: string
	travelTimeFromPrev: number
	distanceFromPrev: number
	estimatedStartTime: number
	estimatedEndTime: number
}

export function TourLocationForm({ initialData, totalDays, onSubmit, onPrevious, isLoading }: TourLocationFormProps) {
	const [locations, setLocations] = useState<TourLocationRequest[]>(initialData)
	const [availableLocations, setAvailableLocations] = useState<Location[]>([])
	const [editingIndex, setEditingIndex] = useState<number | null>(null)
	const [loadingLocations, setLoadingLocations] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const { getAllLocation } = useLocationController()
	const [formData, setFormData] = useState<LocationFormData>({
		locationId: "",
		dayOrder: 1,
		startTime: "08:00",
		endTime: "09:00",
		notes: "",
		travelTimeFromPrev: 0,
		distanceFromPrev: 0,
		estimatedStartTime: 0,
		estimatedEndTime: 0,
	})
	const [errors, setErrors] = useState<Record<string, string>>({})

	// Fetch available locations
	const fetchLocations = useCallback(async () => {
		try {
			setLoadingLocations(true)
			const response = await getAllLocation()

			if (!response) {
				throw new Error("Failed to fetch locations")
			}

			setAvailableLocations(response)

		} catch (error) {
			console.error("Error fetching locations:", error)
		} finally {
			setLoadingLocations(false)
		}
	}, [])

	useEffect(() => {
		fetchLocations()
	}, [fetchLocations])

	const validateForm = () => {
		const newErrors: Record<string, string> = {}

		if (!formData.locationId) {
			newErrors.locationId = "Vui lòng chọn địa điểm"
		}

		if (formData.dayOrder < 1 || formData.dayOrder > totalDays) {
			newErrors.dayOrder = `Ngày phải từ 1 đến ${totalDays}`
		}

		if (!formData.startTime) {
			newErrors.startTime = "Giờ bắt đầu là bắt buộc"
		}

		if (!formData.endTime) {
			newErrors.endTime = "Giờ kết thúc là bắt buộc"
		}

		if (formData.startTime && formData.endTime) {
			const startTime = new Date(`2000-01-01T${formData.startTime}:00`)
			const endTime = new Date(`2000-01-01T${formData.endTime}:00`)

			if (startTime >= endTime) {
				newErrors.endTime = "Giờ kết thúc phải sau giờ bắt đầu"
			}

			// Check for time conflicts with existing locations on the same day
			const conflictingLocation = locations.find((loc, index) => {
				if (editingIndex !== null && index === editingIndex) return false
				if (loc.dayOrder !== formData.dayOrder) return false

				const existingStart = new Date(`2000-01-01T${loc.startTime}:00`)
				const existingEnd = new Date(`2000-01-01T${loc.endTime}:00`)

				return (
					(startTime >= existingStart && startTime < existingEnd) ||
					(endTime > existingStart && endTime <= existingEnd) ||
					(startTime <= existingStart && endTime >= existingEnd)
				)
			})

			if (conflictingLocation) {
				newErrors.startTime = "Thời gian bị trùng với địa điểm khác trong cùng ngày"
				newErrors.endTime = "Thời gian bị trùng với địa điểm khác trong cùng ngày"
			}
		}

		if (formData.travelTimeFromPrev < 0) {
			newErrors.travelTimeFromPrev = "Thời gian di chuyển không được âm"
		}

		if (formData.distanceFromPrev < 0) {
			newErrors.distanceFromPrev = "Khoảng cách không được âm"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleAddLocation = () => {
		setEditingIndex(null)
		setFormData({
			locationId: "",
			dayOrder: 1,
			startTime: "08:00",
			endTime: "09:00",
			notes: "",
			travelTimeFromPrev: 0,
			distanceFromPrev: 0,
			estimatedStartTime: 0,
			estimatedEndTime: 0,
		})
		setErrors({})
		setIsModalOpen(true)
	}

	const handleEditLocation = (index: number) => {
		const location = locations[index]
		setEditingIndex(index)
		setFormData({
			locationId: location.locationId,
			dayOrder: location.dayOrder,
			startTime: location.startTime.substring(0, 5), // Remove seconds
			endTime: location.endTime.substring(0, 5), // Remove seconds
			notes: location.notes,
			travelTimeFromPrev: location.travelTimeFromPrev,
			distanceFromPrev: location.distanceFromPrev,
			estimatedStartTime: location.estimatedStartTime,
			estimatedEndTime: location.estimatedEndTime,
		})
		setErrors({})
		setIsModalOpen(true)
	}

	const handleDeleteLocation = (index: number) => {
		setLocations((prev) => prev.filter((_, i) => i !== index))
	}

	const handleSaveLocation = () => {
		if (!validateForm()) return

		const locationData: TourLocationRequest = {
			locationId: formData.locationId,
			dayOrder: formData.dayOrder,
			startTime: `${formData.startTime}:00`,
			endTime: `${formData.endTime}:00`,
			notes: formData.notes,
			travelTimeFromPrev: formData.travelTimeFromPrev,
			distanceFromPrev: formData.distanceFromPrev,
			estimatedStartTime: formData.estimatedStartTime,
			estimatedEndTime: formData.estimatedEndTime,
		}

		if (editingIndex !== null) {
			// Edit existing location
			setLocations((prev) => prev.map((location, index) => (index === editingIndex ? locationData : location)))
		} else {
			// Add new location
			setLocations((prev) => [...prev, locationData])
		}

		setIsModalOpen(false)
	}

	const handleSubmit = () => {
		if (locations.length === 0) {
			alert("Vui lòng thêm ít nhất một địa điểm")
			return
		}
		onSubmit(locations)
	}

	const handleInputChange = (field: keyof LocationFormData, value: any) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}))

		if (errors[field]) {
			setErrors((prev) => ({
				...prev,
				[field]: "",
			}))
		}
	}

	const getLocationName = (locationId: string) => {
		const location = availableLocations.find((loc) => loc.id === locationId)
		return location?.name || "Không xác định"
	}

	const getLocationCategory = (locationId: string) => {
		const location = availableLocations.find((loc) => loc.id === locationId)
		return location?.category || ""
	}

	const getLocationImage = (locationId: string) => {
		const location = availableLocations.find((loc) => loc.id === locationId)
		const thumbnail = location?.medias?.find((media) => media.isThumbnail)
		return thumbnail?.mediaUrl || "/placeholder.svg?height=40&width=40"
	}

	const formatTime = (time: string) => {
		return time.substring(0, 5) // Remove seconds
	}

	const dayOptions = Array.from({ length: totalDays }, (_, i) => ({
		value: (i + 1).toString(),
		label: `Ngày ${i + 1}`,
	}))

	// Group locations by day for better display
	const locationsByDay = locations.reduce(
		(acc, location) => {
			const day = location.dayOrder
			if (!acc[day]) acc[day] = []
			acc[day].push(location)
			return acc
		},
		{} as Record<number, TourLocationRequest[]>,
	)

	return (
		<div className="space-y-6">
			<div className="text-center mb-6">
				<h3 className="text-xl font-semibold text-gray-900">Địa Điểm Tham Quan</h3>
				<p className="text-gray-600 mt-2">Thêm các địa điểm tham quan cho tour {totalDays} ngày của bạn</p>
			</div>

			{loadingLocations && (
				<Alert>
					<AlertCircle className="h-4 w-4" />
					<AlertDescription className="flex items-center gap-2">
						<Spin size="small" />
						Đang tải danh sách địa điểm...
					</AlertDescription>
				</Alert>
			)}

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-lg font-medium">Danh Sách Địa Điểm</CardTitle>
					<Button onClick={handleAddLocation} disabled={loadingLocations} className="flex items-center gap-2">
						<Plus className="w-4 h-4" />
						Thêm Địa Điểm
					</Button>
				</CardHeader>
				<CardContent>
					{locations.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							<MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
							<p>Chưa có địa điểm nào</p>
							<p className="text-sm">Nhấn "Thêm Địa Điểm" để bắt đầu</p>
						</div>
					) : (
						<div className="space-y-6">
							{Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
								<div key={day}>
									<div className="flex items-center gap-2 mb-3">
										<Badge variant="default" className="text-sm">
											Ngày {day}
										</Badge>
										<span className="text-sm text-gray-500">({locationsByDay[day]?.length || 0} địa điểm)</span>
									</div>

									{locationsByDay[day]?.length > 0 ? (
										<div className="space-y-3">
											{locationsByDay[day]
												.sort((a, b) => a.startTime.localeCompare(b.startTime))
												.map((location, locationIndex) => {
													const globalIndex = locations.findIndex((loc) => loc === location)
													return (
														<Card key={globalIndex} className="border">
															<CardContent className="p-4">
																<div className="flex items-center justify-between">
																	<div className="flex items-center gap-4">
																		<Avatar className="h-12 w-12">
																			<AvatarImage src={getLocationImage(location.locationId) || "/placeholder.svg"} />
																			<AvatarFallback>
																				<MapPin className="h-6 w-6" />
																			</AvatarFallback>
																		</Avatar>
																		<div className="flex-1">
																			<h6 className="font-semibold">{getLocationName(location.locationId)}</h6>
																			<div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
																				<div className="flex items-center gap-1">
																					<Clock className="w-4 h-4" />
																					{formatTime(location.startTime)} - {formatTime(location.endTime)}
																				</div>
																				<Badge variant="secondary" className="text-xs">
																					{getLocationCategory(location.locationId)}
																				</Badge>
																			</div>
																			{location.notes && <p className="text-sm text-gray-600 mt-2">{location.notes}</p>}
																			{location.travelTimeFromPrev > 0 && (
																				<div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
																					<Navigation className="w-3 h-3" />
																					{location.travelTimeFromPrev} phút di chuyển
																					{location.distanceFromPrev > 0 && ` (${location.distanceFromPrev} km)`}
																				</div>
																			)}
																		</div>
																	</div>
																	<div className="flex items-center gap-2">
																		<TooltipProvider>
																			<Tooltip>
																				<TooltipTrigger asChild>
																					<Button
																						variant="ghost"
																						size="sm"
																						onClick={() => handleEditLocation(globalIndex)}
																					>
																						<Edit className="w-4 h-4" />
																					</Button>
																				</TooltipTrigger>
																				<TooltipContent>Chỉnh sửa</TooltipContent>
																			</Tooltip>
																		</TooltipProvider>
																		<TooltipProvider>
																			<Tooltip>
																				<TooltipTrigger asChild>
																					<Button
																						variant="ghost"
																						size="sm"
																						onClick={() => handleDeleteLocation(globalIndex)}
																						className="text-red-500 hover:text-red-700"
																					>
																						<Trash2 className="w-4 h-4" />
																					</Button>
																				</TooltipTrigger>
																				<TooltipContent>Xóa</TooltipContent>
																			</Tooltip>
																		</TooltipProvider>
																	</div>
																</div>
															</CardContent>
														</Card>
													)
												})}
										</div>
									) : (
										<div className="text-center py-4 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
											<MapPin className="w-8 h-8 mx-auto mb-2" />
											<p className="text-sm">Chưa có địa điểm nào cho ngày {day}</p>
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			<div className="flex justify-between pt-4">
				<Button variant="outline" onClick={onPrevious} size="lg" className="px-8 bg-transparent">
					Quay Lại
				</Button>
				<Button
					onClick={handleSubmit}
					disabled={isLoading || locations.length === 0}
					size="lg"
					className="px-8 bg-green-600 hover:bg-green-700"
				>
					{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Hoàn Thành Tạo Tour
				</Button>
			</div>

			{/* Location Form Modal */}
			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>{editingIndex !== null ? "Chỉnh Sửa Địa Điểm" : "Thêm Địa Điểm Mới"}</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="locationId">
								Địa Điểm <span className="text-red-500">*</span>
							</Label>
							<Select
								value={formData.locationId}
								onValueChange={(value) => handleInputChange("locationId", value)}
								disabled={loadingLocations}
							>
								<SelectTrigger className={errors.locationId ? "border-red-500" : ""}>
									<SelectValue placeholder="Chọn địa điểm tham quan" />
								</SelectTrigger>
								<SelectContent>
									{availableLocations.map((location) => (
										<SelectItem key={location.id} value={location.id}>
											<div className="flex items-center gap-2">
												<Avatar className="h-6 w-6">
													<AvatarImage
														src={location.medias?.find((m) => m.isThumbnail)?.mediaUrl || "/placeholder.svg"}
													/>
													<AvatarFallback>
														<MapPin className="h-3 w-3" />
													</AvatarFallback>
												</Avatar>
												<div>
													<div className="font-medium">{location.name}</div>
													<div className="text-sm text-gray-500">
														{location.category} • {location.districtName}
													</div>
												</div>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.locationId && <p className="text-sm text-red-500">{errors.locationId}</p>}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label htmlFor="dayOrder">
									Ngày Thứ <span className="text-red-500">*</span>
								</Label>
								<Select
									value={formData.dayOrder.toString()}
									onValueChange={(value) => handleInputChange("dayOrder", Number.parseInt(value))}
								>
									<SelectTrigger className={errors.dayOrder ? "border-red-500" : ""}>
										<SelectValue placeholder="Chọn ngày" />
									</SelectTrigger>
									<SelectContent>
										{dayOptions.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{errors.dayOrder && <p className="text-sm text-red-500">{errors.dayOrder}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="startTime">
									Giờ Bắt Đầu <span className="text-red-500">*</span>
								</Label>
								<Input
									id="startTime"
									type="time"
									value={formData.startTime}
									onChange={(e) => handleInputChange("startTime", e.target.value)}
									className={errors.startTime ? "border-red-500" : ""}
								/>
								{errors.startTime && <p className="text-sm text-red-500">{errors.startTime}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="endTime">
									Giờ Kết Thúc <span className="text-red-500">*</span>
								</Label>
								<Input
									id="endTime"
									type="time"
									value={formData.endTime}
									onChange={(e) => handleInputChange("endTime", e.target.value)}
									className={errors.endTime ? "border-red-500" : ""}
								/>
								{errors.endTime && <p className="text-sm text-red-500">{errors.endTime}</p>}
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="travelTimeFromPrev">Thời Gian Di Chuyển</Label>
								<div className="relative">
									<Input
										id="travelTimeFromPrev"
										type="number"
										min={0}
										value={formData.travelTimeFromPrev.toString()}
										onChange={(e) => handleInputChange("travelTimeFromPrev", Number.parseInt(e.target.value) || 0)}
										className={errors.travelTimeFromPrev ? "border-red-500" : ""}
									/>
									<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
										<span className="text-gray-500 text-sm">phút</span>
									</div>
								</div>
								{errors.travelTimeFromPrev && <p className="text-sm text-red-500">{errors.travelTimeFromPrev}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="distanceFromPrev">Khoảng Cách</Label>
								<div className="relative">
									<Input
										id="distanceFromPrev"
										type="number"
										min={0}
										value={formData.distanceFromPrev.toString()}
										onChange={(e) => handleInputChange("distanceFromPrev", Number.parseInt(e.target.value) || 0)}
										className={errors.distanceFromPrev ? "border-red-500" : ""}
									/>
									<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
										<span className="text-gray-500 text-sm">km</span>
									</div>
								</div>
								{errors.distanceFromPrev && <p className="text-sm text-red-500">{errors.distanceFromPrev}</p>}
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="notes">Ghi Chú</Label>
							<Textarea
								id="notes"
								placeholder="Nhập ghi chú về địa điểm này (tùy chọn)"
								value={formData.notes}
								onChange={(e) => handleInputChange("notes", e.target.value)}
								className="min-h-[60px]"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsModalOpen(false)}>
							Hủy
						</Button>
						<Button onClick={handleSaveLocation}>{editingIndex !== null ? "Cập Nhật" : "Thêm"}</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
