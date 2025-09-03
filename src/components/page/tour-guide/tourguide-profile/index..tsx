"use client"

import React, { useEffect, useRef, useState } from "react"
// import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import axiosInstance from "@/lib/interceptors"
import { useTourguideAssign } from "@/services/tourguide"
import { useUser } from "@/services/use-user"
import { motion } from "framer-motion"
import { ArrowLeft, Award, Camera, CheckCircle, FileText, Globe, ImageIcon, Key, Save, User, X } from "lucide-react"
import Link from "next/link"
import { getUserFromLocalStorage } from "@/utils"

interface Certification {
	id?: string
	name: string
	image?: File | string
	imageUrl?: string
}

interface GuideProfile {
	id: string
	fullName: string
	email: string
	phone: string
	languages: string[]
	yearsOfExperience: number
	certifications: Certification[]
	bio: string
	profilePicture?: File | string
	profilePictureUrl?: string
	joinDate: string
	totalTours: number
	rating: number
}

const MOCK_PROFILE: GuideProfile = {
	id: "3",
	fullName: "Nguyễn Văn Hướng",
	email: "guide@travelogue.com",
	phone: "0901234567",
	languages: ["Tiếng Việt", "English", "中文"],
	yearsOfExperience: 5,
	certifications: [
		{
			id: "1",
			name: "Hướng dẫn viên du lịch quốc gia",
			imageUrl: "/placeholder.svg?height=200&width=300",
		},
		{
			id: "2",
			name: "Chứng chỉ tiếng Anh TOEIC 850",
			imageUrl: "/placeholder.svg?height=200&width=300",
		},
	],
	bio: "Tôi là hướng dẫn viên du lịch với 5 năm kinh nghiệm, chuyên về các tour khám phá văn hóa và lịch sử Việt Nam. T��i đam mê chia sẻ những câu chuyện thú vị về quê hương và tạo ra những trải nghiệm đáng nhớ cho du khách.",
	profilePictureUrl: "/placeholder.svg?height=120&width=120",
	joinDate: "2019-03-15",
	totalTours: 156,
	rating: 4.8,
}

// export default function GuideProfileClient() {
// 	return (
// 		<ProtectedRoute requiredRole="tour_guide">
// 			<GuideProfileContent />
// 		</ProtectedRoute>
// 	)
// }

