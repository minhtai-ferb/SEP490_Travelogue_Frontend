"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
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
			const submitData: Partial<any | any> = {
				...formData,
				finalPrice: formData.adultPrice,
				status: getStatusNumber(formData.statusText),
				statusText: formData.statusText as any,
				tourType: getTourTypeNumber(formData.tourTypeText),
			}
			onSubmit(submitData)
		}
	}

	const getStatusNumber = (statusText: TourStatus): number => {
		const statusMap: Record<TourStatus, number> = {
			Draft: 0,
			Confirmed: 1,
			Cancelled: 3,
		}
		return statusMap[statusText] || 0
	}

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
					<CardTitle>Thông Tin Cơ Bản</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Tên Tour *</Label>
						<Input
							id="name"
							placeholder="Nhập tên tour"
							value={formData.name}
							onChange={(e) => handleInputChange("name", e.target.value)}
							className={errors.name ? "border-red-500" : ""}
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
						/>
						{errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
					</div>

					<div className="space-y-2">
						<Label htmlFor="content">Nội Dung Tour</Label>
						<Textarea
							id="content"
							placeholder="Nhập nội dung chi tiết về tour (tùy chọn)"
							value={formData.content || ""}
							onChange={(e) => handleInputChange("content", e.target.value || null)}
							rows={4}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Loại Tour *</Label>
							<Select value={formData.tourTypeText} onValueChange={(value) => handleInputChange("tourTypeText", value)}>
								<SelectTrigger className={errors.tourTypeText ? "border-red-500" : ""}>
									<SelectValue placeholder="Chọn loại tour" />
								</SelectTrigger>
								<SelectContent>
									{tourTypes.map((type) => (
										<SelectItem key={type.key} value={type.key}>
											{type.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.tourTypeText && <p className="text-sm text-red-500">{errors.tourTypeText}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="totalDaysText">Thời Gian Tour *</Label>
							<Input
								id="totalDaysText"
								placeholder="VD: 7 ngày 6 đêm"
								value={formData.totalDaysText}
								onChange={(e) => handleInputChange("totalDaysText", e.target.value)}
								className={errors.totalDaysText ? "border-red-500" : ""}
							/>
							{errors.totalDaysText && <p className="text-sm text-red-500">{errors.totalDaysText}</p>}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="totalDays">Số Ngày *</Label>
						<Input
							id="totalDays"
							placeholder="7"
							type="number"
							value={formData.totalDays.toString()}
							onChange={(e) => handleInputChange("totalDays", Number.parseInt(e.target.value) || 0)}
							className={errors.totalDays ? "border-red-500" : ""}
						/>
						{errors.totalDays && <p className="text-sm text-red-500">{errors.totalDays}</p>}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Thông Tin Giá</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="adultPrice">Giá Người Lớn (VNĐ) *</Label>
							<Input
								id="adultPrice"
								placeholder="0"
								type="number"
								value={formData.adultPrice.toString()}
								onChange={(e) => handleInputChange("adultPrice", Number.parseInt(e.target.value) || 0)}
								className={errors.adultPrice ? "border-red-500" : ""}
							/>
							{errors.adultPrice && <p className="text-sm text-red-500">{errors.adultPrice}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="childrenPrice">Giá Trẻ Em (VNĐ)</Label>
							<Input
								id="childrenPrice"
								placeholder="0"
								type="number"
								value={formData.childrenPrice.toString()}
								onChange={(e) => handleInputChange("childrenPrice", Number.parseInt(e.target.value) || 0)}
								className={errors.childrenPrice ? "border-red-500" : ""}
							/>
							{errors.childrenPrice && <p className="text-sm text-red-500">{errors.childrenPrice}</p>}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="finalPrice">Giá Cuối (VNĐ)</Label>
						<Input
							id="finalPrice"
							placeholder="Tự động tính từ giá người lớn"
							type="number"
							value={formData.adultPrice.toString()}
							readOnly
							className="bg-gray-50"
						/>
						<p className="text-sm text-gray-500">Giá cuối sẽ tự động được tính từ giá người lớn</p>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Trạng Thái</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label>Trạng Thái Tour *</Label>
						<Select
							value={formData.statusText}
							onValueChange={(value) => handleInputChange("statusText", value as TourStatus)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Chọn trạng thái" />
							</SelectTrigger>
							<SelectContent>
								{statusOptions.map((status) => (
									<SelectItem key={status.key} value={status.key}>
										{status.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			<Separator />

			<div className="flex gap-3 justify-end">
				<Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
					Hủy
				</Button>
				<Button type="submit" disabled={isLoading}>
					{isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
					{tour ? "Cập Nhật" : "Tạo Tour"}
				</Button>
			</div>
		</form>
	)
}
