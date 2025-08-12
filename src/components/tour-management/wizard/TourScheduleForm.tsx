"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComp } from "@/components/ui/calendar"
import { ArrowRight, ArrowLeft, Plus, Trash2, Calendar, Users, Loader2, Banknote, Copy, Sparkles, UserCircle2, User } from "lucide-react"
import type { ScheduleFormData } from "@/types/Tour"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTourguideAssign } from "@/services/tourguide"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TourGuideItem } from "@/types/Tourguide"

interface TourScheduleFormProps {
	initialData?: ScheduleFormData[]
	tourDays: number
	onChange?: (data: ScheduleFormData[]) => void
	onSubmit: (data: ScheduleFormData[]) => void
	onPrevious: () => void
	onCancel: () => void
	isLoading?: boolean
}

export function TourScheduleForm({
	initialData = [],
	tourDays,
	onChange,
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
	const [openDatePicker, setOpenDatePicker] = useState(false)
	const [quickAddOpen, setQuickAddOpen] = useState(false)
	const { getTourGuide } = useTourguideAssign()
	const [guides, setGuides] = useState<Array<TourGuideItem>>([])
	const [guidesLoading, setGuidesLoading] = useState(false)

	useEffect(() => {
		if (initialData.length > 0) {
			setSchedules(initialData)
		}
	}, [initialData])

	useEffect(() => {
		onChange?.(schedules)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [schedules])

	useEffect(() => {
		setNewSchedule((prev) => ({ ...prev, totalDays: tourDays }))
	}, [tourDays])

	// Fetch available tour guides once
	useEffect(() => {
		let mounted = true
		const fetchGuides = async () => {
			try {
				setGuidesLoading(true)
				const res: any = await getTourGuide()
				const list: any[] = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : []
				const normalized = list.map((g: any) => ({
					id: g.id || g.userId || g.tourGuideId,
					userName: g.userName || g.userName || g.email || "Chưa rõ",
					avatarUrl: g.avatarUrl || "",
					email: g.email || "",
					sex: g.sex || 0,
					sexText: g.sexText || "",
					address: g.address || "",
					price: g.price || 0,
					introduction: g.introduction || "",
					averageRating: g.averageRating || 0,
					totalReviews: g.totalReviews || 0,
				}))
				if (mounted) setGuides(normalized.filter((g) => !!g.id) as TourGuideItem[])
			} catch {
				if (mounted) setGuides([])
			} finally {
				if (mounted) setGuidesLoading(false)
			}
		}
		fetchGuides()
		return () => {
			mounted = false
		}
	}, [getTourGuide])

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

		// Optional: validate tourGuideId existence when selected
		if (newSchedule.tourGuideId && !guides.find((g) => g.id === newSchedule.tourGuideId)) {
			newErrors.tourGuideId = "Hướng dẫn viên không hợp lệ"
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

	const formatCurrency = (value: number) =>
		new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value || 0)

	const parseYMD = (v: string) => {
		if (!v) return undefined
		const parts = v.split("-")
		if (parts.length !== 3) return undefined
		const year = Number(parts[0])
		const month = Number(parts[1])
		const day = Number(parts[2])
		if (!year || !month || !day) return undefined
		return new Date(year, month - 1, day)
	}
	const toYMD = (d: Date) => {
		const yyyy = d.getFullYear()
		const mm = String(d.getMonth() + 1).padStart(2, "0")
		const dd = String(d.getDate()).padStart(2, "0")
		return `${yyyy}-${mm}-${dd}`
	}

	const handleDuplicate = (index: number) => {
		const base = schedules[index]
		if (!base) return
		setNewSchedule({ ...base })
	}

	const handleQuickAddWeekly = (weeks: number) => {
		if (!newSchedule.departureDate) return
		const baseDate = parseYMD(newSchedule.departureDate) as Date
		const batch: ScheduleFormData[] = []
		for (let i = 0; i < weeks; i += 1) {
			const d = new Date(baseDate)
			d.setDate(d.getDate() + i * 7)
			batch.push({ ...newSchedule, departureDate: toYMD(d) })
		}
		setSchedules((prev) => [...prev, ...batch])
		setQuickAddOpen(false)
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
					<CardTitle className="flex items-center gap-2 text-lg">
						<Plus className="w-5 h-5" />
						Thêm Lịch Trình Mới
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="departureDate" className="flex items-center gap-2">
								<Calendar className="w-4 h-4" />
								Ngày Khởi Hành <span className="text-red-500">*</span>
							</Label>
							<Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
								<PopoverTrigger asChild>
									<Button type="button" variant="outline" className={`w-full justify-start ${errors.departureDate ? "border-red-500" : ""}`} disabled={isLoading}>
										{newSchedule.departureDate ? new Date(newSchedule.departureDate).toLocaleDateString("vi-VN") : "Chọn ngày"}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="p-0" align="start" sideOffset={8} side="bottom">
									<CalendarComp
										className="rounded-md border bg-background p-2 w-auto"
										mode="single"
										selected={parseYMD(newSchedule?.departureDate || "")}
										onSelect={(d) => {
											if (!d) return
											setNewSchedule((prev) => ({ ...prev, departureDate: toYMD(d) }))
											setOpenDatePicker(false)
										}}
										disabled={(date) => date < new Date(new Date().toDateString())}
										initialFocus
										captionLayout="dropdown"
									/>
								</PopoverContent>
							</Popover>
							{errors.departureDate && <p className="text-sm text-red-500">{errors.departureDate}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="maxParticipant" className="flex items-center gap-2">
								<Users className="w-4 h-4" />
								Số Người Tối Đa <span className="text-red-500">*</span>
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
								<Banknote className="w-4 h-4" />
								Giá Người Lớn (VNĐ) <span className="text-red-500">*</span>
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
							<p className="text-xs text-gray-500">{formatCurrency(newSchedule.adultPrice)}</p>
							{errors.adultPrice && <p className="text-sm text-red-500">{errors.adultPrice}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="childrenPrice" className="flex items-center gap-2">
								<Banknote className="w-4 h-4" />
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
							<p className="text-xs text-gray-500">{formatCurrency(newSchedule.childrenPrice)}</p>
							{errors.childrenPrice && <p className="text-sm text-red-500">{errors.childrenPrice}</p>}
						</div>

						<div className="space-y-2">
							<div className="space-y-1 md:w-1/2">
								<Label htmlFor="tourGuideId" className="flex items-center gap-2">
									<User className="w-4 h-4" />
									Hướng Dẫn Viên
								</Label>
								<Select
									value={newSchedule.tourGuideId}
									onValueChange={(val) => setNewSchedule({ ...newSchedule, tourGuideId: val === "none" ? undefined : val })}
									disabled={isLoading || guidesLoading}
								>
									<SelectTrigger id="tourGuideId" className={errors.tourGuideId ? "border-red-500" : ""} disabled={isLoading || guidesLoading}>
										<SelectValue placeholder={guidesLoading ? "Đang tải..." : "Chọn hướng dẫn viên"} />
									</SelectTrigger>
									<SelectContent className="overflow-y-auto w-full max-h-[300px]">
										<SelectItem value="none" className="cursor-pointer hover:bg-gray-100 p-2 rounded-md">Không chỉ định</SelectItem>
										{guides.map((g) => (
											<SelectItem key={g.id} value={g.id} className="cursor-pointer hover:bg-gray-100 p-2 rounded-md">
												<div className="flex items-center gap-2">
													<Avatar className="w-6 h-6">
														<AvatarImage src={g.avatarUrl} />
														<AvatarFallback>
															{g.userName.charAt(0).toUpperCase()}
														</AvatarFallback>
													</Avatar>
													<div className="flex flex-col">
														<span className="text-sm font-medium">{g.userName}</span>
														<span className="text-xs text-gray-500">{g.email}</span>
													</div>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{errors.tourGuideId && <p className="text-sm text-red-500">{errors.tourGuideId}</p>}
							</div>
							<div className="space-y-1"></div>
						</div>
					</div>

					<div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mt-4 gap-3">
						<div className="flex items-center gap-2">
							<Popover open={quickAddOpen} onOpenChange={setQuickAddOpen}>
								<PopoverTrigger asChild>
									<Button type="button" variant="secondary" className="gap-2">
										<Sparkles className="w-4 h-4" />
										Thêm nhanh chuỗi ngày
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-80">
									<div className="space-y-3">
										<p className="text-sm text-gray-600">Bắt đầu từ ngày đang chọn, thêm các lịch trình cách nhau 7 ngày.</p>
										<div className="grid grid-cols-3 gap-2">
											<Button type="button" variant="outline" onClick={() => handleQuickAddWeekly(2)}>+ 2 tuần</Button>
											<Button type="button" variant="outline" onClick={() => handleQuickAddWeekly(4)}>+ 4 tuần</Button>
											<Button type="button" variant="outline" onClick={() => handleQuickAddWeekly(8)}>+ 8 tuần</Button>
										</div>
										<p className="text-xs text-gray-500">Các mục thêm sẽ sao chép số người và giá hiện tại.</p>
									</div>
								</PopoverContent>
							</Popover>
						</div>
						<div className="flex items-center gap-2 ml-auto">
							<Button onClick={handleAddSchedule} className="flex items-center gap-2" disabled={isLoading}>
								<Plus className="w-4 h-4" />
								Thêm Lịch Trình
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Schedules List */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<span>Danh Sách Lịch Trình ({schedules.length})</span>
					</CardTitle>
					{schedules.length > 0 && (
						<div className="flex flex-wrap gap-2">
							<Badge variant="secondary" className="bg-green-100 text-green-800">
								{schedules.length} lịch trình
							</Badge>
							<Badge variant="secondary" className="bg-blue-100 text-blue-800">
								Tổng doanh thu: {formatCurrency(getTotalRevenue())}
							</Badge>
							<Badge variant="secondary" className="bg-amber-100 text-amber-800">
								Tổng sức chứa: {schedules.reduce((s, it) => s + (it.maxParticipant || 0), 0)} người
							</Badge>
						</div>
					)}
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
										<TableHead>Hướng Dẫn Viên</TableHead>
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
											<TableCell>
												<span className="text-sm">
													{guides.find((g) => g.id === schedule.tourGuideId)?.userName || "—"}
												</span>
											</TableCell>
											<TableCell className="text-center">
												<div className="flex items-center justify-center gap-1">
													<Button
														variant="ghost"
														size="sm"
														onClick={() => handleDuplicate(index)}
														title="Đưa dữ liệu này lên form"
														disabled={isLoading}
													>
														<Copy className="w-4 h-4" />
													</Button>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => handleRemoveSchedule(index)}
														className="text-red-500 hover:text-red-700"
														disabled={isLoading}
													>
														<Trash2 className="w-4 h-4" />
													</Button>
												</div>
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