function GuideProfileContent() {
	// const [user] = useAtom(userAtom)
	const user = getUserFromLocalStorage()
	const [profile, setProfile] = useState<GuideProfile>(MOCK_PROFILE)
	const { getTourguideProfile } = useTourguideAssign()
	const { getUserDetail } = useUser()
	const [isEditing, setIsEditing] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [saveMessage, setSaveMessage] = useState("")
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(true)
	const [retryCount, setRetryCount] = useState(0)

	const profilePictureRef = useRef<HTMLInputElement>(null)
	const certificationRefs = useRef<{ [key: number]: HTMLInputElement }>({})

	// Optimized function to get user detail and tourguide ID
	const getUserDetailAndTourguideId = async () => {
		try {
			if (!user?.userId) {
				console.warn("No user ID available in localStorage")
				return { userDetail: null, tourguideId: null }
			}

			console.log("Fetching user detail for userId:", user.userId)
			const userDetail = await getUserDetail(user.userId)
			console.log("User Detail Response:", userDetail)

			if (!userDetail?.tourGuideInfo?.id) {
				console.warn("No tourGuideInfo found in user detail:", userDetail)
				return { userDetail, tourguideId: null }
			}

			const tourguideId = userDetail.tourGuideInfo.id
			console.log("Found tourguideId:", tourguideId)

			// Cache tourguideId for future use
			localStorage.setItem("tourguideId", tourguideId.toString())

			return { userDetail, tourguideId }
		} catch (error) {
			console.error("Error fetching user detail:", error)
			return { userDetail: null, tourguideId: null }
		}
	}

	// Retry handler with exponential backoff
	const handleRetry = async () => {
		setRetryCount(prev => prev + 1)
		setError("")
		await fetchProfileData()
	}

	// Function to fetch profile data
	const fetchProfileData = async () => {
		try {
			setLoading(true)
			setError("")

			// Get user detail and tourguide ID
			const { userDetail, tourguideId } = await getUserDetailAndTourguideId()

			if (!tourguideId) {
				setError("Không tìm thấy thông tin tourguide ID. Vui lòng kiểm tra lại tài khoản.")
				console.error("No valid tourguide ID found. UserDetail:", userDetail)
				return
			}

			console.log("Fetching profile for tourguideId:", tourguideId)
			const profileResponse = await getTourguideProfile(tourguideId)
			console.log("Profile Response:", profileResponse)

			if (profileResponse?.data) {
				// Map API response to component state		
				const apiProfile = profileResponse.data
				const mappedProfile = {
					id: apiProfile.id || tourguideId.toString(),
					fullName: apiProfile.fullName || apiProfile.full_name || userDetail?.fullName || "",
					email: apiProfile.email || userDetail?.email || user?.email || "",
					phone: apiProfile.phone || userDetail?.phone || "",
					languages: Array.isArray(apiProfile.languages) ? apiProfile.languages : ["Tiếng Việt"],
					yearsOfExperience: apiProfile.yearsOfExperience || apiProfile.years_of_experience || 0,
					certifications: Array.isArray(apiProfile.certifications) ? apiProfile.certifications : [],
					bio: apiProfile.bio || "",
					profilePictureUrl: apiProfile.profilePictureUrl || apiProfile.profile_picture_url || apiProfile.avatar,
					joinDate: apiProfile.joinDate || apiProfile.join_date || apiProfile.createdAt || new Date().toISOString().split('T')[0],
					totalTours: apiProfile.totalTours || apiProfile.total_tours || 0,
					rating: apiProfile.rating || 0,
				}

				console.log("Mapped Profile:", mappedProfile)
				setProfile(mappedProfile)
			} else {
				console.warn("No profile data received:", profileResponse)
				setError("Không có dữ liệu hồ sơ")
			}
		} catch (error) {
			console.error("Error fetching profile:", error)
			setError(`Không thể tải thông tin hồ sơ: ${error instanceof Error ? error.message : "Lỗi không xác định"}`)
		} finally {
			setLoading(false)
		}
	}

	// useEffect to fetch data on component mount
	useEffect(() => {
		if (user?.userId) {
			fetchProfileData()
		} else {
			setError("Không tìm thấy thông tin người dùng trong localStorage")
			setLoading(false)
		}
	}, [user?.userId])

	const handleSave = async () => {
		setIsSaving(true)
		setError("")

		try {
			// Get current tourguideId using the optimized function
			const { tourguideId } = await getUserDetailAndTourguideId()
			if (!tourguideId) {
				throw new Error("Không tìm thấy thông tin tourguide ID để lưu hồ sơ")
			}

			// Create FormData for multipart/form-data request
			const formData = new FormData()

			// Add basic profile data with actual tourguideId
			formData.append("id", tourguideId.toString())
			formData.append("fullName", profile.fullName)
			formData.append("phone", profile.phone)
			formData.append("yearsOfExperience", profile.yearsOfExperience.toString())
			formData.append("bio", profile.bio)
			formData.append("languages", JSON.stringify(profile.languages))

			// Add profile picture if it's a new file
			if (profile.profilePicture instanceof File) {
				formData.append("profilePicture", profile.profilePicture)
			}

			// Add certifications data
			const certificationsData = profile.certifications.map((cert, index) => ({
				id: cert.id,
				name: cert.name,
				hasNewImage: cert.image instanceof File,
			}))
			formData.append("certifications", JSON.stringify(certificationsData))

			// Add certification images
			profile.certifications.forEach((cert, index) => {
				if (cert.image instanceof File) {
					formData.append(`certification_image_${index}`, cert.image)
				}
			})

			console.log("Saving profile for tourguideId:", tourguideId)
			console.log("Profile data:", profile)

			// Make API call
			const response = await axiosInstance.post("/tourguides/profile", formData)

			if (!response?.data) {
				throw new Error(response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin")
			}

			console.log("Profile saved successfully:", response.data)

			// Refresh profile data after successful save
			await fetchProfileData()

			setIsEditing(false)
			setSaveMessage("Thông tin đã được cập nhật thành công!")
			setTimeout(() => setSaveMessage(""), 5000)
		} catch (err) {
			console.error("Error updating profile:", err)
			setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi cập nhật thông tin")
		} finally {
			setIsSaving(false)
		}
	}

	const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			// Validate file type
			if (!file.type.startsWith("image/")) {
				setError("Vui lòng chọn file hình ảnh")
				return
			}

			// Validate file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				setError("Kích thước file không được vượt quá 5MB")
				return
			}

			setProfile((prev) => ({
				...prev,
				profilePicture: file,
				profilePictureUrl: URL.createObjectURL(file),
			}))
		}
	}

	const handleCertificationImageChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			// Validate file type
			if (!file.type.startsWith("image/")) {
				setError("Vui lòng chọn file hình ảnh cho chứng chỉ")
				return
			}

			// Validate file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				setError("Kích thước file không được vượt quá 5MB")
				return
			}

			const newCertifications = [...profile.certifications]
			newCertifications[index] = {
				...newCertifications[index],
				image: file,
				imageUrl: URL.createObjectURL(file),
			}
			setProfile((prev) => ({ ...prev, certifications: newCertifications }))
		}
	}

	const handleLanguageChange = (index: number, value: string) => {
		const newLanguages = [...profile.languages]
		newLanguages[index] = value
		setProfile({ ...profile, languages: newLanguages })
	}

	const addLanguage = () => {
		setProfile({ ...profile, languages: [...profile.languages, ""] })
	}

	const removeLanguage = (index: number) => {
		const newLanguages = profile.languages.filter((_, i) => i !== index)
		setProfile({ ...profile, languages: newLanguages })
	}

	const handleCertificationChange = (index: number, field: "name", value: string) => {
		const newCertifications = [...profile.certifications]
		newCertifications[index] = { ...newCertifications[index], [field]: value }
		setProfile({ ...profile, certifications: newCertifications })
	}

	const addCertification = () => {
		setProfile({
			...profile,
			certifications: [...profile.certifications, { name: "", image: undefined, imageUrl: undefined }],
		})
	}

	const removeCertification = (index: number) => {
		const newCertifications = profile.certifications.filter((_, i) => i !== index)
		setProfile({ ...profile, certifications: newCertifications })
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Loading State */}
			{loading && (
				<div className="flex items-center justify-center min-h-screen">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
						<p className="text-gray-600">Đang tải thông tin hồ sơ...</p>
					</div>
				</div>
			)}

			{/* Error State */}
			{error && !loading && (
				<div className="flex items-center justify-center min-h-screen">
					<div className="max-w-md mx-auto">
						<Alert className="border-red-200 bg-red-50">
							<AlertDescription className="text-red-800">
								{error}
							</AlertDescription>
						</Alert>
						<div className="mt-4 text-center">
							<Button onClick={handleRetry} variant="outline" disabled={loading}>
								{loading ? "Đang thử lại..." : `Thử lại ${retryCount > 0 ? `(lần ${retryCount + 1})` : ""}`}
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Main Content */}
			{!loading && !error && (
				<>
					{/* Header */}
					<header className="bg-white shadow-sm border-b">
						<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="flex justify-between items-center h-16">
								<div className="flex items-center space-x-4">
									<Link href="/admin/dashboard">
										<Button variant="ghost" size="sm">
											<ArrowLeft className="w-4 h-4 mr-2" />
											Về Dashboard
										</Button>
									</Link>
									<h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
								</div>

								<div className="flex items-center space-x-2">
									{!isEditing ? (
										<Button onClick={() => setIsEditing(true)}>
											<User className="w-4 h-4 mr-2" />
											Chỉnh sửa
										</Button>
									) : (
										<div className="flex space-x-2">
											<Button variant="outline" onClick={() => setIsEditing(false)}>
												Hủy
											</Button>
											<Button onClick={handleSave} disabled={isSaving}>
												{isSaving ? (
													<div className="flex items-center">
														<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
														Đang lưu...
													</div>
												) : (
													<>
														<Save className="w-4 h-4 mr-2" />
														Lưu thay đổi
													</>
												)}
											</Button>
										</div>
									)}
								</div>
							</div>
						</div>
					</header>

					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						{/* Success Message */}
						{saveMessage && (
							<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
								<Alert className="border-green-200 bg-green-50">
									<CheckCircle className="h-4 w-4 text-green-600" />
									<AlertDescription className="text-green-800">{saveMessage}</AlertDescription>
								</Alert>
							</motion.div>
						)}

						{/* Error Message */}
						{error && (
							<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
								<Alert className="border-red-200 bg-red-50">
									<X className="h-4 w-4 text-red-600" />
									<AlertDescription className="text-red-800">{error}</AlertDescription>
								</Alert>
							</motion.div>
						)}

						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
							{/* Profile Summary */}
							<div className="lg:col-span-1">
								<Card>
									<CardContent className="p-6 text-center">
										<div className="relative inline-block mb-4">
											<Avatar className="w-24 h-24">
												<AvatarImage src={profile.profilePictureUrl || "/placeholder.svg"} />
												<AvatarFallback className="text-2xl">{profile.fullName.charAt(0)}</AvatarFallback>
											</Avatar>
											{isEditing && (
												<>
													<Button
														size="sm"
														className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
														variant="secondary"
														onClick={() => profilePictureRef.current?.click()}
													>
														<Camera className="w-4 h-4" />
													</Button>
													<input
														ref={profilePictureRef}
														type="file"
														accept="image/*"
														onChange={handleProfilePictureChange}
														className="hidden"
													/>
												</>
											)}
										</div>

										<h2 className="text-xl font-bold text-gray-900 mb-2">{profile.fullName}</h2>
										<Badge variant="outline" className="mb-4">
											Hướng dẫn viên
										</Badge>

										<div className="space-y-3 text-sm">
											<div className="flex items-center justify-between">
												<span className="text-gray-600">Tham gia:</span>
												<span className="font-medium">{new Date(profile.joinDate).toLocaleDateString("vi-VN")}</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-gray-600">Tổng tour:</span>
												<span className="font-medium">{profile.totalTours}</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-gray-600">Đánh giá:</span>
												<span className="font-medium">⭐ {profile.rating}/5.0</span>
											</div>
										</div>

										<div className="mt-6">
											<Link href="/tour-guide/change-password">
												<Button variant="outline" className="w-full bg-transparent">
													<Key className="w-4 h-4 mr-2" />
													Đổi mật khẩu
												</Button>
											</Link>
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Profile Details */}
							<div className="lg:col-span-2 space-y-6">
								{/* Basic Information */}
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center">
											<User className="w-5 h-5 mr-2" />
											Thông tin cơ bản
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<Label htmlFor="fullName">Họ và tên</Label>
												<Input
													id="fullName"
													value={profile.fullName}
													onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
													disabled={!isEditing}
												/>
											</div>
											<div>
												<Label htmlFor="email">Email</Label>
												<Input id="email" value={profile.email} disabled className="bg-gray-50" />
												<p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
											</div>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<Label htmlFor="phone">Số điện thoại</Label>
												<Input
													id="phone"
													value={profile.phone}
													onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
													disabled={!isEditing}
												/>
											</div>
											<div>
												<Label htmlFor="experience">Số năm kinh nghiệm</Label>
												<Input
													id="experience"
													type="number"
													value={profile.yearsOfExperience}
													onChange={(e) =>
														setProfile({ ...profile, yearsOfExperience: Number.parseInt(e.target.value) || 0 })
													}
													disabled={!isEditing}
												/>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Languages */}
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center">
											<Globe className="w-5 h-5 mr-2" />
											Ngôn ngữ
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											{profile.languages.map((language, index) => (
												<div key={index} className="flex items-center space-x-2">
													<Input
														value={language}
														onChange={(e) => handleLanguageChange(index, e.target.value)}
														disabled={!isEditing}
														placeholder="Nhập ngôn ngữ"
													/>
													{isEditing && profile.languages.length > 1 && (
														<Button
															variant="outline"
															size="sm"
															onClick={() => removeLanguage(index)}
															className="text-red-600"
														>
															Xóa
														</Button>
													)}
												</div>
											))}
											{isEditing && (
												<Button variant="outline" onClick={addLanguage} className="w-full bg-transparent">
													+ Thêm ngôn ngữ
												</Button>
											)}
										</div>
									</CardContent>
								</Card>

								{/* Certifications */}
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center">
											<Award className="w-5 h-5 mr-2" />
											Chứng chỉ
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-6">
											{profile.certifications.map((cert, index) => (
												<div key={index} className="border rounded-lg p-4 bg-gray-50">
													<div className="space-y-3">
														{/* Certificate Name */}
														<div>
															<Label htmlFor={`cert-name-${index}`}>Tên chứng chỉ</Label>
															<Input
																id={`cert-name-${index}`}
																value={cert.name}
																onChange={(e) => handleCertificationChange(index, "name", e.target.value)}
																disabled={!isEditing}
																placeholder="Nhập tên chứng chỉ"
															/>
														</div>

														{/* Certificate Image */}
														<div>
															<Label>Hình ảnh chứng chỉ</Label>
															<div className="mt-2">
																{cert.imageUrl && (
																	<div className="mb-3">
																		<img
																			src={cert.imageUrl || "/placeholder.svg"}
																			alt={cert.name || "Chứng chỉ"}
																			className="w-full max-w-sm h-32 object-cover rounded-lg border"
																		/>
																	</div>
																)}

																{isEditing && (
																	<div className="flex items-center space-x-2">
																		<Button
																			type="button"
																			variant="outline"
																			size="sm"
																			onClick={() => certificationRefs.current[index]?.click()}
																		>
																			<ImageIcon className="w-4 h-4 mr-2" />
																			{cert.imageUrl ? "Thay đổi hình" : "Chọn hình"}
																		</Button>
																		<input
																			ref={(el) => {
																				if (el) certificationRefs.current[index] = el
																			}}
																			type="file"
																			accept="image/*"
																			onChange={(e) => handleCertificationImageChange(index, e)}
																			className="hidden"
																		/>
																	</div>
																)}
															</div>
														</div>

														{/* Actions */}
														{isEditing && (
															<div className="flex justify-end">
																<Button
																	variant="outline"
																	size="sm"
																	onClick={() => removeCertification(index)}
																	className="text-red-600"
																>
																	<X className="w-4 h-4 mr-1" />
																	Xóa chứng chỉ
																</Button>
															</div>
														)}
													</div>
												</div>
											))}

											{isEditing && (
												<Button variant="outline" onClick={addCertification} className="w-full bg-transparent">
													+ Thêm chứng chỉ
												</Button>
											)}
										</div>
									</CardContent>
								</Card>

								{/* Bio */}
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center">
											<FileText className="w-5 h-5 mr-2" />
											Giới thiệu bản thân
										</CardTitle>
									</CardHeader>
									<CardContent>
										<Textarea
											value={profile.bio}
											onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
											disabled={!isEditing}
											rows={4}
											placeholder="Viết một đoạn giới thiệu ngắn về bản thân..."
										/>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	)
}

export default GuideProfileContent