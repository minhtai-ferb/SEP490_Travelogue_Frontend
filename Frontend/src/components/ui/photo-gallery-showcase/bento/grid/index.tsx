"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Share2, MapPin, Eye, Play, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { TravelogueButton } from "@/components/common/avatar-button"
import TravelCTA from "@/components/common/booking-tour-button"
import { ShinyButton } from "@/components/magicui/shiny-button"
import { useRouter } from "next/navigation"

// Fixed Bento Grid Layout - maintains consistent visual pattern regardless of data
// Pattern: tall -> lg -> wide -> sm -> sm -> tall -> wide -> sm -> sm (repeats)

interface BentoItem {
	id: string
	type: "photo" | "video" | "stats" | "text" | "feature"
	src?: string
	title: string
	subtitle?: string
	location?: string
	category?: string
	likes?: number
	views?: number
	description?: string
	stats?: { label: string; value: string | number; icon: any }[]
	gradient?: string
	size: "sm" | "md" | "lg" | "xl" | "wide" | "tall"
	featured?: boolean
	isVideo?: boolean
}

interface BentoPhotoGridProps {
	items: BentoItem[]
	className?: string
}

export function BentoPhotoGrid({ items, className }: BentoPhotoGridProps) {
	const [likedItems, setLikedItems] = useState<Set<string>>(new Set())
	const [selectedItem, setSelectedItem] = useState<BentoItem | null>(null)

	const toggleLike = (itemId: string) => {
		setLikedItems((prev) => {
			const newSet = new Set(prev)
			if (newSet.has(itemId)) {
				newSet.delete(itemId)
			} else {
				newSet.add(itemId)
			}
			return newSet
		})
	}

	const getFixedSizePattern = (index: number) => {
		// Mobile-first responsive pattern
		const mobilePattern = [
			"col-span-2 row-span-2", // large on mobile (index 0)
			"col-span-1 row-span-2", // tall (index 1)
			"col-span-1 row-span-1", // small (index 2)
			"col-span-2 row-span-1", // wide (index 3)
			"col-span-1 row-span-1", // small (index 4)
			"col-span-1 row-span-1", // small (index 5)
			"col-span-2 row-span-1", // wide (index 6)
			"col-span-1 row-span-2", // tall (index 7)
			"col-span-1 row-span-1", // small (index 8)
		]

		// Desktop pattern (your original)
		const desktopPattern = [
			"sm:col-span-1 sm:row-span-2 md:col-span-1 md:row-span-2", // tall
			"sm:col-span-2 sm:row-span-2 md:col-span-2 md:row-span-2", // lg
			"sm:col-span-3 sm:row-span-1 md:col-span-3 md:row-span-1", // wide
			"sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1", // sm
			"sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1", // sm
			"sm:col-span-1 sm:row-span-2 md:col-span-1 md:row-span-2", // tall
			"sm:col-span-3 sm:row-span-1 md:col-span-3 md:row-span-1", // wide
			"sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1", // sm
			"sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1", // sm
		]

		const mobileClass = mobilePattern[index % mobilePattern.length]
		const desktopClass = desktopPattern[index % desktopPattern.length]

		return `${mobileClass} ${desktopClass}`
	}

	return (
		<div className={cn("w-full", className)}>
			{/* Bento Grid Container */}
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 auto-rows-[150px] sm:auto-rows-[180px] md:auto-rows-[200px]">
				{items.map((item, index) => (
					<motion.div
						key={item.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
						className={cn("relative", getFixedSizePattern(index))}
					>
						<BentoCard
							item={item}
							isLiked={likedItems.has(item.id)}
							onLike={() => toggleLike(item.id)}
							onClick={() => setSelectedItem(item)}
						/>
					</motion.div>
				))}
			</div>

			{/* Lightbox Modal */}
			<AnimatePresence>
				{selectedItem && (
					<BentoLightbox
						item={selectedItem}
						onClose={() => setSelectedItem(null)}
					/>
				)}
			</AnimatePresence>
		</div>
	)
}

interface BentoCardProps {
	item: BentoItem
	isLiked: boolean
	onLike: () => void
	onClick: () => void
}

function BentoCard({ item, onClick }: BentoCardProps) {
	const [isHovered, setIsHovered] = useState(false)
	const [imageLoaded, setImageLoaded] = useState(false)

	const renderPhotoCard = () => (
		<div className="relative w-full h-full overflow-hidden group">
			{/* Background Image */}
			{item.src && (
				<motion.img
					src={item.src}
					alt={item.title}
					className={cn(
						"absolute inset-0 w-full h-full object-cover transition-all duration-700",
						imageLoaded ? "scale-100 blur-0" : "scale-110 blur-sm",
						isHovered && "scale-110",
					)}
					onLoad={() => setImageLoaded(true)}
				/>
			)}

			{/* Loading skeleton */}
			{!imageLoaded && item.src && (
				<div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
			)}

			{/* Video indicator */}
			{item.isVideo && (
				<div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-full p-2 z-10">
					<Play className="h-4 w-4 text-white" />
				</div>
			)}

			{/* Category badge */}
			{/* {item.category && (
				<div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 z-10">
					<Badge className="bg-white/90 text-gray-900 backdrop-blur-sm text-xs px-2 py-1">{item.category}</Badge>
				</div>
			)} */}

			{/* Gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

			{/* Content */}
			<div className="absolute inset-0 p-3 sm:p-4 md:p-6 flex flex-col mx-auto align-middle items-center justify-center text-white">
				<motion.div
					initial={{ y: 10, opacity: 0.8 }}
					animate={{
						y: isHovered ? 0 : 10,
						opacity: isHovered ? 1 : 0.8,
					}}
				>
					{item.location && (
						<div className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-1 sm:mb-2 line-clamp-2">
							{item.location}
						</div>
					)}
				</motion.div>
			</div>
		</div>
	)

	const renderStatsCard = () => (
		<div
			className={cn(
				"relative w-full h-full p-6 flex flex-col justify-center",
				item.gradient || "bg-gradient-to-br from-blue-500 to-purple-600",
			)}
		>
			<div className="text-center text-white">
				<h3 className="text-2xl md:text-3xl font-bold mb-2">{item.title}</h3>
				{item.subtitle && <p className="text-sm opacity-90 mb-4">{item.subtitle}</p>}

				{item.stats && (
					<div className="grid grid-cols-1 gap-3">
						{item.stats.map((stat, index) => (
							<div key={index} className="flex items-center justify-center gap-2">
								<stat.icon className="h-5 w-5" />
								<span className="text-lg font-semibold">{stat.value}</span>
								<span className="text-sm opacity-80">{stat.label}</span>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)

	const renderTextCard = () => (
		<div
			className={cn(
				"relative w-full h-full p-6 flex flex-col justify-center",
				item.gradient || "bg-gradient-to-br from-gray-100 to-gray-200",
			)}
		>
			<div className="text-center">
				<h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900">{item.title}</h3>
				{item.description && <p className="text-gray-700 text-sm leading-relaxed">{item.description}</p>}
				{item.subtitle && <p className="text-gray-600 text-xs mt-2 opacity-80">{item.subtitle}</p>}
			</div>
		</div>
	)

	const renderFeatureCard = () => (
		<div className="relative w-full h-full overflow-hidden">
			{/* Background */}
			<div className={cn("absolute inset-0", item.gradient || "bg-gradient-to-br from-orange-400 to-pink-500")} />

			{/* Pattern overlay */}
			<div className="absolute inset-0 opacity-10">
				<div
					className="w-full h-full"
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
					}}
				/>
			</div>

			{/* Content */}
			<div className="relative p-6 h-full flex flex-col justify-center text-white text-center">
				<Star className="h-8 w-8 mx-auto mb-4" />
				<h3 className="text-xl font-bold mb-2">{item.title}</h3>
				{item.description && <p className="text-sm opacity-90 leading-relaxed">{item.description}</p>}
			</div>
		</div>
	)

	const renderCard = () => {
		switch (item.type) {
			case "stats":
				return renderStatsCard()
			case "text":
				return renderTextCard()
			case "feature":
				return renderFeatureCard()
			default:
				return renderPhotoCard()
		}
	}

	return (
		<Card
			className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl border-0 h-full"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={onClick}
		>
			{renderCard()}
		</Card>
	)
}

interface BentoLightboxProps {
	item: BentoItem
	onClose: () => void
}



function BentoLightbox({ item, onClose }: BentoLightboxProps) {
	const router = useRouter()
	const handleExplore = () => {
		router.push(`/chuyen-di/${item.id}`)
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
			onClick={onClose}
		>
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.8, opacity: 0 }}
				className="relative max-w-4xl max-h-[90vh] w-full"
				onClick={(e) => e.stopPropagation()}
			>
				{item.src ? (
					<img
						src={item.src || "/placeholder.svg"}
						alt={item.title}
						className="w-full h-full object-contain rounded-2xl"
					/>
				) : (
					<div
						className={cn(
							"w-full h-96 rounded-2xl flex items-center justify-center",
							item.gradient || "bg-gradient-to-br from-blue-500 to-purple-600",
						)}
					>
						<div className="text-center text-white">
							<h2 className="text-3xl font-bold mb-4">{item.title}</h2>
							{item.description && <p className="text-lg opacity-90">{item.description}</p>}
						</div>
					</div>
				)}

				{/* Close button */}
				<Button
					size="icon"
					variant="secondary"
					className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full"
					onClick={onClose}
				>
					×
				</Button>

				{/* Info panel */}
				<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl">
					<div className="flex items-start text-white">
						<div>
							<h2 className="text-2xl font-bold mb-2">{item.title}</h2>
							{item.location && (
								<div className="flex items-center gap-2 text-sm opacity-90 mb-2">
									<MapPin className="h-4 w-4" />
									{item.location}
								</div>
							)}
							{item.description && <p className="text-sm opacity-80">{item.description}</p>}
							<ShinyButton className="mt-3 flex items-center mx-auto gap-2 px-4 py-2 rounded-full 
							bg-gradient-to-r from-blue-500 to-purple-600 
							hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
								onClick={handleExplore}
							>
								<p className="w-full text-white">Khám phá tour</p>
							</ShinyButton>
						</div>
					</div>
				</div>
			</motion.div>
		</motion.div>
	)
}
