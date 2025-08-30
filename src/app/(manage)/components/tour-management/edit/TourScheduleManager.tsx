'use client';

import { useCallback, useEffect, useMemo, useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Plus, Edit, Trash2, Calendar, Users, DollarSign, AlertCircle, CheckCircle, AlertTriangle, Clock } from "lucide-react"
import { useTour } from "@/services/tour"
import type { ScheduleFormData, TourDetail, TourSchedule } from "@/types/Tour"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTourguideAssign } from "@/services/tourguide"
import type { TourGuideItem } from "@/types/Tourguide"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatPriceSimple } from "@/utils/format"
interface TourScheduleManagerProps {
	tour: TourDetail
	onUpdate: (updatedTour: TourDetail) => void
}

const DeleteConfirmDialog = ({ open, onOpenChange, onConfirm, loading, title, description }: { open: boolean, onOpenChange: (open: boolean) => void, onConfirm: () => void, loading: boolean, title: string, description: string }) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
					<Button variant="destructive" onClick={onConfirm} disabled={loading}>
						{loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
						Xóa
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export function TourScheduleManager({ tour, onUpdate }: TourScheduleManagerProps) {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")
	const [editingSchedule, setEditingSchedule] = useState<TourSchedule | null>(null)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const today = new Date().toISOString().split("T")[0]
	const [formData, setFormData] = useState<ScheduleFormData>({
		departureDate: "",
		maxParticipant: 20,
		totalDays: tour.totalDays,
		adultPrice: tour.adultPrice,
		childrenPrice: tour.childrenPrice,
		tourGuideId: (Array.isArray((tour as any)?.tourGuide) && (tour as any)?.tourGuide?.[0]?.id) || undefined,
	})
	const [tourGuide, setTourGuide] = useState<TourGuideItem[]>([])
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const { createTourSchedule, updateTourSchedule, deleteTourSchedule, getTourDetail } = useTour()
	const { getTourGuide } = useTourguideAssign()
	const fetchTourGuide = useCallback(async () => {
		try {
			const response = await getTourGuide()
			setTourGuide(response)
		} catch (error) {
			console.error("Error fetching tour guide:", error)
		}
	}, [getTourGuide])

	useEffect(() => {
		fetchTourGuide()
	}, [])

	const resetForm = () => {
		setFormData({
			departureDate: "",
			maxParticipant: 20,
			totalDays: tour.totalDays,
			adultPrice: tour.adultPrice,
			childrenPrice: tour.childrenPrice,
			tourGuideId: undefined,
		})
		setEditingSchedule(null)
		setError("")
		setSuccess("")
	}

	const handleOpenDialog = (schedule?: TourSchedule) => {
		if (schedule) {
			setEditingSchedule(schedule)
			setFormData({
				departureDate: (schedule.startTime || (schedule as any).departureDate || "").split("T")[0],
				maxParticipant: schedule.maxParticipant,
				totalDays: schedule.totalDays,
				adultPrice: schedule.adultPrice,
				childrenPrice: schedule.childrenPrice,
				tourGuideId: (schedule as any)?.tourGuide?.id || undefined,
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
			setIsDeleteDialogOpen(false)
		}
	}

	const formatDate = (dateString: string) => {
		if (!dateString) return ""
		const d = new Date(dateString)
		if (isNaN(d.getTime())) return ""
		return d.toLocaleDateString("vi-VN", {
			year: "numeric",
			month: "long",
			day: "numeric",
			weekday: "long",
		})
	}

	const formatShortDate = (dateString: string) => {
		if (!dateString) return ""
		const d = new Date(dateString)
		if (isNaN(d.getTime())) return ""
		return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
	}

	const getScheduleDate = (s: TourSchedule) => s.startTime || (s as any).departureDate || ""
	const scheduleRows = useMemo(() => tour.schedules.map((s) => ({ s, dateStr: getScheduleDate(s) })), [tour.schedules])

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
				<Alert className="border-red-200 bg-red-50 align-middle">
					<AlertCircle className="h-5 w-5" color="red" />
					<AlertDescription className="text-red-800 text-lg mt-1">{error}</AlertDescription>
				</Alert>
			)}

			{success && (
				<Alert className="border-green-200 bg-green-50">
					<CheckCircle className="h-4 w-4" color="green" />
					<AlertDescription className="text-green-800 text-xl">{success}</AlertDescription>
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
											value={formData?.departureDate || ""}
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

									<div className="space-y-6">
										<Label htmlFor="tourGuideId">Hướng Dẫn Viên</Label>
										<Select
											required
											disabled={!tourGuide?.length}
											value={formData.tourGuideId || ""}
											onValueChange={(value) =>
												setFormData((prev) => ({
													...prev,
													tourGuideId: value || undefined,
												}))
											}
										>
											<SelectTrigger className="w-full h-12">
												<SelectValue
													placeholder="Chọn hướng dẫn viên"
													defaultValue={formData.tourGuide?.[0]?.id}
												/>
											</SelectTrigger>

											<SelectContent className="max-h-[400px] overflow-y-auto">
												{/* No guide available */}
												{!tourGuide?.length && (
													<SelectItem value="none">Không có hướng dẫn viên</SelectItem>
												)}

												{/* Available guides list */}
												{tourGuide?.map((guide) => (
													<SelectItem value={guide.id} key={guide.id} className="flex items-center gap-2">
														<div className="flex items-center gap-2">
															<Avatar className="w-10 h-10 rounded-full">
																<AvatarImage src={guide.avatarUrl} />
																<AvatarFallback>{guide.userName.charAt(0)}</AvatarFallback>
															</Avatar>
															<div>
																<p className="font-medium">{guide.userName}</p>
																<p className="text-sm text-gray-500">{guide.introduction}</p>
																<p className="text-sm text-gray-500">{formatPriceSimple(guide.price)}</p>
															</div>
														</div>
													</SelectItem>
												))}

												{/* Currently selected guide (if not already in list) */}
												{formData.tourGuide?.[0] &&
													!tourGuide?.some((g) => g.id === formData.tourGuide?.[0]?.id) && (
														<SelectItem
															value={formData.tourGuide[0].id}
															key={formData.tourGuide[0].id}
															className="flex items-center gap-2"
														>
															<Avatar className="w-10 h-10 rounded-full">
																<AvatarImage src={formData.tourGuide[0].avatarUrl} />
																<AvatarFallback>
																	{formData.tourGuide[0].userName.charAt(0)}
																</AvatarFallback>
															</Avatar>
															<div>
																<p className="font-medium">{formData.tourGuide[0].userName}</p>
																<p className="text-sm text-gray-500">
																	{formData.tourGuide[0].introduction}
																</p>
																<p className="text-sm text-gray-500">
																	{formatPriceSimple(formData.tourGuide[0].price)}
																</p>
															</div>
														</SelectItem>
													)}
											</SelectContent>
										</Select>

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
										<TableHead>Ngày khởi hành</TableHead>
										<TableHead>Số Người</TableHead>
										<TableHead>Giá người lớn</TableHead>
										<TableHead>Giá trẻ em</TableHead>
										<TableHead>Thời gian diễn ra</TableHead>
										<TableHead>Trạng Thái</TableHead>
										<TableHead className="text-center">Hành Động</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{tour.schedules.map((schedule) => {
										const availability = getAvailabilityStatus(schedule)
										const dateStr = getScheduleDate(schedule)
										return (
											<TableRow key={schedule.scheduleId}>
												<TableCell>
													<div>
														<p className="font-medium">{formatShortDate(dateStr)}</p>
														<p className="text-sm text-gray-500">{formatDate(dateStr)}</p>
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
														<span className="font-semibold text-green-600">{formatPriceSimple(schedule.adultPrice)}</span>
													</div>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-1">
														<span className="font-semibold text-blue-600">{formatPriceSimple(schedule.childrenPrice)}</span>
													</div>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2 text-sm text-gray-600">
														<Clock className="w-4 h-4" />
														<span>
															{formatShortDate(schedule.startTime)}
														</span>
													</div>
												</TableCell>
												<TableCell>
													<Badge className={availability.color}>{availability.status}</Badge>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														{
															// Chỉ cho phép chỉnh sửa nếu lịch trình vẫn diễn ra
															schedule.endTime > today && (
																<Button
																	variant="ghost"
																	size="sm"
																	onClick={() => handleOpenDialog(schedule)}
																	disabled={isLoading}
																>
																	<Edit className="w-4 h-4" />
																</Button>
															)
														}
														<Button
															variant="ghost"
															size="sm"
															onClick={() => { setEditingSchedule(schedule); setIsDeleteDialogOpen(true) }}
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
			<DeleteConfirmDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
				onConfirm={() => handleDelete(editingSchedule?.scheduleId || "")}
				loading={isLoading}
				title="Xóa lịch trình"
				description="Bạn có chắc chắn muốn xóa lịch trình này?"
			/>
		</div>
	)
}
