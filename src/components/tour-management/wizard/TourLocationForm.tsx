"use client"
import { useState, useEffect, useCallback } from "react"
import {
	Input,
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Tooltip,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
	Select,
	SelectItem,
	Textarea,
	Avatar,
	Spinner,
	Alert,
} from "@heroui/react"
import { Plus, Edit, Trash2, MapPin, Clock, Navigation } from "lucide-react"
import type { TourLocationRequest, Location, LocationResponse } from "@/types/Tour"
import { ListMedia } from "@/types/Location"
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
	const { getAllLocation } = useLocationController()
	const [errors, setErrors] = useState<Record<string, string>>({})

	const { isOpen, onOpen, onClose } = useDisclosure()

	// Fetch available locations
	const fetchLocations = useCallback(async () => {
		try {
			setLoadingLocations(true)
			const response = await getAllLocation()

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
		onOpen()
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
		onOpen()
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

		onClose()
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
		const thumbnail = location?.medias?.find((media: ListMedia) => media.isThumbnail)
		return thumbnail?.mediaUrl || "/placeholder.svg?height=40&width=40"
	}

	const formatTime = (time: string) => {
		return time.substring(0, 5) // Remove seconds
	}

	const dayOptions = Array.from({ length: totalDays }, (_, i) => ({
		key: (i + 1).toString(),
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
				<Alert color="primary">
					<div className="flex items-center gap-2">
						<Spinner size="sm" />
						Đang tải danh sách địa điểm...
					</div>
				</Alert>
			)}

			<Card>
				<CardHeader className="flex justify-between items-center">
					<h4 className="text-lg font-medium">Danh Sách Địa Điểm</h4>
					<Button
						color="primary"
						startContent={<Plus className="w-4 h-4" />}
						onPress={handleAddLocation}
						isDisabled={loadingLocations}
					>
						Thêm Địa Điểm
					</Button>
				</CardHeader>
				<CardBody>
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
									<h5 className="text-lg font-semibold mb-3 flex items-center gap-2">
										<Chip color="primary" variant="flat">
											Ngày {day}
										</Chip>
										<span className="text-sm text-gray-500">({locationsByDay[day]?.length || 0} địa điểm)</span>
									</h5>

									{locationsByDay[day]?.length > 0 ? (
										<div className="space-y-3">
											{locationsByDay[day]
												.sort((a, b) => a.startTime.localeCompare(b.startTime))
												.map((location: TourLocationRequest, locationIndex: number) => {
													const globalIndex = locations.findIndex((loc) => loc === location)
													return (
														<Card key={globalIndex} className="border">
															<CardBody className="p-4">
																<div className="flex items-center justify-between">
																	<div className="flex items-center gap-4">
																		<Avatar
																			src={getLocationImage(location.locationId)}
																			size="md"
																			className="flex-shrink-0"
																		/>
																		<div className="flex-1">
																			<h6 className="font-semibold">{getLocationName(location.locationId)}</h6>
																			<div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
																				<div className="flex items-center gap-1">
																					<Clock className="w-4 h-4" />
																					{formatTime(location.startTime)} - {formatTime(location.endTime)}
																				</div>
																				<Chip size="sm" variant="flat" color="secondary">
																					{getLocationCategory(location.locationId)}
																				</Chip>
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
																		<Tooltip content="Chỉnh sửa">
																			<Button
																				isIconOnly
																				size="sm"
																				variant="light"
																				onPress={() => handleEditLocation(globalIndex)}
																			>
																				<Edit className="w-4 h-4" />
																			</Button>
																		</Tooltip>
																		<Tooltip content="Xóa" color="danger">
																			<Button
																				isIconOnly
																				size="sm"
																				variant="light"
																				color="danger"
																				onPress={() => handleDeleteLocation(globalIndex)}
																			>
																				<Trash2 className="w-4 h-4" />
																			</Button>
																		</Tooltip>
																	</div>
																</div>
															</CardBody>
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
				</CardBody>
			</Card>

			<div className="flex justify-between pt-4">
				<Button variant="bordered" onPress={onPrevious} size="lg" className="px-8">
					Quay Lại
				</Button>
				<Button
					color="success"
					onPress={handleSubmit}
					isLoading={isLoading}
					size="lg"
					className="px-8"
					isDisabled={locations.length === 0}
				>
					Hoàn Thành Tạo Tour
				</Button>
			</div>

			{/* Location Form Modal */}
			<Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
				<ModalContent>
					<ModalHeader>{editingIndex !== null ? "Chỉnh Sửa Địa Điểm" : "Thêm Địa Điểm Mới"}</ModalHeader>
					<ModalBody>
						<div className="space-y-4">
							<Select
								label="Địa Điểm"
								placeholder="Chọn địa điểm tham quan"
								selectedKeys={formData.locationId ? [formData.locationId] : []}
								onSelectionChange={(keys) => {
									const selected = Array.from(keys)[0] as string
									handleInputChange("locationId", selected)
								}}
								isInvalid={!!errors.locationId}
								errorMessage={errors.locationId}
								isRequired
								variant="bordered"
								isLoading={loadingLocations}
							>
								{availableLocations.map((location) => (
									<SelectItem
										key={location.id}
										textValue={location.name}
										startContent={<Avatar src={location.medias?.find((m) => m.isThumbnail)?.mediaUrl} size="sm" />}
									>
										<div className="flex flex-col">
											<span className="font-medium">{location.name}</span>
											<span className="text-sm text-gray-500">
												{location.category} • {location.districtName}
											</span>
										</div>
									</SelectItem>
								))}
							</Select>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<Select
									label="Ngày Thứ"
									placeholder="Chọn ngày"
									selectedKeys={[formData.dayOrder.toString()]}
									onSelectionChange={(keys) => {
										const selected = Array.from(keys)[0] as string
										handleInputChange("dayOrder", Number.parseInt(selected))
									}}
									isInvalid={!!errors.dayOrder}
									errorMessage={errors.dayOrder}
									isRequired
									variant="bordered"
								>
									{dayOptions.map((option) => (
										<SelectItem key={option.key} textValue={option.label}>
											{option.label}
										</SelectItem>
									))}
								</Select>

								<Input
									label="Giờ Bắt Đầu"
									type="time"
									value={formData.startTime}
									onValueChange={(value) => handleInputChange("startTime", value)}
									isInvalid={!!errors.startTime}
									errorMessage={errors.startTime}
									isRequired
									variant="bordered"
								/>

								<Input
									label="Giờ Kết Thúc"
									type="time"
									value={formData.endTime}
									onValueChange={(value) => handleInputChange("endTime", value)}
									isInvalid={!!errors.endTime}
									errorMessage={errors.endTime}
									isRequired
									variant="bordered"
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Input
									label="Thời Gian Di Chuyển"
									type="number"
									min={0}
									value={formData.travelTimeFromPrev.toString()}
									onValueChange={(value) => handleInputChange("travelTimeFromPrev", Number.parseInt(value) || 0)}
									isInvalid={!!errors.travelTimeFromPrev}
									errorMessage={errors.travelTimeFromPrev}
									variant="bordered"
									endContent={
										<div className="pointer-events-none flex items-center">
											<span className="text-default-400 text-small">phút</span>
										</div>
									}
								/>

								<Input
									label="Khoảng Cách"
									type="number"
									min={0}
									value={formData.distanceFromPrev.toString()}
									onValueChange={(value) => handleInputChange("distanceFromPrev", Number.parseInt(value) || 0)}
									isInvalid={!!errors.distanceFromPrev}
									errorMessage={errors.distanceFromPrev}
									variant="bordered"
									endContent={
										<div className="pointer-events-none flex items-center">
											<span className="text-default-400 text-small">km</span>
										</div>
									}
								/>
							</div>

							<Textarea
								label="Ghi Chú"
								placeholder="Nhập ghi chú về địa điểm này (tùy chọn)"
								value={formData.notes}
								onValueChange={(value) => handleInputChange("notes", value)}
								variant="bordered"
								minRows={2}
							/>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button variant="light" onPress={onClose}>
							Hủy
						</Button>
						<Button color="primary" onPress={handleSaveLocation}>
							{editingIndex !== null ? "Cập Nhật" : "Thêm"}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	)
}
