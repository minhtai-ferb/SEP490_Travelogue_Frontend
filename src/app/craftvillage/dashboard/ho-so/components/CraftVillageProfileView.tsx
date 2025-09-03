"use client"

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import {
	MapPin,
	Edit3,
	Save,
	X,
	CheckCircle,
	AlertCircle,
	Loader2,
	Star,
	Mountain,
	Heart,
	Sparkles,
	Award,
	TreePine,
	Palette,
	Phone,
	Mail,
	Globe,
	Contact,
	FileText,
	Users,
	Edit2,
} from "lucide-react"
import toast from "react-hot-toast"
import { AddressSearchWithMap } from "@/app/(client)/ho-so/gia-nhap/components/request-craft-village/components/organisms/AddressSearchWithMap"
import ContentEditor from "@/components/common/content-editor/ContentEditor"
import { ImageUpload } from "@/app/(manage)/components/locations/create/components/image-upload"
import type { MediaDto } from "@/app/(manage)/components/locations/create/types/CreateLocation"
import { useCraftVillage } from "@/services/use-craftvillage"
import { useDistrictManager } from "@/services/district-manager"
import { District } from "@/types/District"

interface CraftVillageData {
	id: string
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
	mediaDtos: MediaDto[]
}

interface CraftVillageProfileViewProps {
	craftVillageId: string
}

