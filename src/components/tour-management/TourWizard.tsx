"use client"
import { useState, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, X, AlertCircle } from "lucide-react"
import { TourBasicForm } from "./wizard/TourBasicForm"
import { TourScheduleForm } from "./wizard/TourScheduleForm"
import { TourLocationForm } from "./wizard/TourLocationForm"
import type { CreateTourBasicRequest, ScheduleFormData, TourLocationRequest } from "@/types/Tour"
import { useTour } from "@/services/tour"

interface TourWizardProps {
	isOpen: boolean
	onClose: () => void
	onComplete: () => void
}

interface WizardStep {
	id: number
	title: string
	description: string
	completed: boolean
}

export function TourWizard({ isOpen, onClose, onComplete }: TourWizardProps) {
	const [currentStep, setCurrentStep] = useState(1)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState("")
	const [createdTourId, setCreatedTourId] = useState<string | null>(null)
	const { createTour, createTourSchedule, createTourBulk } = useTour()

	// Form data states
	const [basicData, setBasicData] = useState<CreateTourBasicRequest | null>(null)
	const [scheduleData, setScheduleData] = useState<ScheduleFormData[]>([])
	const [locationData, setLocationData] = useState<TourLocationRequest[]>([])

	const steps: WizardStep[] = [
		{
			id: 1,
			title: "Thông tin cơ bản",
			description: "Tạo tour với thông tin cơ bản",
			completed: basicData !== null,
		},
		{
			id: 2,
			title: "Lịch trình tour",
			description: "Thêm các lịch trình khởi hành",
			completed: scheduleData.length > 0,
		},
		{
			id: 3,
			title: "Địa điểm tham quan",
			description: "Thêm các địa điểm trong tour",
			completed: locationData.length > 0,
		},
	]

	const handleReset = useCallback(() => {
		setCurrentStep(1)
		setBasicData(null)
		setScheduleData([])
		setLocationData([])
		setCreatedTourId(null)
		setError("")
	}, [])

	const handleClose = useCallback(() => {
		handleReset()
		onClose()
	}, [handleReset, onClose])

	const handleBasicFormSubmit = useCallback(async (data: CreateTourBasicRequest) => {
		try {
			setIsLoading(true)
			setError("")

			// Call API to create basic tour
			const response = await createTour(data)
			setCreatedTourId(response?.tourId)
			setBasicData(data)
			setCurrentStep(2)
		} catch (error) {
			console.error("Error creating basic tour:", error)
			setError("Có lỗi khi tạo tour cơ bản. Vui lòng thử lại.")
		} finally {
			setIsLoading(false)
		}
	}, [])

	const handleScheduleFormSubmit = useCallback(
		async (data: ScheduleFormData[]) => {
			if (!createdTourId) {
				setError("Không tìm thấy ID tour")
				return
			}

			try {
				setIsLoading(true)
				setError("")

				// Call API to create schedules
				const response = await createTourSchedule(createdTourId, data)
				if (!response) {
					throw new Error("Không thể tạo lịch trình")
				}
				setScheduleData(data)
				setCurrentStep(3)
			} catch (error) {
				console.error("Error creating schedules:", error)
				setError("Có lỗi khi tạo lịch trình. Vui lòng thử lại.")
			} finally {
				setIsLoading(false)
			}
		},
		[createdTourId],
	)

	const handleLocationFormSubmit = useCallback(
		async (data: TourLocationRequest[]) => {
			if (!createdTourId) {
				setError("Không tìm thấy ID tour")
				return
			}

			try {
				setIsLoading(true)
				setError("")

				// Call API to bulk update locations
				// const response = await fetch(`/api/tour/bulk?tourId=${createdTourId}`, {
				// 	method: "POST",
				// 	headers: {
				// 		"Content-Type": "application/json",
				// 	},
				// 	body: JSON.stringify(data),
				// })

				// if (!response.ok) {
				// 	throw new Error("Không thể cập nhật địa điểm")
				// }

				const response = await createTourBulk(createdTourId, data)
				if (!response) {
					throw new Error("Không thể cập nhật địa điểm")
				}

				setLocationData(data)
				// Tour creation completed
				onComplete()
				handleClose()
			} catch (error) {
				console.error("Error updating locations:", error)
				setError("Có lỗi khi cập nhật địa điểm. Vui lòng thử lại.")
			} finally {
				setIsLoading(false)
			}
		},
		[createdTourId, onComplete, handleClose],
	)

	const handlePrevious = useCallback(() => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1)
		}
	}, [currentStep])

	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return <TourBasicForm initialData={basicData} onSubmit={handleBasicFormSubmit} isLoading={isLoading} />
			case 2:
				return (
					<TourScheduleForm
						initialData={scheduleData}
						totalDays={basicData?.totalDays || 1}
						onSubmit={handleScheduleFormSubmit}
						onPrevious={handlePrevious}
						isLoading={isLoading}
					/>
				)
			case 3:
				return (
					<TourLocationForm
						initialData={locationData}
						totalDays={basicData?.totalDays || 1}
						onSubmit={handleLocationFormSubmit}
						onPrevious={handlePrevious}
						isLoading={isLoading}
					/>
				)
			default:
				return null
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
				<DialogHeader className="space-y-4">
					<div className="flex items-center justify-between">
						<DialogTitle className="text-2xl font-bold">Tạo Tour Mới</DialogTitle>
						<Button variant="ghost" size="sm" onClick={handleClose}>
							<X className="h-4 w-4" />
						</Button>
					</div>

					{/* Progress Bar */}
					<div className="w-full space-y-4">
						<Progress value={(currentStep / steps.length) * 100} className="w-full" />

						{/* Step Indicators */}
						<div className="flex justify-between items-center">
							{steps.map((step, index) => (
								<div key={step.id} className="flex items-center">
									<div className="flex flex-col items-center">
										<div
											className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${step.completed
												? "bg-green-500 text-white border-green-500"
												: currentStep === step.id
													? "bg-blue-500 text-white border-blue-500"
													: "bg-gray-100 text-gray-400 border-gray-300"
												}`}
										>
											{step.completed ? (
												<CheckCircle className="w-5 h-5" />
											) : (
												<span className="text-sm font-semibold">{step.id}</span>
											)}
										</div>
										<div className="mt-2 text-center">
											<p className="text-sm font-medium">{step.title}</p>
											<p className="text-xs text-gray-500">{step.description}</p>
										</div>
									</div>
									{index < steps.length - 1 && <div className="flex-1 h-0.5 bg-gray-200 mx-4 mt-[-20px]" />}
								</div>
							))}
						</div>
					</div>
				</DialogHeader>

				<div className="px-6">
					{error && (
						<Alert className="mb-4 border-red-200 bg-red-50">
							<div className="flex items-center align-middle gap-3">
								<AlertCircle className="h-6 w-6 text-red-600" />
								<AlertDescription className="text-red-800 font-semibold">{error}</AlertDescription>
							</div>
						</Alert>
					)}

					<Card>
						<CardContent className="p-6">{renderStepContent()}</CardContent>
					</Card>
				</div>
			</DialogContent>
		</Dialog>
	)
}
