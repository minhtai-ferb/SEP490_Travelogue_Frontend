"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Progress } from "@heroui/react"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Calendar, MapPin, Sparkles } from 'lucide-react'
import type { TripPlan } from "@/types/Tripplan"
import { BasicInfoStep } from "./step/basic-info-step"
import { DestinationStep } from "./step/destination-step"
import { PreferencesStep } from "./step/preferences-step"
import { StepIndicator } from "./step-indicator"

interface TripPlanningWizardProps {
	onPlanCreated: (plan: TripPlan) => void
}

export default function TripPlanningWizard({ onPlanCreated }: TripPlanningWizardProps) {
	const [currentStep, setCurrentStep] = useState(1)
	const [formData, setFormData] = useState({
		date: new Date(),
		duration: 1,
		travelers: 2,
		budget: [500000] as [number],
		selectedDestinations: [],
		selectedRestaurants: [],
		selectedCraftVillages: [],
		preferences: "",
		useAI: false,
	})

	const steps = [
		{ id: 1, title: "Thông tin cơ bản", icon: Calendar, description: "Ngày và ngân sách" },
		{ id: 2, title: "Chọn điểm đến", icon: MapPin, description: "Địa điểm yêu thích" },
		{ id: 3, title: "Hoàn thiện", icon: Sparkles, description: "Tùy chỉnh và AI" },
	]

	const updateFormData = (data: Partial<typeof formData>) => {
		setFormData(prev => ({ ...prev, ...data }))
	}

	const handleNext = () => {
		setCurrentStep(prev => Math.min(prev + 1, 3))
	}

	const handleBack = () => {
		setCurrentStep(prev => Math.max(prev - 1, 1))
	}

	const handleComplete = (plan: TripPlan) => {
		onPlanCreated(plan)
	}

	const progress = (currentStep / 3) * 100

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="text-center mb-8">
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4"
					>
						<Sparkles className="h-4 w-4" />
						Lên kế hoạch thông minh
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
					>
						Tạo chuyến du lịch hoàn hảo
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="text-xl text-gray-600 max-w-2xl mx-auto"
					>
						Khám phá vẻ đẹp Tây Ninh với lịch trình được cá nhân hóa chỉ trong vài phút
					</motion.p>
				</div>

				{/* Progress Bar */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.3 }}
					className="max-w-4xl mx-auto mb-8"
				>
					<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
						<div className="flex justify-between items-center mb-4">
							<span className="text-sm font-medium text-gray-500">
								Bước {currentStep} / {steps.length}
							</span>
							<Badge variant="secondary" className="bg-blue-100 text-blue-700">
								{Math.round(progress)}% hoàn thành
							</Badge>
						</div>
						<Progress value={progress} className="h-2 mb-6" />
						<StepIndicator steps={steps} currentStep={currentStep} />
					</div>
				</motion.div>

				{/* Form Content */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="max-w-4xl mx-auto"
				>
					<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
						<div className="p-8 md:p-12">
							<AnimatePresence mode="wait">
								{currentStep === 1 && (
									<BasicInfoStep
										key="basic-info"
										formData={formData}
										updateFormData={updateFormData}
										onNext={handleNext}
									/>
								)}

								{currentStep === 2 && (
									<DestinationStep
										key="destinations"
										formData={formData}
										updateFormData={updateFormData}
										onNext={handleNext}
										onBack={handleBack}
									/>
								)}

								{currentStep === 3 && (
									<PreferencesStep
										key="preferences"
										formData={formData}
										updateFormData={updateFormData}
										onBack={handleBack}
										onComplete={handleComplete}
									/>
								)}
							</AnimatePresence>
						</div>
					</Card>
				</motion.div>

				{/* Features */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
					className="max-w-6xl mx-auto mt-16 grid md:grid-cols-3 gap-8"
				>
					{[
						{
							icon: "🎯",
							title: "Cá nhân hóa",
							description: "Lịch trình được tùy chỉnh theo sở thích của bạn"
						},
						{
							icon: "🤖",
							title: "AI thông minh",
							description: "Tối ưu hóa tuyến đường và thời gian di chuyển"
						},
						{
							icon: "💎",
							title: "Trải nghiệm cao cấp",
							description: "Khám phá những điểm đến độc đáo và ẩm thực đặc sắc"
						}
					].map((feature, index) => (
						<div key={index} className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm">
							<div className="text-4xl mb-4">{feature.icon}</div>
							<h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
							<p className="text-gray-600">{feature.description}</p>
						</div>
					))}
				</motion.div>
			</div>
		</div>
	)
}
