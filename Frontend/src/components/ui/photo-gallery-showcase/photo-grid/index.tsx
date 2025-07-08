"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Share2, MapPin, Eye, Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface Photo {
	id: string
	src: string
	title: string
	location: string
	category: string
	likes: number
	isVideo?: boolean
	featured?: boolean
	description?: string
}

interface PhotoGridProps {
	photos: Photo[]
	layout?: "masonry" | "grid" | "featured" | "carousel" | "magazine"
	className?: string
	showOverlay?: boolean
	showActions?: boolean
}

export function PhotoGrid({
	photos,
	layout = "masonry",
	className,
	showOverlay = true,
	showActions = true,
}: PhotoGridProps) {
	const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
	const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set())

	const toggleLike = (photoId: string) => {
		setLikedPhotos((prev) => {
			const newSet = new Set(prev)
			if (newSet.has(photoId)) {
				newSet.delete(photoId)
			} else {
				newSet.add(photoId)
			}
			return newSet
		})
	}

	const renderMasonryLayout = () => (
		<div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
			{photos.map((photo, index) => (
				<motion.div
					key={photo.id}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: index * 0.1 }}
					className="break-inside-avoid mb-4"
				>
					<PhotoCard
						photo={photo}
						showOverlay={showOverlay}
						showActions={showActions}
						isLiked={likedPhotos.has(photo.id)}
						onLike={() => toggleLike(photo.id)}
						onClick={() => setSelectedPhoto(photo)}
					/>
				</motion.div>
			))}
		</div>
	)

	const renderGridLayout = () => (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{photos.map((photo, index) => (
				<motion.div
					key={photo.id}
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: index * 0.1 }}
				>
					<PhotoCard
						photo={photo}
						showOverlay={showOverlay}
						showActions={showActions}
						isLiked={likedPhotos.has(photo.id)}
						onLike={() => toggleLike(photo.id)}
						onClick={() => setSelectedPhoto(photo)}
						aspectRatio="square"
					/>
				</motion.div>
			))}
		</div>
	)

	const renderFeaturedLayout = () => (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			{/* Large featured image */}
			<div className="lg:col-span-2 lg:row-span-2">
				<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="h-full">
					<PhotoCard
						photo={photos[0]}
						showOverlay={showOverlay}
						showActions={showActions}
						isLiked={likedPhotos.has(photos[0]?.id)}
						onLike={() => toggleLike(photos[0]?.id)}
						onClick={() => setSelectedPhoto(photos[0])}
						size="large"
					/>
				</motion.div>
			</div>

			{/* Smaller images */}
			<div className="grid grid-cols-1 gap-6">
				{photos.slice(1, 5).map((photo, index) => (
					<motion.div
						key={photo.id}
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: (index + 1) * 0.1 }}
					>
						<PhotoCard
							photo={photo}
							showOverlay={showOverlay}
							showActions={showActions}
							isLiked={likedPhotos.has(photo.id)}
							onLike={() => toggleLike(photo.id)}
							onClick={() => setSelectedPhoto(photo)}
							size="small"
						/>
					</motion.div>
				))}
			</div>
		</div>
	)

	const renderMagazineLayout = () => (
		<div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-8 gap-4 auto-rows-[200px]">
			{photos.map((photo, index) => {
				const spanClass = getSpanClass(index)
				return (
					<motion.div
						key={photo.id}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: index * 0.1 }}
						className={cn("relative", spanClass)}
					>
						<PhotoCard
							photo={photo}
							showOverlay={showOverlay}
							showActions={showActions}
							isLiked={likedPhotos.has(photo.id)}
							onLike={() => toggleLike(photo.id)}
							onClick={() => setSelectedPhoto(photo)}
							className="h-full"
						/>
					</motion.div>
				)
			})}
		</div>
	)

	const getSpanClass = (index: number) => {
		const patterns = [
			"md:col-span-3 md:row-span-2", // Large
			"md:col-span-2 md:row-span-1", // Medium
			"md:col-span-2 md:row-span-1", // Medium
			"md:col-span-3 md:row-span-1", // Wide
			"md:col-span-2 md:row-span-2", // Tall
			"md:col-span-2 md:row-span-1", // Medium
		]
		return patterns[index % patterns.length]
	}

	const renderLayout = () => {
		switch (layout) {
			case "grid":
				return renderGridLayout()
			case "featured":
				return renderFeaturedLayout()
			case "magazine":
				return renderMagazineLayout()
			default:
				return renderMasonryLayout()
		}
	}

	return (
		<div className={cn("w-full", className)}>
			{renderLayout()}

			{/* Lightbox Modal */}
			<AnimatePresence>
				{selectedPhoto && (
					<PhotoLightbox
						photo={selectedPhoto}
						onClose={() => setSelectedPhoto(null)}
						isLiked={likedPhotos.has(selectedPhoto.id)}
						onLike={() => toggleLike(selectedPhoto.id)}
					/>
				)}
			</AnimatePresence>
		</div>
	)
}

