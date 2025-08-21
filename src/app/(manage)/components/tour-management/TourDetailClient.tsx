'use client';

import TourDetailId from "@/app/(manage)/components/tour-management/TourDetailId";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTour } from "@/services/tour";
import type { TourDetail } from "@/types/Tour";
import { TourTypeLabels } from "@/types/Tour";
import { AlertCircle, ArrowLeft, Edit, Loader2, Clock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TourDetailClientProps {
	tourId: string,
	href:string
}

const statusColorMap: Record<string, string> = {
	"Nháp": "bg-yellow-100 text-yellow-800",
	"Đã xác nhận": "bg-green-100 text-green-800",
	"Đã hủy": "bg-red-100 text-red-800",
}

export default function TourDetailClient({ tourId , href }: TourDetailClientProps) {
	const router = useRouter()
	const [tour, setTour] = useState<TourDetail | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")

	const { getTourDetail } = useTour()

	useEffect(() => {
		const fetchTour = async () => {
			try {
				setLoading(true)
				setError("")
				const response = await getTourDetail(tourId)
				if (response) {
					setTour(response)
				} else {
					throw new Error((response as any).message || "Failed to fetch tour")
				}
			} catch (error: any) {
				console.error("Error fetching tour:", error)
				setError(error.message || "Không thể tải thông tin tour")
			} finally {
				setLoading(false)
			}
		}

		if (tourId) {
			fetchTour()
		}
	}, [tourId, getTourDetail])

	const handleEdit = () => {
		router.push(`${href}/${tourId}/edit`)
	}

	const handleBack = () => {
		router.push(href)
	}


	if (loading) {
		return (
			<div className="container mx-auto p-6 max-w-6xl">
				<div className="flex items-center justify-center py-12">
					<Loader2 className="w-8 h-8 animate-spin" />
					<span className="ml-2">Đang tải...</span>
				</div>
			</div>
		)
	}

	if (error || !tour) {
		return (
			<div className="container mx-auto p-6 max-w-6xl">
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
		<div className="container mx-auto p-6 max-w-6xl">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-4">
					<div>
						<h1 className="text-3xl font-bold">{tour.name}</h1>
						<div className="flex items-center gap-2 mt-2">
							<Badge className={`${statusColorMap[tour.statusText == "Draft" ? "Nháp" : tour.statusText == "Confirmed" ? "Đã xác nhận" : tour.statusText == "Cancelled" ? "Đã hủy" : tour.statusText] || "bg-gray-100 text-gray-800"} text-xs`}>
								{tour.statusText == "Draft" ? "Nháp" : tour.statusText == "Confirmed" ? "Đã xác nhận" : tour.statusText == "Cancelled" ? "Đã hủy" : tour.statusText}
							</Badge>
							<Badge variant="outline" className="text-xs">
								{TourTypeLabels[tour.tourType as keyof typeof TourTypeLabels]}
							</Badge>
						</div>
					</div>
				</div>
				<div className="flex gap-2">
					<Button onClick={handleEdit} className="flex items-center gap-2">
						<Edit className="w-4 h-4" />
						Chỉnh sửa
					</Button>
				</div>
			</div>

			{error && (
				<Alert className="mb-6 border-red-200 bg-red-50">
					<AlertCircle className="h-4 w-4 text-red-600" />
					<AlertDescription className="text-red-800">{error}</AlertDescription>
				</Alert>
			)}

			<TourDetailId tour={tour} />
		</div>
	)
}
