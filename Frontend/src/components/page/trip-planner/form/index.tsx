"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { CalendarIcon, Loader2, MapPin, Sparkles, Utensils, Briefcase } from "lucide-react"
import type { TripPlan, TripLocation } from "@/types/Tripplan"
import DestinationSelector from "../destination-selector"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"

interface TripPlanningFormProps {
	onPlanCreated: (plan: TripPlan) => void
}

export default function TripPlanningForm({ onPlanCreated }: TripPlanningFormProps) {
	const [currentStep, setCurrentStep] = useState(1)
	const [useAI, setUseAI] = useState(false)
	const [isGenerating, setIsGenerating] = useState(false)
	const [date, setDate] = useState<Date | undefined>(new Date())
	const [duration, setDuration] = useState(1)
	const [selectedDestinations, setSelectedDestinations] = useState<TripLocation[]>([])
	const [selectedRestaurants, setSelectedRestaurants] = useState<TripLocation[]>([])
	const [selectedCraftVillages, setSelectedCraftVillages] = useState<TripLocation[]>([])
	const [preferences, setPreferences] = useState("")
	const [budget, setBudget] = useState<[number]>([500000])
	const [travelers, setTravelers] = useState(2)

	const handleNext = () => {
		setCurrentStep(currentStep + 1)
	}

	const handleBack = () => {
		setCurrentStep(currentStep - 1)
	}

	const handleSubmit = async () => {
		if (useAI) {
			setIsGenerating(true)
			// Simulate AI processing
			await new Promise((resolve) => setTimeout(resolve, 2000))
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
			isAIGenerated: useAI,
		}

		onPlanCreated(plan)
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
					{
						time: "14:00",
						title: i % 2 === 0 ? "Tham quan làng nghề" : "Tham quan điểm du lịch",
						description: i % 2 === 0 ? "Tìm hiểu về nghề truyền thống" : "Khám phá cảnh quan thiên nhiên",
						location:
							i % 2 === 0
								? selectedCraftVillages[0]?.name || "Làng nghề truyền thống"
								: selectedDestinations[(i + 1) % selectedDestinations.length]?.name || "Điểm du lịch",
					},
					{
						time: "18:00",
						title: "Ăn tối",
						description: "Thưởng thức bữa tối với đặc sản địa phương",
						location:
							selectedRestaurants[(i + 1) % Math.max(1, selectedRestaurants.length)]?.name || "Nhà hàng đặc sản",
					},
				],
			})
		}
		return days
	}

	const removeDestination = (id: string) => {
		setSelectedDestinations(selectedDestinations.filter((dest) => dest.id !== id))
	}

	const removeRestaurant = (id: string) => {
		setSelectedRestaurants(selectedRestaurants.filter((rest) => rest.id !== id))
	}

	const removeCraftVillage = (id: string) => {
		setSelectedCraftVillages(selectedCraftVillages.filter((village) => village.id !== id))
	}

	return (
		<div className="space-y-8">
			{/* Step 1: Basic Information */}
			{currentStep === 1 && (
				<div className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="date">Ngày bắt đầu</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant={"outline"}
									className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{date ? format(date, "PPP", { locale: vi }) : <span>Chọn ngày</span>}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={vi} />
							</PopoverContent>
						</Popover>
					</div>

					<div className="space-y-2">
						<Label>Số ngày du lịch</Label>
						<div className="flex items-center space-x-4">
							<Button variant="outline" size="icon" onClick={() => setDuration(Math.max(1, duration - 1))}>
								-
							</Button>
							<span className="font-medium text-lg w-8 text-center">{duration}</span>
							<Button variant="outline" size="icon" onClick={() => setDuration(Math.min(10, duration + 1))}>
								+
							</Button>
						</div>
					</div>

					<div className="space-y-2">
						<Label>Số người tham gia</Label>
						<div className="flex items-center space-x-4">
							<Button variant="outline" size="icon" onClick={() => setTravelers(Math.max(1, travelers - 1))}>
								-
							</Button>
							<span className="font-medium text-lg w-8 text-center">{travelers}</span>
							<Button variant="outline" size="icon" onClick={() => setTravelers(Math.min(20, travelers + 1))}>
								+
							</Button>
						</div>
					</div>

					<div className="space-y-2">
						<Label>Ngân sách dự kiến (VND/người)</Label>
						<div className="space-y-4">
							<Slider
								defaultValue={budget}
								max={5000000}
								step={100000}
								onValueChange={(value) => setBudget(value as [number])}
							/>
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">0đ</span>
								<span className="font-medium">{budget[0].toLocaleString("vi-VN")}đ</span>
								<span className="text-sm text-muted-foreground">5.000.000đ</span>
							</div>
						</div>
					</div>

					<div className="flex justify-end">
						<Button onClick={handleNext}>Tiếp theo</Button>
					</div>
				</div>
			)}

			{/* Step 2: Select Destinations */}
			{currentStep === 2 && (
				<div className="space-y-6">
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<Label className="text-lg font-medium flex items-center">
								<MapPin className="mr-2 h-5 w-5 text-primary" />
								Điểm du lịch
							</Label>
							<span className="text-sm text-muted-foreground">Đã chọn: {selectedDestinations.length}</span>
						</div>

						<DestinationSelector
							type="destination"
							onSelect={(location) => setSelectedDestinations([...selectedDestinations, location])}
						/>

						{selectedDestinations.length > 0 && (
							<div className="mt-4">
								<Label className="mb-2 block">Điểm du lịch đã chọn:</Label>
								<div className="flex flex-wrap gap-2">
									{selectedDestinations.map((dest) => (
										<Badge key={dest.id} variant="secondary" className="pl-2 pr-1 py-1.5 flex items-center gap-1">
											{dest.name}
											<Button
												variant="ghost"
												size="icon"
												className="h-4 w-4 rounded-full ml-1"
												onClick={() => removeDestination(dest.id)}
											>
												×
											</Button>
										</Badge>
									))}
								</div>
							</div>
						)}
					</div>

					<Separator />

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<Label className="text-lg font-medium flex items-center">
								<Utensils className="mr-2 h-5 w-5 text-primary" />
								Nhà hàng & Quán ăn
							</Label>
							<span className="text-sm text-muted-foreground">Đã chọn: {selectedRestaurants.length}</span>
						</div>

						<DestinationSelector
							type="restaurant"
							onSelect={(location) => setSelectedRestaurants([...selectedRestaurants, location])}
						/>

						{selectedRestaurants.length > 0 && (
							<div className="mt-4">
								<Label className="mb-2 block">Nhà hàng đã chọn:</Label>
								<div className="flex flex-wrap gap-2">
									{selectedRestaurants.map((rest) => (
										<Badge key={rest.id} variant="secondary" className="pl-2 pr-1 py-1.5 flex items-center gap-1">
											{rest.name}
											<Button
												variant="ghost"
												size="icon"
												className="h-4 w-4 rounded-full ml-1"
												onClick={() => removeRestaurant(rest.id)}
											>
												×
											</Button>
										</Badge>
									))}
								</div>
							</div>
						)}
					</div>

					<Separator />

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<Label className="text-lg font-medium flex items-center">
								<Briefcase className="mr-2 h-5 w-5 text-primary" />
								Làng nghề truyền thống
							</Label>
							<span className="text-sm text-muted-foreground">Đã chọn: {selectedCraftVillages.length}</span>
						</div>

						<DestinationSelector
							type="craftVillage"
							onSelect={(location) => setSelectedCraftVillages([...selectedCraftVillages, location])}
						/>

						{selectedCraftVillages.length > 0 && (
							<div className="mt-4">
								<Label className="mb-2 block">Làng nghề đã chọn:</Label>
								<div className="flex flex-wrap gap-2">
									{selectedCraftVillages.map((village) => (
										<Badge key={village.id} variant="secondary" className="pl-2 pr-1 py-1.5 flex items-center gap-1">
											{village.name}
											<Button
												variant="ghost"
												size="icon"
												className="h-4 w-4 rounded-full ml-1"
												onClick={() => removeCraftVillage(village.id)}
											>
												×
											</Button>
										</Badge>
									))}
								</div>
							</div>
						)}
					</div>

					<div className="flex justify-between">
						<Button variant="outline" onClick={handleBack}>
							Quay lại
						</Button>
						<Button onClick={handleNext}>Tiếp theo</Button>
					</div>
				</div>
			)}

			{/* Step 3: Preferences and AI */}
			{currentStep === 3 && (
				<div className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="preferences">Sở thích và yêu cầu đặc biệt</Label>
						<Textarea
							id="preferences"
							placeholder="Ví dụ: Thích khám phá ẩm thực địa phương, muốn có thời gian nghỉ ngơi giữa các điểm tham quan, ưu tiên các hoạt động ngoài trời..."
							value={preferences}
							onChange={(e) => setPreferences(e.target.value)}
							rows={4}
						/>
					</div>

					<Card className="border-dashed border-primary/50 bg-primary/5">
						<CardContent className="pt-6">
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center gap-2">
									<Sparkles className="h-5 w-5 text-primary" />
									<Label htmlFor="use-ai" className="font-medium">
										Sử dụng AI để tối ưu lịch trình
									</Label>
								</div>
								<Switch id="use-ai" checked={useAI} onCheckedChange={setUseAI} />
							</div>

							<p className="text-sm text-muted-foreground">
								AI sẽ phân tích các lựa chọn của bạn và đề xuất lịch trình tối ưu dựa trên khoảng cách, thời gian di
								chuyển, và các yếu tố khác.
							</p>
						</CardContent>
					</Card>

					<div className="flex justify-between">
						<Button variant="outline" onClick={handleBack}>
							Quay lại
						</Button>
						<Button onClick={handleSubmit} disabled={isGenerating}>
							{isGenerating ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Đang tạo lịch trình...
								</>
							) : (
								"Hoàn thành"
							)}
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}
