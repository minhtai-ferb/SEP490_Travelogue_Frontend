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
import {
	MapPin,
	Plus,
	Trash2,
	Edit3,
	Users,
	CheckCircle,
	AlertCircle,
	Send,
	Loader2,
	Star,
	Calendar,
	Ticket,
	Activity,
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
} from "lucide-react"
import toast from "react-hot-toast"
import { AddressSearchWithMap } from "./organisms/AddressSearchWithMap"
import { useDistrictManager } from "@/services/district-manager"
import { useAtomValue } from "jotai"
import { userAtom } from "@/store/auth"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

// Schema-compliant interfaces
interface WorkshopActivity {
	activity: string
	description: string
	startHour: number
	endHour: number
	activityOrder: number
}

interface TicketType {
	type: "Visit" | "Experience"
	name: string
	price: number
	isCombo: boolean
	durationMinutes: number
	content: string
	workshopActivities?: WorkshopActivity[]
}

interface RecurringSession {
	startTime: string
	endTime: string
	capacity: number
}

interface RecurringRule {
	daysOfWeek: string[]
	startDate: string
	endDate: string
	sessions: RecurringSession[]
}

interface WorkshopData {
	name: string
	description: string
	status: "Pending"
	ticketTypes: TicketType[]
	recurringRules: RecurringRule[]
}

export interface ApplicationFormData {
	name: string
	description: string
	address: string
	latitude: number
	longitude: number
	ownerId: string
	workshopsAvailable: boolean
	workshops: WorkshopData[]
	// Optional contact information
	phoneNumber?: string
	email?: string
	website?: string
}

interface ModernTravelApplicationFormProps {
	onSubmit: (data: ApplicationFormData) => void
	isLoading?: boolean
}

