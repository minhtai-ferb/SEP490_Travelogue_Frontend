"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
	RecurringRule,
	RecurringSession,
	Workshop,
	WorkshopActivity
} from "@/types/CraftVillageRequest"
import {
	Activity,
	Calendar,
	Plus,
	Ticket,
	Trash2,
	X
} from "lucide-react"
import { useCallback, useMemo, useState } from "react"

interface ModernWorkshopModalProps {
	isOpen: boolean
	onClose: () => void
	onSave: (workshop: Workshop) => void
	editingWorkshop?: Workshop | null
	formData: any
}

const TICKET_TYPES = {
	VISIT: 1,
	EXPERIENCE: 2,
} as const

const DAYS_OF_WEEK = {
	MONDAY: 1,
	TUESDAY: 2,
	WEDNESDAY: 3,
	THURSDAY: 4,
	FRIDAY: 5,
	SATURDAY: 6,
	SUNDAY: 0,
} as const

const timeToHours = (timeString: string): number => {
	if (!timeString) return 0
	const [hours, minutes] = timeString.split(":").map(Number)
	return hours + minutes / 60
}

const hoursToTime = (hours: number): string => {
	const h = Math.floor(hours)
	const m = Math.round((hours - h) * 60)
	return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:00`
}

export default function ModernWorkshopModal({
	isOpen,
	onClose,
	onSave,
	editingWorkshop,
	formData
}: ModernWorkshopModalProps) {
	const [currentStep, setCurrentStep] = useState(1)
	const [errors, setErrors] = useState<Record<string, string>>({})

	// Initialize workshop state
	const [workshop, setWorkshop] = useState<Workshop>(() => {
		if (editingWorkshop) {
			return { ...editingWorkshop }
		}
		return {
			name: "",
			description: "",
			content: "",
			status: 1,
			ticketTypes: [
				{
					type: TICKET_TYPES.VISIT,
					name: "Vé tham quan",
					price: 0,
					isCombo: false,
					durationMinutes: 0,
					content: "Tham quan và khám phá không gian làng nghề",
					workshopActivities: [],
				},
				{
					type: TICKET_TYPES.EXPERIENCE,
					name: "Vé trải nghiệm",
					price: 0,
					isCombo: true,
					durationMinutes: 0,
					content: "Tham quan và trải nghiệm thực hành",
					workshopActivities: [],
				},
			],
			schedules: [],
			recurringRules: [],
			exceptions: [],
		}
	})

	const updateWorkshop = useCallback((updates: Partial<Workshop>) => {
		setWorkshop(prev => ({ ...prev, ...updates }))
	}, [])

	// Helper function để kiểm tra có vé trải nghiệm không
	const hasExperienceTicket = useCallback(() => {
		return workshop.ticketTypes.some(ticket => ticket.type === TICKET_TYPES.EXPERIENCE && ticket.price > 0)
	}, [workshop.ticketTypes])

	const visitTicket = useMemo(() =>
		workshop.ticketTypes.find(t => t.type === TICKET_TYPES.VISIT),
		[workshop.ticketTypes]
	)

	const experienceTicket = useMemo(() =>
		workshop.ticketTypes.find(t => t.type === TICKET_TYPES.EXPERIENCE),
		[workshop.ticketTypes]
	)

	const validateStep = useCallback((step: number) => {
		const newErrors: Record<string, string> = {}

		if (step === 1) {
			if (!workshop.name.trim()) newErrors.name = "Tên trải nghiệm là bắt buộc"
			if (!workshop.description.trim()) newErrors.description = "Mô tả là bắt buộc"

			// Validate visit ticket
			if (visitTicket && visitTicket.price <= 0) {
				newErrors.visitPrice = "Giá vé tham quan phải lớn hơn 0"
			}
			if (visitTicket && visitTicket.durationMinutes <= 0) {
				newErrors.visitDuration = "Thời gian vé tham quan phải lớn hơn 0"
			}

			// Chỉ validate vé trải nghiệm nếu user đã nhập giá
			if (experienceTicket && experienceTicket.price > 0) {
				if (experienceTicket.durationMinutes <= 0) {
					newErrors.experienceDuration = "Thời gian vé trải nghiệm phải lớn hơn 0"
				}
				if (visitTicket && experienceTicket.price <= visitTicket.price) {
					newErrors.experiencePrice = "Giá vé trải nghiệm phải cao hơn vé tham quan"
				}
			}
		}

		if (step === 2 && hasExperienceTicket()) {
			// Validate activities duration vs ticket duration
			if (experienceTicket) {
				const totalActivityMinutes = experienceTicket.workshopActivities.reduce((total, activity) => {
					const startHours = timeToHours(activity.startHour)
					const endHours = timeToHours(activity.endHour)
					return total + Math.round((endHours - startHours) * 60)
				}, 0)

				if (Math.abs(totalActivityMinutes - experienceTicket.durationMinutes) > 5) {
					newErrors.activityDuration = `Tổng thời gian hoạt động (${totalActivityMinutes} phút) phải khớp với thời gian vé (${experienceTicket.durationMinutes} phút)`
				}
			}
		}

		if (step === 3) {
			if (workshop.recurringRules.length === 0) {
				newErrors.schedule = "Cần có ít nhất một lịch trình"
			}
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}, [workshop, visitTicket, experienceTicket, hasExperienceTicket])

	const handleNext = useCallback(() => {
		if (validateStep(currentStep)) {
			// Nếu đang ở step 1 và không có vé trải nghiệm, bỏ qua step 2 (activities)
			if (currentStep === 1 && !hasExperienceTicket()) {
				setCurrentStep(3) // Nhảy thẳng đến step 3 (lịch trình)
			} else {
				setCurrentStep((prev) => Math.min(prev + 1, 3))
			}
		}
	}, [currentStep, validateStep, hasExperienceTicket])

	const handleBack = useCallback(() => {
		// Logic quay lại: nếu đang ở step 3 và không có vé trải nghiệm, quay về step 1
		if (currentStep === 3 && !hasExperienceTicket()) {
			setCurrentStep(1)
		} else {
			setCurrentStep((prev) => prev - 1)
		}
	}, [currentStep, hasExperienceTicket])

	const handleSave = useCallback(() => {
		if (validateStep(currentStep)) {
			onSave(workshop)
			onClose()
		}
	}, [currentStep, validateStep, workshop, onSave, onClose])

	const addActivity = useCallback(() => {
		if (!experienceTicket) return

		const newActivity: WorkshopActivity = {
			activity: "",
			description: "",
			startHour: "09:00:00",
			endHour: "10:00:00",
			activityOrder: experienceTicket.workshopActivities.length + 1,
		}

		updateWorkshop({
			ticketTypes: workshop.ticketTypes.map((t) =>
				t.type === TICKET_TYPES.EXPERIENCE
					? { ...t, workshopActivities: [...t.workshopActivities, newActivity] }
					: t,
			),
		})
	}, [experienceTicket, workshop.ticketTypes, updateWorkshop])

	const removeActivity = useCallback((index: number) => {
		updateWorkshop({
			ticketTypes: workshop.ticketTypes.map((t) =>
				t.type === TICKET_TYPES.EXPERIENCE
					? { ...t, workshopActivities: t.workshopActivities.filter((_, i) => i !== index) }
					: t,
			),
		})
	}, [workshop.ticketTypes, updateWorkshop])

	const updateActivity = useCallback((index: number, updates: Partial<WorkshopActivity>) => {
		updateWorkshop({
			ticketTypes: workshop.ticketTypes.map((t) =>
				t.type === TICKET_TYPES.EXPERIENCE
					? {
						...t,
						workshopActivities: t.workshopActivities.map((activity, i) =>
							i === index ? { ...activity, ...updates } : activity,
						),
					}
					: t,
			),
		})
	}, [workshop.ticketTypes, updateWorkshop])

	const addRecurringRule = useCallback(() => {
		const newRule: RecurringRule = {
			daysOfWeek: [1], // Thứ 2
			startDate: new Date().toISOString().split("T")[0],
			endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
			sessions: [
				{
					startTime: "08:00:00",
					endTime: "10:00:00",
					capacity: 20,
				},
			],
		}

		updateWorkshop({
			recurringRules: [...workshop.recurringRules, newRule],
		})
	}, [workshop.recurringRules, updateWorkshop])

	const removeRecurringRule = useCallback((index: number) => {
		updateWorkshop({
			recurringRules: workshop.recurringRules.filter((_, i) => i !== index),
		})
	}, [workshop.recurringRules, updateWorkshop])

	const updateRecurringRule = useCallback((index: number, updates: Partial<RecurringRule>) => {
		updateWorkshop({
			recurringRules: workshop.recurringRules.map((rule, i) =>
				i === index ? { ...rule, ...updates } : rule,
			),
		})
	}, [workshop.recurringRules, updateWorkshop])

	const addSession = useCallback((ruleIndex: number) => {
		const newSession = {
			startTime: "14:00:00", // Default afternoon session
			endTime: "16:00:00",
			capacity: 20,
		}

		updateWorkshop({
			recurringRules: workshop.recurringRules.map((rule, i) =>
				i === ruleIndex ? { ...rule, sessions: [...rule.sessions, newSession] } : rule,
			),
		})
	}, [workshop.recurringRules, updateWorkshop])

	const removeSession = useCallback((ruleIndex: number, sessionIndex: number) => {
		updateWorkshop({
			recurringRules: workshop.recurringRules.map((rule, i) =>
				i === ruleIndex ? { ...rule, sessions: rule.sessions.filter((_, si) => si !== sessionIndex) } : rule,
			),
		})
	}, [workshop.recurringRules, updateWorkshop])

	const updateSession = useCallback((ruleIndex: number, sessionIndex: number, updates: Partial<RecurringSession>) => {
		updateWorkshop({
			recurringRules: workshop.recurringRules.map((rule, i) =>
				i === ruleIndex ? {
					...rule,
					sessions: rule.sessions.map((session, si) =>
						si === sessionIndex ? { ...session, ...updates } : session
					)
				} : rule,
			),
		})
	}, [workshop.recurringRules, updateWorkshop])

	// Get steps that should be shown (filter out step 2 if no experience ticket)
	const availableSteps = useMemo(() => {
		const steps = [1, 3] // Always show step 1 and 3
		if (hasExperienceTicket()) {
			steps.splice(1, 0, 2) // Insert step 2 if experience ticket exists
		}
		return steps
	}, [hasExperienceTicket])

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-500 to-pink-500 text-white">
					<h2 className="text-xl font-bold">
						{editingWorkshop ? "Chỉnh sửa trải nghiệm" : "Tạo trải nghiệm mới"}
					</h2>
					<Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
						<X className="h-5 w-5" />
					</Button>
				</div>

				{/* Step Indicator */}
				<div className="flex justify-center p-4 bg-gray-50">
					<div className="flex items-center space-x-4">
						{availableSteps.map((step, index) => (
							<div key={step} className="flex items-center">
								<div
									className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === currentStep
										? "bg-purple-500 text-white"
										: step < currentStep
											? "bg-green-500 text-white"
											: "bg-gray-200 text-gray-600"
										}`}
								>
									{step}
								</div>
								{index < availableSteps.length - 1 && (
									<div className="w-12 h-0.5 bg-gray-300 mx-2" />
								)}
							</div>
						))}
					</div>
				</div>

				{/* Content */}
				<div className="p-6 max-h-[60vh] overflow-y-auto">
					{/* Step 1: Thông tin cơ bản */}
					{currentStep === 1 && (
						<div className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label className="text-sm font-medium text-gray-700">Tên trải nghiệm *</Label>
									<Input
										value={workshop.name}
										onChange={(e) => updateWorkshop({ name: e.target.value })}
										onKeyDown={(e) => e.stopPropagation()}
										className={`h-10 text-base border-2 ${errors.name ? "border-red-300" : "border-gray-200 focus:border-purple-400"}`}
										placeholder="VD: Trải nghiệm làm gốm truyền thống"
									/>
									{errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
								</div>

								<div className="space-y-2">
									<Label className="text-sm font-medium text-gray-700">Mô tả ngắn *</Label>
									<Input
										value={workshop.description}
										onChange={(e) => updateWorkshop({ description: e.target.value })}
										onKeyDown={(e) => e.stopPropagation()}
										className={`h-10 text-base border-2 ${errors.description ? "border-red-300" : "border-gray-200 focus:border-purple-400"}`}
										placeholder="VD: Học cách tạo ra sản phẩm gốm độc đáo"
									/>
									{errors.description && <p className="text-xs text-red-600">{errors.description}</p>}
								</div>
							</div>

							<div className="space-y-2">
								<Label className="text-sm font-medium text-gray-700">Nội dung chi tiết</Label>
								<Textarea
									value={workshop.content}
									onChange={(e) => updateWorkshop({ content: e.target.value })}
									onKeyDown={(e) => e.stopPropagation()}
									className="min-h-[100px] text-base border-2 border-gray-200 focus:border-purple-400"
									placeholder="Mô tả chi tiết về trải nghiệm, quy trình, những gì khách hàng sẽ học được..."
								/>
							</div>

							{/* Ticket Types */}
							<div className="space-y-6">
								<h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
									<Ticket className="h-5 w-5 text-purple-500" />
									Loại vé
								</h4>

								{/* Vé tham quan */}
								<div className="space-y-4 p-4 border-2 border-blue-200 rounded-lg bg-blue-50/30">
									<h5 className="font-semibold text-gray-800 flex items-center gap-2">
										<Calendar className="h-4 w-4 text-blue-500" />
										Vé tham quan
									</h5>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label className="text-sm font-medium text-gray-700">Giá vé (VNĐ)</Label>
											<Input
												type="number"
												value={visitTicket?.price || 0}
												onChange={(e) =>
													updateWorkshop({
														ticketTypes: workshop.ticketTypes.map((t) =>
															t.type === TICKET_TYPES.VISIT ? { ...t, price: Number.parseInt(e.target.value) || 0 } : t,
														),
													})
												}
												onKeyDown={(e) => e.stopPropagation()}
												className={`h-10 text-base border-2 ${errors.visitPrice ? "border-red-300" : "border-gray-200 focus:border-purple-400"}`}
												placeholder="VD: 25000"
											/>
											{errors.visitPrice && <p className="text-xs text-red-600">{errors.visitPrice}</p>}
										</div>
										<div className="space-y-2">
											<Label className="text-sm font-medium text-gray-700">Thời gian (phút)</Label>
											<Input
												type="number"
												value={visitTicket?.durationMinutes || 0}
												onChange={(e) =>
													updateWorkshop({
														ticketTypes: workshop.ticketTypes.map((t) =>
															t.type === TICKET_TYPES.VISIT ? { ...t, durationMinutes: Number.parseInt(e.target.value) || 0 } : t,
														),
													})
												}
												onKeyDown={(e) => e.stopPropagation()}
												className={`h-10 text-base border-2 ${errors.visitDuration ? "border-red-300" : "border-gray-200 focus:border-purple-400"}`}
												placeholder="VD: 60"
											/>
											{errors.visitDuration && <p className="text-xs text-red-600">{errors.visitDuration}</p>}
										</div>
									</div>
								</div>

								{/* Vé trải nghiệm */}
								{formData.workshopsAvailable && (
									<div className="space-y-4 p-4 border-2 border-purple-200 rounded-lg bg-purple-50/30">
										<div className="flex items-center justify-between">
											<h5 className="font-semibold text-gray-800 flex items-center gap-2">
												<Activity className="h-4 w-4 text-purple-500" />
												Vé trải nghiệm (bao gồm tham quan)
											</h5>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label className="text-sm font-medium text-gray-700">Giá vé (VNĐ)</Label>
												<Input
													type="number"
													value={experienceTicket?.price || 0}
													onChange={(e) =>
														updateWorkshop({
															ticketTypes: workshop.ticketTypes.map((t) =>
																t.type === TICKET_TYPES.EXPERIENCE ? { ...t, price: Number.parseInt(e.target.value) || 0 } : t,
															),
														})
													}
													onKeyDown={(e) => e.stopPropagation()}
													className={`h-10 text-base border-2 ${errors.experiencePrice ? "border-red-300" : "border-gray-200 focus:border-purple-400"}`}
													placeholder="VD: 80000"
												/>
												{errors.experiencePrice && <p className="text-xs text-red-600">{errors.experiencePrice}</p>}
											</div>
											<div className="space-y-2">
												<Label className="text-sm font-medium text-gray-700">Thời gian (phút)</Label>
												<Input
													type="number"
													value={experienceTicket?.durationMinutes || 0}
													onChange={(e) =>
														updateWorkshop({
															ticketTypes: workshop.ticketTypes.map((t) =>
																t.type === TICKET_TYPES.EXPERIENCE ? { ...t, durationMinutes: Number.parseInt(e.target.value) || 0 } : t,
															),
														})
													}
													onKeyDown={(e) => e.stopPropagation()}
													className={`h-10 text-base border-2 ${errors.experienceDuration ? "border-red-300" : "border-gray-200 focus:border-purple-400"}`}
													placeholder="VD: 120"
												/>
												<div className="text-xs text-purple-700 bg-purple-100/50 p-2 rounded">
													💡 Thời gian này sẽ được dùng để tính tổng thời gian các hoạt động ở bước tiếp theo
												</div>
												{errors.experienceDuration && <p className="text-xs text-red-600">{errors.experienceDuration}</p>}
											</div>
										</div>

									</div>
								)}
							</div>
						</div>
					)}

					{/* Step 2: Hoạt động trải nghiệm */}
					{currentStep === 2 && formData.workshopsAvailable && experienceTicket && (
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
									<Activity className="h-5 w-5 text-purple-500" />
									Hoạt động trải nghiệm
								</h4>

								{/* Duration indicator */}
								<div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
									<span className="text-purple-600 font-medium">Yêu cầu: {experienceTicket.durationMinutes} phút</span>
									{" | "}
									<span className={`font-medium ${Math.abs((experienceTicket.workshopActivities.reduce((total, activity) => {
										const startHours = timeToHours(activity.startHour)
										const endHours = timeToHours(activity.endHour)
										return total + Math.round((endHours - startHours) * 60)
									}, 0)) - experienceTicket.durationMinutes) <= 5 ? "text-green-600" : "text-red-600"
										}`}>
										Hiện tại: {experienceTicket.workshopActivities.reduce((total, activity) => {
											const startHours = timeToHours(activity.startHour)
											const endHours = timeToHours(activity.endHour)
											return total + Math.round((endHours - startHours) * 60)
										}, 0)} phút
									</span>
								</div>
							</div>

							{errors.activityDuration && (
								<div className="p-3 bg-red-50 border border-red-200 rounded-lg">
									<p className="text-sm text-red-700">{errors.activityDuration}</p>
								</div>
							)}

							<div className="space-y-4">
								{experienceTicket.workshopActivities.map((activity, index) => (
									<Card key={index} className="border-2 border-purple-100">
										<CardContent className="p-4">
											<div className="flex items-start justify-between mb-4">
												<Badge variant="outline" className="bg-purple-50 text-purple-700">
													Hoạt động {index + 1}
												</Badge>
												<Button
													type="button"
													size="sm"
													variant="outline"
													onClick={(e) => {
														e.preventDefault()
														e.stopPropagation()
														removeActivity(index)
													}}
													onKeyDown={(e) => {
														if (e.key === 'Backspace' || e.key === 'Delete') {
															e.preventDefault()
															e.stopPropagation()
														}
													}}
													className="text-red-600 hover:bg-red-50"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>

											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label>Tên hoạt động</Label>
													<Input
														value={activity.activity}
														onChange={(e) => updateActivity(index, { activity: e.target.value })}
														onKeyDown={(e) => e.stopPropagation()}
														placeholder="VD: Nặn đất sét"
														className="border-2 border-gray-200 focus:border-purple-400"
													/>
												</div>

												<div className="space-y-2">
													<Label>Mô tả</Label>
													<Input
														value={activity.description}
														onChange={(e) => updateActivity(index, { description: e.target.value })}
														onKeyDown={(e) => e.stopPropagation()}
														placeholder="VD: Học cách nặn và tạo hình cơ bản"
														className="border-2 border-gray-200 focus:border-purple-400"
													/>
												</div>

												<div className="space-y-2">
													<Label>Giờ bắt đầu</Label>
													<Input
														type="time"
														value={activity.startHour.slice(0, 5)}
														onChange={(e) => updateActivity(index, { startHour: `${e.target.value}:00` })}
														onKeyDown={(e) => e.stopPropagation()}
														className="border-2 border-gray-200 focus:border-purple-400"
													/>
												</div>

												<div className="space-y-2">
													<Label>Giờ kết thúc</Label>
													<Input
														type="time"
														value={activity.endHour.slice(0, 5)}
														onChange={(e) => updateActivity(index, { endHour: `${e.target.value}:00` })}
														onKeyDown={(e) => e.stopPropagation()}
														className="border-2 border-gray-200 focus:border-purple-400"
													/>
												</div>
											</div>
										</CardContent>
									</Card>
								))}

								<Button
									type="button"
									variant="outline"
									onClick={addActivity}
									className="w-full border-dashed border-purple-300 text-purple-600 hover:bg-purple-50"
								>
									<Plus className="h-4 w-4 mr-2" />
									Thêm hoạt động
								</Button>
							</div>
						</div>
					)}

					{/* Step 3: Lịch trình */}
					{currentStep === 3 && (
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
									<Calendar className="h-5 w-5 text-purple-500" />
									Lịch trình hoạt động
								</h4>
								<Button
									type="button"
									variant="outline"
									onClick={addRecurringRule}
									className="border-purple-300 text-purple-600 hover:bg-purple-50"
								>
									<Plus className="h-4 w-4 mr-2" />
									Thêm lịch trình
								</Button>
							</div>

							{errors.schedule && (
								<div className="p-3 bg-red-50 border border-red-200 rounded-lg">
									<p className="text-sm text-red-700">{errors.schedule}</p>
								</div>
							)}

							{workshop.recurringRules.length === 0 ? (
								<div className="text-center py-8 text-gray-500">
									<Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
									<p>Chưa có lịch trình nào. Hãy thêm lịch trình hoạt động.</p>
								</div>
							) : (
								<div className="space-y-4">
									{workshop.recurringRules.map((rule, index) => (
										<Card key={index} className="border-2 border-purple-100">
											<CardContent className="p-6">
												<div className="flex items-start justify-between mb-4">
													<Badge variant="outline" className="bg-purple-50 text-purple-700">
														Lịch trình {index + 1}
													</Badge>
													<Button
														type="button"
														size="sm"
														variant="outline"
														onClick={(e) => {
															e.preventDefault()
															e.stopPropagation()
															removeRecurringRule(index)
														}}
														onKeyDown={(e) => {
															if (e.key === 'Backspace' || e.key === 'Delete') {
																e.preventDefault()
																e.stopPropagation()
															}
														}}
														className="text-red-600 hover:bg-red-50"
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>

												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													<div className="space-y-2">
														<Label>Ngày bắt đầu</Label>
														<Input
															type="date"
															value={rule.startDate}
															onChange={(e) => updateRecurringRule(index, { startDate: e.target.value })}
															onKeyDown={(e) => e.stopPropagation()}
															className="border-2 border-gray-200 focus:border-purple-400"
														/>
													</div>

													<div className="space-y-2">
														<Label>Ngày kết thúc</Label>
														<Input
															type="date"
															value={rule.endDate}
															onChange={(e) => updateRecurringRule(index, { endDate: e.target.value })}
															onKeyDown={(e) => e.stopPropagation()}
															className="border-2 border-gray-200 focus:border-purple-400"
														/>
													</div>

													<div className="space-y-2 md:col-span-2">
														<Label>Các ngày trong tuần</Label>
														<div className="flex flex-wrap gap-2">
															{[
																{ value: DAYS_OF_WEEK.MONDAY, label: "T2" },
																{ value: DAYS_OF_WEEK.TUESDAY, label: "T3" },
																{ value: DAYS_OF_WEEK.WEDNESDAY, label: "T4" },
																{ value: DAYS_OF_WEEK.THURSDAY, label: "T5" },
																{ value: DAYS_OF_WEEK.FRIDAY, label: "T6" },
																{ value: DAYS_OF_WEEK.SATURDAY, label: "T7" },
																{ value: DAYS_OF_WEEK.SUNDAY, label: "CN" },
															].map((day) => (
																<div key={day.value} className="flex items-center space-x-2">
																	<Checkbox
																		id={`${index}-${day.value}`}
																		checked={rule.daysOfWeek.includes(day.value)}
																		onCheckedChange={(checked) => {
																			const updatedDays = checked
																				? [...rule.daysOfWeek, day.value]
																				: rule.daysOfWeek.filter((d) => d !== day.value)
																			updateRecurringRule(index, { daysOfWeek: updatedDays })
																		}}
																	/>
																	<Label htmlFor={`${index}-${day.value}`} className="text-sm">
																		{day.label}
																	</Label>
																</div>
															))}
														</div>
													</div>
												</div>

												{/* Sessions - Multiple time slots per day */}
												<div className="space-y-4 mt-6">
													<div className="flex items-center justify-between">
														<Label className="text-base font-semibold text-gray-700">Các ca trong ngày</Label>
														<Button
															type="button"
															variant="outline"
															size="sm"
															onClick={() => addSession(index)}
															className="border-purple-300 text-purple-600 hover:bg-purple-50"
														>
															<Plus className="h-4 w-4 mr-1" />
															Thêm ca
														</Button>
													</div>

													<div className="text-xs text-blue-700 bg-blue-100/50 p-3 rounded-lg">
														💡 <strong>Ví dụ:</strong> Ca sáng 8h-10h, ca chiều 14h-16h, ca tối 19h-21h. Mỗi ca có thể có sức chứa khác nhau.
													</div>

													{rule.sessions.map((session, sessionIndex) => (
														<div key={sessionIndex} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
															<div className="flex items-center justify-between mb-3">
																<Badge variant="outline" className="bg-blue-50 text-blue-700">
																	Ca {sessionIndex + 1}
																</Badge>
																{rule.sessions.length > 1 && (
																	<Button
																		type="button"
																		variant="outline"
																		size="sm"
																		onClick={(e) => {
																			e.preventDefault()
																			e.stopPropagation()
																			removeSession(index, sessionIndex)
																		}}
																		onKeyDown={(e) => {
																			if (e.key === 'Backspace' || e.key === 'Delete') {
																				e.preventDefault()
																				e.stopPropagation()
																			}
																		}}
																		className="text-red-600 hover:bg-red-50"
																	>
																		<Trash2 className="h-4 w-4" />
																	</Button>
																)}
															</div>

															<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
																<div className="space-y-2">
																	<Label className="text-sm">Giờ bắt đầu</Label>
																	<Input
																		type="time"
																		value={session.startTime.slice(0, 5)}
																		onChange={(e) => updateSession(index, sessionIndex, { startTime: `${e.target.value}:00` })}
																		onKeyDown={(e) => e.stopPropagation()}
																		className="border-2 border-gray-200 focus:border-purple-400"
																	/>
																</div>

																<div className="space-y-2">
																	<Label className="text-sm">Giờ kết thúc</Label>
																	<Input
																		type="time"
																		value={session.endTime.slice(0, 5)}
																		onChange={(e) => updateSession(index, sessionIndex, { endTime: `${e.target.value}:00` })}
																		onKeyDown={(e) => e.stopPropagation()}
																		className="border-2 border-gray-200 focus:border-purple-400"
																	/>
																</div>

																<div className="space-y-2">
																	<Label className="text-sm">Sức chứa</Label>
																	<Input
																		type="number"
																		value={session.capacity}
																		onChange={(e) => updateSession(index, sessionIndex, { capacity: Number.parseInt(e.target.value) || 20 })}
																		onKeyDown={(e) => e.stopPropagation()}
																		className="border-2 border-gray-200 focus:border-purple-400"
																		placeholder="VD: 20"
																	/>
																</div>
															</div>
														</div>
													))}
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							)}
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="p-6 border-t bg-gray-50 rounded-b-2xl flex justify-between">
					<div className="flex gap-2">
						{currentStep > 1 && (
							<Button type="button" variant="outline" onClick={handleBack}>
								Quay lại
							</Button>
						)}
					</div>
					<div className="flex gap-2">
						{currentStep < 3 ? (
							<Button type="button" onClick={handleNext} className="bg-gradient-to-r from-purple-500 to-pink-500">
								Tiếp theo
							</Button>
						) : (
							<Button type="button" onClick={handleSave} className="bg-gradient-to-r from-emerald-500 to-blue-500">
								{editingWorkshop ? "Cập nhật" : "Lưu trải nghiệm"}
							</Button>
						)}
					</div>
				</div>
			</div>
		</div >
	)
}
