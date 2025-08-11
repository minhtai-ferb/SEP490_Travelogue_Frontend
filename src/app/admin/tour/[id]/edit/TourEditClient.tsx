'use client';

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react"
import { useTour } from "@/services/tour"
import { TourBasicInfoForm } from "@/components/tour-management/edit/TourBasicInfoForm"
import { TourScheduleManager } from "@/components/tour-management/edit/TourScheduleManager"
import { TourItineraryManager } from "@/components/tour-management/edit/TourItineraryManager"
import type { TourDetail } from "@/types/Tour"

interface TourEditClientProps {
	tourId: string
}

export default function TourEditClient({ tourId }: TourEditClientProps) {
	const router = useRouter()
	const [tour, setTour] = useState<TourDetail | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
	const [activeTab, setActiveTab] = useState("basic")

	const { getTourDetail } = useTour()

	useEffect(() => {
		const fetchTour = async () => {
			try {
				setLoading(true)
				setError("")
				const response = await getTourDetail(tourId)
				setTour(response)
			} catch (error) {
				console.error("Error fetching tour:", error)
				setError("Không thể tải thông tin tour")
			} finally {
				setLoading(false)
			}
		}

		if (tourId) {
			fetchTour()
		}
	}, [tourId, getTourDetail])

	const handleBack = () => {
		router.push("/admin/tour")
	}

	const handleTourUpdate = (updatedTour: TourDetail) => {
		setTour(updatedTour)
	}

	if (loading) {
		return (
			<div className="container mx-auto p-6 max-w-7xl">
				<div className="flex items-center justify-center py-12">
					<Loader2 className="w-8 h-8 animate-spin" />
					<span className="ml-2">Đang tải...</span>
				</div>
			</div>
		)
	}

	if (error || !tour) {
		return (
			<div className="container mx-auto p-6 max-w-7xl">
				<Alert className="mb-6">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error || "Không tìm thấy tour"}</AlertDescription>
				</Alert>
				<Button onClick={handleBack} variant="outline">
					<ArrowLeft className="w-4 h-4 mr-2" />
					Quay lại
				</Button>
			</div>
		)
	}

	return (
		<div className="container mx-auto p-6 max-w-7xl">
			{/* Header */}
			<div className="flex items-center gap-4 mb-6">
				<div className="flex-1">
					<h1 className="text-3xl font-bold">Chỉnh Sửa Tour</h1>
					<p className="text-gray-600 mt-1">{tour.name}</p>
				</div>
				<div className="flex items-center gap-2">
					<div
						className={`px-3 py-1 rounded-full text-sm font-medium ${tour.status === 1 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
							}`}
					>
						{tour.statusText}
					</div>
				</div>
			</div>

			{/* Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="basic">Thông Tin Cơ Bản</TabsTrigger>
					<TabsTrigger value="schedules">Lịch Trình</TabsTrigger>
					<TabsTrigger value="itinerary">Hành Trình</TabsTrigger>
				</TabsList>

				<TabsContent value="basic">
					<TourBasicInfoForm tour={tour} onUpdate={handleTourUpdate} />
				</TabsContent>

				<TabsContent value="schedules">
					<TourScheduleManager tour={tour} onUpdate={handleTourUpdate} />
				</TabsContent>

				<TabsContent value="itinerary">
					<TourItineraryManager tour={tour} onUpdate={handleTourUpdate} />
				</TabsContent>
			</Tabs>
		</div>
	)
}