export default function CraftVillageProfileView({ craftVillageId }: CraftVillageProfileViewProps) {
	const { getCraftVillageInfo, updateCraftVillageProfile } = useCraftVillage()
	const { getAllDistrict } = useDistrictManager()

	const [craftVillageData, setCraftVillageData] = useState<CraftVillageData | null>(null)
	const [districts, setDistricts] = useState<District[]>([])
	const [isEditing, setIsEditing] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [isSaving, setIsSaving] = useState(false)
	const [errors, setErrors] = useState<Record<string, string>>({})

	// Form data state
	const [formData, setFormData] = useState<CraftVillageData>({
		id: "",
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
		mediaDtos: [],
	})

	// Progress calculation
	const [completionProgress, setCompletionProgress] = useState(0)
	useEffect(() => {
		const required = [
			formData.name,
			formData.description,
			formData.content,
			formData.address,
			formData.districtId,
			formData.phoneNumber,
			formData.email,
			formData.signatureProduct,
			formData.yearsOfHistory,
		]
		const completed = required.filter((v) => `${v}`.trim().length > 0).length
		const base = (completed / required.length) * 100
		const bonus = Math.min(
			[
				formData.website?.trim() ? 1 : 0,
				formData.mediaDtos.length > 0 ? 1 : 0,
				formData.workshopsAvailable ? 1 : 0,
			].reduce((a, b) => a + b, 0) * 5,
			15,
		)
		setCompletionProgress(Math.min(100, Math.round(base + bonus)))
	}, [formData])

	// Load data
	useEffect(() => {
		const loadData = async () => {
			try {
				setIsLoading(true)

				// Load districts
				const districtsResponse = await getAllDistrict()
				if (districtsResponse?.data) {
					setDistricts(districtsResponse.data)
				}

				// Load craft village data
				const craftVillageResponse = await getCraftVillageInfo(craftVillageId)
				if (craftVillageResponse?.data) {
					const data = craftVillageResponse.data
					const craftVillage: CraftVillageData = {
						id: data.id,
						name: data.name || "",
						description: data.description || "",
						content: data.content || "",
						address: data.address || "",
						latitude: data.latitude || 11.3254,
						longitude: data.longitude || 106.1022,
						openTime: data.openTime || "08:00",
						closeTime: data.closeTime || "17:00",
						districtId: data.districtId || "",
						phoneNumber: data.phoneNumber || "",
						email: data.email || "",
						website: data.website || "",
						workshopsAvailable: data.workshopsAvailable || false,
						signatureProduct: data.signatureProduct || "",
						yearsOfHistory: data.yearsOfHistory?.toString() || "",
						isRecognizedByUnesco: data.isRecognizedByUnesco || false,
						mediaDtos: data.mediaDtos || [],
					}
					setCraftVillageData(craftVillage)
					setFormData(craftVillage)
				}
			} catch (error) {
				console.error("Error loading craft village data:", error)
				toast.error("Không thể tải thông tin làng nghề")
			} finally {
				setIsLoading(false)
			}
		}

		if (craftVillageId) {
			loadData()
		}
	}, [craftVillageId, getCraftVillageInfo, getAllDistrict])

	// Handle input changes
	const handleInputChange = (field: keyof CraftVillageData, value: any) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}))
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors(prev => ({
				...prev,
				[field]: ""
			}))
		}
	}

	// Phone number formatting
	const formatPhoneNumber = (value: string) => {
		const cleaned = value.replace(/\D/g, "")
		if (cleaned.length <= 3) return cleaned
		if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`
		if (cleaned.length <= 9) return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
		return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`
	}

	const handlePhoneChange = (value: string) => {
		const formatted = formatPhoneNumber(value)
		handleInputChange("phoneNumber", formatted)
	}

	// Address change handler
	const handleAddressChange = useCallback((address: string, lat: number, lng: number) => {
		setFormData(prev => ({
			...prev,
			address,
			latitude: lat,
			longitude: lng
		}))
		if (errors.address) {
			setErrors(prev => ({ ...prev, address: "" }))
		}
	}, [errors.address])

	// Validation
	const validateForm = () => {
		const newErrors: Record<string, string> = {}

		if (!formData.name.trim()) newErrors.name = "Tên làng nghề là bắt buộc"
		if (!formData.description.trim()) newErrors.description = "Mô tả ngắn là bắt buộc"
		if (!formData.content.trim()) newErrors.content = "Nội dung chi tiết là bắt buộc"
		if (!formData.address.trim()) newErrors.address = "Địa chỉ là bắt buộc"
		if (!formData.districtId) newErrors.districtId = "Quận/huyện là bắt buộc"
		if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Số điện thoại là bắt buộc"
		if (!formData.email.trim()) newErrors.email = "Email là bắt buộc"
		if (!formData.signatureProduct.trim()) newErrors.signatureProduct = "Sản phẩm đặc trưng là bắt buộc"
		if (!formData.yearsOfHistory.trim()) newErrors.yearsOfHistory = "Số năm lịch sử là bắt buộc"

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (formData.email && !emailRegex.test(formData.email)) {
			newErrors.email = "Email không hợp lệ"
		}

		// Phone validation
		const validatePhone = (phone: string) => /^[\d\s]{10,15}$/.test(phone.replace(/\s/g, ""))
		if (formData.phoneNumber && !validatePhone(formData.phoneNumber)) {
			newErrors.phoneNumber = "Số điện thoại không hợp lệ (10-11 số)"
		}

		// Years validation
		const years = Number.parseInt(formData.yearsOfHistory)
		if (Number.isNaN(years) || years < 1 || years > 2000) {
			newErrors.yearsOfHistory = "Số năm lịch sử phải từ 1 đến 2000"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	// Save changes
	const handleSave = async () => {
		if (!validateForm()) {
			toast.error("Vui lòng kiểm tra và sửa các lỗi trong form")
			return
		}

		try {
			setIsSaving(true)

			const updateData = {
				...formData,
				yearsOfHistory: parseInt(formData.yearsOfHistory)
			}

			await updateCraftVillageProfile(craftVillageId, updateData)
			setCraftVillageData(formData)
			setIsEditing(false)
			toast.success("Cập nhật thông tin làng nghề thành công!")
		} catch (error) {
			console.error("Error updating craft village:", error)
			toast.error("Có lỗi xảy ra khi cập nhật thông tin")
		} finally {
			setIsSaving(false)
		}
	}

	// Cancel editing
	const handleCancel = () => {
		if (craftVillageData) {
			setFormData(craftVillageData)
		}
		setErrors({})
		setIsEditing(false)
	}

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-blue-600" />
			</div>
		)
	}

	if (!craftVillageData) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Không tìm thấy thông tin làng nghề
					</h2>
					<p className="text-gray-600">
						Vui lòng liên hệ quản trị viên để được hỗ trợ
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
			<div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
				{/* Hero Header */}
				<div className="text-center space-y-6">
					<div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full shadow-lg">
						<Mountain className="h-10 w-10 text-white" />
					</div>
					<div className="space-y-3">
						<h1 className="text-4xl py-6 md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
							Hồ sơ làng nghề
						</h1>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
							Quản lý thông tin làng nghề của bạn để thu hút du khách khám phá văn hóa truyền thống
						</p>
					</div>

					{/* Benefits */}
					{/* <div className="flex flex-wrap justify-center gap-4 mt-8">
						<div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
							<Star className="h-4 w-4 text-yellow-500" />
							<span className="text-sm font-medium text-gray-700">Tiếp cận hàng nghìn du khách</span>
						</div>
						<div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
							<Heart className="h-4 w-4 text-red-500" />
							<span className="text-sm font-medium text-gray-700">Bảo tồn văn hóa truyền thống</span>
						</div>
						<div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
							<Sparkles className="h-4 w-4 text-purple-500" />
							<span className="text-sm font-medium text-gray-700">Tăng thu nhập bền vững</span>
						</div>
					</div> */}
				</div>

				{/* Edit Mode Toggle */}
				<div className="flex justify-end">
					{isEditing ? (
						<div className="flex gap-2">
							<Button
								onClick={handleCancel}
								variant="outline"
								className="flex items-center gap-2"
							>
								<X className="h-4 w-4" />
								Hủy
							</Button>
							<Button
								onClick={handleSave}
								disabled={isSaving}
								className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
							>
								{isSaving ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Save className="h-4 w-4" />
								)}
								Lưu thay đổi
							</Button>
						</div>
					) : (
						<Button
							onClick={() => setIsEditing(true)}
							className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
						>
							<Edit2 className="h-4 w-4" />
							Chỉnh sửa
						</Button>
					)}
				</div>

				{/* Progress Bar */}
				<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
					<CardContent className="pt-6">
						<div className="space-y-3">
							<div className="flex justify-between items-center">
								<span className="font-semibold text-gray-700">Độ hoàn thiện hồ sơ</span>
								<span className="text-2xl font-bold text-emerald-600">{completionProgress}%</span>
							</div>
							<Progress value={completionProgress} className="h-3 bg-gray-200" />
							<p className="text-sm text-gray-500 text-center">
								{completionProgress === 100
									? "🎉 Hồ sơ hoàn thiện!"
									: completionProgress >= 85
										? "✨ Gần hoàn thành! Thêm nội dung để tăng độ hấp dẫn"
										: "Vui lòng hoàn thành các thông tin bắt buộc"}
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Main Form */}
				<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
					<CardHeader className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-t-lg">
						<CardTitle className="flex items-center gap-3 text-xl">
							<TreePine className="h-6 w-6" />
							<div>
								<h2 className="text-2xl font-bold">Thông tin làng nghề</h2>
								<p className="text-emerald-100 font-normal text-base">
									{isEditing ? "Chỉnh sửa thông tin làng nghề" : "Xem thông tin làng nghề"}
								</p>
							</div>
						</CardTitle>
					</CardHeader>

					<CardContent className="p-8 space-y-8">
						{/* Basic Information */}
						<div className="space-y-6">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
									<Palette className="h-5 w-5 text-white" />
								</div>
								<h3 className="text-xl font-bold text-gray-800">Giới thiệu cơ bản</h3>
							</div>

							<div className="grid grid-cols-1 gap-6">
								<div className="space-y-3">
									<Label className="text-base font-semibold text-gray-700 flex items-center gap-2">
										<Award className="h-4 w-4 text-emerald-500" />
										Tên làng nghề <span className="text-red-500">*</span>
									</Label>
									{isEditing ? (
										<>
											<Input
												value={formData.name}
												onChange={(e) => handleInputChange("name", e.target.value)}
												placeholder="VD: Làng nghề gốm sứ Bát Tràng"
												className={`h-12 text-base border-2 transition-all duration-200 ${errors.name
													? "border-red-300 focus:border-red-500"
													: "border-gray-200 focus:border-emerald-400 hover:border-gray-300"
													}`}
											/>
											{errors.name && (
												<div className="flex items-center gap-2 text-red-600">
													<AlertCircle className="h-4 w-4" />
													<p className="text-sm">{errors.name}</p>
												</div>
											)}
										</>
									) : (
										<div className="p-3 bg-gray-50 rounded-lg">
											<p className="text-base text-gray-800">{formData.name || "Chưa có thông tin"}</p>
										</div>
									)}
								</div>

								<div className="space-y-3">
									<Label className="text-base font-semibold text-gray-700 flex items-center gap-2">
										<Users className="h-4 w-4 text-blue-500" />
										Mô tả ngắn <span className="text-red-500">*</span>
									</Label>
									{isEditing ? (
										<>
											<Textarea
												value={formData.description}
												onChange={(e) => handleInputChange("description", e.target.value)}
												placeholder="Điểm nổi bật khiến du khách muốn đến thăm..."
												rows={3}
												className={`text-base border-2 transition-all duration-200 resize-none ${errors.description
													? "border-red-300 focus:border-red-500"
													: "border-gray-200 focus:border-emerald-400 hover:border-gray-300"
													}`}
											/>
											{errors.description && (
												<div className="flex items-center gap-2 text-red-600">
													<AlertCircle className="h-4 w-4" />
													<p className="text-sm">{errors.description}</p>
												</div>
											)}
										</>
									) : (
										<div className="p-3 bg-gray-50 rounded-lg">
											<p className="text-base text-gray-800">{formData.description || "Chưa có thông tin"}</p>
										</div>
									)}
								</div>

								<div className="space-y-3">
									<Label className="text-base font-semibold text-gray-700">Nội dung chi tiết <span className="text-red-500">*</span></Label>
									{isEditing ? (
										<>
											<ContentEditor
												content={formData.content}
												onChange={(v) => handleInputChange("content", v)}
											/>
											{errors.content && <p className="text-sm text-red-600">{errors.content}</p>}
										</>
									) : (
										<div className="p-4 bg-gray-50 rounded-lg prose max-w-none">
											<div dangerouslySetInnerHTML={{ __html: formData.content || "Chưa có thông tin" }} />
										</div>
									)}
								</div>
							</div>
						</div>

						<Separator className="my-8" />

						{/* Operating Time, District, Signature */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-3">
								<Label className="text-base font-semibold text-gray-700">Giờ mở cửa <span className="text-red-500">*</span></Label>
								{isEditing ? (
									<Input
										type="time"
										value={formData.openTime}
										onChange={(e) => handleInputChange("openTime", e.target.value)}
										className={`h-12 text-base border-2 ${errors.openTime ? "border-red-300" : "border-gray-200 focus:border-emerald-400"}`}
									/>
								) : (
									<div className="p-3 bg-gray-50 rounded-lg">
										<p className="text-base text-gray-800">{formData.openTime || "Chưa có thông tin"}</p>
									</div>
								)}
							</div>
							<div className="space-y-3">
								<Label className="text-base font-semibold text-gray-700">Giờ đóng cửa <span className="text-red-500">*</span></Label>
								{isEditing ? (
									<>
										<Input
											type="time"
											value={formData.closeTime}
											onChange={(e) => handleInputChange("closeTime", e.target.value)}
											className={`h-12 text-base border-2 ${errors.closeTime ? "border-red-300" : "border-gray-200 focus:border-emerald-400"}`}
										/>
										{errors.closeTime && <p className="text-sm text-red-600">{errors.closeTime}</p>}
									</>
								) : (
									<div className="p-3 bg-gray-50 rounded-lg">
										<p className="text-base text-gray-800">{formData.closeTime || "Chưa có thông tin"}</p>
									</div>
								)}
							</div>
							<div className="space-y-3">
								<Label className="text-base font-semibold text-gray-700">Quận/Huyện <span className="text-red-500">*</span></Label>
								{isEditing ? (
									<>
										<Select value={formData.districtId} onValueChange={(v) => handleInputChange("districtId", v)}>
											<SelectTrigger className={`h-12 text-base border-2 ${errors.districtId ? "border-red-300" : "border-gray-200"}`}>
												<SelectValue placeholder="Chọn quận/huyện" />
											</SelectTrigger>
											<SelectContent>
												{districts.map((d) => (
													<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
												))}
											</SelectContent>
										</Select>
										{errors.districtId && <p className="text-sm text-red-600">{errors.districtId}</p>}
									</>
								) : (
									<div className="p-3 bg-gray-50 rounded-lg">
										<p className="text-base text-gray-800">
											{districts.find(d => d.id === formData.districtId)?.name || "Chưa có thông tin"}
										</p>
									</div>
								)}
							</div>
							<div className="space-y-3">
								<Label className="text-base font-semibold text-gray-700">Sản phẩm đặc trưng <span className="text-red-500">*</span></Label>
								{isEditing ? (
									<>
										<Input
											value={formData.signatureProduct}
											onChange={(e) => handleInputChange("signatureProduct", e.target.value)}
											placeholder="VD: Gốm sứ, lụa, mộc, ..."
											className={`h-12 text-base border-2 ${errors.signatureProduct ? "border-red-300" : "border-gray-200 focus:border-emerald-400"}`}
										/>
										{errors.signatureProduct && <p className="text-sm text-red-600">{errors.signatureProduct}</p>}
									</>
								) : (
									<div className="p-3 bg-gray-50 rounded-lg">
										<p className="text-base text-gray-800">{formData.signatureProduct || "Chưa có thông tin"}</p>
									</div>
								)}
							</div>
							<div className="space-y-3">
								<Label className="text-base font-semibold text-gray-700">Số năm lịch sử <span className="text-red-500">*</span></Label>
								{isEditing ? (
									<>
										<Input
											type="number"
											min={1}
											max={2000}
											value={formData.yearsOfHistory}
											onChange={(e) => handleInputChange("yearsOfHistory", e.target.value)}
											className={`h-12 text-base border-2 ${errors.yearsOfHistory ? "border-red-300" : "border-gray-200 focus:border-emerald-400"}`}
										/>
										{errors.yearsOfHistory && <p className="text-sm text-red-600">{errors.yearsOfHistory}</p>}
									</>
								) : (
									<div className="p-3 bg-gray-50 rounded-lg">
										<p className="text-base text-gray-800">{formData.yearsOfHistory || "Chưa có thông tin"} năm</p>
									</div>
								)}
							</div>
							<div className="flex items-center gap-3 pt-8">
								{isEditing ? (
									<Checkbox
										id="unesco"
										checked={formData.isRecognizedByUnesco}
										onCheckedChange={(v) => handleInputChange("isRecognizedByUnesco", !!v)}
									/>
								) : (
									<div className="flex items-center gap-2">
										{formData.isRecognizedByUnesco ? (
											<CheckCircle className="h-4 w-4 text-green-500" />
										) : (
											<X className="h-4 w-4 text-gray-400" />
										)}
									</div>
								)}
								<Label htmlFor="unesco" className="text-sm text-gray-700">Được UNESCO công nhận</Label>
							</div>
						</div>

						<Separator className="my-8" />

						{/* Location */}
						<div className="space-y-6">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
									<MapPin className="h-5 w-5 text-white" />
								</div>
								<h3 className="text-xl font-bold text-gray-800">Vị trí địa lý</h3>
							</div>

							<div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
								{isEditing ? (
									<>
										<AddressSearchWithMap
											address={formData.address}
											latitude={formData.latitude}
											longitude={formData.longitude}
											onAddressChange={handleAddressChange}
											addressError={errors.address}
										/>
										{errors.address && (
											<div className="flex items-center gap-2 text-red-600 mt-3">
												<AlertCircle className="h-4 w-4" />
												<p className="text-sm">{errors.address}</p>
											</div>
										)}
									</>
								) : (
									<div className="space-y-4">
										<div className="p-3 bg-white rounded-lg">
											<Label className="text-sm font-semibold text-gray-600">Địa chỉ</Label>
											<p className="text-base text-gray-800 mt-1">{formData.address || "Chưa có thông tin"}</p>
										</div>
										<div className="grid grid-cols-2 gap-4">
											<div className="p-3 bg-white rounded-lg">
												<Label className="text-sm font-semibold text-gray-600">Vĩ độ</Label>
												<p className="text-base text-gray-800 mt-1">{formData.latitude}</p>
											</div>
											<div className="p-3 bg-white rounded-lg">
												<Label className="text-sm font-semibold text-gray-600">Kinh độ</Label>
												<p className="text-base text-gray-800 mt-1">{formData.longitude}</p>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>

						<Separator className="my-8" />

						{/* Contact Information */}
						<div className="space-y-6">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
									<Contact className="h-5 w-5 text-white" />
								</div>
								<div>
									<h3 className="text-xl font-bold text-gray-800">Thông tin liên hệ</h3>
									<p className="text-sm text-gray-600 mt-1">Bắt buộc: SĐT và Email. Website là tùy chọn.</p>
								</div>
							</div>

							<div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									<div className="space-y-3">
										<Label className="text-base font-semibold text-gray-700 flex items-center gap-2">
											<Phone className="h-4 w-4 text-green-500" />
											Số điện thoại <span className="text-red-500">*</span>
										</Label>
										{isEditing ? (
											<>
												<Input
													value={formData.phoneNumber}
													onChange={(e) => handlePhoneChange(e.target.value)}
													placeholder="VD: 0912 345 678"
													className={`h-12 text-base border-2 transition-all duration-200 ${errors.phoneNumber
														? "border-red-300 focus:border-red-500"
														: "border-gray-200 focus:border-orange-400 hover:border-gray-300"
														}`}
												/>
												{errors.phoneNumber && (
													<div className="flex items-center gap-2 text-red-600">
														<AlertCircle className="h-4 w-4" />
														<p className="text-sm">{errors.phoneNumber}</p>
													</div>
												)}
											</>
										) : (
											<div className="p-3 bg-white rounded-lg">
												<p className="text-base text-gray-800">{formData.phoneNumber || "Chưa có thông tin"}</p>
											</div>
										)}
									</div>

									<div className="space-y-3">
										<Label className="text-base font-semibold text-gray-700 flex items-center gap-2">
											<Mail className="h-4 w-4 text-blue-500" />
											Email <span className="text-red-500">*</span>
										</Label>
										{isEditing ? (
											<>
												<Input
													type="email"
													value={formData.email}
													onChange={(e) => handleInputChange("email", e.target.value)}
													placeholder="VD: contact@langnghegom.com"
													className={`h-12 text-base border-2 transition-all duration-200 ${errors.email
														? "border-red-300 focus:border-red-500"
														: "border-gray-200 focus:border-orange-400 hover:border-gray-300"
														}`}
												/>
												{errors.email && (
													<div className="flex items-center gap-2 text-red-600">
														<AlertCircle className="h-4 w-4" />
														<p className="text-sm">{errors.email}</p>
													</div>
												)}
											</>
										) : (
											<div className="p-3 bg-white rounded-lg">
												<p className="text-base text-gray-800">{formData.email || "Chưa có thông tin"}</p>
											</div>
										)}
									</div>

									<div className="space-y-3">
										<Label className="text-base font-semibold text-gray-700 flex items-center gap-2">
											<Globe className="h-4 w-4 text-purple-500" />
											Website
											<Badge variant="secondary" className="ml-2 text-xs bg-purple-100 text-purple-700">
												Tùy chọn
											</Badge>
										</Label>
										{isEditing ? (
											<>
												<Input
													value={formData.website}
													onChange={(e) => handleInputChange("website", e.target.value)}
													placeholder="VD: https://langnghegom.com"
													className={`h-12 text-base border-2 transition-all duration-200 ${errors.website
														? "border-red-300 focus:border-red-500"
														: "border-gray-200 focus:border-orange-400 hover:border-gray-300"
														}`}
												/>
												{errors.website && (
													<div className="flex items-center gap-2 text-red-600">
														<AlertCircle className="h-4 w-4" />
														<p className="text-sm">{errors.website}</p>
													</div>
												)}
											</>
										) : (
											<div className="p-3 bg-white rounded-lg">
												{formData.website ? (
													<a
														href={formData.website}
														target="_blank"
														rel="noopener noreferrer"
														className="text-base text-blue-600 hover:text-blue-800 underline"
													>
														{formData.website}
													</a>
												) : (
													<p className="text-base text-gray-800">Chưa có thông tin</p>
												)}
											</div>
										)}
									</div>
								</div>
							</div>
						</div>

						<Separator className="my-8" />

						{/* Images */}
						<div className="space-y-6">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-fuchsia-500 rounded-full flex items-center justify-center">
									<FileText className="h-5 w-5 text-white" />
								</div>
								<h3 className="text-xl font-bold text-gray-800">Hình ảnh minh chứng</h3>
							</div>

							{isEditing ? (
								<>
									<ImageUpload
										mediaDtos={formData.mediaDtos}
										onChange={(items: MediaDto[]) => {
											handleInputChange("mediaDtos", items)
										}}
									/>
									{errors.mediaDtos && <p className="text-sm text-red-600">{errors.mediaDtos}</p>}
								</>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{formData.mediaDtos.length > 0 ? (
										formData.mediaDtos.map((media, index) => (
											<div key={index} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
												<img
													src={media.mediaUrl}
													alt={`Hình ảnh ${index + 1}`}
													className="w-full h-full object-cover"
												/>
												{media.isThumbnail && (
													<div className="absolute top-2 left-2">
														<Badge className="bg-emerald-500 text-white">Ảnh đại diện</Badge>
													</div>
												)}
											</div>
										))
									) : (
										<div className="col-span-full text-center py-8 text-gray-500">
											Chưa có hình ảnh minh chứng
										</div>
									)}
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
