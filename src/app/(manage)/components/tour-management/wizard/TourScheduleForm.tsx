"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComp } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTour } from "@/services/tour"
import { useTourguideAssign } from "@/services/tourguide"
import type { ScheduleFormData } from "@/types/Tour"
import { TourGuideItem } from "@/types/Tourguide"
import { ArrowLeft, ArrowRight, Banknote, Calendar, Copy, Loader2, Plus, Sparkles, Trash2, User, Users } from "lucide-react"
import { useEffect, useState } from "react"

interface TourScheduleFormProps {
	initialData?: ScheduleFormData[]
	tourId: string
	tourDays: number
	onChange?: (data: ScheduleFormData[]) => void
	onSubmit: (data: ScheduleFormData[]) => void
	onPrevious: () => void
	onCancel: () => void
	isLoading?: boolean
}

export function TourScheduleForm({
	initialData = [],
	tourId,
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
		tourGuideId: "",
	})
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [openDatePicker, setOpenDatePicker] = useState(false)
	const [quickAddOpen, setQuickAddOpen] = useState(false)
	const [validating, setValidating] = useState(false)
	const { getTourguideFilter } = useTourguideAssign()
	const [guides, setGuides] = useState<Array<TourGuideItem>>([])
	const [guidesLoading, setGuidesLoading] = useState(false)
	const { validateSchedule } = useTour()

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
		const fetchTourGuides = async () => {
			try {
				setGuidesLoading(true)
				const res: any = await getTourguideFilter({
					FullName: "",
					StartDate: newSchedule.departureDate,
					EndDate: newSchedule.departureDate,
					MinRating: 0,
					MaxRating: 5,
					Gender: "",
					MinPrice: 0,
					MaxPrice: 0,
				})
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
		fetchTourGuides()
		return () => {
			mounted = false
		}
	}, [getTourguideFilter, newSchedule.departureDate])

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

	const handleAddSchedule = async () => {
		// Step 1: Basic form validation
		if (!validateNewSchedule()) {
			return
		}

		// Step 2: Server-side validation with loading state
		setValidating(true)
		setErrors({}) // Clear previous errors

		try {
			// Prepare data for validation
			const validationData = {
				departureDate: new Date(newSchedule.departureDate).toISOString(),
				maxParticipant: newSchedule.maxParticipant,
				adultPrice: newSchedule.adultPrice,
				childrenPrice: newSchedule.childrenPrice,
				tourGuideId: newSchedule.tourGuideId || "",
			}

			const response = await validateSchedule(validationData, tourId)

			// Step 3: Handle validation result
			if (response?.success || response?.isValid !== false) {
				// Validation passed - add schedule
				setSchedules([...schedules, { ...newSchedule }])
				setNewSchedule({
					departureDate: "",
					maxParticipant: 20,
					totalDays: tourDays,
					adultPrice: 0,
					childrenPrice: 0,
					tourGuideId: "",
				})
				setErrors({})
			} else {
				// Validation failed - show server errors
				console.log("response", response)
				const serverMessage = response?.errors || response?.errorMessage || "Có lỗi xảy ra khi validation lịch trình"

				setErrors({
					validation: serverMessage,
					...(response?.errors || {}) // Include field-specific errors if available
				})
			}
		} catch (error: any) {
			// Handle API errors
			const errorMessage = error?.response?.data?.message ||
				error?.message ||
				"Không thể kiểm tra lịch trình. Vui lòng thử lại."
			setErrors({ validation: errorMessage })
		} finally {
			setValidating(false)
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

	const handleQuickAddWeekly = async (weeks: number) => {
		// First validate and add the current schedule
		if (!validateNewSchedule()) {
			return // Stop if basic validation fails
		}

		if (!newSchedule.departureDate) return

		// Validate current schedule first
		setValidating(true)
		setErrors({})

		try {
			const validationData = {
				departureDate: new Date(newSchedule.departureDate).toISOString(),
				maxParticipant: newSchedule.maxParticipant,
				adultPrice: newSchedule.adultPrice,
				childrenPrice: newSchedule.childrenPrice,
				tourGuideId: newSchedule.tourGuideId || "",
			}

			const response = await validateSchedule(validationData, tourId)
			console.log("object", response);
			if (!response?.success && response?.isValid === false) {
				// Validation failed - show error and stop
				const serverMessage = response?.errors || response?.errorMessage || "Có lỗi xảy ra khi validation lịch trình"
				setErrors({
					validation: serverMessage,
					...(response?.errors || {})
				})
				return
			}

			// Validation passed - proceed with batch creation
			const baseDate = parseYMD(newSchedule.departureDate) as Date
			const batch: ScheduleFormData[] = []

			// Add current schedule first
			batch.push({ ...newSchedule })

			// Then add weekly schedules
			for (let i = 1; i <= weeks; i += 1) {
				const d = new Date(baseDate)
				d.setDate(d.getDate() + i * 7)
				batch.push({ ...newSchedule, departureDate: toYMD(d) })
			}

			setSchedules((prev) => [...prev, ...batch])

			// Reset form
			setNewSchedule({
				departureDate: "",
				maxParticipant: 20,
				totalDays: tourDays,
				adultPrice: 0,
				childrenPrice: 0,
				tourGuideId: "",
			})

			setQuickAddOpen(false)
			setErrors({})

		} catch (error: any) {
			const errorMessage = error?.response?.data?.message ||
				error?.message ||
				"Không thể kiểm tra lịch trình. Vui lòng thử lại."
			setErrors({ validation: errorMessage })
		} finally {
			setValidating(false)
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
				<h2 className="text-2xl font-bold">Lịch Trình</h2>
				<p className="text-gray-600 mt-2">Thêm các ngày khởi hành và giá cho chuyến tham quan {tourDays} ngày</p>
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
									<Button type="button" variant="outline"
										className={`w-full justify-start ${errors.departureDate ? "border-red-500" : ""}`}
										disabled={isLoading}>
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
							<div className="space-y-2">
								<p className="text-xs text-gray-500 font-medium">{formatCurrency(newSchedule.childrenPrice)}</p>

								<p className="text-xs text-gray-600 font-medium">Tính nhanh theo % giá người lớn:</p>
								<div className="flex gap-2 flex-wrap">
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => setNewSchedule({ ...newSchedule, childrenPrice: Math.round(newSchedule.adultPrice * 0.25) })}
										disabled={isLoading || !newSchedule.adultPrice}
										className="text-xs px-2 py-1 h-7"
									>
										25%
									</Button>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => setNewSchedule({ ...newSchedule, childrenPrice: Math.round(newSchedule.adultPrice * 0.3) })}
										disabled={isLoading || !newSchedule.adultPrice}
										className="text-xs px-2 py-1 h-7"
									>
										30%
									</Button>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => setNewSchedule({ ...newSchedule, childrenPrice: Math.round(newSchedule.adultPrice * 0.5) })}
										disabled={isLoading || !newSchedule.adultPrice}
										className="text-xs px-2 py-1 h-7"
									>
										50%
									</Button>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => setNewSchedule({ ...newSchedule, childrenPrice: Math.round(newSchedule.adultPrice * 0.75) })}
										disabled={isLoading || !newSchedule.adultPrice}
										className="text-xs px-2 py-1 h-7"
									>
										75%
									</Button>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => setNewSchedule({ ...newSchedule, childrenPrice: 0 })}
										disabled={isLoading}
										className="text-xs px-2 py-1 h-7 text-gray-500"
									>
										Miễn phí
									</Button>
								</div>
							</div>
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

					{/* Validation Errors Display */}
					{errors.validation && (
						<div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
							<div className="flex items-start gap-2">
								<div className="w-5 h-5 text-red-600 mt-0.5">⚠️</div>
								<div className="flex-1">
									<h4 className="text-sm font-medium text-red-800 mb-1">Lỗi validation lịch trình</h4>
									<p className="text-sm text-red-600">{errors.validation}</p>
								</div>
							</div>
						</div>
					)}

					{/* Individual Field Errors */}
					{Object.keys(errors).length > 0 && !errors.validation && (
						<div className="mt-4 space-y-2">
							{Object.entries(errors).map(([field, message]) => (
								<div key={field} className="flex items-center gap-2 text-sm text-red-600">
									<div className="w-2 h-2 rounded-full bg-red-400" />
									<span>{message}</span>
								</div>
							))}
						</div>
					)}

					<div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mt-4 gap-3">
						<div className="flex items-center gap-2">
							<Popover open={quickAddOpen} onOpenChange={setQuickAddOpen}>
								<PopoverTrigger asChild>
									<Button
										type="button"
										variant="secondary"
										className="gap-2"
										disabled={validating}
									>
										<Sparkles className="w-4 h-4" />
										Thêm nhanh chuỗi ngày
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-80">
									<div className="space-y-3">
										<p className="text-sm text-gray-600">Bắt đầu từ ngày đang chọn, thêm các lịch trình cách nhau 7 ngày.</p>
										<div className="grid grid-cols-3 gap-2">
											<Button
												type="button"
												variant="outline"
												onClick={() => handleQuickAddWeekly(2)}
												disabled={validating}
											>
												{validating ? "..." : "+ 2 tuần"}
											</Button>
											<Button
												type="button"
												variant="outline"
												onClick={() => handleQuickAddWeekly(4)}
												disabled={validating}
											>
												{validating ? "..." : "+ 4 tuần"}
											</Button>
											<Button
												type="button"
												variant="outline"
												onClick={() => handleQuickAddWeekly(8)}
												disabled={validating}
											>
												{validating ? "..." : "+ 8 tuần"}
											</Button>
										</div>
										<p className="text-xs text-gray-500">Các mục thêm sẽ sao chép số người và giá hiện tại.</p>
										{validating && (
											<div className="flex items-center gap-2 text-sm text-blue-600">
												<Loader2 className="w-4 h-4 animate-spin" />
												<span>Đang kiểm tra lịch trình...</span>
											</div>
										)}
									</div>
								</PopoverContent>
							</Popover>
						</div>
						<div className="flex items-center gap-2 ml-auto">
							<Button
								onClick={handleAddSchedule}
								className="flex items-center gap-2"
								disabled={isLoading || validating}
							>
								{validating && <Loader2 className="w-4 h-4 animate-spin" />}
								{!validating && <Plus className="w-4 h-4" />}
								{validating ? "Đang kiểm tra..." : "Thêm Lịch Trình"}
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
