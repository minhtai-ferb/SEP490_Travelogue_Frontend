"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowRight, X, Loader2 } from "lucide-react"
import { TourTypeLabels, type CreateTourRequest } from "@/types/Tour"

interface TourBasicFormProps {
	initialData?: CreateTourRequest | null
	onSubmit: (data: CreateTourRequest) => void
	onCancel: () => void
	isLoading?: boolean
}

export function TourBasicForm({ initialData, onSubmit, onCancel, isLoading = false }: TourBasicFormProps) {
	const [formData, setFormData] = useState<CreateTourRequest>({
		name: "",
		description: "",
		content: "",
		totalDays: 1,
		tourType: 1,
	})

	const [errors, setErrors] = useState<Record<string, string>>({})

	useEffect(() => {
		if (initialData) {
			setFormData(initialData)
		}
	}, [initialData])

	const validateForm = () => {
		const newErrors: Record<string, string> = {}

		if (!formData.name.trim()) {
			newErrors.name = "Tên tour là bắt buộc"
		}

		if (!formData.description.trim()) {
			newErrors.description = "Mô tả tour là bắt buộc"
		}

		if (!formData.content.trim()) {
			newErrors.content = "Nội dung tour là bắt buộc"
		}

		if (formData.totalDays <= 0) {
			newErrors.totalDays = "Số ngày tour phải lớn hơn 0"
		}

		if (!formData.tourType) {
			newErrors.tourType = "Loại tour là bắt buộc"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (validateForm()) {
			onSubmit(formData)
		}
	}

	const handleInputChange = (field: keyof CreateTourRequest, value: any) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}))

		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({
				...prev,
				[field]: "",
			}))
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Basic Information */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<div className="w-2 h-2 bg-blue-500 rounded-full" />
							Thông Tin Cơ Bản
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Tên Tour *</Label>
							<Input
								id="name"
								placeholder="Nhập tên tour du lịch"
								value={formData.name}
								onChange={(e) => handleInputChange("name", e.target.value)}
								className={errors.name ? "border-red-500" : ""}
								disabled={isLoading}
							/>
							{errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Mô Tả Tour *</Label>
							<Textarea
								id="description"
								placeholder="Nhập mô tả chi tiết về tour"
								value={formData.description}
								onChange={(e) => handleInputChange("description", e.target.value)}
								className={errors.description ? "border-red-500" : ""}
								rows={3}
								disabled={isLoading}
							/>
							{errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="content">Nội Dung Chi Tiết *</Label>
							<Textarea
								id="content"
								placeholder="Nhập nội dung chi tiết về tour"
								value={formData.content}
								onChange={(e) => handleInputChange("content", e.target.value)}
								className={errors.content ? "border-red-500" : ""}
								rows={4}
								disabled={isLoading}
							/>
							{errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
						</div>
					</CardContent>
				</Card>

				{/* Tour Details */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<div className="w-2 h-2 bg-green-500 rounded-full" />
							Chi Tiết Tour
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label>Loại Tour *</Label>
							<Select
								value={formData.tourType.toString()}
								onValueChange={(value) => handleInputChange("tourType", Number.parseInt(value))}
								disabled={isLoading}
							>
								<SelectTrigger className={errors.tourType ? "border-red-500" : ""}>
									<SelectValue placeholder="Chọn loại tour" />
								</SelectTrigger>
								<SelectContent>
									{Object.entries(TourTypeLabels).map(([key, label]) => (
										<SelectItem key={key} value={key}>
											{label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.tourType && <p className="text-sm text-red-500">{errors.tourType}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="totalDays">Số Ngày Tour *</Label>
							<Input
								id="totalDays"
								type="number"
								min="1"
								max="365"
								value={formData.totalDays}
								onChange={(e) => handleInputChange("totalDays", Number.parseInt(e.target.value) || 1)}
								className={errors.totalDays ? "border-red-500" : ""}
								disabled={isLoading}
							/>
							{errors.totalDays && <p className="text-sm text-red-500">{errors.totalDays}</p>}
							<p className="text-xs text-gray-500">
								Tour sẽ có {formData.totalDays} ngày {formData.totalDays > 1 ? formData.totalDays - 1 : 0} đêm
							</p>
						</div>

						<div className="p-4 bg-blue-50 rounded-lg">
							<h4 className="font-medium text-blue-900 mb-2">Thông Tin Tour</h4>
							<div className="space-y-1 text-sm text-blue-800">
								<p>
									<strong>Loại:</strong> {TourTypeLabels[formData.tourType]}
								</p>
								<p>
									<strong>Thời gian:</strong> {formData.totalDays} ngày{" "}
									{formData.totalDays > 1 ? formData.totalDays - 1 : 0} đêm
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Action Buttons */}
			<div className="flex justify-between items-center pt-6 border-t">
				<Button
					type="button"
					variant="outline"
					onClick={onCancel}
					className="flex items-center gap-2 bg-transparent"
					disabled={isLoading}
				>
					<X className="w-4 h-4" />
					Hủy
				</Button>
				<Button type="submit" className="flex items-center gap-2" disabled={isLoading}>
					{isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
					Tiếp theo
					<ArrowRight className="w-4 h-4" />
				</Button>
			</div>
		</form>
	)
}
