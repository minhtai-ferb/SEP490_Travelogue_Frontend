"use client"
import { useState, useEffect } from "react"
import {
	Input,
	Button,
	Card,
	CardBody,
	CardHeader,
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Chip,
	Tooltip,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from "@heroui/react"
import { Plus, Edit, Trash2, Calendar, Users, DollarSign } from "lucide-react"
import type { ScheduleFormData } from "@/types/Tour"

interface TourScheduleFormProps {
	initialData: ScheduleFormData[]
	totalDays: number
	onSubmit: (data: ScheduleFormData[]) => void
	onPrevious: () => void
	isLoading: boolean
}


export function TourScheduleForm({ initialData, totalDays, onSubmit, onPrevious, isLoading }: TourScheduleFormProps) {
	const [schedules, setSchedules] = useState<ScheduleFormData[]>(initialData)
	const [editingIndex, setEditingIndex] = useState<number | null>(null)
	const [formData, setFormData] = useState<ScheduleFormData>({
		departureDate: "",
		maxParticipant: 20,
		totalDays: totalDays,
		adultPrice: 0,
		childrenPrice: 0,
	})
	const [errors, setErrors] = useState<Record<string, string>>({})

	const { isOpen, onOpen, onClose } = useDisclosure()

	useEffect(() => {
		setFormData((prev) => ({ ...prev, totalDays }))
	}, [totalDays])

	const validateForm = () => {
		const newErrors: Record<string, string> = {}

		if (!formData.departureDate) {
			newErrors.departureDate = "Ngày khởi hành là bắt buộc"
		} else {
			const selectedDate = new Date(formData.departureDate)
			const today = new Date()
			today.setHours(0, 0, 0, 0)

			if (selectedDate < today) {
				newErrors.departureDate = "Ngày khởi hành không được trong quá khứ"
			}
		}

		if (formData.maxParticipant < 1) {
			newErrors.maxParticipant = "Số người tối đa phải ít nhất là 1"
		}

		if (formData.maxParticipant > 100) {
			newErrors.maxParticipant = "Số người tối đa không được vượt quá 100"
		}

		if (formData.adultPrice <= 0) {
			newErrors.adultPrice = "Giá người lớn phải lớn hơn 0"
		}

		if (formData.childrenPrice < 0) {
			newErrors.childrenPrice = "Giá trẻ em không được âm"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleAddSchedule = () => {
		setEditingIndex(null)
		setFormData({
			departureDate: "",
			maxParticipant: 20,
			totalDays: totalDays,
			adultPrice: 0,
			childrenPrice: 0,
		})
		setErrors({})
		onOpen()
	}

	const handleEditSchedule = (index: number) => {
		const schedule = schedules[index]
		setEditingIndex(index)
		setFormData({
			departureDate: schedule.departureDate.split("T")[0], // Extract date part
			maxParticipant: schedule.maxParticipant,
			totalDays: schedule.totalDays,
			adultPrice: schedule.adultPrice,
			childrenPrice: schedule.childrenPrice,
		})
		setErrors({})
		onOpen()
	}

	const handleDeleteSchedule = (index: number) => {
		setSchedules((prev) => prev.filter((_, i) => i !== index))
	}

	const handleSaveSchedule = () => {
		if (!validateForm()) return

		const scheduleData: ScheduleFormData = {
			departureDate: new Date(formData.departureDate).toISOString(),
			maxParticipant: formData.maxParticipant,
			totalDays: formData.totalDays,
			adultPrice: formData.adultPrice,
			childrenPrice: formData.childrenPrice,
		}

		if (editingIndex !== null) {
			// Edit existing schedule
			setSchedules((prev) => prev.map((schedule, index) => (index === editingIndex ? scheduleData : schedule)))
		} else {
			// Add new schedule
			setSchedules((prev) => [...prev, scheduleData])
		}

		onClose()
	}

	const handleSubmit = () => {
		if (schedules.length === 0) {
			alert("Vui lòng thêm ít nhất một lịch trình")
			return
		}
		console.log('====================================');
		console.log(schedules);
		console.log('====================================');
		onSubmit(schedules)
	}

	const handleInputChange = (field: keyof ScheduleFormData, value: any) => {
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

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("vi-VN")
	}

	const formatPrice = (price: number) => {
		return price.toLocaleString("vi-VN") + " VNĐ"
	}

	return (
		<div className="space-y-6">
			<div className="text-center mb-6">
				<h3 className="text-xl font-semibold text-gray-900">Lịch Trình Tour</h3>
				<p className="text-gray-600 mt-2">Thêm các lịch trình khởi hành cho tour {totalDays} ngày của bạn</p>
			</div>

			<Card>
				<CardHeader className="flex justify-between items-center">
					<h4 className="text-lg font-medium">Danh Sách Lịch Trình</h4>
					<Button color="primary" startContent={<Plus className="w-4 h-4" />} onPress={handleAddSchedule}>
						Thêm Lịch Trình
					</Button>
				</CardHeader>
				<CardBody>
					{schedules.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							<Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
							<p>Chưa có lịch trình nào</p>
							<p className="text-sm">Nhấn "Thêm Lịch Trình" để bắt đầu</p>
						</div>
					) : (
						<Table aria-label="Bảng lịch trình tour">
							<TableHeader>
								<TableColumn>Ngày Khởi Hành</TableColumn>
								<TableColumn>Số Ngày</TableColumn>
								<TableColumn>Số Người Tối Đa</TableColumn>
								<TableColumn>Giá Người Lớn</TableColumn>
								<TableColumn>Giá Trẻ Em</TableColumn>
								<TableColumn align="center">Hành Động</TableColumn>
							</TableHeader>
							<TableBody>
								{schedules.map((schedule, index) => (
									<TableRow key={index}>
										<TableCell>
											<div className="flex items-center gap-2">
												<Calendar className="w-4 h-4 text-primary" />
												{formatDate(schedule.departureDate)}
											</div>
										</TableCell>
										<TableCell>
											<Chip size="sm" variant="flat" color="primary">
												{schedule.totalDays} ngày
											</Chip>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<Users className="w-4 h-4 text-gray-500" />
												{schedule.maxParticipant} người
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<DollarSign className="w-4 h-4 text-success" />
												<span className="font-semibold text-success">{formatPrice(schedule.adultPrice)}</span>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<DollarSign className="w-4 h-4 text-warning" />
												<span className="font-semibold text-warning">{formatPrice(schedule.childrenPrice)}</span>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center justify-center gap-2">
												<Tooltip content="Chỉnh sửa">
													<Button isIconOnly size="sm" variant="light" onPress={() => handleEditSchedule(index)}>
														<Edit className="w-4 h-4" />
													</Button>
												</Tooltip>
												<Tooltip content="Xóa" color="danger">
													<Button
														isIconOnly
														size="sm"
														variant="light"
														color="danger"
														onPress={() => handleDeleteSchedule(index)}
													>
														<Trash2 className="w-4 h-4" />
													</Button>
												</Tooltip>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardBody>
			</Card>

			<div className="flex justify-between pt-4">
				<Button variant="bordered" onPress={onPrevious} size="lg" className="px-8">
					Quay Lại
				</Button>
				<Button
					color="primary"
					onPress={handleSubmit}
					isLoading={isLoading}
					size="lg"
					className="px-8"
					isDisabled={schedules.length === 0}
				>
					Tiếp Theo: Thêm Địa Điểm
				</Button>
			</div>

			{/* Schedule Form Modal */}
			<Modal isOpen={isOpen} onClose={onClose} size="2xl">
				<ModalContent>
					<ModalHeader>{editingIndex !== null ? "Chỉnh Sửa Lịch Trình" : "Thêm Lịch Trình Mới"}</ModalHeader>
					<ModalBody>
						<div className="space-y-4">
							<Input
								label="Ngày Khởi Hành"
								type="date"
								value={formData.departureDate}
								onValueChange={(value) => handleInputChange("departureDate", value)}
								isInvalid={!!errors.departureDate}
								errorMessage={errors.departureDate}
								isRequired
								variant="bordered"
							/>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Input
									label="Số Người Tối Đa"
									type="number"
									min={1}
									max={100}
									value={formData.maxParticipant.toString()}
									onValueChange={(value) => handleInputChange("maxParticipant", Number.parseInt(value) || 1)}
									isInvalid={!!errors.maxParticipant}
									errorMessage={errors.maxParticipant}
									isRequired
									variant="bordered"
									endContent={
										<div className="pointer-events-none flex items-center">
											<span className="text-default-400 text-small">người</span>
										</div>
									}
								/>

								<Input
									label="Số Ngày Tour"
									type="number"
									value={formData.totalDays.toString()}
									isReadOnly
									variant="bordered"
									description="Tự động lấy từ thông tin cơ bản"
									endContent={
										<div className="pointer-events-none flex items-center">
											<span className="text-default-400 text-small">ngày</span>
										</div>
									}
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Input
									label="Giá Người Lớn"
									type="number"
									min={0}
									value={formData.adultPrice.toString()}
									onValueChange={(value) => handleInputChange("adultPrice", Number.parseInt(value) || 0)}
									isInvalid={!!errors.adultPrice}
									errorMessage={errors.adultPrice}
									isRequired
									variant="bordered"
									startContent={
										<div className="pointer-events-none flex items-center">
											<span className="text-default-400 text-small">VNĐ</span>
										</div>
									}
								/>

								<Input
									label="Giá Trẻ Em"
									type="number"
									min={0}
									value={formData.childrenPrice.toString()}
									onValueChange={(value) => handleInputChange("childrenPrice", Number.parseInt(value) || 0)}
									isInvalid={!!errors.childrenPrice}
									errorMessage={errors.childrenPrice}
									variant="bordered"
									startContent={
										<div className="pointer-events-none flex items-center">
											<span className="text-default-400 text-small">VNĐ</span>
										</div>
									}
								/>
							</div>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button variant="light" onPress={onClose}>
							Hủy
						</Button>
						<Button color="primary" onPress={handleSaveSchedule}>
							{editingIndex !== null ? "Cập Nhật" : "Thêm"}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	)
}
