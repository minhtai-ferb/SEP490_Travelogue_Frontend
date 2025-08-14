"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Clock, Users, Camera, Mountain, Building2, Palette, ArrowRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import type { TypeLocation } from "@/types/Location"
import { useLocationController } from "@/services/location-controller"

interface LocationData {
	id: string
	name: string
	description: string
	shortDescription: string
	images: string[]
	rating: number
	reviewCount: number
	visitDuration: string
	bestTimeToVisit: string
	highlights: string[]
	location: string
	price?: string
	category: string
	tags: string[]
	facts: { label: string; value: string }[]
}

interface ParallaxLocationIntroProps {
	locationType: TypeLocation | null
	className?: string
	onLocationSelect?: (location: LocationData) => void
}

const getLocationTypeInfo = (type: TypeLocation | null) => {
	if (!type) {
		return {
			title: "Chọn loại địa điểm",
			subtitle: "Vui lòng chọn một loại địa điểm để khám phá",
			description: "Hãy chọn một trong các loại địa điểm ở trên để bắt đầu khám phá những điểm đến tuyệt vời.",
			icon: Mountain,
			gradient: "from-gray-500 to-gray-600",
			bgImage: "/placeholder.svg?height=800&width=1200",
		}
	}

	// Map based on type name or id - adjust based on your TypeLocation structure
	const typeKey = type.name?.toLowerCase() || type?.name?.toLowerCase() || type.id

	const infoMap: Record<string, any> = {
		"danh lam thắng cảnh": {
			title: "Danh lam thắng cảnh",
			subtitle: "Khám phá vẻ đẹp thiên nhiên hùng vĩ",
			description:
				"Những điểm đến tuyệt vời với cảnh quan thiên nhiên hùng vĩ, nơi bạn có thể hòa mình vào không gian xanh mát và tận hưởng không khí trong lành.",
			icon: Mountain,
			gradient: "from-green-500 to-blue-600",
			bgImage:
				"https://vinhtour.vn/wp-content/uploads/2024/01/kham-pha-khu-du-lich-sinh-thai-khong-thoi-gian-long-an-2024-1678-1.jpg",
		},
		"làng nghề truyền thống": {
			title: "Làng Nghề Truyền Thống",
			subtitle: "Khám phá nghệ thuật thủ công tinh xảo",
			description:
				"Những làng nghề lâu đời với kỹ thuật truyền thống được lưu giữ qua nhiều thế hệ, nơi bạn có thể trải nghiệm và học hỏi các nghề thủ công độc đáo.",
			icon: Palette,
			gradient: "from-orange-500 to-red-600",
			bgImage: "https://luhanhvietnam.com.vn/du-lich/vnt_upload/news/04_2021/nghe-dan-may-tre-nua.jpg",
		},
		"di tích lịch sử": {
			title: "Di Tích Lịch Sử",
			subtitle: "Khám phá di sản văn hóa quý báu",
			description:
				"Những di tích lịch sử quan trọng mang giá trị văn hóa và giáo dục cao, giúp bạn hiểu thêm về lịch sử và truyền thống của vùng đất này.",
			icon: Building2,
			gradient: "from-purple-500 to-indigo-600",
			bgImage: "/image/dinhhiepninh.jpg",
		},
	}

	return (
		infoMap[typeKey] ||
		infoMap[type?.name?.toLowerCase()] || {
			title: type?.name || "Địa điểm du lịch",
			subtitle: "Khám phá những điểm đến tuyệt vời",
			description: "Những địa điểm du lịch hấp dẫn đang chờ bạn khám phá.",
			icon: Mountain,
			gradient: "from-blue-500 to-purple-600",
			bgImage: "/placeholder.svg?height=800&width=1200",
		}
	)
}

