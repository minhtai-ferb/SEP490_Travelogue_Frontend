"use client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useTour } from "@/services/tour"
import type { CreateTourRequest, ScheduleFormData, TourLocationBulkRequest } from "@/types/Tour"
import { AlertTriangle, CheckCircle, Circle } from "lucide-react"
import { useState } from "react"
import { TourBasicForm } from "./wizard/TourBasicForm"
import { TourLocationForm } from "./wizard/TourLocationForm"
import { TourScheduleForm } from "./wizard/TourScheduleForm"

interface TourWizardProps {
	onComplete: () => void
	onCancel: () => void
}

const steps = [
	{
		id: 1,
		title: "Thông Tin Cơ Bản",
		description: "Tạo tour với thông tin cơ bản",
	},
	{
		id: 2,
		title: "Địa Điểm Tour",
		description: "Cập nhật địa điểm tham quan",
	},
	{
		id: 3,
		title: "Lịch Trình Tour",
		description: "Thêm các lịch trình khởi hành",
	},
]

export function TourWizard({ onComplete, onCancel }: TourWizardProps) {
	const [currentStep, setCurrentStep] = useState(1)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState("")
	const [createdTourId, setCreatedTourId] = useState<string | null>(null)

	const [basicInfo, setBasicInfo] = useState<CreateTourRequest | null>(null)
	const [schedules, setSchedules] = useState<ScheduleFormData[]>([])
	const [locationsState, setLocationsState] = useState<TourLocationBulkRequest[]>([])

	const { createTour, createTourSchedule, createTourBulk } = useTour()

	const progress = (currentStep / steps.length) * 100

	const handleNext = () => {
		if (currentStep < steps.length) {
			setCurrentStep(currentStep + 1)
		}
	}

	const handlePrevious = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1)
		}
	}

	const handleBasicInfoSubmit = async (data: CreateTourRequest) => {
		try {
			setIsLoading(true)
			setError("")

			// Step 1: Create basic tour
			const response = await createTour(data)

			if (response && typeof (response as any).tourId === "string") {
				setCreatedTourId((response as any).tourId)
				setBasicInfo(data)
				handleNext()
			} else {
				throw new Error("Failed to create tour")
			}
		} catch (error: any) {
			console.error("Error creating tour:", error)
			setError(error.message || "Có lỗi khi tạo tour cơ bản")
		} finally {
			setIsLoading(false)
		}
	}

	const handleScheduleSubmit = async (data: ScheduleFormData[]) => {
		if (!createdTourId) {
			setError("Không tìm thấy ID tour")
			return
		}

		try {
			setIsLoading(true)
			setError("")

			// Step 3 (final): Create tour schedules
			await createTourSchedule(createdTourId, data)
			setSchedules(data)
			// Tour creation completed
			onComplete()
		} catch (error: any) {
			console.error("Error creating schedules:", error)
			setError(error.message || "Có lỗi khi tạo lịch trình tour")
		} finally {
			setIsLoading(false)
		}
	}

	const handleLocationSubmit = async (data: TourLocationBulkRequest[]) => {
		if (!createdTourId) {
			setError("Không tìm thấy ID tour")
			return
		}

		try {
			setIsLoading(true)
			setError("")

			// Step 2: Bulk update tour locations
			// Persist locally to keep state when navigating back-and-forth
			setLocationsState(data)
			await createTourBulk(createdTourId, data)
			// Proceed to next step (schedules)
			handleNext()
		} catch (error: any) {
			console.error("Error updating locations:", error)
			setError(error.message || "Có lỗi khi cập nhật địa điểm tour")
		} finally {
			setIsLoading(false)
		}
	}

	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return (
					<TourBasicForm
						initialData={basicInfo}
						onSubmit={handleBasicInfoSubmit}
						onCancel={onCancel}
						isLoading={isLoading}
					/>
				)
			case 2:
				return (
					<TourLocationForm
						tourId={createdTourId!}
						tourDays={basicInfo?.totalDays || 1}
						initialData={locationsState}
						onSubmit={handleLocationSubmit}
						onPrevious={handlePrevious}
						onCancel={onCancel}
						isLoading={isLoading}
					/>
				)
			case 3:
				return (
					<TourScheduleForm
						initialData={schedules}
						tourDays={basicInfo?.totalDays || 1}
						onChange={(data) => setSchedules(data)}
						onSubmit={handleScheduleSubmit}
						onPrevious={handlePrevious}
						onCancel={onCancel}
						isLoading={isLoading}
					/>
				)
			default:
				return null

		}
	}

	return (
		<div className="space-y-8">
			{/* Progress Header */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold">
						Bước {currentStep} của {steps.length}
					</h2>
					<span className="text-sm text-gray-500">{Math.round(progress)}% hoàn thành</span>
				</div>

				<Progress value={progress} className="h-2" />

				{/* Step Indicators */}
				<div className="flex items-center justify-between">
					{steps.map((step, index) => (
						<div key={step.id} className="flex items-center">
							<div className="flex flex-col items-center">
								<div
									className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep > step.id
										? "bg-green-500 border-green-500 text-white"
										: currentStep === step.id
											? "bg-blue-500 border-blue-500 text-white"
											: "bg-white border-gray-300 text-gray-400"
										}`}
								>
									{currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
								</div>
								<div className="mt-2 text-center">
									<p className={`text-sm font-medium ${currentStep >= step.id ? "text-gray-900" : "text-gray-400"}`}>
										{step.title}
									</p>
									<p className="text-xs text-gray-500 max-w-32">{step.description}</p>
								</div>
							</div>
							{index < steps.length - 1 && (
								<div className={`flex-1 h-0.5 mx-4 ${currentStep > step.id ? "bg-green-500" : "bg-gray-200"}`} />
							)}
						</div>
					))}
				</div>
			</div>

			{/* Error Alert */}
			{error && (
				<Alert className="border-red-200 bg-red-50">
					<AlertTriangle className="h-4 w-4 text-red-600" />
					<AlertDescription className="text-red-800">{error}</AlertDescription>
				</Alert>
			)}

			{/* Step Content */}
			<div className="min-h-[500px]">{renderStepContent()}</div>
		</div>
	)
}
