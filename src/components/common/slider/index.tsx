"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SlideItem {
	id: string
	title?: string
	subtitle?: string
	description?: string
	image?: string
	video?: string
	content?: React.ReactNode
	overlay?: boolean
	textPosition?: "left" | "center" | "right" | "bottom"
}

interface SliderProps {
	items: SlideItem[]
	variant?: "default" | "cards" | "fade" | "scale" | "3d" | "parallax"
	autoPlay?: boolean
	autoPlayInterval?: number
	showDots?: boolean
	showArrows?: boolean
	showProgress?: boolean
	infinite?: boolean
	slidesToShow?: number
	spacing?: number
	height?: string
	className?: string
	onSlideChange?: (index: number) => void
}

export function Slider({
	items,
	variant = "default",
	autoPlay = false,
	autoPlayInterval = 5000,
	showDots = true,
	showArrows = true,
	showProgress = false,
	infinite = true,
	slidesToShow = 1,
	spacing = 20,
	height = "400px",
	className,
	onSlideChange,
}: SliderProps) {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [isPlaying, setIsPlaying] = useState(autoPlay)
	const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 })

	// Auto play functionality
	useEffect(() => {
		if (!isPlaying || items.length <= 1) return

		const interval = setInterval(() => {
			setCurrentIndex((prev) => (infinite ? (prev + 1) % items.length : Math.min(prev + 1, items.length - 1)))
		}, autoPlayInterval)

		return () => clearInterval(interval)
	}, [isPlaying, autoPlayInterval, items.length, infinite])

	// Handle slide change
	const handleSlideChange = useCallback(
		(index: number) => {
			setCurrentIndex(index)
			onSlideChange?.(index)
		},
		[onSlideChange],
	)

	// Navigation functions
	const goToNext = () => {
		const nextIndex = infinite ? (currentIndex + 1) % items.length : Math.min(currentIndex + 1, items.length - 1)
		handleSlideChange(nextIndex)
	}

	const goToPrev = () => {
		const prevIndex = infinite
			? currentIndex === 0
				? items.length - 1
				: currentIndex - 1
			: Math.max(currentIndex - 1, 0)
		handleSlideChange(prevIndex)
	}

	// Drag handling
	const handleDragEnd = (event: any, info: PanInfo) => {
		const threshold = 50
		if (info.offset.x > threshold) {
			goToPrev()
		} else if (info.offset.x < -threshold) {
			goToNext()
		}
	}

	// Calculate drag constraints
	useEffect(() => {
		const containerWidth = 100 // percentage
		const slideWidth = containerWidth / slidesToShow
		const totalWidth = slideWidth * items.length
		const maxDrag = totalWidth - containerWidth

		setDragConstraints({
			left: -maxDrag,
			right: 0,
		})
	}, [items.length, slidesToShow])

	const getSlideVariants = () => {
		switch (variant) {
			case "fade":
				return {
					enter: { opacity: 0 },
					center: { opacity: 1 },
					exit: { opacity: 0 },
				}
			case "scale":
				return {
					enter: { opacity: 0, scale: 0.8 },
					center: { opacity: 1, scale: 1 },
					exit: { opacity: 0, scale: 1.2 },
				}
			case "3d":
				return {
					enter: { opacity: 0, rotateY: 90, z: -100 },
					center: { opacity: 1, rotateY: 0, z: 0 },
					exit: { opacity: 0, rotateY: -90, z: -100 },
				}
			case "parallax":
				return {
					enter: { opacity: 0, x: 100, y: 50 },
					center: { opacity: 1, x: 0, y: 0 },
					exit: { opacity: 0, x: -100, y: -50 },
				}
			default:
				return {
					enter: { opacity: 0, x: 300 },
					center: { opacity: 1, x: 0 },
					exit: { opacity: 0, x: -300 },
				}
		}
	}

	const slideVariants = getSlideVariants()

	return (
		<div className={cn("relative w-full overflow-hidden rounded-2xl", className)} style={{ height }}>
			{/* Main Slider Container */}
			<div className="relative w-full h-full">
				{variant === "cards" ? (
					// Cards variant with multiple slides visible
					<motion.div
						className="flex h-full"
						drag="x"
						dragConstraints={dragConstraints}
						onDragEnd={handleDragEnd}
						animate={{ x: `${-currentIndex * (100 / slidesToShow)}%` }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
					>
						{items.map((item, index) => (
							<motion.div
								key={item.id}
								className="flex-shrink-0 h-full"
								style={{ width: `${100 / slidesToShow}%`, paddingRight: spacing }}
							>
								<SlideContent item={item} variant={variant} />
							</motion.div>
						))}
					</motion.div>
				) : (
					<AnimatePresence mode="wait">
						<motion.div
							key={currentIndex}
							variants={slideVariants}
							initial="enter"
							animate="center"
							exit="exit"
							transition={{ duration: 0.5, ease: "easeInOut" }}
							className="absolute inset-0"
							drag="x"
							onDragEnd={handleDragEnd}
						>
							<SlideContent item={items[currentIndex]} variant={variant} />
						</motion.div>
					</AnimatePresence>
				)}
			</div>

			{/* Navigation Arrows */}
			{showArrows && items.length > 1 && (
				<>
					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						onClick={goToPrev}
						className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm 
						hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200"
					>
						<ChevronLeft className="w-6 h-6" />
					</motion.button>

					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						onClick={goToNext}
						className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm 
						hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200"
					>
						<ChevronRight className="w-6 h-6" />
					</motion.button>
				</>
			)}

			{/* Dots Indicator */}
			{showDots && items.length > 1 && (
				<div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
					{items.map((_, index) => (
						<motion.button
							key={index}
							whileHover={{ scale: 1.2 }}
							whileTap={{ scale: 0.8 }}
							onClick={() => handleSlideChange(index)}
							className={cn(
								"w-3 h-3 rounded-full transition-all duration-300",
								index === currentIndex
									? "bg-white shadow-lg scale-125"
									: "bg-white/50 hover:bg-white/75 backdrop-blur-sm",
							)}
						/>
					))}
				</div>
			)}

			{/* Progress Bar */}
			{showProgress && (
				<div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
					<motion.div
						className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
						initial={{ width: "0%" }}
						animate={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
						transition={{ duration: 0.3 }}
					/>
				</div>
			)}

			{/* Play/Pause Button */}
			{autoPlay && (
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => setIsPlaying(!isPlaying)}
					className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200"
				>
					{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
				</motion.button>
			)}
		</div>
	)
}

// Slide Content Component
interface SlideContentProps {
	item: SlideItem
	variant: string
}

function SlideContent({ item, variant }: SlideContentProps) {
	return (
		<div className="relative w-full h-full overflow-hidden rounded-2xl">
			{/* Background Image/Video */}
			{item?.image && (
				<motion.img
					src={item.image}
					alt={item.title || "Slide"}
					className="absolute inset-0 w-full h-full object-cover"
					initial={{ scale: 1.1 }}
					animate={{ scale: 1 }}
					transition={{ duration: 0.5 }}
				/>
			)}

			{item?.video && (
				<video src={item.video} autoPlay muted loop className="absolute inset-0 w-full h-full object-cover" />
			)}

			{/* Overlay */}
			{item?.overlay && <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />}

			{/* Content */}
			{(item?.title || item?.subtitle || item?.description) && (
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.6 }}
					className={cn("absolute z-10 text-white p-8", {
						"left-8 top-1/2 -translate-y-1/2 max-w-md": item.textPosition === "left",
						"right-8 top-1/2 -translate-y-1/2 max-w-md text-right": item.textPosition === "right",
						"left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center max-w-2xl": item.textPosition === "center",
						"bottom-8 left-8 right-8": item.textPosition === "bottom" || !item.textPosition,
					})}
				>
					{item?.subtitle && (
						<motion.p
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.3, duration: 0.5 }}
							className="text-sm md:text-base text-white/80 mb-2"
						>
							{item.subtitle}
						</motion.p>
					)}

					{item.title && (
						<motion.h2
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.4, duration: 0.5 }}
							className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance"
						>
							{item.title}
						</motion.h2>
					)}

					{item.description && (
						<motion.p
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.5, duration: 0.5 }}
							className="text-sm md:text-lg text-white/90 leading-relaxed"
						>
							{item.description}
						</motion.p>
					)}
				</motion.div>
			)}

			{/* Custom Content */}
			{item?.content && (
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.3, duration: 0.6 }}
					className="absolute inset-0 z-10"
				>
					{item.content}
				</motion.div>
			)}
		</div>
	)
}
