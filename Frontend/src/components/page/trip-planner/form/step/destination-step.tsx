"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Utensils, Briefcase, ArrowLeft, ArrowRight, X, Loader2, CheckCircle2 } from 'lucide-react'
import DestinationSelector from "../../destination-selector"
import { TripPlan } from "@/types/Tripplan"
import { useState } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface DestinationStepProps {
	formData: any
	updateFormData: (data: any) => void
	onComplete: (plan: TripPlan) => void
	onBack: () => void
}

export function DestinationStep({ formData, updateFormData, onComplete, onBack }: DestinationStepProps) {
	const { selectedDestinations, selectedRestaurants, selectedCraftVillages } = formData
	const [isGenerating, setIsGenerating] = useState(false)

	const {
		preferences,
		useAI,
		date,
		duration,
		budget,
		travelers,
	} = formData

	const handleSubmit = async () => {
		try {
			setIsGenerating(true)
			// Simulate AI processing
			await new Promise((resolve) => setTimeout(resolve, 3000))
			setIsGenerating(false)
		} catch (error) {
			console.error("Error generating trip plan:", error)
			setIsGenerating(false)
			return
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
			itinerary: generateSampleItinerary(),
			preferences: preferences,
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

	const removeDestination = (id: string) => {
		updateFormData({
			selectedDestinations: selectedDestinations.filter((dest: any) => dest.id !== id)
		})
	}

	const removeRestaurant = (id: string) => {
		updateFormData({
			selectedRestaurants: selectedRestaurants.filter((rest: any) => rest.id !== id)
		})
	}

	const removeCraftVillage = (id: string) => {
		updateFormData({
			selectedCraftVillages: selectedCraftVillages.filter((village: any) => village.id !== id)
		})
	}

	return (
		<motion.div
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			className="space-y-8"
		>
			<div className="text-center mb-8">
				<h2 className="text-3xl font-bold text-gray-900 mb-2">
					Chọn điểm đến yêu thích
				</h2>
				<p className="text-gray-600">
					Tùy chỉnh chuyến du lịch theo sở thích của bạn
				</p>
			</div>

			<div className="space-y-8">
				{/* Tourist Destinations */}
				<div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
					<div className="flex items-center justify-between mb-4">
						<Label className="text-xl font-semibold flex items-center gap-3">
							<div className="p-2 bg-blue-100 rounded-lg">
								<MapPin className="h-6 w-6 text-blue-600" />
							</div>
							Điểm du lịch
						</Label>
						<Badge variant="secondary" className="bg-blue-100 text-blue-700 px-3 py-1">
							{selectedDestinations.length} đã chọn
						</Badge>
					</div>

					<DestinationSelector
						type="destination"
						onSelect={(location) =>
							updateFormData({
								selectedDestinations: [...selectedDestinations, location]
							})
						}
					/>

					{selectedDestinations.length > 0 && (
						<div className="mt-6">
							<div className="flex flex-wrap gap-3">
								{selectedDestinations.map((dest: any) => (
									<motion.div
										key={dest.id}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										className="bg-white rounded-xl px-4 py-2 shadow-sm border flex items-center gap-2"
									>
										<span className="font-medium">{dest.name}</span>
										<Button
											variant="ghost"
											size="icon"
											className="h-6 w-6 rounded-full hover:bg-red-100 hover:text-red-600"
											onClick={() => removeDestination(dest.id)}
										>
											<X className="h-4 w-4" />
										</Button>
									</motion.div>
								))}
							</div>
						</div>
					)}
				</div>

				<Separator className="my-8" />

				{/* Restaurants */}
				<div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6">
					<div className="flex items-center justify-between mb-4">
						<Label className="text-xl font-semibold flex items-center gap-3">
							<div className="p-2 bg-orange-100 rounded-lg">
								<Utensils className="h-6 w-6 text-orange-600" />
							</div>
							Nhà hàng & Quán ăn
						</Label>
						<Badge variant="secondary" className="bg-orange-100 text-orange-700 px-3 py-1">
							{selectedRestaurants.length} đã chọn
						</Badge>
					</div>

					<DestinationSelector
						type="restaurant"
						onSelect={(location) =>
							updateFormData({
								selectedRestaurants: [...selectedRestaurants, location]
							})
						}
					/>

					{selectedRestaurants.length > 0 && (
						<div className="mt-6">
							<div className="flex flex-wrap gap-3">
								{selectedRestaurants.map((rest: any) => (
									<motion.div
										key={rest.id}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										className="bg-white rounded-xl px-4 py-2 shadow-sm border flex items-center gap-2"
									>
										<span className="font-medium">{rest.name}</span>
										<Button
											variant="ghost"
											size="icon"
											className="h-6 w-6 rounded-full hover:bg-red-100 hover:text-red-600"
											onClick={() => removeRestaurant(rest.id)}
										>
											<X className="h-4 w-4" />
										</Button>
									</motion.div>
								))}
							</div>
						</div>
					)}
				</div>

				<Separator className="my-8" />

				{/* Craft Villages */}
				<div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
					<div className="flex items-center justify-between mb-4">
						<Label className="text-xl font-semibold flex items-center gap-3">
							<div className="p-2 bg-green-100 rounded-lg">
								<Briefcase className="h-6 w-6 text-green-600" />
							</div>
							Làng nghề truyền thống
						</Label>
						<Badge variant="secondary" className="bg-green-100 text-green-700 px-3 py-1">
							{selectedCraftVillages.length} đã chọn
						</Badge>
					</div>

					<DestinationSelector
						type="craftVillage"
						onSelect={(location) =>
							updateFormData({
								selectedCraftVillages: [...selectedCraftVillages, location]
							})
						}
					/>

					{selectedCraftVillages.length > 0 && (
						<div className="mt-6">
							<div className="flex flex-wrap gap-3">
								{selectedCraftVillages.map((village: any) => (
									<motion.div
										key={village.id}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										className="bg-white rounded-xl px-4 py-2 shadow-sm border flex items-center gap-2"
									>
										<span className="font-medium">{village.name}</span>
										<Button
											variant="ghost"
											size="icon"
											className="h-6 w-6 rounded-full hover:bg-red-100 hover:text-red-600"
											onClick={() => removeCraftVillage(village.id)}
										>
											<X className="h-4 w-4" />
										</Button>
									</motion.div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			<div className="flex justify-between pt-6">
				<Button
					variant="outline"
					onClick={onBack}
					size="lg"
					className="px-8 py-3 rounded-xl font-medium"
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
							{useAI ? "AI đang tạo lịch trình..." : "Đang xử lý..."}
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
