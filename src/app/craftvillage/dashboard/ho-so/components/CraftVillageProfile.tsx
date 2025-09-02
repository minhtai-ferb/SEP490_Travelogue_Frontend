"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageUpload } from "@/app/(manage)/components/locations/create/components/image-upload"
import { AddressSearchInput } from "@/app/(manage)/components/locations/create/components/address-search-input"
import VietmapGL from "@/components/vietmap-gl"
import { SeccretKey } from "@/secret/secret"
import { useCraftVillage } from "@/services/use-craftvillage"
import { useDistrictManager } from "@/services/district-manager"
import {
	MapPin,
	Phone,
	Mail,
	Globe,
	Clock,
	DollarSign,
	Edit2,
	Save,
	X,
	Star,
	Users,
	Award,
	Calendar,
	Camera,
	FileCog,
	Loader2,
	Building,
	History
} from "lucide-react"
import toast from "react-hot-toast"
import { MediaDto } from "@/app/(manage)/components/locations/create/types/CreateLocation"

// Local MediaDto interface for craft village images
interface CraftVillageMediaDto {
	id: number | string
	url: string
	name: string
	description?: string
	isThumbnail: boolean
	type: string
}

// Conversion functions between MediaDto and CraftVillageMediaDto
const convertToMediaDto = (craftVillageMedia: CraftVillageMediaDto[]): MediaDto[] => {
	return craftVillageMedia.map(media => ({
		mediaUrl: media.url,
		isThumbnail: media.isThumbnail
	}))
}

const convertToCraftVillageMediaDto = (mediaDtos: MediaDto[]): CraftVillageMediaDto[] => {
	return mediaDtos.map((media, index) => ({
		id: index,
		url: media.mediaUrl,
		name: `Image ${index + 1}`,
		description: "",
		isThumbnail: media.isThumbnail,
		type: "image"
	}))
}

