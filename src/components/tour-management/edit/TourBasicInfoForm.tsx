'use client';

import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save, AlertCircle } from "lucide-react"
import { useTour } from "@/services/tour"
import { TourTypeLabels } from "@/types/Tour"
import type { TourDetail } from "@/types/Tour"
import toast from "react-hot-toast";
import { ImageUpload } from "@/app/admin/locations/create/components/image-upload"

interface TourBasicInfoFormProps {
	tour: TourDetail
	onUpdate: (updatedTour: TourDetail) => void
}

export function TourBasicInfoForm({ tour, onUpdate }: TourBasicInfoFormProps) {
	const [formData, setFormData] = useState({
		name: tour.name,
		description: tour.description,
		content: tour.content || "",
		totalDays: tour.totalDays,
		tourType: tour.tourType,
		medias: tour.medias || [],
	})
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")

	const { updateTourInfo } = useTour()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError("")
		setSuccess("")

		try {
			const response = await updateTourInfo(tour.tourId, formData)

			// Update the tour data
			const updatedTour = { ...tour, ...formData }
			onUpdate(updatedTour)
			setSuccess("Cập nhật thông tin tour thành công!")
		} catch (error: any) {
			setError(error?.response?.data?.message || "Có lỗi khi cập nhật tour")
			toast.error(error?.response?.data?.message || "Có lỗi khi cập nhật tour")
			console.error("Error updating tour:", error)
		} finally {
			setIsLoading(false)
		}
	}

	const handleInputChange = (field: string, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
		setError("")
		setSuccess("")
	}


	const handleImageChange = (mediaDtos: { mediaUrl: string; isThumbnail: boolean }[]) => {
		setFormData((prev) => ({ ...prev, mediaDtos }))
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Thông Tin Cơ Bản</CardTitle>
			</CardHeader>
			<CardContent>
				{error && (
					<Alert className="mb-6 border-red-200 bg-red-50">
						<AlertCircle className="h-4 w-4 text-red-600" />
						<AlertDescription className="text-red-800">{error}</AlertDescription>
					</Alert>
				)}

				{success && (
					<Alert className="mb-6 border-green-200 bg-green-50 flex items-center align-middle">
						<AlertCircle className="h-6 w-6 text-green-600" color="green" />
						<AlertDescription className="text-green-800 text-xl mt-1 ml-2">{success}</AlertDescription>
					</Alert>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="md:col-span-2 space-y-2">
							<Label htmlFor="name">Tên Tour *</Label>
							<Input
								id="name"
								value={formData.name}
								onChange={(e) => handleInputChange("name", e.target.value)}
								placeholder="Nhập tên tour"
								required
							/>
						</div>

						<div className="md:col-span-2 space-y-2">
							<Label htmlFor="description">Mô Tả Tour *</Label>
							<Textarea
								id="description"
								value={formData.description}
								onChange={(e) => handleInputChange("description", e.target.value)}
								placeholder="Nhập mô tả tour"
								rows={3}
								required
							/>
						</div>

						<div className="md:col-span-2 space-y-2">
							<Label htmlFor="content">Nội Dung Chi Tiết</Label>
							<Textarea
								id="content"
								value={formData.content}
								onChange={(e) => handleInputChange("content", e.target.value)}
								placeholder="Nhập nội dung chi tiết về tour"
								rows={5}
							/>
						</div>

						<div className="space-y-2">
							<Label>Loại Tour *</Label>
							<Select
								value={formData.tourType.toString()}
								onValueChange={(value) => handleInputChange("tourType", Number.parseInt(value))}
							>
								<SelectTrigger>
									<SelectValue placeholder="Chọn loại tour" />
								</SelectTrigger>
								<SelectContent>
									{/* Map theo enum backend (1..7) */}
									{Object.entries(TourTypeLabels)
										.filter(([key]) => Number(key) >= 1 && Number(key) <= 7)
										.map(([key, label]) => (
											<SelectItem key={key} value={key}>
												{label}
											</SelectItem>
										))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="totalDays">Số Ngày *</Label>
							<Input
								id="totalDays"
								type="number"
								min="1"
								value={formData.totalDays}
								onChange={(e) => handleInputChange("totalDays", Number.parseInt(e.target.value) || 1)}
								required
							/>
						</div>

						<div className="md:col-span-2 space-y-2">
							<Label>Hình ảnh</Label>
							<ImageUpload mediaDtos={formData.medias} onChange={handleImageChange} isLoading={isLoading} />
						</div>
					</div>

					<div className="flex justify-end">
						<Button type="submit" disabled={isLoading}>
							{isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
							<Save className="w-4 h-4 mr-2" />
							Lưu Thay Đổi
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