export function ParallaxLocationIntro({ locationType, className, onLocationSelect }: ParallaxLocationIntroProps) {
	const [locations, setLocations] = useState<LocationData[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const { searchLocation } = useLocationController()

	const containerRef = useRef<HTMLDivElement>(null)
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start end", "end start"],
	})

	const isInView = useInView(containerRef, { once: true, margin: "-100px" })

	// Parallax transforms
	const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
	const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"])
	const cardY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"])

	const locationInfo = getLocationTypeInfo(locationType)

	// Fetch data when location type changes
	useEffect(() => {
		const loadData = async () => {
			if (!locationType?.id) {
				setLocations([])
				setLoading(false)
				return
			}

			setLoading(true)
			setError(null)

			try {
				const data = await searchLocation({ type: locationType.id })

				// Transform API data to match LocationData interface
				const transformedData: LocationData[] = data.map((item: any) => ({
					id: item.id || "",
					name: item.name || "",
					description: item.description || "",
					shortDescription: item.shortDescription || item.description?.substring(0, 100) + "..." || "",
					images: item.images || ["/placeholder.svg?height=400&width=600"],
					rating: item.rating || 4.5,
					reviewCount: item.reviewCount || 0,
					visitDuration: item.visitDuration || "2-3 giờ",
					bestTimeToVisit: item.bestTimeToVisit || "8:00 - 17:00",
					highlights: item.highlights || [],
					location: item.location || item.address || "",
					price: item.price || "Liên hệ",
					category: item.category || locationType?.name || "",
					tags: item.tags || [],
					facts: item.facts || [],
				}))

				setLocations(transformedData)
			} catch (err) {
				console.error("Error fetching locations:", err)
				setError("Không thể tải dữ liệu. Vui lòng thử lại sau.")
			} finally {
				setLoading(false)
			}
		}

		loadData()
	}, [locationType, searchLocation])

	return (
		<div ref={containerRef} className={cn("relative min-h-screen overflow-hidden", className)}>
			{/* Fixed Background Layer */}
			<div className="absolute inset-0 z-0">
				{/* Background Image */}
				<motion.div style={{ y: backgroundY }} className="absolute inset-0 w-full h-[120%]">
					<div
						className="w-full h-full bg-cover bg-center bg-no-repeat"
						style={{
							backgroundImage: `url(${locationInfo.bgImage})`,
							backgroundAttachment: "fixed",
						}}
					/>
				</motion.div>
				{/* Gradient Overlay - Reduced opacity */}
				<div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", locationInfo.gradient)} />
				{/* Dark Overlay - Reduced opacity */}
				<div className="absolute inset-0 bg-black/20" />
			</div>

			{/* Floating Elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
				{[...Array(6)].map((_, i) => (
					<motion.div
						key={i}
						className="absolute w-2 h-2 bg-white/30 rounded-full"
						style={{
							left: `${20 + i * 15}%`,
							top: `${30 + (i % 3) * 20}%`,
						}}
						animate={{
							y: [0, -20, 0],
							opacity: [0.3, 0.8, 0.3],
						}}
						transition={{
							duration: 3 + i,
							repeat: Number.POSITIVE_INFINITY,
							delay: i * 0.5,
						}}
					/>
				))}
			</div>

			{/* Content */}
			<div className="relative z-20 container mx-auto px-4 py-20">
				{/* Hero Section */}
				<motion.div style={{ y: textY }} className="text-center text-white mb-16">
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={isInView ? { opacity: 1, scale: 1 } : {}}
						transition={{ duration: 0.6 }}
						className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 mb-6 border border-white/30"
					>
						<locationInfo.icon className="w-6 h-6" />
						<span className="font-medium">Khám phá {locationInfo.title}</span>
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 50 }}
						animate={isInView ? { opacity: 1, y: 0 } : {}}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg"
					>
						{locationInfo.title}
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 30 }}
						animate={isInView ? { opacity: 1, y: 0 } : {}}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="text-xl md:text-2xl mb-4 text-white/95 drop-shadow-md"
					>
						{locationInfo.subtitle}
					</motion.p>

					<motion.p
						initial={{ opacity: 0, y: 30 }}
						animate={isInView ? { opacity: 1, y: 0 } : {}}
						transition={{ duration: 0.8, delay: 0.6 }}
						className="text-lg text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-sm"
					>
						{locationInfo.description}
					</motion.p>
				</motion.div>

				{/* Loading State */}
				{loading && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="flex items-center justify-center py-20"
					>
						<div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 text-center text-white border border-white/30">
							<Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
							<p className="text-lg">Đang tải thông tin...</p>
						</div>
					</motion.div>
				)}

				{/* Error State */}
				{error && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-2xl p-8 text-center text-white"
					>
						<p className="text-lg">{error}</p>
						<Button onClick={() => window.location.reload()} className="mt-4 bg-white/20 hover:bg-white/30">
							Thử lại
						</Button>
					</motion.div>
				)}

				{/* No Type Selected */}
				{!locationType && !loading && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-8 text-center text-white"
					>
						<Mountain className="w-16 h-16 mx-auto mb-4 opacity-60" />
						<p className="text-lg">Vui lòng chọn một loại địa điểm để bắt đầu khám phá</p>
					</motion.div>
				)}

				{/* Location Cards */}
				{!loading && !error && locationType && locations.length > 0 && (
					<motion.div style={{ y: cardY }} className="grid md:grid-cols-2 gap-8">
						{locations.map((location, index) => (
							<LocationCard key={location.id} location={location} index={index} onSelect={onLocationSelect} />
						))}
					</motion.div>
				)}

				{/* Empty State */}
				{!loading && !error && locationType && locations.length === 0 && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-8 text-center text-white"
					>
						<MapPin className="w-16 h-16 mx-auto mb-4 opacity-60" />
						<p className="text-lg">Không tìm thấy địa điểm nào cho loại này</p>
						<p className="text-sm opacity-75 mt-2">Hãy thử chọn loại địa điểm khác</p>
					</motion.div>
				)}
			</div>
		</div>
	)
}

