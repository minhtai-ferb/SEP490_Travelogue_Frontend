"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react"
import type { Tour, UpdateTourRequest } from "@/types/Tour"
import { useTour } from "@/services/tour"
import { TourForm } from "@/components/tour-management/TourForm"

interface TourEditClientProps {
	tourId: string
}

export default function TourEditClient({ tourId }: TourEditClientProps) {
	const router = useRouter()
	const [tour, setTour] = useState<Tour | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
	const [actionLoading, setActionLoading] = useState(false)

	const { getTourDetail, updateTour } = useTour()

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

	const handleUpdate = async (data: Partial<UpdateTourRequest>) => {
		if (!tour) return

		try {
			setActionLoading(true)
			setError("")
			await updateTour(tour.tourId, data)
			router.push(`/tour/${tourId}`)
		} catch (error) {
			console.error("Error updating tour:", error)
			setError("Có lỗi khi cập nhật tour")
		} finally {
			setActionLoading(false)
		}
	}

	const handleCancel = () => {
		router.push(`/tour/${tourId}`)
	}

	const handleBack = () => {
		router.push("/tour")
	}

	if (loading) {
		return (
			<div className="container mx-auto p-6 max-w-4xl">
				<div className="flex items-center justify-center py-12">
					<Loader2 className="w-8 h-8 animate-spin" />
					<span className="ml-2">Đang tải...</span>
				</div>
			</div>
		)
	}

	if (error || !tour) {
		return (
			<div className="container mx-auto p-6 max-w-4xl">
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
		<div className="container mx-auto p-6 max-w-4xl">
			{/* Header */}
			<div className="flex items-center gap-4 mb-6">
				<Button variant="ghost" onClick={handleCancel} className="flex items-center gap-2">
					<ArrowLeft className="w-4 h-4" />
					Quay lại
				</Button>
				<div>
					<h1 className="text-3xl font-bold">Chỉnh Sửa Tour</h1>
					<p className="text-gray-600 mt-1">{tour.name}</p>
				</div>
			</div>

			{error && (
				<Alert className="mb-6 border-red-200 bg-red-50">
					<AlertCircle className="h-4 w-4 text-red-600" />
					<AlertDescription className="text-red-800">{error}</AlertDescription>
				</Alert>
			)}

			<Card>
				<CardHeader>
					<CardTitle>Thông Tin Tour</CardTitle>
				</CardHeader>
				<CardContent>
					<TourForm tour={tour} onSubmit={handleUpdate} onCancel={handleCancel} isLoading={actionLoading} />
				</CardContent>
			</Card>
		</div>
	)
}
