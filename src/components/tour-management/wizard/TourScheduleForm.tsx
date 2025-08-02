"use client"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Plus, Edit, Trash2, Calendar, Users, DollarSign, Loader2 } from "lucide-react"
import { ScheduleFormData } from "@/types/Tour"

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
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [formData, setFormData] = useState<ScheduleFormData>({
		departureDate: "",
		maxParticipant: 20,
		totalDays: totalDays,
		adultPrice: 0,
		childrenPrice: 0,
	})
	const [errors, setErrors] = useState<Record<string, string>>({})

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
		setIsModalOpen(true)
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
		setIsModalOpen(true)
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

		setIsModalOpen(false)
	}

	const handleSubmit = () => {
		if (schedules.length === 0) {
			alert("Vui lòng thêm ít nhất một lịch trình")
			return
		}
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
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-lg font-medium">Danh Sách Lịch Trình</CardTitle>
					<Button onClick={handleAddSchedule} className="flex items-center gap-2">
						<Plus className="w-4 h-4" />
						Thêm Lịch Trình
					</Button>
				</CardHeader>
				<CardContent>
					{schedules.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							<Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
							<p>Chưa có lịch trình nào</p>
							<p className="text-sm">Nhấn "Thêm Lịch Trình" để bắt đầu</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Ngày Khởi Hành</TableHead>
									<TableHead>Số Ngày</TableHead>
									<TableHead>Số Người Tối Đa</TableHead>
									<TableHead>Giá Người Lớn</TableHead>
									<TableHead>Giá Trẻ Em</TableHead>
									<TableHead className="text-center">Hành Động</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{schedules.map((schedule, index) => (
									<TableRow key={index}>
										<TableCell>
											<div className="flex items-center gap-2">
												<Calendar className="w-4 h-4 text-blue-500" />
												{formatDate(schedule.departureDate)}
											</div>
										</TableCell>
										<TableCell>
											<Badge variant="secondary">{schedule.totalDays} ngày</Badge>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<Users className="w-4 h-4 text-gray-500" />
												{schedule.maxParticipant} người
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<DollarSign className="w-4 h-4 text-green-500" />
												<span className="font-semibold text-green-600">{formatPrice(schedule.adultPrice)}</span>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<DollarSign className="w-4 h-4 text-orange-500" />
												<span className="font-semibold text-orange-600">{formatPrice(schedule.childrenPrice)}</span>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center justify-center gap-2">
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger asChild>
															<Button variant="ghost" size="sm" onClick={() => handleEditSchedule(index)}>
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
																onClick={() => handleDeleteSchedule(index)}
																className="text-red-500 hover:text-red-700"
															>
																<Trash2 className="w-4 h-4" />
															</Button>
														</TooltipTrigger>
														<TooltipContent>Xóa</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			<div className="flex justify-between pt-4">
				<Button variant="outline" onClick={onPrevious} size="lg" className="px-8 bg-transparent">
					Quay Lại
				</Button>
				<Button onClick={handleSubmit} disabled={isLoading || schedules.length === 0} size="lg" className="px-8">
					{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Tiếp Theo: Thêm Địa Điểm
				</Button>
			</div>

			{/* Schedule Form Modal */}
			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>{editingIndex !== null ? "Chỉnh Sửa Lịch Trình" : "Thêm Lịch Trình Mới"}</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="departureDate">
								Ngày Khởi Hành <span className="text-red-500">*</span>
							</Label>
							<Input
								id="departureDate"
								type="date"
								value={formData.departureDate}
								onChange={(e) => handleInputChange("departureDate", e.target.value)}
								className={errors.departureDate ? "border-red-500" : ""}
							/>
							{errors.departureDate && <p className="text-sm text-red-500">{errors.departureDate}</p>}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="maxParticipant">
									Số Người Tối Đa <span className="text-red-500">*</span>
								</Label>
								<div className="relative">
									<Input
										id="maxParticipant"
										type="number"
										min={1}
										max={100}
										value={formData.maxParticipant.toString()}
										onChange={(e) => handleInputChange("maxParticipant", Number.parseInt(e.target.value) || 1)}
										className={errors.maxParticipant ? "border-red-500" : ""}
									/>
									<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
										<span className="text-gray-500 text-sm">người</span>
									</div>
								</div>
								{errors.maxParticipant && <p className="text-sm text-red-500">{errors.maxParticipant}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="totalDays">Số Ngày Tour</Label>
								<div className="relative">
									<Input
										id="totalDays"
										type="number"
										value={formData.totalDays.toString()}
										readOnly
										className="bg-gray-50"
									/>
									<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
										<span className="text-gray-500 text-sm">ngày</span>
									</div>
								</div>
								<p className="text-sm text-gray-500">Tự động lấy từ thông tin cơ bản</p>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="adultPrice">
									Giá Người Lớn <span className="text-red-500">*</span>
								</Label>
								<div className="relative">
									<Input
										id="adultPrice"
										type="number"
										min={0}
										value={formData.adultPrice.toString()}
										onChange={(e) => handleInputChange("adultPrice", Number.parseInt(e.target.value) || 0)}
										className={errors.adultPrice ? "border-red-500" : ""}
									/>
									<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
										<span className="text-gray-500 text-sm">VNĐ</span>
									</div>
								</div>
								{errors.adultPrice && <p className="text-sm text-red-500">{errors.adultPrice}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="childrenPrice">Giá Trẻ Em</Label>
								<div className="relative">
									<Input
										id="childrenPrice"
										type="number"
										min={0}
										value={formData.childrenPrice.toString()}
										onChange={(e) => handleInputChange("childrenPrice", Number.parseInt(e.target.value) || 0)}
										className={errors.childrenPrice ? "border-red-500" : ""}
									/>
									<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
										<span className="text-gray-500 text-sm">VNĐ</span>
									</div>
								</div>
								{errors.childrenPrice && <p className="text-sm text-red-500">{errors.childrenPrice}</p>}
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsModalOpen(false)}>
							Hủy
						</Button>
						<Button onClick={handleSaveSchedule}>{editingIndex !== null ? "Cập Nhật" : "Thêm"}</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
