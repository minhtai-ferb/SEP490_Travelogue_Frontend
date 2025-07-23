"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { CalendarIcon, Users, Clock, Wallet, ArrowRight } from 'lucide-react'

interface BasicInfoStepProps {
	formData: any
	updateFormData: (data: any) => void
	onNext: () => void
}

export function BasicInfoStep({ formData, updateFormData, onNext }: BasicInfoStepProps) {
	const { date, duration, travelers, budget } = formData

	return (
		<motion.div
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			className="space-y-8"
		>
			<div className="text-center mb-8">
				<h2 className="text-3xl font-bold text-gray-900 mb-2">
					Hãy bắt đầu với thông tin cơ bản
				</h2>
				<p className="text-gray-600">
					Cho chúng tôi biết kế hoạch du lịch của bạn
				</p>
			</div>

			<div className="grid md:grid-cols-2 gap-8">
				{/* Date Selection */}
				<div className="space-y-3">
					<Label className="text-lg font-medium flex items-center gap-2">
						<CalendarIcon className="h-5 w-5 text-blue-500" />
						Ngày bắt đầu
					</Label>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className={cn(
									"w-full justify-start text-left font-normal h-14 text-base border-2 hover:border-blue-300 transition-colors",
									!date && "text-muted-foreground"
								)}
							>
								<CalendarIcon className="mr-3 h-5 w-5" />
								{date ? format(date, "PPP", { locale: vi }) : <span>Chọn ngày</span>}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<Calendar
								mode="single"
								selected={date}
								onSelect={(newDate) => updateFormData({ date: newDate })}
								initialFocus
								locale={vi}
							/>
						</PopoverContent>
					</Popover>
				</div>

				{/* Duration */}
				<div className="space-y-3">
					<Label className="text-lg font-medium flex items-center gap-2">
						<Clock className="h-5 w-5 text-blue-500" />
						Số ngày du lịch
					</Label>
					<div className="flex items-center justify-center space-x-6 bg-gray-50 rounded-xl p-4">
						<Button
							variant="outline"
							size="icon"
							className="h-12 w-12 rounded-full"
							onClick={() => updateFormData({ duration: Math.max(1, duration - 1) })}
						>
							-
						</Button>
						<div className="text-center">
							<div className="text-3xl font-bold text-blue-600">{duration}</div>
							<div className="text-sm text-gray-500">ngày</div>
						</div>
						<Button
							variant="outline"
							size="icon"
							className="h-12 w-12 rounded-full"
							onClick={() => updateFormData({ duration: Math.min(10, duration + 1) })}
						>
							+
						</Button>
					</div>
				</div>

				{/* Travelers */}
				<div className="space-y-3">
					<Label className="text-lg font-medium flex items-center gap-2">
						<Users className="h-5 w-5 text-blue-500" />
						Số người tham gia
					</Label>
					<div className="flex items-center justify-center space-x-6 bg-gray-50 rounded-xl p-4">
						<Button
							variant="outline"
							size="icon"
							className="h-12 w-12 rounded-full"
							onClick={() => updateFormData({ travelers: Math.max(1, travelers - 1) })}
						>
							-
						</Button>
						<div className="text-center">
							<div className="text-3xl font-bold text-blue-600">{travelers}</div>
							<div className="text-sm text-gray-500">người</div>
						</div>
						<Button
							variant="outline"
							size="icon"
							className="h-12 w-12 rounded-full"
							onClick={() => updateFormData({ travelers: Math.min(20, travelers + 1) })}
						>
							+
						</Button>
					</div>
				</div>

				{/* Budget */}
				<div className="space-y-3">
					<Label className="text-lg font-medium flex items-center gap-2">
						<Wallet className="h-5 w-5 text-blue-500" />
						Ngân sách (VND/người)
					</Label>
					<div className="bg-gray-50 rounded-xl p-6 space-y-4">
						<Slider
							value={budget}
							max={5000000}
							step={100000}
							onValueChange={(value) => updateFormData({ budget: value as [number] })}
							className="w-full"
						/>
						<div className="flex justify-between items-center">
							<span className="text-sm text-gray-500">0đ</span>
							<div className="text-center">
								<div className="text-2xl font-bold text-blue-600">
									{budget[0].toLocaleString("vi-VN")}đ
								</div>
								<div className="text-sm text-gray-500">mỗi người</div>
							</div>
							<span className="text-sm text-gray-500">5.000.000đ</span>
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-end pt-6">
				<Button
					onClick={onNext}
					size="lg"
					className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
				>
					Tiếp theo
					<ArrowRight className="ml-2 h-5 w-5" />
				</Button>
			</div>
		</motion.div>
	)
}
