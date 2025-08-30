"use client"

import { useState, useCallback, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, ArrowRight, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import ContentEditor from "@/components/common/content-editor/ContentEditor"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface WorkshopSummary {
	id: string
	name: string
	description: string
	content: string
	startDate: string
	endDate: string
	adultPrice: number
	childrenPrice: number
	maxParticipant: number
	activitiesCount: number
	schedulesCount: number
	activities: Activity[]
	schedules: Schedule[]
	status: "draft" | "ready"
}

interface Activity {
	id: string
	name: string
	description: string
	startTime: string
	endTime: string
	notes: string
}

interface Schedule {
	id: string
	dayOfWeek: number // 0 = Chủ nhật, 1 = Thứ 2, ... 6 = Thứ 7
	startTime: string
	endTime: string
}

interface WorkshopCreationModalProps {
	isOpen: boolean
	onClose: () => void
	onSave: (workshop: WorkshopSummary) => void
	editingWorkshop?: WorkshopSummary | null
}

export default function WorkshopCreationModal({
	isOpen,
	onClose,
	onSave,
	editingWorkshop,
}: WorkshopCreationModalProps) {
	const [currentStep, setCurrentStep] = useState(1)
	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [content, setContent] = useState("")
	const [activities, setActivities] = useState<Activity[]>([])
	const [schedules, setSchedules] = useState<Schedule[]>([])

	// Reset form when modal opens/closes
	useEffect(() => {
		if (isOpen) {
			if (editingWorkshop) {
				setName(editingWorkshop.name)
				setDescription(editingWorkshop.description)
				setContent(editingWorkshop.content || "")
				setActivities(editingWorkshop.activities || [])
				setSchedules(editingWorkshop.schedules || [])
			} else {
				setName("")
				setDescription("")
				setContent("")
				setActivities([])
				setSchedules([])
			}
			setCurrentStep(1)
		}
	}, [isOpen, editingWorkshop])

	const addActivity = useCallback(() => {
		const newActivity: Activity = {
			id: Date.now().toString(),
			name: "",
			description: "",
			startTime: "09:00",
			endTime: "10:00",
			notes: "",
		}
		setActivities((prev) => [...prev, newActivity])
	}, [])

	const updateActivity = useCallback((id: string, updates: Partial<Activity>) => {
		setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)))
	}, [])

	const removeActivity = useCallback((id: string) => {
		setActivities((prev) => prev.filter((a) => a.id !== id))
	}, [])

	const addSchedule = useCallback(() => {
		const newSchedule: Schedule = {
			id: Date.now().toString(),
			dayOfWeek: 1,
			startTime: "09:00",
			endTime: "17:00",
		}
		setSchedules((prev) => [...prev, newSchedule])
	}, [])

	const updateSchedule = useCallback((id: string, updates: Partial<Schedule>) => {
		setSchedules((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)))
	}, [])

	const removeSchedule = useCallback((id: string) => {
		setSchedules((prev) => prev.filter((s) => s.id !== id))
	}, [])

	const validateStep = (step: number): boolean => {
		switch (step) {
			case 1:
				return !!(name.trim() && description.trim() && content.trim())
			case 2:
				return activities.length > 0 && activities.every((a) => a.name.trim())
			case 3:
				return schedules.length > 0 && schedules.every((s) => s.dayOfWeek >= 0 && s.dayOfWeek <= 6 && s.startTime && s.endTime)
			default:
				return true
		}
	}

	const handleNext = () => {
		if (!validateStep(currentStep)) {
			toast.error("Vui lòng hoàn thành thông tin bắt buộc")
			return
		}
		setCurrentStep((prev) => Math.min(prev + 1, 4))
	}

	const handlePrevious = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 1))
	}

	const handleSave = () => {
		if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
			toast.error("Vui lòng hoàn thành tất cả thông tin")
			return
		}

		const workshop: WorkshopSummary = {
			id: editingWorkshop?.id || Date.now().toString(),
			name,
			description,
			content,
			startDate: new Date().toISOString(),
			endDate: new Date().toISOString(),
			adultPrice: 0,
			childrenPrice: 0,
			maxParticipant: 0,
			activitiesCount: activities.length,
			schedulesCount: schedules.length,
			activities,
			schedules,
			status: "ready",
		}

		onSave(workshop)
	}

	const renderBasicInfoStep = () => (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="workshop-name">Tên Workshop *</Label>
				<Input
					id="workshop-name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="VD: Trải nghiệm làm gốm truyền thống"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="workshop-description">Mô tả ngắn *</Label>
				<Textarea
					id="workshop-description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="Mô tả ngắn gọn về workshop (1-2 câu)"
					rows={3}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="workshop-content">Nội dung chi tiết *</Label>
				<ContentEditor content={content} onChange={setContent} />
			</div>
		</div>
	)

	const renderActivitiesStep = () => (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h4 className="font-medium">Hoạt động trong Workshop</h4>
				<Button onClick={addActivity} size="sm">
					<Plus className="h-4 w-4 mr-2" />
					Thêm hoạt động
				</Button>
			</div>

			{activities.length === 0 ? (
				<div className="text-center py-8 text-muted-foreground">
					<p>Chưa có hoạt động nào. Hãy thêm hoạt động đầu tiên!</p>
				</div>
			) : (
				<div className="space-y-3">
					{activities.map((activity, index) => (
						<Card key={activity.id}>
							<CardContent className="pt-4">
								<div className="flex items-start justify-between mb-3">
									<Badge variant="outline">Hoạt động {index + 1}</Badge>
									<Button
										size="sm"
										variant="outline"
										onClick={() => removeActivity(activity.id)}
										className="text-red-600"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label>Tên hoạt động *</Label>
										<Input
											value={activity.name}
											onChange={(e) => updateActivity(activity.id, { name: e.target.value })}
											placeholder="VD: Nặn đất sét"
										/>
									</div>

									<div className="space-y-2">
										<Label>Thời gian</Label>
										<div className="flex items-center gap-2">
											<Input
												type="time"
												value={activity.startTime}
												onChange={(e) => updateActivity(activity.id, { startTime: e.target.value })}
											/>
											<span>-</span>
											<Input
												type="time"
												value={activity.endTime}
												onChange={(e) => updateActivity(activity.id, { endTime: e.target.value })}
											/>
										</div>
									</div>

									<div className="md:col-span-2 space-y-2">
										<Label>Mô tả hoạt động</Label>
										<Textarea
											value={activity.description}
											onChange={(e) => updateActivity(activity.id, { description: e.target.value })}
											placeholder="Mô tả chi tiết hoạt động này..."
											rows={2}
										/>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	)

	const renderSchedulesStep = () => (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h4 className="font-medium">Lịch trong tuần</h4>
				<Button onClick={addSchedule} size="sm">
					<Plus className="h-4 w-4 mr-2" />
					Thêm lịch trong tuần
				</Button>
			</div>

			{schedules.length === 0 ? (
				<div className="text-center py-8 text-muted-foreground">
					<p>Chưa có lịch trong tuần. Hãy thêm lịch đầu tiên!</p>
				</div>
			) : (
				<div className="space-y-3">
					{schedules.map((schedule, index) => (
						<Card key={schedule.id}>
							<CardContent className="pt-4">
								<div className="flex items-start justify-between mb-3">
									<Badge variant="outline">Lịch {index + 1}</Badge>
									<Button
										size="sm"
										variant="outline"
										onClick={() => removeSchedule(schedule.id)}
										className="text-red-600"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div className="space-y-2">
										<Label>Thứ trong tuần *</Label>
										<Select value={String(schedule.dayOfWeek)} onValueChange={(v) => updateSchedule(schedule.id, { dayOfWeek: Number(v) })}>
											<SelectTrigger>
												<SelectValue placeholder="Chọn thứ" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="1">Thứ 2</SelectItem>
												<SelectItem value="2">Thứ 3</SelectItem>
												<SelectItem value="3">Thứ 4</SelectItem>
												<SelectItem value="4">Thứ 5</SelectItem>
												<SelectItem value="5">Thứ 6</SelectItem>
												<SelectItem value="6">Thứ 7</SelectItem>
												<SelectItem value="0">Chủ nhật</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label>Giờ bắt đầu</Label>
										<Input
											type="time"
											value={schedule.startTime}
											onChange={(e) => updateSchedule(schedule.id, { startTime: e.target.value })}
										/>
									</div>

									<div className="space-y-2">
										<Label>Giờ kết thúc</Label>
										<Input
											type="time"
											value={schedule.endTime}
											onChange={(e) => updateSchedule(schedule.id, { endTime: e.target.value })}
										/>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	)

	const renderReviewStep = () => (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Thông tin Workshop</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<Label className="text-sm font-medium">Tên Workshop</Label>
						<p className="text-sm text-muted-foreground">{name}</p>
					</div>
					<div>
						<Label className="text-sm font-medium">Mô tả</Label>
						<p className="text-sm text-muted-foreground">{description}</p>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Hoạt động ({activities.length})</CardTitle>
				</CardHeader>
				<CardContent>
					{activities.map((activity, index) => (
						<div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
							<div>
								<p className="font-medium text-sm">{activity.name}</p>
								<p className="text-xs text-muted-foreground">
									{activity.startTime} - {activity.endTime}
								</p>
							</div>
						</div>
					))}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Lịch trình ({schedules.length})</CardTitle>
				</CardHeader>
				<CardContent>
					{schedules.map((schedule) => (
						<div key={schedule.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
							<div>
								<p className="font-medium text-sm">{["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"][schedule.dayOfWeek]}</p>
								<p className="text-xs text-muted-foreground">
									{schedule.startTime} - {schedule.endTime}
								</p>
							</div>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	)

	const steps = [
		{ title: "Thông tin cơ bản", component: renderBasicInfoStep },
		{ title: "Hoạt động", component: renderActivitiesStep },
		{ title: "Lịch trình", component: renderSchedulesStep },
		{ title: "Xem lại", component: renderReviewStep },
	]

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Plus className="h-5 w-5" />
						{editingWorkshop ? "Chỉnh sửa Workshop" : "Tạo Workshop mới"}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					{/* Step Indicator */}
					<div className="flex items-center justify-between">
						{steps.map((step, index) => (
							<div key={index} className="flex items-center">
								<div
									className={cn(
										"w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
										currentStep > index + 1
											? "bg-green-500 text-white"
											: currentStep === index + 1
												? "bg-blue-500 text-white"
												: "bg-gray-200 text-gray-500",
									)}
								>
									{index + 1}
								</div>
								<span className="ml-2 text-sm font-medium hidden md:block">{step.title}</span>
								{index < steps.length - 1 && <div className="w-8 h-px bg-gray-300 mx-4" />}
							</div>
						))}
					</div>

					{/* Step Content */}
					<div className="min-h-[400px]">{steps[currentStep - 1].component()}</div>

					{/* Navigation */}
					<div className="flex justify-between pt-4 border-t">
						<Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Quay lại
						</Button>

						{currentStep < steps.length ? (
							<Button onClick={handleNext} disabled={!validateStep(currentStep)}>
								Tiếp theo
								<ArrowRight className="h-4 w-4 ml-2" />
							</Button>
						) : (
							<Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
								{editingWorkshop ? "Cập nhật Workshop" : "Lưu Workshop"}
							</Button>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
