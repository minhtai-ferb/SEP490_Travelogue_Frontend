"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { ArrowLeft, Loader2, Sparkles, Wand2, CheckCircle2 } from "lucide-react"
import type { TripPlan } from "@/types/Tripplan"

interface PreferencesStepProps {
	formData: any
	updateFormData: (data: any) => void
	onBack: () => void
	onComplete: (plan: TripPlan) => void
}

export function PreferencesStep({ formData, updateFormData, onBack, onComplete }: PreferencesStepProps) {
	const [isGenerating, setIsGenerating] = useState(false)
	const {
		preferences,
		useAI,
		date,
		duration,
		selectedDestinations,
		selectedRestaurants,
		selectedCraftVillages,
		budget,
		travelers,
	} = formData

	const handleSubmit = async () => {
		if (useAI) {
			setIsGenerating(true)
			// Simulate AI processing
			await new Promise((resolve) => setTimeout(resolve, 3000))
			setIsGenerating(false)
		}

		// Create the trip plan
		const plan: TripPlan = {
			id: `trip-${Date.now()}`,
			title: `Chuyến du lịch Tây Ninh - ${format(date || new Date(), "dd/MM/yyyy", { locale: vi })}`,
			startDate: date || new Date(),
			duration: duration,
			destinations: selectedDestinations,
			restaurants: selectedRestaurants,
			craftVillages: selectedCraftVillages,
			budget: budget[0],
			travelers: travelers,
			preferences: preferences,
			itinerary: generateSampleItinerary(),
			tourguide: undefined,
		}

		onComplete(plan)
	}

	const generateSampleItinerary = () => {
		// This would be replaced with actual AI-generated content
		const days = []
		for (let i = 0; i < duration; i++) {
			days.push({
				day: i + 1,
				activities: [
					{
						time: "08:00",
						title: i === 0 ? "Khởi hành" : "Bắt đầu ngày mới",
						description: i === 0 ? "Xuất phát từ điểm tập trung" : "Ăn sáng tại khách sạn",
						location: i === 0 ? "Điểm xuất phát" : "Khách sạn",
					},
					{
						time: "09:30",
						title: selectedDestinations[i % selectedDestinations.length]?.name || "Tham quan điểm du lịch",
						description: "Khám phá và chụp ảnh tại điểm du lịch nổi tiếng",
						location: selectedDestinations[i % selectedDestinations.length]?.address || "Tây Ninh",
					},
					{
						time: "12:00",
						title: "Ăn trưa",
						description: "Thưởng thức ẩm thực địa phương",
						location: selectedRestaurants[i % Math.max(1, selectedRestaurants.length)]?.name || "Nhà hàng địa phương",
					},
				],
			})
		}
		return days
	}

	return (
		<motion.div
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			className="space-y-8"
		>
			<div className="text-center mb-8">
				<h2 className="text-3xl font-bold text-gray-900 mb-2">Hoàn thiện chuyến du lịch</h2>
				<p className="text-gray-600">Thêm sở thích cá nhân và tối ưu hóa với AI</p>
			</div>

			<div className="space-y-8">
				{/* Preferences */}
				<div className="space-y-4">
					<Label htmlFor="preferences" className="text-lg font-medium">
						Sở thích và yêu cầu đặc biệt
					</Label>
					<Textarea
						id="preferences"
						placeholder="Ví dụ: Thích khám phá ẩm thực địa phương, muốn có thời gian nghỉ ngơi giữa các điểm tham quan, ưu tiên các hoạt động ngoài trời..."
						value={preferences}
						onChange={(e) => updateFormData({ preferences: e.target.value })}
						rows={4}
						className="resize-none border-2 focus:border-blue-300 rounded-xl"
					/>
				</div>

				{/* AI Toggle */}
				<Card className="border-2 border-dashed border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-purple-100 rounded-lg">
									<Sparkles className="h-6 w-6 text-purple-600" />
								</div>
								<div>
									<Label htmlFor="use-ai" className="text-lg font-semibold">
										Tối ưu hóa với AI
									</Label>
									<p className="text-sm text-gray-600 mt-1">Để AI tạo lịch trình hoàn hảo cho bạn</p>
								</div>
							</div>
							<Switch
								id="use-ai"
								checked={useAI}
								onCheckedChange={(checked) => updateFormData({ useAI: checked })}
								className="scale-125"
							/>
						</div>

						{useAI && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								className="bg-white rounded-xl p-4 border border-purple-200"
							>
								<div className="flex items-center gap-2 text-purple-600 mb-2">
									<Wand2 className="h-4 w-4" />
									<span className="font-medium">AI sẽ tối ưu hóa:</span>
								</div>
								<ul className="text-sm text-gray-600 space-y-1">
									<li className="flex items-center gap-2">
										<CheckCircle2 className="h-4 w-4 text-green-500" />
										Tuyến đường di chuyển hiệu quả nhất
									</li>
									<li className="flex items-center gap-2">
										<CheckCircle2 className="h-4 w-4 text-green-500" />
										Thời gian tham quan phù hợp
									</li>
									<li className="flex items-center gap-2">
										<CheckCircle2 className="h-4 w-4 text-green-500" />
										Gợi ý hoạt động dựa trên sở thích
									</li>
								</ul>
							</motion.div>
						)}
					</CardContent>
				</Card>
			</div>

			<div className="flex justify-between pt-6">
				<Button
					variant="outline"
					onClick={onBack}
					size="lg"
					className="px-8 py-3 rounded-xl font-medium"
					disabled={isGenerating}
				>
					<ArrowLeft className="mr-2 h-5 w-5" />
					Quay lại
				</Button>

				<Button
					onClick={handleSubmit}
					disabled={isGenerating}
					size="lg"
					className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 min-w-[200px]"
				>
					{isGenerating ? (
						<>
							<Loader2 className="mr-2 h-5 w-5 animate-spin" />
							"Đang tạo lịch trình..."
						</>
					) : (
						<>
							<CheckCircle2 className="mr-2 h-5 w-5" />
							Hoàn thành
						</>
					)}
				</Button>
			</div>
		</motion.div>
	)
}
