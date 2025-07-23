"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	MapPin,
	Star,
	Clock,
	Users,
	Camera,
	Mountain,
	Building2,
	Palette,
	ArrowRight,
	Loader2,
	Heart,
	Share2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export type LocationType = "scenic-spot" | "craft-village" | "historical-site"

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
	locationType: LocationType
	className?: string
	onLocationSelect?: (location: LocationData) => void
}

// Mock API function - replace with your actual API
const fetchLocationData = async (type: LocationType): Promise<LocationData[]> => {
	// Simulate API delay
	await new Promise((resolve) => setTimeout(resolve, 1500))

	const mockData: Record<LocationType, LocationData[]> = {
		"scenic-spot": [
			{
				id: "nui-ba-den",
				name: "Núi Bà Đen",
				description:
					"Ngọn núi thiêng liêng cao nhất Nam Bộ với độ cao 986m, nổi tiếng với những truyền thuyết bí ẩn và cảnh quan hùng vĩ. Đây là điểm du lịch tâm linh quan trọng với nhiều đền chùa cổ kính và hệ thống cáp treo hiện đại.",
				shortDescription: "Ngọn núi thiêng liêng cao nhất Nam Bộ",
				images: ["/backgroundTayNinh.png", "/placeholder.svg?height=300&width=400"],
				rating: 4.8,
				reviewCount: 2847,
				visitDuration: "4-6 giờ",
				bestTimeToVisit: "6:00 - 17:00",
				highlights: ["Cáp treo hiện đại", "Đền Bà Đen linh thiêng", "Tầm nhìn 360°", "Rừng nguyên sinh"],
				location: "Tây Ninh",
				price: "150.000đ - 300.000đ",
				category: "Thiên nhiên & Tâm linh",
				tags: ["Núi", "Tâm linh", "Cáp treo", "Thiên nhiên"],
				facts: [
					{ label: "Độ cao", value: "986m" },
					{ label: "Diện tích", value: "2.570 ha" },
					{ label: "Thành lập", value: "1978" },
				],
			},
			{
				id: "rung-tram-tra-su-2",
				name: "Cánh đồng",
				description:
					"Khu rừng tràm ngập nước đẹp như tranh vẽ với hệ sinh thái đa dạng. Nơi đây có hơn 70 loài chim quý hiếm và là điểm đến lý tưởng cho những ai yêu thích thiên nhiên hoang dã.",
				shortDescription: "Rừng tràm ngập nước đẹp như tranh vẽ",
				images: [
					"https://cdn.tgdd.vn/Files/2022/03/30/1422964/kham-pha-du-lich-rung-tram-tra-su-o-an-giang-xanh-muot-mat-202203300104042991.jpg",
					"https://cdn.tgdd.vn/Files/2022/03/30/1422964/kham-pha-du-lich-rung-tram-tra-su-o-an-giang-xanh-muot-mat-202203300104042991.jpg",
				],
				rating: 4.6,
				reviewCount: 1523,
				visitDuration: "3-4 giờ",
				bestTimeToVisit: "5:30 - 17:30",
				highlights: ["Chèo thúng chai", "Ngắm chim hoang dã", "Cảnh hoàng hôn", "Không khí trong lành"],
				location: "An Giang",
				price: "50.000đ - 100.000đ",
				category: "Sinh thái",
				tags: ["Rừng", "Sinh thái", "Chim", "Thúng chai"],
				facts: [
					{ label: "Diện tích", value: "845 ha" },
					{ label: "Loài chim", value: "70+ loài" },
					{ label: "Tuổi rừng", value: "100+ năm" },
				],
			},
		],
		"craft-village": [
			{
				id: "lang-gom-binh-duong",
				name: "Làng gốm Bình Dương",
				description:
					"Làng nghề gốm sứ truyền thống với lịch sử hơn 200 năm. Nơi đây vẫn giữ nguyên các kỹ thuật làm gốm cổ truyền, tạo ra những sản phẩm gốm sứ tinh xảo với họa tiết độc đáo mang đậm bản sắc văn hóa Khmer.",
				shortDescription: "Làng nghề gốm sứ truyền thống 200 năm tuổi",
				images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=300&width=400"],
				rating: 4.5,
				reviewCount: 892,
				visitDuration: "2-3 giờ",
				bestTimeToVisit: "8:00 - 17:00",
				highlights: ["Xem thợ làm gốm", "Trải nghiệm làm gốm", "Mua sản phẩm thủ công", "Tìm hiểu văn hóa Khmer"],
				location: "Tây Ninh",
				price: "30.000đ - 80.000đ",
				category: "Làng nghề",
				tags: ["Gốm sứ", "Thủ công", "Khmer", "Truyền thống"],
				facts: [
					{ label: "Lịch sử", value: "200+ năm" },
					{ label: "Gia đình thợ", value: "50+ hộ" },
					{ label: "Sản phẩm", value: "100+ loại" },
				],
			},
			{
				id: "lang-det-chieu",
				name: "Làng dệt chiếu cói",
				description:
					"Làng nghề dệt chiếu cói nổi tiếng với những tấm chiếu mịn màng, bền đẹp. Nghề dệt chiếu được truyền từ đời này sang đời khác, tạo ra những sản phẩm thủ công mỹ nghệ có giá trị cao.",
				shortDescription: "Làng nghề dệt chiếu cói truyền thống",
				images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=300&width=400"],
				rating: 4.3,
				reviewCount: 654,
				visitDuration: "1-2 giờ",
				bestTimeToVisit: "7:00 - 16:00",
				highlights: ["Xem quy trình dệt", "Mua chiếu thủ công", "Học cách dệt cơ bản", "Chụp ảnh với thợ dệt"],
				location: "Tây Ninh",
				price: "20.000đ - 50.000đ",
				category: "Làng nghề",
				tags: ["Dệt", "Chiếu cói", "Thủ công", "Mỹ nghệ"],
				facts: [
					{ label: "Thành lập", value: "150+ năm" },
					{ label: "Thợ dệt", value: "80+ người" },
					{ label: "Sản lượng", value: "1000+ chiếu/tháng" },
				],
			},
		],
		"historical-site": [
			{
				id: "chua-cao-dai",
				name: "Thánh Tòa Cao Đài",
				description:
					"Thánh địa của đạo Cao Đài với kiến trúc độc đáo kết hợp phong cách Đông Tây. Đây là trung tâm tôn giáo quan trọng với những nghi lễ trang nghiêm và kiến trúc đầy màu sắc, thu hút hàng triệu du khách mỗi năm.",
				shortDescription: "Thánh địa của đạo Cao Đài với kiến trúc độc đáo",
				images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=300&width=400"],
				rating: 4.7,
				reviewCount: 3241,
				visitDuration: "2-3 giờ",
				bestTimeToVisit: "6:00 - 18:00",
				highlights: ["Kiến trúc độc đáo", "Nghi lễ tôn giáo", "Bảo tàng Cao Đài", "Văn hóa tâm linh"],
				location: "Tây Ninh",
				price: "Miễn phí",
				category: "Tôn giáo",
				tags: ["Cao Đài", "Tôn giáo", "Kiến trúc", "Văn hóa"],
				facts: [
					{ label: "Thành lập", value: "1926" },
					{ label: "Tín đồ", value: "2.5 triệu" },
					{ label: "Diện tích", value: "5 ha" },
				],
			},
			{
				id: "chua-cao-dai",
				name: "Thánh Tòa Cao Đài",
				description:
					"Thánh địa của đạo Cao Đài với kiến trúc độc đáo kết hợp phong cách Đông Tây. Đây là trung tâm tôn giáo quan trọng với những nghi lễ trang nghiêm và kiến trúc đầy màu sắc, thu hút hàng triệu du khách mỗi năm.",
				shortDescription: "Thánh địa của đạo Cao Đài với kiến trúc độc đáo",
				images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=300&width=400"],
				rating: 4.7,
				reviewCount: 3241,
				visitDuration: "2-3 giờ",
				bestTimeToVisit: "6:00 - 18:00",
				highlights: ["Kiến trúc độc đáo", "Nghi lễ tôn giáo", "Bảo tàng Cao Đài", "Văn hóa tâm linh"],
				location: "Tây Ninh",
				price: "Miễn phí",
				category: "Tôn giáo",
				tags: ["Cao Đài", "Tôn giáo", "Kiến trúc", "Văn hóa"],
				facts: [
					{ label: "Thành lập", value: "1926" },
					{ label: "Tín đồ", value: "2.5 triệu" },
					{ label: "Diện tích", value: "5 ha" },
				],
			},
		],
	}

	return mockData[type] || []
}

