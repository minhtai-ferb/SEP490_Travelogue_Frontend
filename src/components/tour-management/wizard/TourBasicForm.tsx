"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TourType, TourTypeLabels, type CreateTourBasicRequest } from "@/types/Tour"
import { Loader2 } from "lucide-react"

interface TourBasicFormProps {
	initialData: CreateTourBasicRequest | null
	onSubmit: (data: CreateTourBasicRequest) => void
	isLoading: boolean
}

export function TourBasicForm({ initialData, onSubmit, isLoading }: TourBasicFormProps) {
	const [formData, setFormData] = useState<CreateTourBasicRequest>({
		name: "",
		description: "",
		content: "",
		totalDays: 1,
		tourType: TourType.International,
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

		if (formData.totalDays < 1) {
			newErrors.totalDays = "Số ngày tour phải ít nhất là 1"
		}

		if (formData.totalDays > 365) {
			newErrors.totalDays = "Số ngày tour không được vượt quá 365"
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

	const handleInputChange = (field: keyof CreateTourBasicRequest, value: any) => {
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

	const tourTypeOptions = Object.entries(TourTypeLabels).map(([value, label]) => ({
		value,
		label,
	}))

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="text-center mb-6">
				<h3 className="text-xl font-semibold text-gray-900">Thông Tin Cơ Bản Tour</h3>
				<p className="text-gray-600 mt-2">
					Nhập thông tin cơ bản để tạo tour mới. Các thông tin này sẽ được sử dụng làm nền tảng cho tour của bạn.
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg font-medium">Chi Tiết Tour</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">
							Tên Tour <span className="text-red-500">*</span>
						</Label>
						<Input
							id="name"
							placeholder="Nhập tên tour (ví dụ: Tour Tây Ninh 3 ngày 2 đêm)"
							value={formData.name}
							onChange={(e) => handleInputChange("name", e.target.value)}
							className={errors.name ? "border-red-500" : ""}
						/>
						{errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">
							Mô Tả Tour <span className="text-red-500">*</span>
						</Label>
						<Textarea
							id="description"
							placeholder="Nhập mô tả ngắn gọn về tour (100-200 từ)"
							value={formData.description}
							onChange={(e) => handleInputChange("description", e.target.value)}
							className={`min-h-[80px] ${errors.description ? "border-red-500" : ""}`}
						/>
						{errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
					</div>

					<div className="space-y-2">
						<Label htmlFor="content">
							Nội Dung Chi Tiết <span className="text-red-500">*</span>
						</Label>
						<Textarea
							id="content"
							placeholder="Nhập nội dung chi tiết về tour, bao gồm các hoạt động, dịch vụ, lưu ý..."
							value={formData.content}
							onChange={(e) => handleInputChange("content", e.target.value)}
							className={`min-h-[120px] ${errors.content ? "border-red-500" : ""}`}
						/>
						{errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="tourType">
								Loại Tour <span className="text-red-500">*</span>
							</Label>
							<Select
								value={formData.tourType.toString()}
								onValueChange={(value) => handleInputChange("tourType", Number.parseInt(value))}
							>
								<SelectTrigger>
									<SelectValue placeholder="Chọn loại tour" />
								</SelectTrigger>
								<SelectContent>
									{tourTypeOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="totalDays">
								Số Ngày Tour <span className="text-red-500">*</span>
							</Label>
							<div className="relative">
								<Input
									id="totalDays"
									type="number"
									min={1}
									max={365}
									value={formData.totalDays.toString()}
									onChange={(e) => handleInputChange("totalDays", Number.parseInt(e.target.value) || 1)}
									className={errors.totalDays ? "border-red-500" : ""}
								/>
								<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
									<span className="text-gray-500 text-sm">ngày</span>
								</div>
							</div>
							{errors.totalDays && <p className="text-sm text-red-500">{errors.totalDays}</p>}
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="flex justify-end pt-4">
				<Button type="submit" size="lg" className="px-8" disabled={isLoading}>
					{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Tiếp Theo: Tạo Lịch Trình
				</Button>
			</div>
		</form>
	)
}
