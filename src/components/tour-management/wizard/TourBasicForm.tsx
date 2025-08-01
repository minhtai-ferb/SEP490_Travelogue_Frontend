"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Input, Textarea, Select, SelectItem, Button, Card, CardBody, CardHeader } from "@heroui/react"
import { TourType, TourTypeLabels, type CreateTourBasicRequest } from "@/types/Tour"

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
		key: value,
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
					<h4 className="text-lg font-medium">Chi Tiết Tour</h4>
				</CardHeader>
				<CardBody className="space-y-4">
					<Input
						label="Tên Tour"
						placeholder="Nhập tên tour (ví dụ: Tour Tây Ninh 3 ngày 2 đêm)"
						value={formData.name}
						onValueChange={(value) => handleInputChange("name", value)}
						isInvalid={!!errors.name}
						errorMessage={errors.name}
						isRequired
						variant="bordered"
					/>

					<Textarea
						label="Mô Tả Tour"
						placeholder="Nhập mô tả ngắn gọn về tour (100-200 từ)"
						value={formData.description}
						onValueChange={(value) => handleInputChange("description", value)}
						isInvalid={!!errors.description}
						errorMessage={errors.description}
						minRows={3}
						maxRows={5}
						isRequired
						variant="bordered"
					/>

					<Textarea
						label="Nội Dung Chi Tiết"
						placeholder="Nhập nội dung chi tiết về tour, bao gồm các hoạt động, dịch vụ, lưu ý..."
						value={formData.content}
						onValueChange={(value) => handleInputChange("content", value)}
						isInvalid={!!errors.content}
						errorMessage={errors.content}
						minRows={4}
						maxRows={8}
						isRequired
						variant="bordered"
					/>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Select
							label="Loại Tour"
							placeholder="Chọn loại tour"
							selectedKeys={[formData.tourType.toString()]}
							onSelectionChange={(keys) => {
								const selected = Array.from(keys)[0] as string
								handleInputChange("tourType", Number.parseInt(selected))
							}}
							isRequired
							variant="bordered"
						>
							{tourTypeOptions.map((option) => (
								<SelectItem key={option.key} textValue={option.label}>
									{option.label}
								</SelectItem>
							))}
						</Select>

						<Input
							label="Số Ngày Tour"
							placeholder="Nhập số ngày"
							type="number"
							min={1}
							max={365}
							value={formData.totalDays.toString()}
							onValueChange={(value) => handleInputChange("totalDays", Number.parseInt(value) || 1)}
							isInvalid={!!errors.totalDays}
							errorMessage={errors.totalDays}
							isRequired
							variant="bordered"
							endContent={
								<div className="pointer-events-none flex items-center">
									<span className="text-default-400 text-small">ngày</span>
								</div>
							}
						/>
					</div>
				</CardBody>
			</Card>

			<div className="flex justify-end pt-4">
				<Button type="submit" color="primary" size="lg" isLoading={isLoading} className="px-8">
					Tiếp Theo: Tạo Lịch Trình
				</Button>
			</div>
		</form>
	)
}