const getLocationTypeInfo = (type: LocationType) => {
	const info = {
		"scenic-spot": {
			title: "Danh lam thắng cảnh",
			subtitle: "Khám phá vẻ đẹp thiên nhiên hùng vĩ",
			description:
				"Những điểm đến tuyệt vời với cảnh quan thiên nhiên hùng vĩ, nơi bạn có thể hòa mình vào không gian xanh mát và tận hưởng không khí trong lành.",
			icon: Mountain,
			gradient: "from-green-500 to-blue-600",
			bgImage:
				"https://vinhtour.vn/wp-content/uploads/2024/01/kham-pha-khu-du-lich-sinh-thai-khong-thoi-gian-long-an-2024-1678-1.jpg",
		},
		"craft-village": {
			title: "Làng Nghề Truyền Thống",
			subtitle: "Khám phá nghệ thuật thủ công tinh xảo",
			description:
				"Những làng nghề lâu đời với kỹ thuật truyền thống được lưu giữ qua nhiều thế hệ, nơi bạn có thể trải nghiệm và học hỏi các nghề thủ công độc đáo.",
			icon: Palette,
			gradient: "from-orange-500 to-red-600",
			bgImage: "https://luhanhvietnam.com.vn/du-lich/vnt_upload/news/04_2021/nghe-dan-may-tre-nua.jpg",
		},
		"historical-site": {
			title: "Di Tích Lịch Sử",
			subtitle: "Khám phá di sản văn hóa quý báu",
			description:
				"Những di tích lịch sử quan trọng mang giá trị văn hóa và giáo dục cao, giúp bạn hiểu thêm về lịch sử và truyền thống của vùng đất này.",
			icon: Building2,
			gradient: "from-black to-white",
			bgImage: "/image/dinhhiepninh.jpg",
		},
	}

	return info[type]
}