// TimeSpan utility functions
const ticksToTimeString = (ticks: number): string => {
	const hours = Math.floor(ticks / 36000000000)
	const minutes = Math.floor((ticks % 36000000000) / 600000000)
	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

const timeStringToTicks = (timeString: string): number => {
	const [hours, minutes] = timeString.split(':').map(Number)
	return (hours * 36000000000) + (minutes * 600000000)
}

interface CraftVillageData {
	id: string
	name: string
	description: string
	content: string
	address: string
	latitude: number
	longitude: number
	openTime: number // TimeSpan in ticks
	closeTime: number // TimeSpan in ticks
	districtId?: string
	phoneNumber: string
	email: string
	website?: string
	signatureProduct: string
	yearsOfHistory: number
	isRecognizedByUnesco: boolean
	workshopsAvailable: boolean
	visitPrice?: number
	medias?: Array<{
		id: string
		url: string
		isThumbnail: boolean
		type: string
	}>
}

interface CraftVillageProfileProps {
	craftVillageId: string
}

type FieldErrors = Record<string, string | undefined>

export default function CraftVillageProfile({ craftVillageId }: CraftVillageProfileProps) {
	const { getCraftVillageInfo, updateCraftVillageProfile, loading } = useCraftVillage()
	const { getAllDistrict } = useDistrictManager()

	// Data state
	const [craftVillage, setCraftVillage] = useState<CraftVillageData | null>(null)
	const [isEditing, setIsEditing] = useState(false)
	const [districtOptions, setDistrictOptions] = useState<{ value: string; label: string }[]>([])

	// Form state
	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [content, setContent] = useState("")
	const [address, setAddress] = useState("")
	const [latitude, setLatitude] = useState<number>(11.314528)
	const [longitude, setLongitude] = useState<number>(106.086614)
	const [openTime, setOpenTime] = useState("08:00")
	const [closeTime, setCloseTime] = useState("17:00")
	const [districtId, setDistrictId] = useState("")
	const [phoneNumber, setPhoneNumber] = useState("")
	const [email, setEmail] = useState("")
	const [website, setWebsite] = useState("")
	const [signatureProduct, setSignatureProduct] = useState("")
	const [yearsOfHistory, setYearsOfHistory] = useState<number | "">("")
	const [isRecognizedByUnesco, setIsRecognizedByUnesco] = useState(false)
	const [workshopsAvailable, setWorkshopsAvailable] = useState(false)
	const [visitPrice, setVisitPrice] = useState<number | "">("")
	const [mediaDtos, setMediaDtos] = useState<CraftVillageMediaDto[]>([])

	const [errors, setErrors] = useState<FieldErrors>({})

	// Load districts
	useEffect(() => {
		let isMounted = true
		getAllDistrict().then((list) => {
			if (!isMounted) return
			setDistrictOptions(list.map((d: any) => ({ value: d.id, label: d.name })))
		})
		return () => {
			isMounted = false
		}
	}, [getAllDistrict])

	// Load craft village data
	useEffect(() => {
		if (!craftVillageId) return

		const loadCraftVillage = async () => {
			try {
				const data = await getCraftVillageInfo(craftVillageId)
				if (data) {
					setCraftVillage(data)
					// Populate form fields
					setName(data.name || "")
					setDescription(data.description || "")
					setContent(data.content || "")
					setAddress(data.address || "")
					setLatitude(data.latitude || 11.314528)
					setLongitude(data.longitude || 106.086614)
					setOpenTime(data.openTime ? ticksToTimeString(data.openTime) : "08:00")
					setCloseTime(data.closeTime ? ticksToTimeString(data.closeTime) : "17:00")
					setDistrictId(data.districtId?.toString() || "")
					setPhoneNumber(data.phoneNumber || "")
					setEmail(data.email || "")
					setWebsite(data.website || "")
					setSignatureProduct(data.signatureProduct || "")
					setYearsOfHistory(data.yearsOfHistory || "")
					setIsRecognizedByUnesco(data.isRecognizedByUnesco || false)
					setWorkshopsAvailable(data.workshopsAvailable || false)
					setVisitPrice(data.visitPrice || "")

					// Convert medias to CraftVillageMediaDto format
					if (data.medias) {
						const convertedMedias: CraftVillageMediaDto[] = data.medias.map((media: any, index: number) => ({
							id: index,
							url: media.url,
							name: `Image ${index + 1}`,
							description: "",
							isThumbnail: media.isThumbnail,
							type: media.type
						}))
						setMediaDtos(convertedMedias)
					}
				}
			} catch (error) {
				console.error("Error loading craft village:", error)
				toast.error("Không thể tải thông tin làng nghề")
			}
		}

		loadCraftVillage()
	}, [craftVillageId, getCraftVillageInfo])

	// Validation
	const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
	const isValidWebsite = (v: string) => {
		if (!v) return true
		try {
			new URL(v.startsWith("http") ? v : `https://${v}`)
			return true
		} catch {
			return false
		}
	}
	const isValidCoordinates = (lat: number, lng: number) => lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180

	const validate = (): boolean => {
		const next: FieldErrors = {}
		if (!name.trim()) next.name = "Bắt buộc"
		if (!description.trim()) next.description = "Bắt buộc"
		if (!content.trim()) next.content = "Bắt buộc"
		if (!districtId) next.districtId = "Bắt buộc"
		if (!address.trim()) next.address = "Bắt buộc"
		if (!isValidCoordinates(latitude, longitude)) next.coordinates = "Tọa độ không hợp lệ"
		if (!phoneNumber.trim()) next.phoneNumber = "Bắt buộc"
		if (!email.trim() || !isValidEmail(email)) next.email = "Email không hợp lệ"
		if (!isValidWebsite(website)) next.website = "Website không hợp lệ"
		if (!signatureProduct.trim()) next.signatureProduct = "Bắt buộc"
		if (yearsOfHistory === "" || Number.isNaN(Number(yearsOfHistory))) next.yearsOfHistory = "Bắt buộc"
		if ((Number(yearsOfHistory) || 0) < 1 || (Number(yearsOfHistory) || 0) > 2000) next.yearsOfHistory = "1 - 2000"
		if (openTime >= closeTime) next.closeTime = "Đóng cửa phải sau mở cửa"
		if (!mediaDtos.length) next.mediaDtos = "Vui lòng tải lên ít nhất 1 ảnh"
		if (!workshopsAvailable) {
			if (visitPrice === "" || Number(visitPrice) <= 0) next.visitPrice = "Bắt buộc khi không có workshop"
		}

		setErrors(next)
		return Object.keys(next).length === 0
	}

	const onAddressChange = useCallback((addr: string, lat: number, lng: number) => {
		setAddress(addr)
		setLatitude(lat)
		setLongitude(lng)
		setErrors((e) => ({ ...e, address: undefined, coordinates: undefined }))
	}, [])

	const handleSave = async () => {
		if (!validate()) {
			toast.error("Vui lòng kiểm tra lại thông tin")
			return
		}

		try {
			const updateData = {
				name: name.trim(),
				description: description.trim(),
				content: content.trim(),
				address: address.trim(),
				latitude,
				longitude,
				openTime: timeStringToTicks(openTime),
				closeTime: timeStringToTicks(closeTime),
				districtId: districtId,
				phoneNumber: phoneNumber.replace(/\s/g, ""),
				email: email.trim(),
				website: website.trim() || null,
				signatureProduct: signatureProduct.trim(),
				yearsOfHistory: Number(yearsOfHistory) || 0,
				isRecognizedByUnesco,
				workshopsAvailable,
				visitPrice: workshopsAvailable ? null : (Number(visitPrice) || 0),
				mediaDtos: convertToMediaDto(mediaDtos),
			}

			await updateCraftVillageProfile(craftVillageId, updateData)
			toast.success("Cập nhật thành công!")
			setIsEditing(false)

			// Reload data
			const updatedData = await getCraftVillageInfo(craftVillageId)
			if (updatedData) {
				setCraftVillage(updatedData)
			}
		} catch (error) {
			console.error("Error updating craft village:", error)
			toast.error("Cập nhật thất bại")
		}
	}

	const handleCancel = () => {
		if (craftVillage) {
			// Reset form to original data
			setName(craftVillage.name || "")
			setDescription(craftVillage.description || "")
			setContent(craftVillage.content || "")
			setAddress(craftVillage.address || "")
			setLatitude(craftVillage.latitude || 11.314528)
			setLongitude(craftVillage.longitude || 106.086614)
			setOpenTime(craftVillage.openTime ? ticksToTimeString(craftVillage.openTime) : "08:00")
			setCloseTime(craftVillage.closeTime ? ticksToTimeString(craftVillage.closeTime) : "17:00")
			setDistrictId(craftVillage.districtId?.toString() || "")
			setPhoneNumber(craftVillage.phoneNumber || "")
			setEmail(craftVillage.email || "")
			setWebsite(craftVillage.website || "")
			setSignatureProduct(craftVillage.signatureProduct || "")
			setYearsOfHistory(craftVillage.yearsOfHistory || "")
			setIsRecognizedByUnesco(craftVillage.isRecognizedByUnesco || false)
			setWorkshopsAvailable(craftVillage.workshopsAvailable || false)
			setVisitPrice(craftVillage.visitPrice || "")

			if (craftVillage.medias) {
				const convertedMedias: CraftVillageMediaDto[] = craftVillage.medias.map((media: any, index: number) => ({
					id: index,
					url: media.url,
					name: `Image ${index + 1}`,
					description: "",
					isThumbnail: media.isThumbnail,
					type: media.type
				}))
				setMediaDtos(convertedMedias)
			}
		}
		setErrors({})
		setIsEditing(false)
	}

	// Handle media change with conversion
	const handleMediaChange = (newMediaDtos: MediaDto[]) => {
		const converted = convertToCraftVillageMediaDto(newMediaDtos)
		setMediaDtos(converted)
	}

	const hasThumbnail = mediaDtos.some((m) => m.isThumbnail)
	const thumbnailImage = mediaDtos.find((m) => m.isThumbnail)

	if (!craftVillage) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Loader2 className="h-8 w-8 animate-spin text-blue-600" />
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
			{/* Hero Banner */}
			<div className="relative h-80 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 overflow-hidden">
				<div className="absolute inset-0 bg-black/20" />
				<div className="absolute inset-0 bg-[url('/api/placeholder/1920/400')] bg-cover bg-center opacity-20" />

				<div className="relative max-w-7xl mx-auto px-6 h-full flex items-end pb-8">
					<div className="flex items-end gap-6">
						<Avatar className="h-32 w-32 border-4 border-white shadow-2xl">
							<AvatarImage src={thumbnailImage?.url} alt={craftVillage.name} />
							<AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
								{craftVillage.name.charAt(0)}
							</AvatarFallback>
						</Avatar>

						<div className="text-white pb-4">
							<div className="flex items-center gap-4 mb-2">
								<h1 className="text-4xl font-bold">{craftVillage.name}</h1>
								<div className="flex gap-2">
									{craftVillage.isRecognizedByUnesco && (
										<Badge className="bg-yellow-500 text-black font-medium">
											<Award className="h-3 w-3 mr-1" />
											UNESCO
										</Badge>
									)}
									{craftVillage.workshopsAvailable && (
										<Badge className="bg-green-500 text-white">
											<Users className="h-3 w-3 mr-1" />
											Workshop
										</Badge>
									)}
								</div>
							</div>
							<p className="text-lg text-blue-100 mb-2">{craftVillage.description}</p>
							<div className="flex items-center gap-4 text-sm text-blue-200">
								<span className="flex items-center gap-1">
									<MapPin className="h-4 w-4" />
									{craftVillage.address}
								</span>
								<span className="flex items-center gap-1">
									<History className="h-4 w-4" />
									{craftVillage.yearsOfHistory} năm lịch sử
								</span>
							</div>
						</div>
					</div>

					<div className="ml-auto pb-4">
						{!isEditing ? (
							<Button
								onClick={() => setIsEditing(true)}
								className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 transition-all duration-200"
							>
								<Edit2 className="h-4 w-4 mr-2" />
								Chỉnh sửa hồ sơ
							</Button>
						) : (
							<div className="flex gap-2">
								<Button
									onClick={handleSave}
									disabled={loading}
									className="bg-green-600 hover:bg-green-700 text-white"
								>
									{loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
									Lưu thay đổi
								</Button>
								<Button
									onClick={handleCancel}
									variant="outline"
									className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
								>
									<X className="h-4 w-4 mr-2" />
									Hủy
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
				<Tabs defaultValue="overview" className="space-y-6">
					<TabsList className="grid w-full grid-cols-4 bg-white shadow-lg rounded-xl p-2">
						<TabsTrigger value="overview" className="rounded-lg">Tổng quan</TabsTrigger>
						<TabsTrigger value="contact" className="rounded-lg">Liên hệ</TabsTrigger>
						<TabsTrigger value="location" className="rounded-lg">Vị trí</TabsTrigger>
						<TabsTrigger value="media" className="rounded-lg">Hình ảnh</TabsTrigger>
					</TabsList>

					{/* Overview Tab */}
					<TabsContent value="overview" className="space-y-6">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							{/* Basic Information */}
							<Card className="lg:col-span-2 shadow-lg border-0">
								<CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
									<CardTitle className="flex items-center gap-2 text-xl">
										<Building className="h-5 w-5 text-blue-600" />
										Thông tin cơ bản
									</CardTitle>
								</CardHeader>
								<CardContent className="p-6 space-y-4">
									<div className="space-y-2">
										<Label>Tên làng nghề</Label>
										{isEditing ? (
											<Input
												value={name}
												onChange={(e) => setName(e.target.value)}
												placeholder="Nhập tên làng nghề"
											/>
										) : (
											<p className="text-lg font-medium">{craftVillage.name}</p>
										)}
										{errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
									</div>

									<div className="space-y-2">
										<Label>Mô tả ngắn</Label>
										{isEditing ? (
											<Textarea
												rows={3}
												value={description}
												onChange={(e) => setDescription(e.target.value)}
												placeholder="Mô tả 1-2 câu về làng nghề"
											/>
										) : (
											<p className="text-gray-700">{craftVillage.description}</p>
										)}
										{errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
									</div>

									<div className="space-y-2">
										<Label>Nội dung chi tiết</Label>
										{isEditing ? (
											<Textarea
												rows={5}
												value={content}
												onChange={(e) => setContent(e.target.value)}
												placeholder="Mô tả chi tiết lịch sử, sản phẩm, quy trình..."
											/>
										) : (
											<p className="text-gray-700 whitespace-pre-wrap">{craftVillage.content}</p>
										)}
										{errors.content && <p className="text-xs text-red-500">{errors.content}</p>}
									</div>

									{isEditing && (
										<div className="space-y-2">
											<Label>Quận/Huyện</Label>
											<Select value={districtId} onValueChange={setDistrictId}>
												<SelectTrigger>
													<SelectValue placeholder="Chọn quận/huyện" />
												</SelectTrigger>
												<SelectContent>
													{districtOptions.map((opt) => (
														<SelectItem key={opt.value} value={opt.value}>
															{opt.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											{errors.districtId && <p className="text-xs text-red-500">{errors.districtId}</p>}
										</div>
									)}
								</CardContent>
							</Card>

							{/* Statistics */}
							<Card className="shadow-lg border-0">
								<CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
									<CardTitle className="flex items-center gap-2 text-xl">
										<Star className="h-5 w-5 text-orange-600" />
										Thông tin đặc biệt
									</CardTitle>
								</CardHeader>
								<CardContent className="p-6 space-y-4">
									<div className="space-y-2">
										<Label>Sản phẩm đặc trưng</Label>
										{isEditing ? (
											<Input
												value={signatureProduct}
												onChange={(e) => setSignatureProduct(e.target.value)}
												placeholder="VD: Gốm sứ, mây tre..."
											/>
										) : (
											<p className="font-medium text-orange-700">{craftVillage.signatureProduct}</p>
										)}
										{errors.signatureProduct && <p className="text-xs text-red-500">{errors.signatureProduct}</p>}
									</div>

									<div className="space-y-2">
										<Label>Số năm lịch sử</Label>
										{isEditing ? (
											<Input
												type="number"
												value={yearsOfHistory}
												onChange={(e) => setYearsOfHistory(e.target.value === "" ? "" : Number(e.target.value))}
												placeholder="VD: 200"
											/>
										) : (
											<p className="font-medium text-blue-700">{craftVillage.yearsOfHistory} năm</p>
										)}
										{errors.yearsOfHistory && <p className="text-xs text-red-500">{errors.yearsOfHistory}</p>}
									</div>

									<div className="space-y-2">
										<Label>Giờ hoạt động</Label>
										{isEditing ? (
											<div className="grid grid-cols-2 gap-3">
												<div>
													<Label className="text-xs">Mở cửa</Label>
													<Input type="time" value={openTime} onChange={(e) => setOpenTime(e.target.value)} />
												</div>
												<div>
													<Label className="text-xs">Đóng cửa</Label>
													<Input type="time" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} />
												</div>
											</div>
										) : (
											<p className="flex items-center gap-2 font-medium text-green-700">
												<Clock className="h-4 w-4" />
												{ticksToTimeString(craftVillage.openTime)} - {ticksToTimeString(craftVillage.closeTime)}
											</p>
										)}
										{errors.closeTime && <p className="text-xs text-red-500">{errors.closeTime}</p>}
									</div>

									{isEditing && (
										<div className="space-y-4">
											<div className="flex items-center gap-2">
												<Checkbox
													id="workshopsAvailable"
													checked={workshopsAvailable}
													onCheckedChange={(v) => setWorkshopsAvailable(!!v)}
												/>
												<Label htmlFor="workshopsAvailable">Có workshop/trải nghiệm</Label>
											</div>

											<div className="flex items-center gap-2">
												<Checkbox
													id="isRecognizedByUnesco"
													checked={isRecognizedByUnesco}
													onCheckedChange={(v) => setIsRecognizedByUnesco(!!v)}
												/>
												<Label htmlFor="isRecognizedByUnesco">Được UNESCO công nhận</Label>
											</div>

											{!workshopsAvailable && (
												<div className="space-y-2">
													<Label>Giá tham quan (VNĐ) *</Label>
													<Input
														type="number"
														value={visitPrice}
														onChange={(e) => setVisitPrice(e.target.value === "" ? "" : Number(e.target.value))}
														placeholder="Ví dụ: 50000"
													/>
													{errors.visitPrice && <p className="text-xs text-red-500">{errors.visitPrice}</p>}
												</div>
											)}
										</div>
									)}

									{!workshopsAvailable && !isEditing && craftVillage.visitPrice && (
										<div className="space-y-2">
											<Label>Giá tham quan</Label>
											<p className="flex items-center gap-2 font-medium text-green-700">
												<DollarSign className="h-4 w-4" />
												{craftVillage.visitPrice.toLocaleString("vi-VN")}đ
											</p>
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* Contact Tab */}
					<TabsContent value="contact" className="space-y-6">
						<Card className="shadow-lg border-0">
							<CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
								<CardTitle className="flex items-center gap-2 text-xl">
									<Phone className="h-5 w-5 text-green-600" />
									Thông tin liên hệ
								</CardTitle>
							</CardHeader>
							<CardContent className="p-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-2">
										<Label>Số điện thoại</Label>
										{isEditing ? (
											<Input
												value={phoneNumber}
												onChange={(e) => setPhoneNumber(e.target.value)}
												placeholder="VD: 0912 345 678"
											/>
										) : (
											<p className="flex items-center gap-2 text-lg">
												<Phone className="h-4 w-4 text-green-600" />
												{craftVillage.phoneNumber}
											</p>
										)}
										{errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber}</p>}
									</div>

									<div className="space-y-2">
										<Label>Email</Label>
										{isEditing ? (
											<Input
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												placeholder="you@example.com"
											/>
										) : (
											<p className="flex items-center gap-2 text-lg">
												<Mail className="h-4 w-4 text-blue-600" />
												{craftVillage.email}
											</p>
										)}
										{errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
									</div>

									<div className="md:col-span-2 space-y-2">
										<Label>Website</Label>
										{isEditing ? (
											<Input
												value={website}
												onChange={(e) => setWebsite(e.target.value)}
												placeholder="https://..."
											/>
										) : (
											craftVillage.website && (
												<p className="flex items-center gap-2 text-lg">
													<Globe className="h-4 w-4 text-purple-600" />
													<a
														href={craftVillage.website}
														target="_blank"
														rel="noopener noreferrer"
														className="text-blue-600 hover:underline"
													>
														{craftVillage.website}
													</a>
												</p>
											)
										)}
										{errors.website && <p className="text-xs text-red-500">{errors.website}</p>}
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Location Tab */}
					<TabsContent value="location" className="space-y-6">
						<Card className="shadow-lg border-0">
							<CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
								<CardTitle className="flex items-center gap-2 text-xl">
									<MapPin className="h-5 w-5 text-purple-600" />
									Vị trí & Bản đồ
								</CardTitle>
							</CardHeader>
							<CardContent className="p-6 space-y-4">
								{isEditing ? (
									<div className="space-y-4">
										<div className="space-y-2">
											<Label>Địa chỉ</Label>
											<AddressSearchInput
												value={address}
												latitude={latitude}
												longitude={longitude}
												onChange={onAddressChange}
												placeholder="Nhập địa chỉ để tìm kiếm..."
											/>
											{errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
											{errors.coordinates && <p className="text-xs text-red-500">{errors.coordinates}</p>}
										</div>
									</div>
								) : (
									<div className="space-y-2">
										<Label>Địa chỉ</Label>
										<p className="text-lg">{craftVillage.address}</p>
									</div>
								)}

								<div className="w-full h-[400px] rounded-lg overflow-hidden border">
									<VietmapGL
										apiKey={SeccretKey.VIET_MAP_KEY || ""}
										center={[longitude, latitude]}
										markers={[
											{
												lngLat: [longitude, latitude],
												popupHTML: `<div class="p-2"><strong>${craftVillage.name}</strong><br/>${address}</div>`,
												popupOptions: { offset: 25 },
											},
										]}
										zoom={15}
									/>
								</div>

								<div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
									<div>
										<Label>Vĩ độ</Label>
										<p className="font-mono">{latitude.toFixed(6)}</p>
									</div>
									<div>
										<Label>Kinh độ</Label>
										<p className="font-mono">{longitude.toFixed(6)}</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Media Tab */}
					<TabsContent value="media" className="space-y-6">
						<Card className="shadow-lg border-0">
							<CardHeader className="bg-gradient-to-r from-pink-50 to-orange-50">
								<CardTitle className="flex items-center gap-2 text-xl">
									<Camera className="h-5 w-5 text-pink-600" />
									Hình ảnh làng nghề
								</CardTitle>
							</CardHeader>
							<CardContent className="p-6">
								{isEditing ? (
									<div className="space-y-4">
										<ImageUpload
											mediaDtos={convertToMediaDto(mediaDtos)}
											onChange={handleMediaChange}
											isLoading={loading}
										/>
										{(!mediaDtos.length || !hasThumbnail) && (
											<p className="text-xs text-muted-foreground">Vui lòng tải ít nhất 1 ảnh và chọn ảnh đại diện.</p>
										)}
										{errors.mediaDtos && <p className="text-xs text-red-500">{errors.mediaDtos}</p>}
									</div>
								) : (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
										{craftVillage.medias?.map((media, index) => (
											<div key={media.id} className="relative group">
												<div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
													<img
														src={media.url}
														alt={`${craftVillage.name} - Hình ${index + 1}`}
														className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
													/>
													{media.isThumbnail && (
														<div className="absolute top-2 right-2">
															<Badge className="bg-yellow-500 text-black">
																<Star className="h-3 w-3 mr-1" />
																Đại diện
															</Badge>
														</div>
													)}
												</div>
											</div>
										))}
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}