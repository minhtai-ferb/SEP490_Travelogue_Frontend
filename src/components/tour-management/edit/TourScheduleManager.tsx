"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Plus, Edit, Trash2, Calendar, Users, DollarSign, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"
import { useTour } from "@/services/tour"
import type { ScheduleFormData, TourDetail, TourSchedule } from "@/types/Tour"

interface TourScheduleManagerProps {
	tour: TourDetail
	onUpdate: (updatedTour: TourDetail) => void
}

export function TourScheduleManager({ tour, onUpdate }: TourScheduleManagerProps) {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")
	const [editingSchedule, setEditingSchedule] = useState<TourSchedule | null>(null)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [formData, setFormData] = useState<ScheduleFormData>({
		scheduleId: "",
		departureDate: "",
		maxParticipant: 20,
		totalDays: tour.totalDays,
		adultPrice: tour.adultPrice,
		childrenPrice: tour.childrenPrice,
	})

	const { createTourSchedule, updateTourSchedule, deleteTourSchedule, getTourDetail } = useTour()

	const resetForm = () => {
		setFormData({
			departureDate: "",
			maxParticipant: 20,
			totalDays: tour.totalDays,
			adultPrice: tour.adultPrice,
			childrenPrice: tour.childrenPrice,
		})
		setEditingSchedule(null)
		setError("")
		setSuccess("")
	}

	const handleOpenDialog = (schedule?: TourSchedule) => {
		if (schedule) {
			setEditingSchedule(schedule)
			setFormData({
				departureDate: schedule.departureDate.split("T")[0],
				maxParticipant: schedule.maxParticipant,
				totalDays: schedule.totalDays,
				adultPrice: schedule.adultPrice,
				childrenPrice: schedule.childrenPrice,
			})
		} else {
			resetForm()
		}
		setIsDialogOpen(true)
	}

	const handleCloseDialog = () => {
		setIsDialogOpen(false)
		resetForm()
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError("")
		setSuccess("")

		try {
			if (editingSchedule) {
				// Update existing schedule
				await updateTourSchedule(tour.tourId, editingSchedule.scheduleId, formData)
				setSuccess("Cập nhật lịch trình thành công!")
			} else {
				// Create new schedule
				await createTourSchedule(tour.tourId, [formData])
				setSuccess("Thêm lịch trình mới thành công!")
			}

			// Refresh tour data
			const updatedTour = await getTourDetail(tour.tourId)
			onUpdate(updatedTour)
			handleCloseDialog()
		} catch (error: any) {
			console.error("Error saving schedule:", error)
			setError(error?.response?.data?.message || "Có lỗi khi lưu lịch trình")
		} finally {
			setIsLoading(false)
		}
	}

	const handleDelete = async (scheduleId: string) => {
		if (!confirm("Bạn có chắc chắn muốn xóa lịch trình này?")) return

		setIsLoading(true)
		setError("")
		setSuccess("")

		try {
			await deleteTourSchedule(scheduleId, tour.tourId)
			setSuccess("Xóa lịch trình thành công!")

			// Refresh tour data
			const updatedTour = await getTourDetail(tour.tourId)
			onUpdate(updatedTour)
		} catch (error: any) {
			console.error("Error deleting schedule:", error)
			setError(error.message || "Có lỗi khi xóa lịch trình")
		} finally {
			setIsLoading(false)
		}
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("vi-VN", {
			year: "numeric",
			month: "long",
			day: "numeric",
			weekday: "long",
		})
	}

	const getAvailabilityStatus = (schedule: TourSchedule) => {
		const available = schedule.maxParticipant - schedule.currentBooked
		const percentage = (schedule.currentBooked / schedule.maxParticipant) * 100

		if (percentage >= 100) {
			return { status: "Hết chỗ", color: "bg-red-100 text-red-800" }
		} else if (percentage >= 80) {
			return { status: "Sắp hết", color: "bg-yellow-100 text-yellow-800" }
		} else {
			return { status: "Còn chỗ", color: "bg-green-100 text-green-800" }
		}
	}

	return (
		<div className="space-y-6">
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

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Quản Lý Lịch Trình ({tour.schedules.length})</CardTitle>
						<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
							<DialogTrigger asChild>
								<Button onClick={() => handleOpenDialog()}>
									<Plus className="w-4 h-4 mr-2" />
									Thêm Lịch Trình
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-md">
								<DialogHeader>
									<DialogTitle>{editingSchedule ? "Chỉnh Sửa Lịch Trình" : "Thêm Lịch Trình Mới"}</DialogTitle>
								</DialogHeader>
								<form onSubmit={handleSubmit} className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="departureDate">Ngày Khởi Hành *</Label>
										<Input
											id="departureDate"
											type="date"
											value={formData.departureDate}
											onChange={(e) => setFormData((prev) => ({ ...prev, departureDate: e.target.value }))}
											required
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="maxParticipant">Số Người Tối Đa *</Label>
										<Input
											id="maxParticipant"
											type="number"
											min="1"
											value={formData.maxParticipant}
											onChange={(e) =>
												setFormData((prev) => ({ ...prev, maxParticipant: Number.parseInt(e.target.value) || 0 }))
											}
											required
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="adultPrice">Giá Người Lớn (VNĐ) *</Label>
										<Input
											id="adultPrice"
											type="number"
											min="0"
											value={formData.adultPrice}
											onChange={(e) =>
												setFormData((prev) => ({ ...prev, adultPrice: Number.parseFloat(e.target.value) || 0 }))
											}
											required
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="childrenPrice">Giá Trẻ Em (VNĐ) *</Label>
										<Input
											id="childrenPrice"
											type="number"
											min="0"
											value={formData.childrenPrice}
											onChange={(e) =>
												setFormData((prev) => ({ ...prev, childrenPrice: Number.parseFloat(e.target.value) || 0 }))
											}
											required
										/>
									</div>

									<div className="flex gap-2 pt-4">
										<Button
											type="button"
											variant="outline"
											onClick={handleCloseDialog}
											className="flex-1 bg-transparent"
										>
											Hủy
										</Button>
										<Button type="submit" disabled={isLoading} className="flex-1">
											{isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
											{editingSchedule ? "Cập Nhật" : "Thêm Mới"}
										</Button>
									</div>
								</form>
								{error && <DialogFooter>
									<Alert className="border-red-200 bg-red-50">
										<AlertTriangle className="h-4 w-4 text-red-600" />
										<AlertDescription className="text-red-800">{error}</AlertDescription>
									</Alert>
								</DialogFooter>}
							</DialogContent>
						</Dialog>
					</div>
				</CardHeader>
				<CardContent>
					{tour.schedules.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							<Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
							<p>Chưa có lịch trình nào</p>
							<p className="text-sm">Thêm lịch trình đầu tiên cho tour này</p>
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
										<TableHead>Trạng Thái</TableHead>
										<TableHead className="text-center">Hành Động</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{tour.schedules.map((schedule) => {
										const availability = getAvailabilityStatus(schedule)
										return (
											<TableRow key={schedule.scheduleId}>
												<TableCell>
													<div>
														<p className="font-medium">
															{new Date(schedule.departureDate).toLocaleDateString("vi-VN")}
														</p>
														<p className="text-sm text-gray-500">{formatDate(schedule.departureDate)}</p>
													</div>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														<Users className="w-4 h-4 text-gray-400" />
														<span>
															{schedule.currentBooked}/{schedule.maxParticipant}
														</span>
													</div>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-1">
														<DollarSign className="w-4 h-4 text-green-600" />
														<span className="font-semibold text-green-600">
															{schedule.adultPrice.toLocaleString()} VNĐ
														</span>
													</div>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-1">
														<DollarSign className="w-4 h-4 text-blue-600" />
														<span className="font-semibold text-blue-600">
															{schedule.childrenPrice.toLocaleString()} VNĐ
														</span>
													</div>
												</TableCell>
												<TableCell>
													<Badge className={availability.color}>{availability.status}</Badge>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														<Button
															variant="ghost"
															size="sm"
															onClick={() => handleOpenDialog(schedule)}
															disabled={isLoading}
														>
															<Edit className="w-4 h-4" />
														</Button>
														<Button
															variant="ghost"
															size="sm"
															onClick={() => handleDelete(schedule.scheduleId)}
															disabled={isLoading}
															className="text-red-500 hover:text-red-700"
														>
															<Trash2 className="w-4 h-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										)
									})}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
