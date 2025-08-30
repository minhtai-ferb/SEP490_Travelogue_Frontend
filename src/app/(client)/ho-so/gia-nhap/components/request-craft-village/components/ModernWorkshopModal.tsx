"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
	Trash2
} from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"

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

	// Reset state when modal opens/closes or editingWorkshop changes
	useEffect(() => {
		if (isOpen) {
			setCurrentStep(1)
			setErrors({})

			if (editingWorkshop) {
				// Editing existing workshop
				setWorkshop({ ...editingWorkshop })
			} else {
				// Creating new workshop
				setWorkshop({
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
					recurringRules: [
						{
							daysOfWeek: [1], // Thứ 2 mặc định
							sessions: [
								{
									startTime: "08:00:00",
									endTime: "10:00:00",
									capacity: 20,
								},
							],
						},
					],
					exceptions: [],
				})
			}
		}
	}, [isOpen, editingWorkshop])

	// Helper function to calculate end time based on experience ticket duration
	const calculateEndTime = useCallback((startTime: string, durationMinutes?: number) => {
		if (!durationMinutes || durationMinutes <= 0) {
			// Default 2 hours if no duration specified
			durationMinutes = 120
		}

		const [hours, minutes] = startTime.split(':').map(Number)
		const startTotalMinutes = hours * 60 + minutes
		const endTotalMinutes = startTotalMinutes + durationMinutes

		const endHours = Math.floor(endTotalMinutes / 60)
		const endMins = endTotalMinutes % 60

		return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}:00`
	}, [])

	// Helper function để kiểm tra có vé trải nghiệm không
	const hasExperienceTicket = useCallback(() => {
		// Chỉ hiện step hoạt động khi làng nghề có workshop available
		return formData.workshopsAvailable && workshop.ticketTypes.some(ticket => ticket.type === TICKET_TYPES.EXPERIENCE)
	}, [formData.workshopsAvailable, workshop.ticketTypes])

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
			if (currentStep === 1) {
				// Nếu có experience ticket, đi đến step 2, nếu không thì skip đến step 3
				setCurrentStep(hasExperienceTicket() ? 2 : 3)
			} else if (currentStep === 2) {
				setCurrentStep(3)
			}
		}
	}, [currentStep, validateStep, hasExperienceTicket])

	const handleBack = useCallback(() => {
		if (currentStep === 3) {
			// Từ step 3: nếu có experience ticket thì về step 2, nếu không thì về step 1
			setCurrentStep(hasExperienceTicket() ? 2 : 1)
		} else if (currentStep === 2) {
			setCurrentStep(1)
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

		// Tính toán thời gian bắt đầu dựa trên activity cuối cùng
		const lastActivity = experienceTicket.workshopActivities[experienceTicket.workshopActivities.length - 1]
		const startMinutes = lastActivity
			? Number.parseInt(lastActivity.endHour.split(':')[0]) * 60 + Number.parseInt(lastActivity.endHour.split(':')[1])
			: 0
		const endMinutes = startMinutes + 30 // Default 30 phút cho mỗi activity

		const newActivity: WorkshopActivity = {
			activity: "",
			description: "",
			startHour: `${Math.floor(startMinutes / 60).toString().padStart(2, '0')}:${(startMinutes % 60).toString().padStart(2, '0')}:00`,
			endHour: `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}:00`,
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
		const experienceTicketDuration = experienceTicket?.durationMinutes || 120
		const startTime = "08:00:00"
		const endTime = calculateEndTime(startTime, experienceTicketDuration)

		const newRule: RecurringRule = {
			daysOfWeek: [1], // Thứ 2
			sessions: [
				{
					startTime: startTime,
					endTime: endTime,
					capacity: 20,
				},
			],
		}

		updateWorkshop({
			recurringRules: [...workshop.recurringRules, newRule],
		})
	}, [workshop.recurringRules, updateWorkshop, experienceTicket, calculateEndTime])

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
		const experienceTicketDuration = experienceTicket?.durationMinutes || 120
		const startTime = "14:00:00"
		const endTime = calculateEndTime(startTime, experienceTicketDuration)

		const newSession = {
			startTime: startTime,
			endTime: endTime,
			capacity: 20,
		}

		updateWorkshop({
			recurringRules: workshop.recurringRules.map((rule, i) =>
				i === ruleIndex ? { ...rule, sessions: [...rule.sessions, newSession] } : rule,
			),
		})
	}, [workshop.recurringRules, updateWorkshop, experienceTicket, calculateEndTime])

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

	// Helper function to auto-update endTime when startTime changes
	const updateSessionWithDuration = useCallback((ruleIndex: number, sessionIndex: number, newStartTime: string) => {
		const experienceTicketDuration = experienceTicket?.durationMinutes || 120
		const newEndTime = calculateEndTime(newStartTime, experienceTicketDuration)

		updateSession(ruleIndex, sessionIndex, {
			startTime: newStartTime,
			endTime: newEndTime
		})
	}, [experienceTicket, calculateEndTime, updateSession])

	// Always show all steps, just change display numbering
	const availableSteps = useMemo(() => {
		return [1, 2, 3] // Always show all steps
	}, [])

	// Get the actual step number for display
	const getDisplayStep = (step: number) => {
		if (hasExperienceTicket()) {
			return step // Original numbering: 1, 2, 3
		} else {
			// Renumber when no experience ticket: 1, skip 2, 3 becomes 2
			if (step === 1) return 1
			if (step === 2) return null // Don't display step 2
			if (step === 3) return 2   // Step 3 becomes step 2
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-screen p-0 gap-0 rounded-3xl">
				<DialogHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-lg">
					<DialogTitle className="text-xl font-bold">
						{editingWorkshop ? "Chỉnh sửa trải nghiệm" : "Tạo trải nghiệm mới"}
					</DialogTitle>
				</DialogHeader>

				{/* Step Indicator */}
				<div className="flex justify-center p-4 bg-gray-50">
					<div className="flex items-center space-x-4">
						{availableSteps
							.filter(step => getDisplayStep(step) !== null) // Only show steps that have display numbers
							.map((step, index, filteredSteps) => {
								const displayStep = getDisplayStep(step)
								const isCurrentStep = step === currentStep
								const isCompletedStep = step < currentStep || (step === 3 && currentStep === 3 && !hasExperienceTicket())

								return (
									<div key={step} className="flex items-center">
										<div
											className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${isCurrentStep
												? "bg-blue-500 text-white"
												: isCompletedStep
													? "bg-green-500 text-white"
													: "bg-gray-200 text-gray-600"
												}`}
										>
											{displayStep}
										</div>
										{index < filteredSteps.length - 1 && (
											<div className="w-12 h-0.5 bg-gray-300 mx-2" />
										)}
									</div>
								)
							})}
					</div>
				</div>

				{/* Content */}
				<div className="px-6 max-h-[60vh] overflow-y-auto">
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
										className={`h-10 text-base border-2 ${errors.name ? "border-red-300" : "border-gray-200 focus:border-blue-400"}`}
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
										className={`h-10 text-base border-2 ${errors.description ? "border-red-300" : "border-gray-200 focus:border-blue-400"}`}
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
									className="min-h-[100px] text-base border-2 border-gray-200 focus:border-blue-400"
									placeholder="Mô tả chi tiết về trải nghiệm, quy trình, những gì khách hàng sẽ học được..."
								/>
							</div>

							{/* Ticket Types */}
							<div className="space-y-6">
								<h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
									<Ticket className="h-5 w-5 text-blue-500" />
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
												className={`h-10 text-base border-2 ${errors.visitPrice ? "border-red-300" : "border-gray-200 focus:border-blue-400"}`}
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
												className={`h-10 text-base border-2 ${errors.visitDuration ? "border-red-300" : "border-gray-200 focus:border-blue-400"}`}
												placeholder="VD: 60"
											/>
											{errors.visitDuration && <p className="text-xs text-red-600">{errors.visitDuration}</p>}
										</div>
									</div>
								</div>

								{/* Vé trải nghiệm */}
								{formData.workshopsAvailable && (
									<div className="space-y-4 p-4 border-2 border-blue-200 rounded-lg bg-blue-50/30">
										<div className="flex items-center justify-between">
											<h5 className="font-semibold text-gray-800 flex items-center gap-2">
												<Activity className="h-4 w-4 text-blue-500" />
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
													className={`h-10 text-base border-2 ${errors.experiencePrice ? "border-red-300" : "border-gray-200 focus:border-blue-400"}`}
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
													className={`h-10 text-base border-2 ${errors.experienceDuration ? "border-red-300" : "border-gray-200 focus:border-blue-400"}`}
													placeholder="VD: 120"
												/>
												<div className="text-xs text-blue-700 bg-blue-100/50 p-2 rounded">
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
					{currentStep === 2 && hasExperienceTicket() && (
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
									<Activity className="h-5 w-5 text-blue-500" />
									Hoạt động trải nghiệm
								</h4>

								{/* Duration indicator */}
								{experienceTicket && (
									<div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
										<span className="text-blue-600 font-medium">Tổng thời gian workshop: {experienceTicket.durationMinutes} phút</span>
										{" | "}
										<span className={`font-medium ${Math.abs((experienceTicket.workshopActivities.reduce((total, activity) => {
											const startMinutes = Number.parseInt(activity.startHour.split(':')[0]) * 60 + Number.parseInt(activity.startHour.split(':')[1])
											const endMinutes = Number.parseInt(activity.endHour.split(':')[0]) * 60 + Number.parseInt(activity.endHour.split(':')[1])
											return Math.max(total, endMinutes) // Lấy thời điểm kết thúc muộn nhất
										}, 0)) - experienceTicket.durationMinutes) <= 5 ? "text-green-600" : "text-red-600"
											}`}>
											Thời gian đã sử dụng: {experienceTicket.workshopActivities.reduce((total, activity) => {
												const startMinutes = Number.parseInt(activity.startHour.split(':')[0]) * 60 + Number.parseInt(activity.startHour.split(':')[1])
												const endMinutes = Number.parseInt(activity.endHour.split(':')[0]) * 60 + Number.parseInt(activity.endHour.split(':')[1])
												return Math.max(total, endMinutes) // Lấy thời điểm kết thúc muộn nhất
											}, 0)} phút
										</span>
									</div>
								)}
							</div>

							{errors.activityDuration && (
								<div className="p-3 bg-red-50 border border-red-200 rounded-lg">
									<p className="text-sm text-red-700">{errors.activityDuration}</p>
								</div>
							)}

							{experienceTicket && (
								<div className="space-y-4">
									{experienceTicket.workshopActivities.map((activity, index) => (
										<Card key={index} className="border-2 border-purple-100">
											<CardContent className="p-4">
												<div className="flex items-start justify-between mb-4">
													<Badge variant="outline" className="bg-blue-50 text-blue-700">
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
															className="border-2 border-gray-200 focus:border-blue-400"
														/>
													</div>

													<div className="space-y-2">
														<Label>Mô tả</Label>
														<Input
															value={activity.description}
															onChange={(e) => updateActivity(index, { description: e.target.value })}
															onKeyDown={(e) => e.stopPropagation()}
															placeholder="VD: Học cách nặn và tạo hình cơ bản"
															className="border-2 border-gray-200 focus:border-blue-400"
														/>
													</div>

													<div className="space-y-2">
														<Label>Thời gian bắt đầu (phút)</Label>
														<Input
															type="number"
															value={activity.startHour ? Number.parseInt(activity.startHour.split(':')[0]) * 60 + Number.parseInt(activity.startHour.split(':')[1]) : 0}
															onChange={(e) => {
																const minutes = Number.parseInt(e.target.value) || 0
																const hours = Math.floor(minutes / 60)
																const mins = minutes % 60
																updateActivity(index, { startHour: `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:00` })
															}}
															onKeyDown={(e) => e.stopPropagation()}
															className="border-2 border-gray-200 focus:border-blue-400"
															placeholder="VD: 30 (phút)"
															min="0"
														/>
														<p className="text-xs text-gray-500">Thời gian bắt đầu hoạt động (tính từ đầu workshop)</p>
													</div>

													<div className="space-y-2">
														<Label>Thời gian kết thúc (phút)</Label>
														<Input
															type="number"
															value={activity.endHour ? Number.parseInt(activity.endHour.split(':')[0]) * 60 + Number.parseInt(activity.endHour.split(':')[1]) : 0}
															onChange={(e) => {
																const minutes = Number.parseInt(e.target.value) || 0
																const hours = Math.floor(minutes / 60)
																const mins = minutes % 60
																updateActivity(index, { endHour: `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:00` })
															}}
															onKeyDown={(e) => e.stopPropagation()}
															className="border-2 border-gray-200 focus:border-blue-400"
															placeholder="VD: 60 (phút)"
															min="0"
														/>
														<p className="text-xs text-gray-500">Thời gian kết thúc hoạt động (tính từ đầu workshop)</p>
													</div>
												</div>
											</CardContent>
										</Card>
									))}

									<Button
										type="button"
										variant="outline"
										onClick={addActivity}
										className="w-full border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
									>
										<Plus className="h-4 w-4 mr-2" />
										Thêm hoạt động
									</Button>
								</div>
							)}
						</div>
					)}

					{/* Step 3: Lịch trình */}
					{currentStep === 3 && (
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
									<Calendar className="h-5 w-5 text-blue-500" />
									Lịch diễn ra hàng tuần
								</h4>
							</div>

							{errors.schedule && (
								<div className="p-3 bg-red-50 border border-red-200 rounded-lg">
									<p className="text-sm text-red-700">{errors.schedule}</p>
								</div>
							)}

							<div className="space-y-4">
								{workshop.recurringRules.map((rule, index) => (
									<Card key={index} className="border-2 border-purple-100">
										<CardContent className="p-6">
											<div className="flex items-start justify-between mb-4">
												<Badge variant="outline" className="bg-blue-50 text-blue-700">
													Lịch tổ chức định kỳ
												</Badge>
											</div>

											<div className="space-y-4">
												<div className="space-y-2">
													<Label>Chọn ngày tổ chức</Label>
													<div className="flex justify-between gap-10">
														{[
															{ value: DAYS_OF_WEEK.MONDAY, label: "Thứ 2" },
															{ value: DAYS_OF_WEEK.TUESDAY, label: "Thứ 3" },
															{ value: DAYS_OF_WEEK.WEDNESDAY, label: "Thứ 4" },
															{ value: DAYS_OF_WEEK.THURSDAY, label: "Thứ 5" },
															{ value: DAYS_OF_WEEK.FRIDAY, label: "Thứ 6" },
															{ value: DAYS_OF_WEEK.SATURDAY, label: "Thứ 7" },
															{ value: DAYS_OF_WEEK.SUNDAY, label: "Chủ nhật" },
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
													<Label className="text-base font-semibold text-gray-700">Khung giờ tổ chức</Label>
													<Button
														type="button"
														variant="outline"
														size="sm"
														onClick={() => addSession(index)}
														className="border-blue-300 text-blue-600 hover:bg-blue-50"
													>
														<Plus className="h-4 w-4 mr-1" />
														Thêm khung giờ
													</Button>
												</div>

												<div className="text-xs text-blue-700 bg-blue-100/50 p-3 rounded-lg">
													💡 <strong>Tự động tính thời gian:</strong> Giờ kết thúc sẽ được tự động tính dựa trên thời gian của vé trải nghiệm ({experienceTicket?.durationMinutes || 120} phút). Chỉ cần chọn giờ bắt đầu.
												</div>

												{rule.sessions.map((session, sessionIndex) => (
													<div key={sessionIndex} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
														<div className="flex items-center justify-between mb-3">
															<Badge variant="outline" className="bg-blue-50 text-blue-700">
																Khung giờ {sessionIndex + 1}
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
																<Label className="text-sm">Thời gian bắt đầu</Label>
																<Input
																	type="time"
																	value={session.startTime.slice(0, 5)}
																	onChange={(e) => updateSessionWithDuration(index, sessionIndex, `${e.target.value}:00`)}
																	onKeyDown={(e) => e.stopPropagation()}
																	className="border-2 border-gray-200 focus:border-blue-400"
																/>
															</div>

															<div className="space-y-2">
																<Label className="text-sm">Thời gian kết thúc</Label>
																<Input
																	type="time"
																	value={session.endTime.slice(0, 5)}
																	onChange={(e) => updateSession(index, sessionIndex, { endTime: `${e.target.value}:00` })}
																	onKeyDown={(e) => e.stopPropagation()}
																	className="border-2 border-gray-200 focus:border-blue-400"
																/>
															</div>

															<div className="space-y-2">
																<Label className="text-sm">Sức chứa (người/khung giờ)</Label>
																<Input
																	type="number"
																	value={session.capacity}
																	onChange={(e) => updateSession(index, sessionIndex, { capacity: Number.parseInt(e.target.value) || 20 })}
																	onKeyDown={(e) => e.stopPropagation()}
																	className="border-2 border-gray-200 focus:border-blue-400"
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
						</div>
					)}
				</div>

				{/* Footer */}
				<DialogFooter className="flex justify-between items-center p-6 border-t bg-gray-50 rounded-b-lg">
					{currentStep > 1 && (
						<Button type="button" variant="outline" onClick={handleBack}>
							Quay lại
						</Button>
					)}

					<div className="flex gap-2 ml-auto">
						{currentStep < 3 ? (
							<Button type="button" onClick={handleNext} className="bg-gradient-to-r from-blue-500 to-blue-600">
								Tiếp theo
							</Button>
						) : (
							<Button type="button" onClick={handleSave} className="bg-gradient-to-r from-emerald-500 to-blue-500">
								{editingWorkshop ? "Cập nhật" : "Lưu trải nghiệm"}
							</Button>
						)}
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
