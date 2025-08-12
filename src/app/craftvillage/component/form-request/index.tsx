"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AddressSearchInput } from "@/app/admin/locations/create/components/address-search-input"
import { MapPin, Clock, Phone, Mail, Globe, Award, Calendar, Loader2, CheckCircle, Trash2, Upload, FileText } from "lucide-react"
import { useCraftVillage } from "@/services/use-craftvillage"
import toast from "react-hot-toast"
import { useDistrictManager } from "@/services/district-manager"
import { District } from "@/types/District"
import VietmapGL from "@/components/vietmap-gl"
import { SeccretKey } from "@/secret/secret"
import { useTourguideAssign } from "@/services/tourguide"


interface FormData {
	name: string
	description: string
	content: string
	address: string
	latitude: number
	longitude: number
	openTime: string
	closeTime: string
	districtId: string
	phoneNumber: string
	email: string
	website: string
	workshopsAvailable: boolean
	signatureProduct: string
	yearsOfHistory: string
	isRecognizedByUnesco: boolean
	model: string
}

interface FormErrors {
	[key: string]: string
}

export default function CraftVillageForm() {
	const { createCraftVillageRequest } = useCraftVillage()
	const { getAllDistrict } = useDistrictManager()
	const { uploadCertifications } = useTourguideAssign()
	const [districts, setDistricts] = useState<District[]>([])

	useEffect(() => {
		getAllDistrict().then((res) => {
			setDistricts(res)
		})
	}, [getAllDistrict])
	const [formData, setFormData] = useState<FormData>({
		name: "",
		description: "",
		content: "",
		address: "",
		latitude: 11.3254,
		longitude: 106.1022,
		openTime: "08:00",
		closeTime: "17:00",
		districtId: "",
		phoneNumber: "",
		email: "",
		website: "",
		workshopsAvailable: false,
		signatureProduct: "",
		yearsOfHistory: "",
		isRecognizedByUnesco: false,
		model: "",
	})

	const [errors, setErrors] = useState<FormErrors>({})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)
	const [modelImages, setModelImages] = useState<File[]>([])
	const [modelImagePreviews, setModelImagePreviews] = useState<string[]>([])
	const [modelFileTypes, setModelFileTypes] = useState<string[]>([])
	const [modelFileNames, setModelFileNames] = useState<string[]>([])

	// Format phone number as user types
	const formatPhoneNumber = (value: string) => {
		const cleaned = value.replace(/\D/g, "")
		const match = cleaned.match(/^(\d{0,4})(\d{0,3})(\d{0,3})$/)
		if (match) {
			return [match[1], match[2], match[3]].filter(Boolean).join(" ")
		}
		return value
	}

	// Validation functions
	const validateEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return emailRegex.test(email)
	}

	const validatePhone = (phone: string) => {
		const cleaned = phone.replace(/\D/g, "")
		return cleaned.length >= 10 && cleaned.length <= 11
	}

	const validateWebsite = (website: string) => {
		if (!website) return true // Optional field
		try {
			new URL(website.startsWith("http") ? website : `https://${website}`)
			return true
		} catch {
			return false
		}
	}

	const validateCoordinates = (lat: number, lng: number) => {
		return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
	}

	// Handle form field changes
	const handleInputChange = useCallback(
		(field: keyof FormData, value: any) => {
			setFormData((prev) => ({ ...prev, [field]: value }))

			// Clear error when user starts typing
			if (errors[field]) {
				setErrors((prev) => ({ ...prev, [field]: "" }))
			}
		},
		[errors],
	)

	// Handle phone number with formatting
	const handlePhoneChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const formatted = formatPhoneNumber(e.target.value)
			handleInputChange("phoneNumber", formatted)
		},
		[handleInputChange],
	)

	// Handle address selection from map component
	const handleAddressChange = useCallback(
		(address: string, lat: number, lng: number) => {
			setFormData((prev) => ({
				...prev,
				address,
				latitude: lat,
				longitude: lng,
			}))

			// Clear address-related errors
			if (errors.address || errors.latitude || errors.longitude) {
				setErrors((prev) => ({
					...prev,
					address: "",
					latitude: "",
					longitude: "",
				}))
			}
		},
		[errors],
	)

	// Validate entire form
	const validateForm = (): boolean => {
		const newErrors: FormErrors = {}

		// Required fields
		if (!formData.name.trim()) newErrors.name = "Tên làng nghề là bắt buộc"
		if (!formData.description.trim()) newErrors.description = "Mô tả ngắn là bắt buộc"
		if (!formData.content.trim()) newErrors.content = "Nội dung chi tiết là bắt buộc"
		if (!formData.address.trim()) newErrors.address = "Địa chỉ là bắt buộc"
		if (!formData.districtId) newErrors.districtId = "Vui lòng chọn quận/huyện"
		if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Số điện thoại là bắt buộc"
		if (!formData.email.trim()) newErrors.email = "Email là bắt buộc"
		if (!formData.signatureProduct.trim()) newErrors.signatureProduct = "Sản phẩm đặc trưng là bắt buộc"
		if (!formData.yearsOfHistory.trim()) newErrors.yearsOfHistory = "Số năm lịch sử là bắt buộc"
		if (modelImages.length === 0) newErrors.model = "Vui lòng chọn ít nhất 1 hình ảnh model"

		// Format validation
		if (formData.email && !validateEmail(formData.email)) {
			newErrors.email = "Email không hợp lệ"
		}

		if (formData.phoneNumber && !validatePhone(formData.phoneNumber)) {
			newErrors.phoneNumber = "Số điện thoại không hợp lệ (10-11 số)"
		}

		if (formData.website && !validateWebsite(formData.website)) {
			newErrors.website = "Website không hợp lệ"
		}

		if (!validateCoordinates(formData.latitude, formData.longitude)) {
			newErrors.coordinates = "Tọa độ không hợp lệ"
		}

		// Years validation
		const years = Number.parseInt(formData.yearsOfHistory)
		if (isNaN(years) || years < 1 || years > 2000) {
			newErrors.yearsOfHistory = "Số năm lịch sử phải từ 1 đến 2000"
		}

		// Time validation
		if (formData.openTime >= formData.closeTime) {
			newErrors.closeTime = "Giờ đóng cửa phải sau giờ mở cửa"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	// Convert time string (HH:mm) to .NET TimeSpan format HH:mm:ss
	const timeToTimeSpan = (timeString: string): string => {
		const [h, m] = timeString.split(":")
		const hh = String(h).padStart(2, "0")
		const mm = String(m).padStart(2, "0")
		return `${hh}:${mm}:00`
	}

	// Handle model image upload
	const handleModelImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || [])
		if (files.length > 0) {
			// Check if adding these files would exceed the limit
			if (modelImages.length + files.length > 6) {
				toast.error('Tối đa chỉ được upload 6 tập tin (ảnh/PDF)')
				return
			}

			const validFiles: File[] = []
			const validPreviews: string[] = []
			const validTypes: string[] = []
			const validNames: string[] = []

			for (const file of files) {
				const isImage = file.type.startsWith('image/')
				const isPdf = file.type === 'application/pdf'
				if (!isImage && !isPdf) {
					toast.error(`${file.name} không phải là hình ảnh hoặc PDF`)
					continue
				}

				// Validate file size (max 5MB)
				if (file.size > 5 * 1024 * 1024) {
					toast.error(`${file.name} có kích thước vượt quá 5MB`)
					continue
				}

				validFiles.push(file)
				validTypes.push(file.type)
				validNames.push(file.name)
				validPreviews.push(URL.createObjectURL(file))
			}

			if (validFiles.length > 0) {
				setModelImages(prev => [...prev, ...validFiles])
				setModelImagePreviews(prev => [...prev, ...validPreviews])
				setModelFileTypes(prev => [...prev, ...validTypes])
				setModelFileNames(prev => [...prev, ...validNames])
			}

			// Clear error
			if (errors.model) {
				setErrors((prev) => ({ ...prev, model: "" }))
			}
		}
	}

	const removeModelImage = (index: number) => {
		setModelImages(prev => prev.filter((_, i) => i !== index))
		setModelImagePreviews(prev => {
			const next = prev.filter((_, i) => i !== index)
			// Revoke the object URL to avoid memory leaks
			URL.revokeObjectURL(prev[index])
			return next
		})
		setModelFileTypes(prev => prev.filter((_, i) => i !== index))
		setModelFileNames(prev => prev.filter((_, i) => i !== index))
	}

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!validateForm()) {
			toast.error("Vui lòng kiểm tra lại thông tin")
			return
		}

		setIsSubmitting(true)

		try {
			// Upload model images first
			let modelImageUrls: string[] = []
			if (modelImages.length > 0) {
				const uploadedUrls = await uploadCertifications(modelImages)
				modelImageUrls = uploadedUrls
				if (!Array.isArray(modelImageUrls) || modelImageUrls.length === 0) {
					toast.error("Upload tệp thất bại. Vui lòng thử lại hoặc chọn tệp khác")
					setIsSubmitting(false)
					return
				}
			}

			const requestData = {
				name: formData.name.trim(),
				description: formData.description.trim(),
				content: formData.content.trim(),
				address: formData.address.trim(),
				latitude: formData.latitude,
				longitude: formData.longitude,
				openTime: timeToTimeSpan(formData.openTime),
				closeTime: timeToTimeSpan(formData.closeTime),
				districtId: formData.districtId,
				phoneNumber: formData.phoneNumber.replace(/\s/g, ""),
				email: formData.email.trim(),
				website: formData.website.trim() || null,
				workshopsAvailable: formData.workshopsAvailable,
				signatureProduct: formData.signatureProduct.trim(),
				yearsOfHistory: Number.parseInt(formData.yearsOfHistory),
				isRecognizedByUnesco: formData.isRecognizedByUnesco,
				model: modelImageUrls.join(','),
			}

			await createCraftVillageRequest(requestData)

			setIsSuccess(true)
			toast.success("Đăng ký thành công! Chúng tôi sẽ xem xét và phản hồi sớm nhất.")

			// Reset form after success
			setTimeout(() => {
				setFormData({
					name: "",
					description: "",
					content: "",
					address: "",
					latitude: 11.3254,
					longitude: 106.1022,
					openTime: "08:00",
					closeTime: "17:00",
					districtId: "",
					phoneNumber: "",
					email: "",
					website: "",
					workshopsAvailable: false,
					signatureProduct: "",
					yearsOfHistory: "",
					isRecognizedByUnesco: false,
					model: "",
				})
				setModelImages([])
				setModelImagePreviews([])
				setModelFileTypes([])
				setModelFileNames([])
				setIsSuccess(false)
			}, 3000)
		} catch (error: any) {
			console.error("Submit error:", error)
			toast.error(error.message || "Có lỗi xảy ra, vui lòng thử lại")
		} finally {
			setIsSubmitting(false)
		}
	}

	if (isSuccess) {
		return (
			<Card className="max-w-md mx-auto">
				<CardContent className="pt-6">
					<div className="text-center space-y-4">
						<CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
						<h3 className="text-xl font-semibold text-gray-900">Đăng ký thành công!</h3>
						<p className="text-gray-600">Cảm ơn bạn đã đăng ký. Chúng tôi sẽ xem xét thông tin và liên hệ sớm nhất.</p>
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-8">
			{/* Basic Information */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<MapPin className="h-5 w-5 text-blue-600" />
						Thông tin cơ bản
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<Label htmlFor="name" className="text-sm font-medium">
								Tên làng nghề <span className="text-red-500">*</span>
							</Label>
							<Input
								id="name"
								value={formData.name}
								onChange={(e) => handleInputChange("name", e.target.value)}
								placeholder="VD: Làng gốm Bàu Trúc"
								className={errors.name ? "border-red-500" : ""}
								aria-describedby={errors.name ? "name-error" : undefined}
							/>
							{errors.name && (
								<p id="name-error" className="text-sm text-red-600">
									{errors.name}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="districtId" className="text-sm font-medium">
								Quận/Huyện <span className="text-red-500">*</span>
							</Label>
							<Select value={formData.districtId} onValueChange={(value) => handleInputChange("districtId", value)}>
								<SelectTrigger className={errors.districtId ? "border-red-500" : ""}>
									<SelectValue placeholder="Chọn quận/huyện" />
								</SelectTrigger>
								<SelectContent>
									{districts.map((district) => (
										<SelectItem key={district.id} value={district.id}>
											{district.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.districtId && <p className="text-sm text-red-600">{errors.districtId}</p>}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="model" className="text-sm font-medium">
							Hình ảnh Model <span className="text-red-500">*</span>
						</Label>

						{modelImagePreviews.length > 0 ? (
							<div className="space-y-4">
								<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
									{modelImagePreviews.map((preview, index) => (
										<div key={index} className="relative w-full">
											{modelFileTypes[index]?.startsWith('image/') ? (
												<img
													src={preview}
													alt={`Model preview ${index + 1}`}
													className="w-full h-32 object-cover rounded-lg border"
												/>
											) : (
												<a href={preview} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-32 border rounded-lg bg-gray-50">
													<FileText className="w-6 h-6 mr-2 text-gray-600" />
													<span className="text-sm truncate max-w-[85%]">{modelFileNames[index] || 'Tệp PDF'}</span>
												</a>
											)}
											<Button
												type="button"
												variant="destructive"
												size="sm"
												onClick={() => removeModelImage(index)}
												className="absolute top-2 right-2"
											>
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									))}
								</div>
								{modelImagePreviews.length < 6 && (
									<div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
										<input
											type="file"
											id="model"
											accept="image/*,application/pdf,.pdf"
											multiple
											onChange={handleModelImageChange}
											className="hidden"
										/>
										<label
											htmlFor="model"
											className="cursor-pointer flex flex-col items-center space-y-2"
										>
											<Upload className="w-6 h-6 text-gray-400" />
											<div className="text-sm text-gray-600">
												<span className="font-medium text-blue-600 hover:text-blue-500">Thêm ảnh/PDF</span>
											</div>
											<p className="text-xs text-gray-500">Còn {6 - modelImagePreviews.length} slot</p>
										</label>
									</div>
								)}
							</div>
						) : (
							<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
								<input
									type="file"
									id="model"
									accept="image/*,application/pdf,.pdf"
									multiple
									onChange={handleModelImageChange}
									className="hidden"
								/>
								<label
									htmlFor="model"
									className="cursor-pointer flex flex-col items-center space-y-2"
								>
									<Upload className="w-8 h-8 text-gray-400" />
									<div className="text-sm text-gray-600">
										<span className="font-medium text-blue-600 hover:text-blue-500">Chọn ảnh/PDF</span>{" "}hoặc kéo thả vào đây
									</div>
									<p className="text-xs text-gray-500">PNG, JPG, JPEG, PDF tối đa 5MB (tối đa 6 tệp)</p>
								</label>
							</div>
						)}

						{errors.model && (
							<p id="model-error" className="text-sm text-red-600">
								{errors.model}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="description" className="text-sm font-medium">
							Mô tả ngắn <span className="text-red-500">*</span>
						</Label>
						<Textarea
							id="description"
							value={formData.description}
							onChange={(e) => handleInputChange("description", e.target.value)}
							placeholder="Mô tả ngắn gọn về làng nghề (1-2 câu)"
							rows={3}
							className={errors.description ? "border-red-500" : ""}
						/>
						{errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
					</div>

					<div className="space-y-2">
						<Label htmlFor="content" className="text-sm font-medium">
							Nội dung chi tiết <span className="text-red-500">*</span>
						</Label>
						<Textarea
							id="content"
							value={formData.content}
							onChange={(e) => handleInputChange("content", e.target.value)}
							placeholder="Mô tả chi tiết về lịch sử, quy trình sản xuất, sản phẩm..."
							rows={5}
							className={errors.content ? "border-red-500" : ""}
						/>
						{errors.content && <p className="text-sm text-red-600">{errors.content}</p>}
					</div>
				</CardContent>
			</Card>

			{/* Location Information */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<MapPin className="h-5 w-5 text-green-600" />
						Thông tin vị trí
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-2">
						<Label className="text-sm font-medium">
							Địa chỉ <span className="text-red-500">*</span>
						</Label>
						<AddressSearchInput
							value={formData.address}
							latitude={formData.latitude}
							longitude={formData.longitude}
							onChange={handleAddressChange}
							placeholder="Nhập địa chỉ để tìm kiếm..."
						/>
						{errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
						{errors.coordinates && <p className="text-sm text-red-600">{errors.coordinates}</p>}

						<div className="w-full h-[300px]">
							<VietmapGL
								apiKey={SeccretKey.VIET_MAP_KEY || ""}
								center={[formData?.longitude || 106.69531282536502, formData?.latitude || 10.776983649766555]}
								markers={[{
									lngLat: [formData.longitude, formData.latitude],
									popupHTML: `<div>${formData.address}</div>`,
									popupOptions: {
										offset: 25,
									},
								}]}
								zoom={9}
								width="100%"
								height="300px"
							/>
						</div>
					</div>

					<div className="grid md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label className="text-sm font-medium">Vĩ độ</Label>
							<Input
								type="number"
								step="any"
								value={formData.latitude}
								onChange={(e) => handleInputChange("latitude", Number.parseFloat(e.target.value) || 0)}
								placeholder="11.3254"
								readOnly
								className="bg-gray-50"
							/>
						</div>
						<div className="space-y-2">
							<Label className="text-sm font-medium">Kinh độ</Label>
							<Input
								type="number"
								step="any"
								value={formData.longitude}
								onChange={(e) => handleInputChange("longitude", Number.parseFloat(e.target.value) || 0)}
								placeholder="106.1022"
								readOnly
								className="bg-gray-50"
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Contact & Schedule */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Clock className="h-5 w-5 text-purple-600" />
						Liên hệ & Giờ hoạt động
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<Label htmlFor="phoneNumber" className="text-sm font-medium flex items-center gap-2">
								<Phone className="h-4 w-4" />
								Số điện thoại <span className="text-red-500">*</span>
							</Label>
							<Input
								id="phoneNumber"
								value={formData.phoneNumber}
								onChange={handlePhoneChange}
								placeholder="0123 456 789"
								className={errors.phoneNumber ? "border-red-500" : ""}
							/>
							{errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
								<Mail className="h-4 w-4" />
								Email <span className="text-red-500">*</span>
							</Label>
							<Input
								id="email"
								type="email"
								value={formData.email}
								onChange={(e) => handleInputChange("email", e.target.value)}
								placeholder="contact@langnghe.com"
								className={errors.email ? "border-red-500" : ""}
							/>
							{errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="website" className="text-sm font-medium flex items-center gap-2">
							<Globe className="h-4 w-4" />
							Website (tùy chọn)
						</Label>
						<Input
							id="website"
							value={formData.website}
							onChange={(e) => handleInputChange("website", e.target.value)}
							placeholder="https://website.com hoặc website.com"
							className={errors.website ? "border-red-500" : ""}
						/>
						{errors.website && <p className="text-sm text-red-600">{errors.website}</p>}
					</div>

					<div className="grid md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<Label htmlFor="openTime" className="text-sm font-medium">
								Giờ mở cửa
							</Label>
							<Input
								id="openTime"
								type="time"
								value={formData.openTime}
								onChange={(e) => handleInputChange("openTime", e.target.value)}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="closeTime" className="text-sm font-medium">
								Giờ đóng cửa
							</Label>
							<Input
								id="closeTime"
								type="time"
								value={formData.closeTime}
								onChange={(e) => handleInputChange("closeTime", e.target.value)}
								className={errors.closeTime ? "border-red-500" : ""}
							/>
							{errors.closeTime && <p className="text-sm text-red-600">{errors.closeTime}</p>}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Products & History */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Award className="h-5 w-5 text-orange-600" />
						Sản phẩm & Lịch sử
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<Label htmlFor="signatureProduct" className="text-sm font-medium">
								Sản phẩm đặc trưng <span className="text-red-500">*</span>
							</Label>
							<Input
								id="signatureProduct"
								value={formData.signatureProduct}
								onChange={(e) => handleInputChange("signatureProduct", e.target.value)}
								placeholder="VD: Gốm sứ, đồ mây tre đan..."
								className={errors.signatureProduct ? "border-red-500" : ""}
							/>
							{errors.signatureProduct && <p className="text-sm text-red-600">{errors.signatureProduct}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="yearsOfHistory" className="text-sm font-medium flex items-center gap-2">
								<Calendar className="h-4 w-4" />
								Số năm lịch sử <span className="text-red-500">*</span>
							</Label>
							<Input
								id="yearsOfHistory"
								type="number"
								min="1"
								max="2000"
								value={formData.yearsOfHistory}
								onChange={(e) => handleInputChange("yearsOfHistory", e.target.value)}
								placeholder="VD: 200"
								className={errors.yearsOfHistory ? "border-red-500" : ""}
							/>
							{errors.yearsOfHistory && <p className="text-sm text-red-600">{errors.yearsOfHistory}</p>}
						</div>
					</div>

					<Separator />

					<div className="space-y-4">
						<h4 className="font-medium text-gray-900">Tính năng & Chứng nhận</h4>

						<div className="flex items-center space-x-3">
							<Checkbox
								id="workshopsAvailable"
								checked={formData.workshopsAvailable}
								onCheckedChange={(checked) => handleInputChange("workshopsAvailable", checked)}
							/>
							<Label htmlFor="workshopsAvailable" className="text-sm font-medium cursor-pointer">
								Có tổ chức workshop/trải nghiệm cho du khách
							</Label>
						</div>

						<div className="flex items-center space-x-3">
							<Checkbox
								id="isRecognizedByUnesco"
								checked={formData.isRecognizedByUnesco}
								onCheckedChange={(checked) => handleInputChange("isRecognizedByUnesco", checked)}
							/>
							<Label
								htmlFor="isRecognizedByUnesco"
								className="text-sm font-medium cursor-pointer flex items-center gap-2"
							>
								Được UNESCO công nhận
								<Badge variant="secondary" className="text-xs">
									Danh tiếng
								</Badge>
							</Label>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Submit Button */}
			<div className="flex justify-center pt-6">
				<Button
					type="submit"
					disabled={isSubmitting}
					className="w-full md:w-auto px-8 py-3 text-lg font-medium"
					size="lg"
				>
					{isSubmitting ? (
						<>
							<Loader2 className="mr-2 h-5 w-5 animate-spin" />
							Đang gửi đăng ký...
						</>
					) : (
						"Gửi đăng ký làng nghề"
					)}
				</Button>
			</div>
		</form>
	)
}