export function ParallaxLocationIntro({ locationType, className, onLocationSelect }: ParallaxLocationIntroProps) {
	const [locations, setLocations] = useState<LocationData[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

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

	// Fetch data when component mounts or location type changes
	useEffect(() => {
		const loadData = async () => {
			setLoading(true)
			setError(null)

			try {
				const data = await fetchLocationData(locationType)
				setLocations(data)
			} catch (err) {
				setError("Không thể tải dữ liệu. Vui lòng thử lại sau.")
			} finally {
				setLoading(false)
			}
		}

		loadData()
	}, [locationType])

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

				{/* Location Cards */}
				{!loading && !error && (
					<motion.div style={{ y: cardY }} className="grid md:grid-cols-2 gap-8">
						{locations?.map((location, index) => (
							<LocationCard key={location.id} location={location} index={index} onSelect={onLocationSelect} />
						))}
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
	const [disable, setDisable] = useState(false) // disable,
	const handleNavigate = () => {
		if (location.id) {
			setDisable(true)
			if (onSelect) {
				onSelect(location)
			}
			router.push(`/trai-nghiem/${location.id}`)
			setDisable(false)
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
						<div className="flex flex-wrap gap-2 mb-6">
							{location.tags.slice(0, 3).map((tag) => (
								<Badge key={tag} variant="outline" className="border-white/40 text-white/80 text-xs bg-white/10">
									{tag}
								</Badge>
							))}
						</div>

						{/* Highlights */}
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

						{/* Action Button */}
						<Button
							onClick={() => [onSelect?.(location), handleNavigate()]}
							className="w-full bg-white/25 hover:bg-white/35 backdrop-blur-sm border-white/40 text-white group transition-all duration-300"
							variant="outline"
							disabled={!location.id}
						>
							Khám phá ngay
							<ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
						</Button>
					</CardContent>
				</div>
			</Card>
		</motion.div>
	)
}
