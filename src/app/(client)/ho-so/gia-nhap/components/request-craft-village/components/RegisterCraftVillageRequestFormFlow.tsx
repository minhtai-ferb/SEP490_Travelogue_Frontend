"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Workflow as Workshop, CheckCircle, Edit3, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

import CraftVillageForm from "./CraftVillageForm"
import WorkshopCreationModal from "./WorkshopCreationModal"

interface CraftVillageData {
	name: string
	description: string
	content: string
	address: string
	latitude: number
	longitude: number
	openTime: string
	closeTime: string
	districtId: string
	phoneNumber: string
	email: string
	website: string
	workshopsAvailable: boolean
	signatureProduct: string
	yearsOfHistory: number
	isRecognizedByUnesco: boolean
	mediaDtos: Array<{ mediaUrl: string; isThumbnail: boolean }>
	visitPrice?: number
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
	dayOfWeek: number
	startTime: string
	endTime: string
}

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

export default function CraftVillageRegistrationFlow({ fetchLatest }: { fetchLatest: () => void }) {
	const [step, setStep] = useState<"craft-village" | "workshops" | "complete">("craft-village")
	const [craftVillageData, setCraftVillageData] = useState<CraftVillageData | null>(null)
	const [workshops, setWorkshops] = useState<WorkshopSummary[]>([])
	const [showWorkshopModal, setShowWorkshopModal] = useState(false)
	const [editingWorkshop, setEditingWorkshop] = useState<WorkshopSummary | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleCraftVillageComplete = useCallback((data: CraftVillageData) => {
		setCraftVillageData(data)
		setStep("workshops")
		toast.success("Thông tin làng nghề đã được lưu!")
	}, [])

	const handleAddWorkshop = useCallback(() => {
		setEditingWorkshop(null)
		setShowWorkshopModal(true)
	}, [])

	const handleEditWorkshop = useCallback((workshop: WorkshopSummary) => {
		setEditingWorkshop(workshop)
		setShowWorkshopModal(true)
	}, [])

	const handleDeleteWorkshop = useCallback((workshopId: string) => {
		setWorkshops((prev) => prev.filter((w) => w.id !== workshopId))
		toast.success("Đã xóa trải nghiệm")
	}, [])

	const handleWorkshopSaved = useCallback(
		(workshop: WorkshopSummary) => {
			if (editingWorkshop) {
				setWorkshops((prev) => prev.map((w) => (w.id === workshop.id ? workshop : w)))
				toast.success("Đã cập nhật trải nghiệm")
			} else {
				setWorkshops((prev) => [...prev, workshop])
				toast.success("Đã thêm trải nghiệm mới")
			}
			setShowWorkshopModal(false)
			setEditingWorkshop(null)
		},
		[editingWorkshop],
	)

	const handleSkipWorkshops = useCallback(() => {
		setStep("complete")
	}, [])

	const handleCompleteRegistration = useCallback(async () => {
		if (!craftVillageData) return

		setIsSubmitting(true)
		try {
			// Submit craft village data with workshops
			const applicationData = {
				craftVillage: craftVillageData,
				workshops: workshops.map((w) => ({
					name: w.name,
					description: w.description,
					content: w.content,
					startDate: w.startDate,
					endDate: w.endDate,
					adultPrice: w.adultPrice,
					childrenPrice: w.childrenPrice,
					maxParticipant: w.maxParticipant,
					activities: w.activities,
					schedules: w.schedules,
				})),
			}

			const response = await fetch("/api/craft-villages", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(applicationData),
			})

			if (!response.ok) throw new Error("Failed to register craft village")

			toast.success("Đăng ký làng nghề thành công!")
			setStep("complete")
			fetchLatest()
		} catch (error) {
			toast.error("Không thể hoàn thành đăng ký")
		} finally {
			setIsSubmitting(false)
		}
	}, [craftVillageData, workshops, fetchLatest])

	const renderCraftVillageStep = () => (
		<CraftVillageForm onComplete={handleCraftVillageComplete} fetchLatest={fetchLatest} />
	)

	const renderWorkshopsStep = () => (
		<div className="space-y-6">
			{/* Header */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Workshop className="h-5 w-5 text-purple-600" />
						Trải nghiệm (Tùy chọn)
					</CardTitle>
					<p className="text-sm text-muted-foreground">
						Bạn có muốn thêm trải nghiệm để khách hàng có thể đặt trực tiếp không? Điều này sẽ giúp tăng thu nhập và thu
						hút nhiều du khách hơn.
					</p>
				</CardHeader>
			</Card>

			{/* If only visiting (no workshops) */}
			{craftVillageData && !craftVillageData.workshopsAvailable ? (
				<Card>
					<CardContent className="pt-6 space-y-4">
						<p className="text-sm text-muted-foreground">
							Bạn đã chọn chỉ tham quan. Giá tham quan: <span className="font-medium text-foreground">{(craftVillageData.visitPrice || 0).toLocaleString("vi-VN")}đ</span>
						</p>
						<div className="flex gap-3 justify-end">
							<Button variant="outline" onClick={() => setStep("craft-village")}>← Quay lại thông tin</Button>
							<Button onClick={handleCompleteRegistration} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
								{isSubmitting ? "Đang gửi..." : "Hoàn thành đăng ký"}
							</Button>
						</div>
					</CardContent>
				</Card>
			) : (
				<>
					{/* Workshops List */}
					{workshops.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Trải nghiệm đã thêm ({workshops.length})</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{workshops.map((workshop) => (
									<div
										key={workshop.id}
										className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
									>
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-2">
												<h4 className="font-medium">{workshop.name}</h4>
												<Badge
													variant={workshop.status === "ready" ? "default" : "secondary"}
													className={cn(
														workshop.status === "ready" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700",
													)}
												>
													{workshop.status === "ready" ? "Sẵn sàng" : "Nháp"}
												</Badge>
											</div>
											<p className="text-sm text-muted-foreground mb-2">{workshop.description}</p>
											<div className="flex items-center gap-4 text-xs text-muted-foreground">
												<span>📅 {new Date(workshop.startDate).toLocaleDateString("vi-VN")}</span>
												<span>🎯 {workshop.activitiesCount} hoạt động</span>
												<span>📋 {workshop.schedulesCount} lịch/tuần</span>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<Button size="sm" variant="outline" onClick={() => handleEditWorkshop(workshop)}>
												<Edit3 className="h-4 w-4" />
											</Button>
											<Button
												size="sm"
												variant="outline"
												onClick={() => handleDeleteWorkshop(workshop.id)}
												className="text-red-600 hover:text-red-700"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>
								))}
							</CardContent>
						</Card>
					)}

					{/* Add Workshop Button */}
					<Card>
						<CardContent className="pt-6">
							<div className="text-center space-y-4">
								<Button onClick={handleAddWorkshop} className="w-full md:w-auto" size="lg">
									<Plus className="h-5 w-5 mr-2" />
									{workshops.length === 0 ? "Thêm trải nghiệm đầu tiên" : "Thêm trải nghiệm khác"}
								</Button>
								<p className="text-sm text-muted-foreground">
									Trải nghiệm giúp du khách trải nghiệm trực tiếp nghề truyền thống
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Navigation */}
					<Card>
						<CardContent className="pt-6">
							<div className="flex flex-col md:flex-row gap-3 justify-between">
								<Button variant="outline" onClick={() => setStep("craft-village")}>← Quay lại thông tin làng nghề</Button>

								<div className="flex gap-3">
									<Button variant="outline" onClick={handleSkipWorkshops}>Bỏ qua trải nghiệm</Button>
									<Button onClick={handleCompleteRegistration} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
										{isSubmitting ? "Đang gửi..." : "Hoàn thành đăng ký"}
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</>
			)}
		</div>
	)

	const renderCompleteStep = () => (
		<Card>
			<CardContent className="pt-6">
				<div className="text-center space-y-4">
					<CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
					<h3 className="text-xl font-semibold">Đăng ký thành công!</h3>
					<p className="text-muted-foreground max-w-md mx-auto">
						Cảm ơn bạn đã đăng ký làng nghề{workshops.length > 0 && ` cùng với ${workshops.length} trải nghiệm`}. Chúng
						tôi sẽ xem xét và phản hồi trong thời gian sớm nhất.
					</p>
					{workshops.length > 0 && (
						<div className="bg-blue-50 rounded-lg p-4 mt-4">
							<p className="text-sm text-blue-700">
								<strong>Bonus:</strong> Bạn đã thêm {workshops.length} trải nghiệm! Điều này sẽ giúp tăng cơ hội được
								duyệt và thu hút nhiều khách hàng hơn.
							</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	)

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* Progress Indicator */}
			<Card>
				<CardContent className="pt-6">
					<div className="flex items-center justify-center gap-4">
						<div className="flex items-center gap-2">
							<div
								className={cn(
									"w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
									step === "craft-village" ? "bg-blue-500 text-white" : "bg-green-500 text-white",
								)}
							>
								{step === "craft-village" ? "1" : <CheckCircle className="w-5 h-5" />}
							</div>
							<span className="text-sm font-medium">Thông tin làng nghề</span>
						</div>

						<div className="w-12 h-px bg-gray-300" />

						<div className="flex items-center gap-2">
							<div
								className={cn(
									"w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
									step === "workshops"
										? "bg-blue-500 text-white"
										: step === "complete"
											? "bg-green-500 text-white"
											: "bg-gray-200 text-gray-500",
								)}
							>
								{step === "complete" ? <CheckCircle className="w-5 h-5" /> : "2"}
							</div>
							<span className="text-sm font-medium">Trải nghiệm (Tùy chọn)</span>
						</div>

						<div className="w-12 h-px bg-gray-300" />

						<div className="flex items-center gap-2">
							<div
								className={cn(
									"w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
									step === "complete" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500",
								)}
							>
								{step === "complete" ? <CheckCircle className="w-5 h-5" /> : "3"}
							</div>
							<span className="text-sm font-medium">Hoàn thành</span>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Step Content */}
			{step === "craft-village" && renderCraftVillageStep()}
			{step === "workshops" && renderWorkshopsStep()}
			{step === "complete" && renderCompleteStep()}

			{/* Workshop Creation Modal */}
			{showWorkshopModal && (
				<WorkshopCreationModal
					isOpen={showWorkshopModal}
					onClose={() => {
						setShowWorkshopModal(false)
						setEditingWorkshop(null)
					}}
					onSave={handleWorkshopSaved}
					editingWorkshop={editingWorkshop}
				/>
			)}
		</div>
	)
}