export default function ProfessionalApplicationForm({ onSubmit, isLoading = false }: ModernTravelApplicationFormProps) {
	const currentUser = useAtomValue(userAtom)
	const { getAllDistrict } = useDistrictManager()
	const [districtOptions, setDistrictOptions] = useState<{ value: string; label: string }[]>([])

	// Form State
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		address: "",
		latitude: 11.314528,
		longitude: 106.086614,
		workshopsAvailable: false,
		// Optional contact fields
		phoneNumber: "",
		email: "",
		website: "",
	})

	const [workshops, setWorkshops] = useState<WorkshopData[]>([])
	const [showWorkshopModal, setShowWorkshopModal] = useState(false)
	const [editingWorkshop, setEditingWorkshop] = useState<WorkshopData | null>(null)
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [completionProgress, setCompletionProgress] = useState(0)

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

	// Calculate completion progress
	useEffect(() => {
		const requiredFields = [formData.name, formData.description, formData.address]
		const optionalFields = [formData.phoneNumber, formData.email, formData.website].filter(Boolean)

		const completedFields = requiredFields.filter(Boolean).length
		const progress = (completedFields / requiredFields.length) * 100

		// Bonus points for optional fields
		const bonusProgress = Math.min((optionalFields.length / 3) * 10, 10)

		setCompletionProgress(Math.min(progress + bonusProgress, 100))
	}, [formData])

	// Update form data
	const updateFormData = useCallback((updates: Partial<typeof formData>) => {
		setFormData((prev) => ({ ...prev, ...updates }))
		// Clear related errors
		const updatedFields = Object.keys(updates)
		setErrors((prev) => {
			const newErrors = { ...prev }
			updatedFields.forEach((field) => delete newErrors[field])
			return newErrors
		})
	}, [])

	// Handle address change
	const onAddressChange = useCallback(
		(address: string, latitude: number, longitude: number) => {
			updateFormData({ address, latitude, longitude })
		},
		[updateFormData],
	)

	// Workshop management
	const addWorkshop = useCallback(() => {
		const newWorkshop: WorkshopData = {
			name: "",
			description: "",
			status: "Pending",
			ticketTypes: [
				{
					type: "Visit",
					name: "Vé tham quan",
					price: 20000,
					isCombo: false,
					durationMinutes: 60,
					content: "Du khách tham quan và nghe giới thiệu về làng nghề",
				},
				{
					type: "Experience",
					name: "Vé trải nghiệm (bao gồm tham quan)",
					price: 50000,
					isCombo: true,
					durationMinutes: 120,
					content: "Tham quan và trải nghiệm thực hành",
					workshopActivities: [],
				},
			],
			recurringRules: [],
		}
		setEditingWorkshop(newWorkshop)
		setShowWorkshopModal(true)
	}, [])

	const editWorkshop = useCallback((workshop: WorkshopData) => {
		setEditingWorkshop(workshop)
		setShowWorkshopModal(true)
	}, [])

	const deleteWorkshop = useCallback((workshopIndex: number) => {
		setWorkshops((prev) => prev.filter((_, index) => index !== workshopIndex))
		toast.success("Đã xóa trải nghiệm")
	}, [])

	const saveWorkshop = useCallback(
		(workshop: WorkshopData) => {
			if (editingWorkshop && workshops.some((w) => w.name === editingWorkshop.name)) {
				setWorkshops((prev) => prev.map((w) => (w.name === editingWorkshop.name ? workshop : w)))
				toast.success("Đã cập nhật trải nghiệm")
			} else {
				setWorkshops((prev) => [...prev, workshop])
				toast.success("Đã thêm trải nghiệm mới")
			}
			setShowWorkshopModal(false)
			setEditingWorkshop(null)
		},
		[editingWorkshop, workshops],
	)

	// Validation
	const validateForm = useCallback((): boolean => {
		const newErrors: Record<string, string> = {}

		// Required fields
		if (!formData.name.trim()) newErrors.name = "Tên làng nghề là bắt buộc"
		if (!formData.description.trim()) newErrors.description = "Mô tả là bắt buộc"
		if (!formData.address.trim()) newErrors.address = "Địa chỉ là bắt buộc"

		// Optional field validation (only if provided)
		if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Email không hợp lệ"
		}

		if (formData.phoneNumber && !/^[0-9+\-\s()]{10,15}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
			newErrors.phoneNumber = "Số điện thoại không hợp lệ"
		}

		if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
			newErrors.website = "Website phải bắt đầu bằng http:// hoặc https://"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}, [formData])

	// Handle form submission
	const handleSubmit = useCallback(() => {
		if (!validateForm()) {
			toast.error("Vui lòng kiểm tra lại thông tin")
			return
		}

		const applicationData: ApplicationFormData = {
			name: formData.name,
			description: formData.description,
			address: formData.address,
			latitude: formData.latitude,
			longitude: formData.longitude,
			ownerId: currentUser?.id || "",
			workshopsAvailable: formData.workshopsAvailable,
			workshops: workshops,
			// Include optional fields only if they have values
			...(formData.phoneNumber && { phoneNumber: formData.phoneNumber }),
			...(formData.email && { email: formData.email }),
			...(formData.website && { website: formData.website }),
		}

		onSubmit(applicationData)
	}, [formData, workshops, onSubmit, validateForm, currentUser])

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
							Gia nhập cộng đồng du lịch
						</h1>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
							Đăng ký làng nghề của bạn để trở thành điểm đến hấp dẫn cho du khách khám phá văn hóa truyền thống
						</p>
					</div>

					{/* Benefits */}
					<div className="flex flex-wrap justify-center gap-4 mt-8">
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
					</div>
				</div>

				{/* Progress Bar */}
				<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
					<CardContent className="pt-6">
						<div className="space-y-3">
							<div className="flex justify-between items-center">
								<span className="font-semibold text-gray-700">Tiến độ hoàn thành</span>
								<span className="text-2xl font-bold text-emerald-600">{Math.round(completionProgress)}%</span>
							</div>
							<Progress value={completionProgress} className="h-3 bg-gray-200" />
							<p className="text-sm text-gray-500 text-center">
								{completionProgress === 100
									? "🎉 Hoàn thiện! Sẵn sàng gửi đăng ký"
									: completionProgress >= 90
										? "✨ Gần hoàn thành! Thêm thông tin liên hệ để tăng cơ hội được duyệt"
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
									Hãy chia sẻ câu chuyện độc đáo của làng nghề bạn
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
									<Label htmlFor="name" className="text-base font-semibold text-gray-700 flex items-center gap-2">
										<Award className="h-4 w-4 text-emerald-500" />
										Tên làng nghề <span className="text-red-500">*</span>
									</Label>
									<Input
										id="name"
										value={formData.name}
										onChange={(e) => updateFormData({ name: e.target.value })}
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
								</div>

								<div className="space-y-3">
									<Label className="text-base font-semibold text-gray-700 flex items-center gap-2">
										<Users className="h-4 w-4 text-blue-500" />
										Mô tả hấp dẫn <span className="text-red-500">*</span>
									</Label>
									<Textarea
										value={formData.description}
										onChange={(e) => updateFormData({ description: e.target.value })}
										placeholder="Hãy mô tả những điều đặc biệt khiến du khách muốn đến thăm làng nghề của bạn..."
										rows={4}
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
								</div>
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
								<AddressSearchWithMap
									address={formData.address}
									latitude={formData.latitude}
									longitude={formData.longitude}
									onAddressChange={onAddressChange}
									addressError={errors.address}
								/>
								{errors.address && (
									<div className="flex items-center gap-2 text-red-600 mt-3">
										<AlertCircle className="h-4 w-4" />
										<p className="text-sm">{errors.address}</p>
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
									<p className="text-sm text-gray-600 mt-1">Tùy chọn - giúp du khách dễ dàng liên hệ với bạn</p>
								</div>
							</div>

							<div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									<div className="space-y-3">
										<Label className="text-base font-semibold text-gray-700 flex items-center gap-2">
											<Phone className="h-4 w-4 text-green-500" />
											Số điện thoại
											<Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-700">
												Tùy chọn
											</Badge>
										</Label>
										<Input
											value={formData.phoneNumber}
											onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
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
									</div>

									<div className="space-y-3">
										<Label className="text-base font-semibold text-gray-700 flex items-center gap-2">
											<Mail className="h-4 w-4 text-blue-500" />
											Email
											<Badge variant="secondary" className="ml-2 text-xs bg-blue-100 text-blue-700">
												Tùy chọn
											</Badge>
										</Label>
										<Input
											type="email"
											value={formData.email}
											onChange={(e) => updateFormData({ email: e.target.value })}
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
									</div>

									<div className="space-y-3">
										<Label className="text-base font-semibold text-gray-700 flex items-center gap-2">
											<Globe className="h-4 w-4 text-purple-500" />
											Website
											<Badge variant="secondary" className="ml-2 text-xs bg-purple-100 text-purple-700">
												Tùy chọn
											</Badge>
										</Label>
										<Input
											value={formData.website}
											onChange={(e) => updateFormData({ website: e.target.value })}
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
									</div>
								</div>

								<div className="mt-6 bg-white/60 rounded-lg p-4">
									<div className="flex items-start gap-3">
										<Sparkles className="h-5 w-5 text-orange-500 mt-0.5" />
										<div className="text-sm text-gray-700">
											<p className="font-medium mb-1">💡 Mẹo tăng cơ hội được duyệt:</p>
											<ul className="space-y-1 text-xs text-gray-600">
												<li>• Cung cấp số điện thoại giúp du khách dễ dàng liên hệ đặt chuyến tham quan</li>
												<li>• Email chuyên nghiệp tạo ấn tượng tốt với khách hàng</li>
												<li>• Website/Facebook page thể hiện sự chuyên nghiệp</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>

						<Separator className="my-8" />

						{/* Workshop Toggle */}
						<div className="space-y-6">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
									<Activity className="h-5 w-5 text-white" />
								</div>
								<h3 className="text-xl font-bold text-gray-800">Trải nghiệm du lịch</h3>
							</div>

							<div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
								<div className="flex items-start space-x-4">
									<Checkbox
										id="workshopsAvailable"
										checked={formData.workshopsAvailable}
										onCheckedChange={(checked) => updateFormData({ workshopsAvailable: !!checked })}
										className="mt-1 h-5 w-5"
									/>
									<div className="space-y-2">
										<Label
											htmlFor="workshopsAvailable"
											className="text-base font-semibold text-gray-700 cursor-pointer"
										>
											Có cung cấp trải nghiệm cho du khách
										</Label>
										<p className="text-sm text-gray-600 leading-relaxed">
											Trải nghiệm thực hành giúp du khách hiểu sâu hơn về nghề truyền thống và tăng thu nhập cho làng
											nghề
										</p>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Workshop Section */}
				<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
					<CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
						<CardTitle className="flex items-center gap-3 text-xl">
							<Ticket className="h-6 w-6" />
							<div>
								<h2 className="text-2xl font-bold">Trải nghiệm làng nghề</h2>
								<p className="text-purple-100 font-normal text-base">Tạo những trải nghiệm làng nghề đáng nhớ cho du khách</p>
							</div>
						</CardTitle>
					</CardHeader>

					<CardContent className="p-8">
						{workshops.length === 0 ? (
							<div className="text-center py-16 space-y-6">
								<div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto">
									<Plus className="h-12 w-12 text-purple-500" />
								</div>
								<div className="space-y-3">
									<h3 className="text-2xl font-bold text-gray-800">Tạo trải nghiệm đầu tiên</h3>
									<p className="text-gray-600 max-w-md mx-auto leading-relaxed">
										Hãy thiết kế những trải nghiệm thú vị để du khách có thể tham gia và học hỏi từ nghề truyền thống
										của bạn
									</p>
								</div>
								<Button
									onClick={addWorkshop}
									size="lg"
									className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
								>
									<Plus className="h-5 w-5 mr-2" />
									Tạo trải nghiệm đầu tiên
								</Button>
							</div>
						) : (
							<div className="space-y-6">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<Badge variant="secondary" className="bg-purple-100 text-purple-700 px-3 py-1 text-base">
											{workshops.length} trải nghiệm
										</Badge>
										<span className="text-sm text-gray-500">Tuyệt vời! Bạn đang tạo ra giá trị cho du khách</span>
									</div>
									<Button
										onClick={addWorkshop}
										variant="outline"
										className="border-purple-300 text-purple-600 hover:bg-purple-50 bg-transparent"
									>
										<Plus className="h-4 w-4 mr-2" />
										Thêm trải nghiệm
									</Button>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{workshops.map((workshop, index) => (
										<Card
											key={index}
											className="border-2 border-purple-100 hover:border-purple-300 transition-all duration-200 hover:shadow-lg"
										>
											<CardContent className="p-6">
												<div className="space-y-4">
													<div className="flex items-start justify-between">
														<div className="flex-1">
															<h4 className="font-bold text-lg text-gray-800 mb-2">{workshop.name}</h4>
															<p className="text-gray-600 text-sm leading-relaxed">{workshop.description}</p>
														</div>
														<div className="flex items-center gap-2 ml-4">
															<Button size="sm" variant="outline" onClick={() => editWorkshop(workshop)}>
																<Edit3 className="h-4 w-4" />
															</Button>
															<Button
																size="sm"
																variant="outline"
																onClick={() => deleteWorkshop(index)}
																className="text-red-600 hover:text-red-700 hover:bg-red-50"
															>
																<Trash2 className="h-4 w-4" />
															</Button>
														</div>
													</div>

													<div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
														<div className="text-center">
															<div className="text-2xl font-bold text-emerald-600">
																{workshop.ticketTypes.find((t) => t.type === "Visit")?.price.toLocaleString() || "0"}đ
															</div>
															<div className="text-xs text-gray-500">Vé tham quan</div>
														</div>
														<div className="text-center">
															<div className="text-2xl font-bold text-purple-600">
																{workshop.ticketTypes.find((t) => t.type === "Experience")?.price.toLocaleString() ||
																	"0"}
																đ
															</div>
															<div className="text-xs text-gray-500">Vé trải nghiệm</div>
														</div>
													</div>

													<div className="flex flex-wrap gap-2 pt-2">
														<Badge variant="outline" className="text-xs">
															{workshop.recurringRules.length} lịch trình
														</Badge>
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Summary & Submit */}
				<Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-2 border-emerald-200 shadow-xl">
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-xl">
							<CheckCircle className="h-6 w-6 text-emerald-600" />
							<div>
								<h2 className="text-2xl font-bold text-gray-800">Xem lại thông tin</h2>
								<p className="text-gray-600 font-normal text-base">Kiểm tra lại trước khi gửi đăng ký</p>
							</div>
						</CardTitle>
					</CardHeader>

					<CardContent className="p-8 space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="text-center p-6 bg-white rounded-xl shadow-sm">
								<TreePine className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
								<h3 className="font-bold text-gray-800 mb-2">Làng nghề</h3>
								<p className="text-2xl font-bold text-emerald-600 mb-1">{formData.name || "Chưa đặt tên"}</p>
								<p className="text-sm text-gray-500">Điểm đến văn hóa</p>
							</div>

							<div className="text-center p-6 bg-white rounded-xl shadow-sm">
								<MapPin className="h-12 w-12 text-blue-600 mx-auto mb-3" />
								<h3 className="font-bold text-gray-800 mb-2">Vị trí</h3>
								<p className="text-sm text-blue-600 font-medium">{formData.address || "Chưa có địa chỉ"}</p>
							</div>

							<div className="text-center p-6 bg-white rounded-xl shadow-sm">
								<Activity className="h-12 w-12 text-purple-600 mx-auto mb-3" />
								<h3 className="font-bold text-gray-800 mb-2">Trải nghiệm</h3>
								<p className="text-2xl font-bold text-purple-600 mb-1">{workshops.length}</p>
								<p className="text-sm text-gray-500">{workshops.length > 0 ? "hoạt động" : "Chưa có trải nghiệm"}</p>
							</div>
						</div>

						{/* Contact Information Summary */}
						{(formData.phoneNumber || formData.email || formData.website) && (
							<div className="bg-white rounded-xl p-6 shadow-sm">
								<h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
									<Contact className="h-5 w-5 text-orange-500" />
									Thông tin liên hệ
								</h4>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
									{formData.phoneNumber && (
										<div className="flex items-center gap-2">
											<Phone className="h-4 w-4 text-green-500" />
											<div>
												<span className="text-gray-500">Điện thoại:</span>
												<p className="font-medium">{formData.phoneNumber}</p>
											</div>
										</div>
									)}
									{formData.email && (
										<div className="flex items-center gap-2">
											<Mail className="h-4 w-4 text-blue-500" />
											<div>
												<span className="text-gray-500">Email:</span>
												<p className="font-medium">{formData.email}</p>
											</div>
										</div>
									)}
									{formData.website && (
										<div className="flex items-center gap-2">
											<Globe className="h-4 w-4 text-purple-500" />
											<div>
												<span className="text-gray-500">Website:</span>
												<p className="font-medium">{formData.website}</p>
											</div>
										</div>
									)}
								</div>
							</div>
						)}

						{workshops.length > 0 && (
							<div className="bg-white rounded-xl p-6 shadow-sm">
								<h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
									<Ticket className="h-5 w-5 text-purple-500" />
									Danh sách trải nghiệm
								</h4>
								<div className="space-y-3">
									{workshops.map((workshop, index) => (
										<div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
											<div>
												<p className="font-semibold text-gray-800">
													{index + 1}. {workshop.name}
												</p>
												<p className="text-sm text-gray-600">{workshop.description}</p>
											</div>
											<div className="text-right">
												<p className="font-bold text-emerald-600">
													{workshop.ticketTypes.find((t) => t.type === "Visit")?.price.toLocaleString()}đ+
												</p>
												<p className="text-xs text-gray-500">Từ</p>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						<div className="text-center space-y-6 pt-6">
							<div className="space-y-3">
								<h3 className="text-2xl font-bold text-gray-800">Sẵn sàng gia nhập cộng đồng?</h3>
								<p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
									Chúng tôi sẽ xem xét đăng ký của bạn và phản hồi trong vòng 2-3 ngày làm việc. Hãy chuẩn bị đón chào
									những du khách đầu tiên!
								</p>
							</div>

							<Button
								onClick={handleSubmit}
								disabled={isLoading || completionProgress < 70}
								size="lg"
								className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-12 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
							>
								{isLoading ? (
									<>
										<Loader2 className="h-6 w-6 mr-3 animate-spin" />
										Đang gửi đăng ký...
									</>
								) : (
									<>
										<Send className="h-6 w-6 mr-3" />
										Gửi đăng ký tham gia
									</>
								)}
							</Button>

							{completionProgress < 70 && (
								<div className="flex items-center justify-center gap-2 text-amber-600">
									<AlertCircle className="h-4 w-4" />
									<p className="text-sm">Vui lòng hoàn thành các thông tin bắt buộc</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Workshop Modal */}
				{showWorkshopModal && (
					<ModernWorkshopModal
						isOpen={showWorkshopModal}
						onClose={() => {
							setShowWorkshopModal(false)
							setEditingWorkshop(null)
						}}
						onSave={saveWorkshop}
						editingWorkshop={editingWorkshop}
					/>
				)}
			</div>
		</div>
	)
}

// Modern Workshop Modal Component
interface ModernWorkshopModalProps {
	isOpen: boolean
	onClose: () => void
	onSave: (workshop: WorkshopData) => void
	editingWorkshop: WorkshopData | null
}

function ModernWorkshopModal({ isOpen, onClose, onSave, editingWorkshop }: ModernWorkshopModalProps) {
	const [workshop, setWorkshop] = useState<WorkshopData>(
		editingWorkshop || {
			name: "",
			description: "",
			status: "Pending",
			ticketTypes: [
				{
					type: "Visit",
					name: "Vé tham quan",
					price: 20000,
					isCombo: false,
					durationMinutes: 60,
					content: "Du khách tham quan và nghe giới thiệu về làng nghề",
				},
				{
					type: "Experience",
					name: "Vé trải nghiệm (bao gồm tham quan)",
					price: 50000,
					isCombo: true,
					durationMinutes: 120,
					content: "Tham quan và trải nghiệm thực hành",
					workshopActivities: [],
				},
			],
			recurringRules: [],
		},
	)

	const [currentStep, setCurrentStep] = useState(1)
	const [errors, setErrors] = useState<Record<string, string>>({})

	const updateWorkshop = useCallback((updates: Partial<WorkshopData>) => {
		setWorkshop((prev) => ({ ...prev, ...updates }))
	}, [])

	const validateStep = (step: number): boolean => {
		const newErrors: Record<string, string> = {}

		if (step === 1) {
			if (!workshop.name.trim()) newErrors.name = "Tên trải nghiệm là bắt buộc"
			if (!workshop.description.trim()) newErrors.description = "Mô tả là bắt buộc"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleNext = () => {
		if (validateStep(currentStep)) {
			setCurrentStep((prev) => Math.min(prev + 1, 3))
		}
	}

	const handleSave = () => {
		if (validateStep(1)) {
			onSave(workshop)
		}
	}

	const addActivity = () => {
		const experienceTicket = workshop.ticketTypes.find((t) => t.type === "Experience")
		if (experienceTicket) {
			const newActivity: WorkshopActivity = {
				activity: "",
				description: "",
				startHour: 0,
				endHour: 1,
				activityOrder: (experienceTicket.workshopActivities?.length || 0) + 1,
			}

			const updatedTicketTypes = workshop.ticketTypes.map((ticket) =>
				ticket.type === "Experience"
					? { ...ticket, workshopActivities: [...(ticket.workshopActivities || []), newActivity] }
					: ticket,
			)

			updateWorkshop({ ticketTypes: updatedTicketTypes })
		}
	}

	const updateActivity = (index: number, updates: Partial<WorkshopActivity>) => {
		const updatedTicketTypes = workshop.ticketTypes.map((ticket) =>
			ticket.type === "Experience"
				? {
					...ticket,
					workshopActivities:
						ticket.workshopActivities?.map((activity, i) => (i === index ? { ...activity, ...updates } : activity)) ||
						[],
				}
				: ticket,
		)

		updateWorkshop({ ticketTypes: updatedTicketTypes })
	}

	const removeActivity = (index: number) => {
		const updatedTicketTypes = workshop.ticketTypes.map((ticket) =>
			ticket.type === "Experience"
				? {
					...ticket,
					workshopActivities: ticket.workshopActivities?.filter((_, i) => i !== index) || [],
				}
				: ticket,
		)

		updateWorkshop({ ticketTypes: updatedTicketTypes })
	}

	const addRecurringRule = () => {
		const newRule: RecurringRule = {
			daysOfWeek: ["Monday"],
			startDate: new Date().toISOString().split("T")[0],
			endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
			sessions: [{ startTime: "08:00:00", endTime: "10:00:00", capacity: 20 }],
		}
		updateWorkshop({ recurringRules: [...workshop.recurringRules, newRule] })
	}

	const updateRecurringRule = (index: number, updates: Partial<RecurringRule>) => {
		const updatedRules = workshop.recurringRules.map((rule, i) => (i === index ? { ...rule, ...updates } : rule))
		updateWorkshop({ recurringRules: updatedRules })
	}

	const removeRecurringRule = (index: number) => {
		const filteredRules = workshop.recurringRules.filter((_, i) => i !== index)
		updateWorkshop({ recurringRules: filteredRules })
	}

	if (!isOpen) return null

	const experienceTicket = workshop.ticketTypes.find((t) => t.type === "Experience")
	const visitTicket = workshop.ticketTypes.find((t) => t.type === "Visit")

	return (
		<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
				<div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-2xl">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-bold">
								{editingWorkshop ? "Chỉnh sửa trải nghiệm" : "Tạo trải nghiệm mới"}
							</h2>
							<p className="text-purple-100 mt-1">Thiết kế trải nghiệm hấp dẫn cho du khách</p>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={onClose}
							className="bg-white/20 border-white/30 text-white hover:bg-white/30"
						>
							✕
						</Button>
					</div>
				</div>

				<div className="p-8 space-y-8">
					{/* Step Indicator */}
					<div className="flex items-center justify-center gap-4">
						{[1, 2, 3].map((step) => (
							<div key={step} className="flex items-center">
								<div
									className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${currentStep >= step
										? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
										: "bg-gray-200 text-gray-500"
										}`}
								>
									{step}
								</div>
								{step < 3 && <div className="w-12 h-1 bg-gray-200 mx-2" />}
							</div>
						))}
					</div>

					{/* Step 1: Basic Info */}
					{currentStep === 1 && (
						<div className="space-y-6">
							<div className="text-center mb-8">
								<h3 className="text-2xl font-bold text-gray-800 mb-2">Thông tin cơ bản</h3>
								<p className="text-gray-600">Tạo ấn tượng đầu tiên tốt với du khách</p>
							</div>

							<div className="grid grid-cols-1 gap-6">
								<div className="space-y-3">
									<Label className="text-base font-semibold text-gray-700">Tên trải nghiệm *</Label>
									<Input
										value={workshop.name}
										onChange={(e) => updateWorkshop({ name: e.target.value })}
										placeholder="VD: Trải nghiệm làm gốm truyền thống"
										className={`h-12 text-base border-2 ${errors.name ? "border-red-300" : "border-gray-200 focus:border-purple-400"}`}
									/>
									{errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
								</div>

								<div className="space-y-3">
									<Label className="text-base font-semibold text-gray-700">Mô tả hấp dẫn *</Label>
									<Textarea
										value={workshop.description}
										onChange={(e) => updateWorkshop({ description: e.target.value })}
										placeholder="Mô tả những điều thú vị mà du khách sẽ trải nghiệm..."
										rows={4}
										className={`text-base border-2 resize-none ${errors.description ? "border-red-300" : "border-gray-200 focus:border-purple-400"}`}
									/>
									{errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-3">
										<Label className="text-base font-semibold text-gray-700">Giá vé tham quan (VNĐ)</Label>
										<Input
											type="number"
											value={visitTicket?.price || 0}
											onChange={(e) => {
												const updatedTicketTypes = workshop.ticketTypes.map((ticket) =>
													ticket.type === "Visit" ? { ...ticket, price: Number.parseInt(e.target.value) || 0 } : ticket,
												)
												updateWorkshop({ ticketTypes: updatedTicketTypes })
											}}
											className="h-12 text-base border-2 border-gray-200 focus:border-purple-400"
										/>
									</div>

									<div className="space-y-3">
										<Label className="text-base font-semibold text-gray-700">Giá vé trải nghiệm (VNĐ)</Label>
										<Input
											type="number"
											value={experienceTicket?.price || 0}
											onChange={(e) => {
												const updatedTicketTypes = workshop.ticketTypes.map((ticket) =>
													ticket.type === "Experience"
														? { ...ticket, price: Number.parseInt(e.target.value) || 0 }
														: ticket,
												)
												updateWorkshop({ ticketTypes: updatedTicketTypes })
											}}
											className="h-12 text-base border-2 border-gray-200 focus:border-purple-400"
										/>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Step 2: Activities */}
					{currentStep === 2 && (
						<div className="space-y-6">
							<div className="text-center mb-8">
								<h3 className="text-2xl font-bold text-gray-800 mb-2">Hoạt động trải nghiệm</h3>
								<p className="text-gray-600">Thiết kế các hoạt động thú vị cho du khách</p>
							</div>

							<div className="flex items-center justify-between">
								<h4 className="text-lg font-semibold text-gray-800">Danh sách hoạt động</h4>
								<Button onClick={addActivity} className="bg-gradient-to-r from-purple-500 to-pink-500">
									<Plus className="h-4 w-4 mr-2" />
									Thêm hoạt động
								</Button>
							</div>

							{(experienceTicket?.workshopActivities?.length || 0) === 0 ? (
								<div className="text-center py-12 space-y-4">
									<div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
										<Activity className="h-8 w-8 text-purple-500" />
									</div>
									<p className="text-gray-500">Chưa có hoạt động nào. Hãy thêm hoạt động đầu tiên!</p>
								</div>
							) : (
								<div className="space-y-4">
									{experienceTicket?.workshopActivities?.map((activity, index) => (
										<Card key={index} className="border-2 border-purple-100">
											<CardContent className="p-6">
												<div className="flex items-start justify-between mb-4">
													<Badge variant="outline" className="bg-purple-50 text-purple-700">
														Hoạt động {index + 1}
													</Badge>
													<Button
														size="sm"
														variant="outline"
														onClick={() => removeActivity(index)}
														className="text-red-600 hover:bg-red-50"
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>

												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													<div className="space-y-2">
														<Label>Tên hoạt động</Label>
														<Input
															value={activity.activity}
															onChange={(e) => updateActivity(index, { activity: e.target.value })}
															placeholder="VD: Nặn đất sét"
															className="border-2 border-gray-200 focus:border-purple-400"
														/>
													</div>

													<div className="space-y-2">
														<Label>Thời gian (giờ)</Label>
														<div className="flex items-center gap-2">
															<Input
																type="number"
																value={activity.startHour}
																onChange={(e) =>
																	updateActivity(index, { startHour: Number.parseInt(e.target.value) || 0 })
																}
																className="border-2 border-gray-200 focus:border-purple-400"
															/>
															<span>-</span>
															<Input
																type="number"
																value={activity.endHour}
																onChange={(e) =>
																	updateActivity(index, { endHour: Number.parseInt(e.target.value) || 0 })
																}
																className="border-2 border-gray-200 focus:border-purple-400"
															/>
														</div>
													</div>

													<div className="md:col-span-2 space-y-2">
														<Label>Mô tả hoạt động</Label>
														<Textarea
															value={activity.description}
															onChange={(e) => updateActivity(index, { description: e.target.value })}
															placeholder="Mô tả chi tiết hoạt động này..."
															rows={3}
															className="border-2 border-gray-200 focus:border-purple-400 resize-none"
														/>
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							)}
						</div>
					)}

					{/* Step 3: Schedule */}
					{currentStep === 3 && (
						<div className="space-y-6">
							<div className="text-center mb-8">
								<h3 className="text-2xl font-bold text-gray-800 mb-2">Lịch trình hoạt động</h3>
								<p className="text-gray-600">Thiết lập thời gian hoạt động định kỳ</p>
							</div>

							<div className="flex items-center justify-between">
								<h4 className="text-lg font-semibold text-gray-800">Quy tắc lặp lại</h4>
								<Button onClick={addRecurringRule} className="bg-gradient-to-r from-purple-500 to-pink-500">
									<Plus className="h-4 w-4 mr-2" />
									Thêm lịch trình
								</Button>
							</div>

							{workshop.recurringRules.length === 0 ? (
								<div className="text-center py-12 space-y-4">
									<div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
										<Calendar className="h-8 w-8 text-purple-500" />
									</div>
									<p className="text-gray-500">Chưa có lịch trình nào. Hãy thêm lịch trình đầu tiên!</p>
								</div>
							) : (
								<div className="space-y-4">
									{workshop.recurringRules.map((rule, index) => (
										<Card key={index} className="border-2 border-purple-100">
											<CardContent className="p-6">
												<div className="flex items-start justify-between mb-4">
													<Badge variant="outline" className="bg-purple-50 text-purple-700">
														Lịch trình {index + 1}
													</Badge>
													<Button
														size="sm"
														variant="outline"
														onClick={() => removeRecurringRule(index)}
														className="text-red-600 hover:bg-red-50"
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>

												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													<div className="space-y-2">
														<Label>Ngày bắt đầu</Label>
														<Input
															type="date"
															value={rule.startDate}
															onChange={(e) => updateRecurringRule(index, { startDate: e.target.value })}
															className="border-2 border-gray-200 focus:border-purple-400"
														/>
													</div>

													<div className="space-y-2">
														<Label>Ngày kết thúc</Label>
														<Input
															type="date"
															value={rule.endDate}
															onChange={(e) => updateRecurringRule(index, { endDate: e.target.value })}
															className="border-2 border-gray-200 focus:border-purple-400"
														/>
													</div>

													<div className="md:col-span-2 space-y-2">
														<Label>Các ngày trong tuần</Label>
														<div className="flex flex-wrap gap-2">
															{["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
																(day) => (
																	<div key={day} className="flex items-center space-x-2">
																		<Checkbox
																			id={`${index}-${day}`}
																			checked={rule.daysOfWeek.includes(day)}
																			onCheckedChange={(checked) => {
																				const updatedDays = checked
																					? [...rule.daysOfWeek, day]
																					: rule.daysOfWeek.filter((d) => d !== day)
																				updateRecurringRule(index, { daysOfWeek: updatedDays })
																			}}
																		/>
																		<Label htmlFor={`${index}-${day}`} className="text-sm">
																			{day === "Monday"
																				? "T2"
																				: day === "Tuesday"
																					? "T3"
																					: day === "Wednesday"
																						? "T4"
																						: day === "Thursday"
																							? "T5"
																							: day === "Friday"
																								? "T6"
																								: day === "Saturday"
																									? "T7"
																									: "CN"}
																		</Label>
																	</div>
																),
															)}
														</div>
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							)}
						</div>
					)}
				</div>

				<div className="p-6 border-t bg-gray-50 rounded-b-2xl flex justify-between">
					<div className="flex gap-2">
						{currentStep > 1 && (
							<Button variant="outline" onClick={() => setCurrentStep((prev) => prev - 1)}>
								Quay lại
							</Button>
						)}
					</div>

					<div className="flex gap-2">
						{currentStep < 3 ? (
							<Button onClick={handleNext} className="bg-gradient-to-r from-purple-500 to-pink-500">
								Tiếp theo
							</Button>
						) : (
							<Button onClick={handleSave} className="bg-gradient-to-r from-emerald-500 to-blue-500">
								{editingWorkshop ? "Cập nhật" : "Lưu trải nghiệm"}
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
