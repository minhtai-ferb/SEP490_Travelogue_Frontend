"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Input, Textarea, Select, SelectItem, Button, Card, CardBody, CardHeader, Divider } from "@heroui/react"
import type { Tour, CreateTourRequest, UpdateTourRequest, TourStatus } from "@/types/Tour"

interface TourFormProps {
	tour?: Tour | null
	onSubmit: (data: Partial<CreateTourRequest | UpdateTourRequest>) => void
	onCancel: () => void
	isLoading?: boolean
}

const tourTypes = [
	{ key: "Du lịch trong nước", label: "Du lịch trong nước" },
	{ key: "Du lịch nước ngoài", label: "Du lịch nước ngoài" },
	{ key: "Tour phiêu lưu", label: "Tour phiêu lưu" },
	{ key: "Tour văn hóa", label: "Tour văn hóa" },
	{ key: "Tour thiên nhiên", label: "Tour thiên nhiên" },
	{ key: "Tour lịch sử", label: "Tour lịch sử" },
]

const statusOptions = [
	{ key: "Draft", label: "Nháp" },
	{ key: "Published", label: "Đã xuất bản" },
	{ key: "Active", label: "Hoạt động" },
	{ key: "Cancelled", label: "Đã hủy" },
]

export function TourForm({ tour, onSubmit, onCancel, isLoading = false }: TourFormProps) {
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		content: null as string | null,
		tourTypeText: "",
		tourType: 0,
		totalDaysText: "",
		totalDays: 0,
		adultPrice: 0,
		childrenPrice: 0,
		finalPrice: 0,
		statusText: "Draft" as TourStatus,
		status: 0,
	})

	const [errors, setErrors] = useState<Record<string, string>>({})

	useEffect(() => {
		if (tour) {
			setFormData({
				name: tour.name || "",
				description: tour.description || "",
				content: tour.content || null,
				tourTypeText: tour.tourTypeText || "",
				tourType: typeof tour.tourType === "number" ? tour.tourType : 0,
				totalDaysText: tour.totalDaysText || "",
				totalDays: typeof tour.totalDays === "number" ? tour.totalDays : 0,
				adultPrice: typeof tour.adultPrice === "number" ? tour.adultPrice : 0,
				childrenPrice: typeof tour.childrenPrice === "number" ? tour.childrenPrice : 0,
				finalPrice: typeof tour.finalPrice === "number" ? tour.finalPrice : 0,
				statusText: tour.statusText || "Draft",
				status: typeof tour.status === "number" ? tour.status : 0,
			})
		}
	}, [tour])

	const validateForm = () => {
		const newErrors: Record<string, string> = {}

		if (!formData.name.trim()) {
			newErrors.name = "Tên tour là bắt buộc"
		}

		if (!formData.description.trim()) {
			newErrors.description = "Mô tả tour là bắt buộc"
		}

		if (!formData.tourTypeText) {
			newErrors.tourTypeText = "Loại tour là bắt buộc"
		}

		if (!formData.totalDaysText.trim()) {
			newErrors.totalDaysText = "Thời gian tour là bắt buộc"
		}

		if (formData.totalDays <= 0) {
			newErrors.totalDays = "Số ngày tour phải lớn hơn 0"
		}

		if (formData.adultPrice <= 0) {
			newErrors.adultPrice = "Giá người lớn phải lớn hơn 0"
		}

		if (formData.childrenPrice < 0) {
			newErrors.childrenPrice = "Giá trẻ em không được âm"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (validateForm()) {
			// Calculate finalPrice as the adult price (or you can implement your own logic)
			const submitData: Partial<CreateTourRequest | UpdateTourRequest> = {
				...formData,
				finalPrice: formData.adultPrice,
				status: getStatusNumber(formData.statusText),
				tourType: getTourTypeNumber(formData.tourTypeText),
			}
			onSubmit(submitData)
		}
	}

	const statusMap: Partial<Record<TourStatus, number>> = {
		Draft: 0,
		Published: 1,
		Active: 2,
		Cancelled: 3,
	};

	const getStatusNumber = (statusText: TourStatus): number => {
		return statusMap[statusText] ?? 0;
	};

	const getTourTypeNumber = (tourTypeText: string): number => {
		const typeMap: Record<string, number> = {
			"Du lịch trong nước": 0,
			"Du lịch nước ngoài": 1,
			"Tour phiêu lưu": 2,
			"Tour văn hóa": 3,
			"Tour thiên nhiên": 4,
			"Tour lịch sử": 5,
		}
		return typeMap[tourTypeText] || 0
	}

	const handleInputChange = (field: string, value: any) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}))

		// Auto-calculate totalDays from totalDaysText
		if (field === "totalDaysText") {
			const daysMatch = value.match(/(\d+)/)
			if (daysMatch) {
				setFormData((prev) => ({
					...prev,
					totalDays: Number.parseInt(daysMatch[1]),
				}))
			}
		}

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
			<Card>
				<CardHeader>
					<h3 className="text-lg font-semibold">Thông Tin Cơ Bản</h3>
				</CardHeader>
				<CardBody className="space-y-4">
					<Input
						label="Tên Tour"
						placeholder="Nhập tên tour"
						value={formData.name}
						onValueChange={(value) => handleInputChange("name", value)}
						isInvalid={!!errors.name}
						errorMessage={errors.name}
						isRequired
					/>

					<Textarea
						label="Mô Tả Tour"
						placeholder="Nhập mô tả chi tiết về tour"
						value={formData.description}
						onValueChange={(value) => handleInputChange("description", value)}
						isInvalid={!!errors.description}
						errorMessage={errors.description}
						minRows={3}
						isRequired
					/>

					<Textarea
						label="Nội Dung Tour"
						placeholder="Nhập nội dung chi tiết về tour (tùy chọn)"
						value={formData.content || ""}
						onValueChange={(value) => handleInputChange("content", value || null)}
						minRows={4}
					/>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Select
							label="Loại Tour"
							placeholder="Chọn loại tour"
							selectedKeys={formData.tourTypeText ? [formData.tourTypeText] : []}
							onSelectionChange={(keys) => {
								const selected = Array.from(keys)[0] as string
								handleInputChange("tourTypeText", selected)
							}}
							isInvalid={!!errors.tourTypeText}
							errorMessage={errors.tourTypeText}
							isRequired
						>
							{tourTypes.map((type) => (
								<SelectItem key={type.key} textValue={type.key}>
									{type.label}
								</SelectItem>
							))}
						</Select>

						<Input
							label="Thời Gian Tour"
							placeholder="VD: 7 ngày 6 đêm"
							value={formData.totalDaysText}
							onValueChange={(value) => handleInputChange("totalDaysText", value)}
							isInvalid={!!errors.totalDaysText}
							errorMessage={errors.totalDaysText}
							isRequired
						/>
					</div>

					<Input
						label="Số Ngày"
						placeholder="7"
						type="number"
						value={formData.totalDays.toString()}
						onValueChange={(value) => handleInputChange("totalDays", Number.parseInt(value) || 0)}
						isInvalid={!!errors.totalDays}
						errorMessage={errors.totalDays}
						isRequired
					/>
				</CardBody>
			</Card>

			<Card>
				<CardHeader>
					<h3 className="text-lg font-semibold">Thông Tin Giá</h3>
				</CardHeader>
				<CardBody className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Input
							label="Giá Người Lớn (VNĐ)"
							placeholder="0"
							type="number"
							value={formData.adultPrice.toString()}
							onValueChange={(value) => handleInputChange("adultPrice", Number.parseInt(value) || 0)}
							isInvalid={!!errors.adultPrice}
							errorMessage={errors.adultPrice}
							startContent={
								<div className="pointer-events-none flex items-center">
									<span className="text-default-400 text-small">VNĐ</span>
								</div>
							}
							isRequired
						/>

						<Input
							label="Giá Trẻ Em (VNĐ)"
							placeholder="0"
							type="number"
							value={formData.childrenPrice.toString()}
							onValueChange={(value) => handleInputChange("childrenPrice", Number.parseInt(value) || 0)}
							isInvalid={!!errors.childrenPrice}
							errorMessage={errors.childrenPrice}
							startContent={
								<div className="pointer-events-none flex items-center">
									<span className="text-default-400 text-small">VNĐ</span>
								</div>
							}
						/>
					</div>

					<Input
						label="Giá Cuối (VNĐ)"
						placeholder="Tự động tính từ giá người lớn"
						type="number"
						value={formData.adultPrice.toString()}
						isReadOnly
						startContent={
							<div className="pointer-events-none flex items-center">
								<span className="text-default-400 text-small">VNĐ</span>
							</div>
						}
						description="Giá cuối sẽ tự động được tính từ giá người lớn"
					/>
				</CardBody>
			</Card>

			<Card>
				<CardHeader>
					<h3 className="text-lg font-semibold">Trạng Thái</h3>
				</CardHeader>
				<CardBody className="space-y-4">
					<Select
						label="Trạng Thái Tour"
						placeholder="Chọn trạng thái"
						selectedKeys={formData.statusText ? [formData.statusText] : []}
						onSelectionChange={(keys) => {
							const selected = Array.from(keys)[0] as TourStatus
							handleInputChange("statusText", selected)
						}}
						isRequired
					>
						{statusOptions.map((status) => (
							<SelectItem key={status.key} textValue={status.key}>
								{status.label}
							</SelectItem>
						))}
					</Select>
				</CardBody>
			</Card>

			<Divider />

			<div className="flex gap-3 justify-end">
				<Button color="danger" variant="light" onPress={onCancel} isDisabled={isLoading}>
					Hủy
				</Button>
				<Button color="primary" type="submit" isLoading={isLoading}>
					{tour ? "Cập Nhật" : "Tạo Tour"}
				</Button>
			</div>
		</form>
	)
}