// Location Card Component
interface LocationCardProps {
	location: LocationData
	index: number
	onSelect?: (location: LocationData) => void
}

function LocationCard({ location, index, onSelect }: LocationCardProps) {
	const router = useRouter()
	const cardRef = useRef<HTMLDivElement>(null)
	const isInView = useInView(cardRef, { once: true, margin: "-50px" })
	const [isNavigating, setIsNavigating] = useState(false)

	const handleNavigate = async () => {
		if (location.id && !isNavigating) {
			setIsNavigating(true)
			try {
				if (onSelect) {
					onSelect(location)
				}
				router.push(`/trai-nghiem/${location.id}`)
			} catch (error) {
				console.error("Navigation error:", error)
				setIsNavigating(false)
			}
		}
	}

	return (
		<motion.div
			ref={cardRef}
			initial={{ opacity: 0, y: 100 }}
			animate={isInView ? { opacity: 1, y: 0 } : {}}
			transition={{ duration: 0.8, delay: index * 0.2 }}
			whileHover={{ y: -10 }}
			className="group"
		>
			<Card className="bg-white/15 backdrop-blur-md border-white/30 text-white overflow-hidden hover:bg-white/20 transition-all duration-300 shadow-2xl">
				<div className="relative">
					{/* Image */}
					<div className="relative h-64 overflow-hidden">
						<motion.img
							src={location.images[0]}
							alt={location.name}
							className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
							onError={(e) => {
								const target = e.target as HTMLImageElement
								target.src = "/placeholder.svg?height=400&width=600"
							}}
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

						{/* Rating */}
						{location.rating > 0 && (
							<div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
								<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
								<span className="text-sm font-medium">{location.rating}</span>
								{location.reviewCount > 0 && <span className="text-xs text-white/70">({location.reviewCount})</span>}
							</div>
						)}
					</div>

					<CardContent className="p-6">
						{/* Header */}
						<div className="mb-4">
							<h3 className="text-2xl font-bold mb-2">{location.name}</h3>
							<p className="text-white/85 leading-relaxed">{location.shortDescription}</p>
						</div>

						{/* Info Grid */}
						<div className="grid grid-cols-2 gap-4 mb-6">
							<div className="flex items-center gap-2">
								<Clock className="w-4 h-4 text-white/70" />
								<span className="text-sm">{location.visitDuration}</span>
							</div>
							<div className="flex items-center gap-2">
								<MapPin className="w-4 h-4 text-white/70" />
								<span className="text-sm">{location.location}</span>
							</div>
							<div className="flex items-center gap-2">
								<Users className="w-4 h-4 text-white/70" />
								<span className="text-sm">{location.bestTimeToVisit}</span>
							</div>
							<div className="flex items-center gap-2">
								<Camera className="w-4 h-4 text-white/70" />
								<span className="text-sm">{location.price}</span>
							</div>
						</div>

						{/* Tags */}
						{location.tags.length > 0 && (
							<div className="flex flex-wrap gap-2 mb-6">
								{location.tags.slice(0, 3).map((tag) => (
									<Badge key={tag} variant="outline" className="border-white/40 text-white/80 text-xs bg-white/10">
										{tag}
									</Badge>
								))}
							</div>
						)}

						{/* Highlights */}
						{location.highlights.length > 0 && (
							<div className="mb-6">
								<h4 className="font-semibold mb-2 text-white/95">Điểm nổi bật:</h4>
								<ul className="space-y-1">
									{location.highlights.slice(0, 3).map((highlight, idx) => (
										<li key={idx} className="text-sm text-white/75 flex items-center gap-2">
											<div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
											{highlight}
										</li>
									))}
								</ul>
							</div>
						)}

						{/* Action Button */}
						<Button
							onClick={handleNavigate}
							className="w-full bg-white/25 hover:bg-white/35 backdrop-blur-sm border-white/40 text-white group transition-all duration-300"
							variant="outline"
							disabled={!location.id || isNavigating}
						>
							{isNavigating ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Đang tải...
								</>
							) : (
								<>
									Khám phá ngay
									<ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
								</>
							)}
						</Button>
					</CardContent>
				</div>
			</Card>
		</motion.div>
	)
}