interface PhotoCardProps {
	photo: Photo
	showOverlay?: boolean
	showActions?: boolean
	isLiked?: boolean
	onLike?: () => void
	onClick?: () => void
	size?: "small" | "medium" | "large"
	aspectRatio?: "auto" | "square" | "video"
	className?: string
}

function PhotoCard({
	photo,
	showOverlay = true,
	showActions = true,
	isLiked = false,
	onLike,
	onClick,
	size = "medium",
	aspectRatio = "auto",
	className,
}: PhotoCardProps) {
	const [imageLoaded, setImageLoaded] = useState(false)
	const [isHovered, setIsHovered] = useState(false)

	const sizeClasses = {
		small: "h-48",
		medium: "h-64 md:h-80",
		large: "h-96 md:h-[500px] lg:h-[600px]",
	}

	const aspectClasses = {
		auto: "",
		square: "aspect-square",
		video: "aspect-video",
	}

	return (
		<Card
			className={cn(
				"group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl border-0",
				aspectRatio !== "auto" ? aspectClasses[aspectRatio] : sizeClasses[size],
				className,
			)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={onClick}
		>
			{/* Image */}
			<div className="relative w-full h-full overflow-hidden">
				<motion.img
					src={photo.src}
					alt={photo.title}
					className={cn(
						"w-full h-full object-cover transition-all duration-700",
						imageLoaded ? "scale-100 blur-0" : "scale-110 blur-sm",
						isHovered && "scale-110",
					)}
					onLoad={() => setImageLoaded(true)}
				/>

				{/* Loading skeleton */}
				{!imageLoaded && (
					<div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
				)}

				{/* Video indicator */}
				{photo.isVideo && (
					<div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-full p-2">
						<Play className="h-4 w-4 text-white" />
					</div>
				)}

				{/* Category badge */}
				<div className="absolute top-4 left-4">
					<Badge className="bg-white/90 text-gray-900 backdrop-blur-sm">{photo.category}</Badge>
				</div>

				{/* Overlay */}
				{showOverlay && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: isHovered ? 1 : 0 }}
						className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
					/>
				)}

				{/* Content */}
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{
						y: isHovered ? 0 : 20,
						opacity: isHovered ? 1 : 0,
					}}
					className="absolute bottom-0 left-0 right-0 p-6 text-white"
				>
					<h3 className="text-xl font-bold mb-2">{photo.title}</h3>
					<div className="flex items-center gap-2 text-sm opacity-90 mb-3">
						<MapPin className="h-4 w-4" />
						{photo.location}
					</div>
					{photo.description && <p className="text-sm opacity-80 line-clamp-2">{photo.description}</p>}
				</motion.div>

				{/* Actions */}
				{showActions && (
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{
							opacity: isHovered ? 1 : 0,
							scale: isHovered ? 1 : 0.8,
						}}
						className="absolute top-4 right-4 flex gap-2"
					>
						<Button
							size="icon"
							variant="secondary"
							className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 rounded-full h-10 w-10"
							onClick={(e) => {
								e.stopPropagation()
								onLike?.()
							}}
						>
							<Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
						</Button>
						<Button
							size="icon"
							variant="secondary"
							className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 rounded-full h-10 w-10"
							onClick={(e) => {
								e.stopPropagation()
								// Handle share
							}}
						>
							<Share2 className="h-4 w-4" />
						</Button>
					</motion.div>
				)}

				{/* Stats */}
				<div className="absolute bottom-4 right-4 flex items-center gap-4 text-white text-sm">
					<div className="flex items-center gap-1">
						<Eye className="h-4 w-4" />
						<span>1.2k</span>
					</div>
					<div className="flex items-center gap-1">
						<Heart className="h-4 w-4" />
						<span>{photo.likes}</span>
					</div>
				</div>
			</div>
		</Card>
	)
}

interface PhotoLightboxProps {
	photo: Photo
	onClose: () => void
	isLiked: boolean
	onLike: () => void
}

function PhotoLightbox({ photo, onClose, isLiked, onLike }: PhotoLightboxProps) {
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
				<img
					src={photo.src || "/placeholder.svg"}
					alt={photo.title}
					className="w-full h-full object-contain rounded-2xl"
				/>

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
					<div className="flex items-start justify-between text-white">
						<div>
							<h2 className="text-2xl font-bold mb-2">{photo.title}</h2>
							<div className="flex items-center gap-2 text-sm opacity-90 mb-2">
								<MapPin className="h-4 w-4" />
								{photo.location}
							</div>
							{photo.description && <p className="text-sm opacity-80">{photo.description}</p>}
						</div>

						<div className="flex gap-2">
							<Button
								size="icon"
								variant="secondary"
								className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full"
								onClick={onLike}
							>
								<Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
							</Button>
							<Button
								size="icon"
								variant="secondary"
								className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full"
							>
								<Share2 className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</motion.div>
		</motion.div>
	)
}
