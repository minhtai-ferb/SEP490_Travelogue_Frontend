"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ArrowLeft, Plus, Trash2, Calendar, Users, DollarSign, Loader2 } from "lucide-react"
import type { ScheduleFormData } from "@/types/Tour"

interface TourScheduleFormProps {
	initialData?: ScheduleFormData[]
	tourDays: number
	onSubmit: (data: ScheduleFormData[]) => void
	onPrevious: () => void
	onCancel: () => void
	isLoading?: boolean
}

export function TourScheduleForm({
	initialData = [],
	tourDays,
	onSubmit,
	onPrevious,
	onCancel,
	isLoading = false,
}: TourScheduleFormProps) {
	const [schedules, setSchedules] = useState<ScheduleFormData[]>(initialData)
	const [newSchedule, setNewSchedule] = useState<ScheduleFormData>({
		departureDate: "",
		maxParticipant: 20,
		totalDays: tourDays,
		adultPrice: 0,
		childrenPrice: 0,
	})
	const [errors, setErrors] = useState<Record<string, string>>({})

	useEffect(() => {
		if (initialData.length > 0) {
			setSchedules(initialData)
		}
	}, [initialData])

	useEffect(() => {
		setNewSchedule((prev) => ({ ...prev, totalDays: tourDays }))
	}, [tourDays])

	const validateNewSchedule = () => {
		const newErrors: Record<string, string> = {}

		if (!newSchedule.departureDate) {
			newErrors.departureDate = "Ngày khởi hành là bắt buộc"
		}

		if (newSchedule.maxParticipant <= 0) {
			newErrors.maxParticipant = "Số người tham gia phải lớn hơn 0"
		}

		if (newSchedule.adultPrice <= 0) {
			newErrors.adultPrice = "Giá người lớn phải lớn hơn 0"
		}

		if (newSchedule.childrenPrice < 0) {
			newErrors.childrenPrice = "Giá trẻ em không được âm"
		}

		// Check for duplicate dates
		const existingDate = schedules.find((s) => s.departureDate === newSchedule.departureDate)
		if (existingDate) {
			newErrors.departureDate = "Ngày khởi hành đã tồn tại"
		}

		// Check if departure date is in the past
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		const departureDate = new Date(newSchedule.departureDate)
		if (departureDate < today) {
			newErrors.departureDate = "Ngày khởi hành không được trong quá khứ"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleAddSchedule = () => {
		if (validateNewSchedule()) {
			setSchedules([...schedules, { ...newSchedule }])
			setNewSchedule({
				departureDate: "",
				maxParticipant: 20,
				totalDays: tourDays,
				adultPrice: 0,
				childrenPrice: 0,
			})
			setErrors({})
		}
	}

	const handleRemoveSchedule = (index: number) => {
		setSchedules(schedules.filter((_, i) => i !== index))
	}

	const handleSubmit = () => {
		if (schedules.length === 0) {
			setErrors({ general: "Vui lòng thêm ít nhất một lịch trình" })
			return
		}
		onSubmit(schedules)
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("vi-VN", {
			year: "numeric",
			month: "long",
			day: "numeric",
			weekday: "long",
		})
	}

	const getTotalRevenue = () => {
		return schedules.reduce((total, schedule) => {
			return total + schedule.adultPrice * schedule.maxParticipant
		}, 0)
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="text-center">
				<h2 className="text-2xl font-bold">Lịch Trình Tour</h2>
				<p className="text-gray-600 mt-2">Thêm các ngày khởi hành và giá cho tour {tourDays} ngày</p>
			</div>

			{/* Add New Schedule */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Plus className="w-5 h-5" />
						Thêm Lịch Trình Mới
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div className="space-y-2">
							<Label htmlFor="departureDate" className="flex items-center gap-2">
								<Calendar className="w-4 h-4" />
								Ngày Khởi Hành *
							</Label>
							<Input
								id="departureDate"
								type="date"
								value={newSchedule.departureDate}
								onChange={(e) => setNewSchedule({ ...newSchedule, departureDate: e.target.value })}
								className={errors.departureDate ? "border-red-500" : ""}
								disabled={isLoading}
							/>
							{errors.departureDate && <p className="text-sm text-red-500">{errors.departureDate}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="maxParticipant" className="flex items-center gap-2">
								<Users className="w-4 h-4" />
								Số Người Tối Đa *
							</Label>
							<Input
								id="maxParticipant"
								type="number"
								min="1"
								placeholder="20"
								value={newSchedule.maxParticipant}
								onChange={(e) =>
									setNewSchedule({ ...newSchedule, maxParticipant: Number.parseInt(e.target.value) || 0 })
								}
								className={errors.maxParticipant ? "border-red-500" : ""}
								disabled={isLoading}
							/>
							{errors.maxParticipant && <p className="text-sm text-red-500">{errors.maxParticipant}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="adultPrice" className="flex items-center gap-2">
								<DollarSign className="w-4 h-4" />
								Giá Người Lớn (VNĐ) *
							</Label>
							<Input
								id="adultPrice"
								type="number"
								min="0"
								placeholder="0"
								value={newSchedule.adultPrice}
								onChange={(e) => setNewSchedule({ ...newSchedule, adultPrice: Number.parseInt(e.target.value) || 0 })}
								className={errors.adultPrice ? "border-red-500" : ""}
								disabled={isLoading}
							/>
							{errors.adultPrice && <p className="text-sm text-red-500">{errors.adultPrice}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="childrenPrice" className="flex items-center gap-2">
								<DollarSign className="w-4 h-4" />
								Giá Trẻ Em (VNĐ)
							</Label>
							<Input
								id="childrenPrice"
								type="number"
								min="0"
								placeholder="0"
								value={newSchedule.childrenPrice}
								onChange={(e) =>
									setNewSchedule({ ...newSchedule, childrenPrice: Number.parseInt(e.target.value) || 0 })
								}
								className={errors.childrenPrice ? "border-red-500" : ""}
								disabled={isLoading}
							/>
							{errors.childrenPrice && <p className="text-sm text-red-500">{errors.childrenPrice}</p>}
						</div>
					</div>

					<div className="flex justify-end mt-4">
						<Button onClick={handleAddSchedule} className="flex items-center gap-2" disabled={isLoading}>
							<Plus className="w-4 h-4" />
							Thêm Lịch Trình
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Schedules List */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<span>Danh Sách Lịch Trình ({schedules.length})</span>
						<div className="flex gap-2">
							{schedules.length > 0 && (
								<>
									<Badge variant="secondary" className="bg-green-100 text-green-800">
										{schedules.length} lịch trình
									</Badge>
									<Badge variant="secondary" className="bg-blue-100 text-blue-800">
										Tổng doanh thu: {getTotalRevenue().toLocaleString()} VNĐ
									</Badge>
								</>
							)}
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent>
					{schedules.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							<Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
							<p>Chưa có lịch trình nào</p>
							<p className="text-sm">Vui lòng thêm ít nhất một lịch trình để tiếp tục</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Ngày Khởi Hành</TableHead>
										<TableHead>Số Người</TableHead>
										<TableHead>Giá Người Lớn</TableHead>
										<TableHead>Giá Trẻ Em</TableHead>
										<TableHead>Doanh Thu Dự Kiến</TableHead>
										<TableHead className="text-center">Hành Động</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{schedules.map((schedule, index) => (
										<TableRow key={index}>
											<TableCell>
												<div>
													<p className="font-medium">{new Date(schedule.departureDate).toLocaleDateString("vi-VN")}</p>
													<p className="text-sm text-gray-500">{formatDate(schedule.departureDate)}</p>
												</div>
											</TableCell>
											<TableCell>
												<Badge variant="outline" className="flex items-center gap-1 w-fit">
													<Users className="w-3 h-3" />
													{schedule.maxParticipant} người
												</Badge>
											</TableCell>
											<TableCell>
												<span className="font-semibold text-green-600">{schedule.adultPrice.toLocaleString()} VNĐ</span>
											</TableCell>
											<TableCell>
												<span className="font-semibold text-blue-600">
													{schedule.childrenPrice.toLocaleString()} VNĐ
												</span>
											</TableCell>
											<TableCell>
												<span className="font-semibold text-purple-600">
													{(schedule.adultPrice * schedule.maxParticipant).toLocaleString()} VNĐ
												</span>
											</TableCell>
											<TableCell className="text-center">
												<Button
													variant="ghost"
													size="sm"
													onClick={() => handleRemoveSchedule(index)}
													className="text-red-500 hover:text-red-700"
													disabled={isLoading}
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			{errors.general && (
				<div className="text-center">
					<p className="text-sm text-red-500">{errors.general}</p>
				</div>
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
					<Button onClick={handleSubmit} className="flex items-center gap-2" disabled={isLoading}>
						{isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
						Tiếp theo
						<ArrowRight className="w-4 h-4" />
					</Button>
				</div>
			</div>
		</div>
	)
}
