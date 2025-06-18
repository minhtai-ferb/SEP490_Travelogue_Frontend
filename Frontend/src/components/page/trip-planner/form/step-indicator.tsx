"use client"

import { motion } from "framer-motion"
import { CheckCircle2, type LucideIcon } from 'lucide-react'
import { cn } from "@/lib/utils"

interface Step {
	id: number
	title: string
	icon: LucideIcon
	description: string
}

interface StepIndicatorProps {
	steps: Step[]
	currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
	return (
		<div className="flex justify-between">
			{steps.map((step, index) => {
				const isCompleted = currentStep > step.id
				const isCurrent = currentStep === step.id
				const IconComponent = isCompleted ? CheckCircle2 : step.icon

				return (
					<div key={step.id} className="flex flex-col items-center flex-1">
						<div className="flex items-center w-full">
							{index > 0 && (
								<div
									className={cn(
										"flex-1 h-0.5 transition-colors duration-300",
										isCompleted ? "bg-green-500" : "bg-gray-200"
									)}
								/>
							)}

							<motion.div
								initial={false}
								animate={{
									scale: isCurrent ? 1.1 : 1,
									backgroundColor: isCompleted
										? "#10b981"
										: isCurrent
											? "#3b82f6"
											: "#e5e7eb"
								}}
								className={cn(
									"flex items-center justify-center w-12 h-12 rounded-full mx-2 transition-colors duration-300",
									isCompleted && "text-white",
									isCurrent && "text-white",
									!isCompleted && !isCurrent && "text-gray-400"
								)}
							>
								<IconComponent className="h-5 w-5" />
							</motion.div>

							{index < steps.length - 1 && (
								<div
									className={cn(
										"flex-1 h-0.5 transition-colors duration-300",
										currentStep > step.id + 1 ? "bg-green-500" : "bg-gray-200"
									)}
								/>
							)}
						</div>

						<div className="text-center mt-3">
							<div
								className={cn(
									"text-sm font-medium transition-colors duration-300",
									isCurrent ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-400"
								)}
							>
								{step.title}
							</div>
							<div className="text-xs text-gray-500 mt-1 hidden sm:block">
								{step.description}
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}
