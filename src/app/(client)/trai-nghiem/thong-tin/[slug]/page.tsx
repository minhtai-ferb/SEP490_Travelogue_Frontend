"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useExperience } from "@/services/experience"
import type { Experience } from "@/types/Experience"
import { Building, Calendar, ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

function InfoExperience() {
	const { getExperienceById } = useExperience()
	const [experienceDetail, setExperienceDetail] = useState<Experience>()
	const [loading, setLoading] = useState(true)
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const { slug } = useParams()
	const router = useRouter()


	const fetchExperiences = async (id: string) => {
		try {
			setLoading(true)
			const response = await getExperienceById(id)
			setExperienceDetail(response)
		} catch (error) {
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (slug) {
			fetchExperiences(slug as string)
		}
	}, [slug])

	// Handle image navigation
	const goToPreviousImage = () => {
		if (!experienceDetail?.medias?.length) return
		setCurrentImageIndex((prev) => (prev === 0 ? (experienceDetail?.medias?.length ?? 0) - 1 : prev - 1))
	}

	const goToNextImage = () => {
		if (!experienceDetail?.medias?.length) return
		setCurrentImageIndex((prev) => (prev === (experienceDetail.medias?.length ?? 0) - 1 ? 0 : prev + 1))
	}

	// Extract restaurant information from content
	const extractRestaurants = (content: string) => {
		const addressSection = content.split("ĐỊA CHỈ THƯỞNG THỨC")[1]
		if (!addressSection) return []

		return addressSection
			.split("\n")
			.filter((line) => line.trim().startsWith("Nhà hàng"))
			.map((line) => {
				const parts = line.split("-")
				if (parts.length < 2) return null
				return {
					name: parts[0].trim(),
					address: parts[1].replace("ĐC:", "").trim(),
				}
			})
			.filter(Boolean)
	}

	// Format content for better readability
	const formatContent = (content: string) => {
		if (!content) return []

		// Remove the restaurant section for the main content
		const mainContent = content.split("ĐỊA CHỈ THƯỞNG THỨC")[0]

		return mainContent.split("\n").filter((paragraph) => paragraph.trim().length > 0)
	}

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
				<div className="animate-pulse flex flex-col items-center">
					<div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
					<div className="h-4 bg-gray-200 rounded w-64"></div>
				</div>
			</div>
		)
	}

	if (!experienceDetail) {
		return (
			<div className="container mx-auto px-4 py-16 text-center">
				<h2 className="text-2xl font-bold mb-4">Không tìm thấy thông tin</h2>
				<p className="text-muted-foreground">Không thể tìm thấy thông tin về trải nghiệm này.</p>
			</div>
		)
	}

	const restaurants = extractRestaurants(experienceDetail.content || "")
	const contentParagraphs = formatContent(experienceDetail.content || "")

	return (
		<div className="container mx-auto px-4 py-8 max-w-7xl">
			<div className="mb-6 flex items-center gap-2">
				<Button
					variant="ghost"
					onClick={() => router.back()}
					className="flex items-center text-muted-foreground px-0 hover:text-primary"
				>
					<ChevronLeft className="h-4 w-4 mr-1" />
					Quay lại
				</Button>
				<span className="text-sm text-muted-foreground">/ Trải nghiệm / {experienceDetail?.title}</span>
			</div>
			{/* Hero Section */}
			<div className="relative rounded-xl overflow-hidden mb-8 h-[50vh] md:h-[60vh]">
				{experienceDetail.medias && experienceDetail.medias.length > 0 && (
					<>
						<Image
							src={experienceDetail.medias[currentImageIndex].mediaUrl || "/placeholder_image.jpg"}
							alt={experienceDetail.title}
							fill
							className="object-contain"
							quality={100}
							priority
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 md:p-10">
							<Badge className="mb-3 self-start bg-amber-500 hover:bg-amber-600 text-white">Ẩm thực đặc sản</Badge>
							<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">{experienceDetail.title}</h1>
							<p className="text-white/90 max-w-3xl text-lg">{experienceDetail.description}</p>
						</div>

						{/* Image navigation */}
						{experienceDetail.medias.length > 1 && (
							<>
								<Button
									variant="ghost"
									size="icon"
									className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full h-10 w-10"
									onClick={goToPreviousImage}
								>
									<ChevronLeft className="h-6 w-6" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full h-10 w-10"
									onClick={goToNextImage}
								>
									<ChevronRight className="h-6 w-6" />
								</Button>
								<div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
									{currentImageIndex + 1} / {experienceDetail.medias.length}
								</div>
							</>
						)}
					</>
				)}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Main Content */}
				<div className="lg:col-span-2 space-y-6">
					<Card>
						<CardContent className="p-6">
							<h2 className="text-2xl font-bold mb-4">Giới thiệu</h2>
							<div className="prose max-w-none">
								{contentParagraphs.map((paragraph, index) => (
									<p key={index} className="mb-4 text-muted-foreground">
										{paragraph}
									</p>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Image Gallery */}
					{experienceDetail.medias && experienceDetail.medias.length > 1 && (
						<Card>
							<CardContent className="p-6">
								<h2 className="text-xl font-bold mb-4">Hình ảnh</h2>
								<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
									{experienceDetail.medias.map((media, index) => (
										<div
											key={index}
											className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
											onClick={() => setCurrentImageIndex(index)}
										>
											<Image
												src={media.mediaUrl || "/placeholder_image.jpg"}
												alt={`${experienceDetail.title} - Hình ${index + 1}`}
												fill
												className="object-cover"
											/>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)}
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Location Info */}
					<Card className="shadow-md">
						<CardContent className="p-6">
							<h2 className="text-xl font-bold mb-4">Thông tin</h2>

							{experienceDetail.locationName && (
								<div className="flex items-start gap-3 mb-4">
									<MapPin className="h-5 w-5 text-red-500 mt-0.5" />
									<div>
										<h3 className="font-medium">Địa điểm</h3>
										<p className="text-muted-foreground">{experienceDetail.locationName}</p>
									</div>
								</div>
							)}

							{experienceDetail.districtName && (
								<div className="flex items-start gap-3 mb-4">
									<Building className="h-5 w-5 text-slate-500 mt-0.5" />
									<div>
										<h3 className="font-medium">Quận/Huyện</h3>
										<p className="text-muted-foreground">{experienceDetail.districtName}</p>
									</div>
								</div>
							)}

							{experienceDetail.eventName && (
								<div className="flex items-start gap-3">
									<Calendar className="h-5 w-5 text-green-500 mt-0.5" />
									<div>
										<h3 className="font-medium">Sự kiện liên quan</h3>
										<p className="text-muted-foreground">{experienceDetail.eventName}</p>
									</div>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Restaurant Recommendations */}
					{/* {restaurants.length > 0 && (
						<Card className="shadow-md">
							<CardContent className="p-6">
								<h2 className="text-xl font-bold mb-4">Địa chỉ thưởng thức</h2>
								<div className="space-y-4">
									{restaurants.map((restaurant, index) => (
										<div key={index} className="space-y-2">
											<h3 className="font-medium text-lg">{restaurant.name}</h3>
											<div className="flex items-start gap-2">
												<MapPin className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
												<p className="text-muted-foreground">{restaurant.address}</p>
											</div>
											{index < restaurants.length - 1 && <Separator className="my-3" />}
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)} */}

					{/* Share and Save
					<Card className="shadow-md">	
						<CardContent className="p-6">
							<h2 className="text-xl font-bold mb-4">Chia sẻ</h2>
							<div className="flex gap-2">
								<Button variant="outline" className="flex-1">
									<ExternalLink className="h-4 w-4 mr-2" />
									Chia sẻ
								</Button>
								<Button className="flex-1 bg-red-600 hover:bg-red-700">Lưu lại</Button>
							</div>
						</CardContent>
					</Card> */}
				</div>
			</div>
		</div>
	)
}

export default InfoExperience

