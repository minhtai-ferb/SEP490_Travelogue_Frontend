"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ImageType {
	url: string
	alt: string
	isThumbnail?: boolean
}

interface ImageGalleryProps {
	images: ImageType[]
}

export function ImageGalleryExplore({ images }: ImageGalleryProps) {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [isFullscreen, setIsFullscreen] = useState(false)

	const goToPrevious = () => {
		const isFirstImage = currentIndex === 0
		const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1
		setCurrentIndex(newIndex)
	}

	const goToNext = () => {
		const isLastImage = currentIndex === images.length - 1
		const newIndex = isLastImage ? 0 : currentIndex + 1
		setCurrentIndex(newIndex)
	}

	const goToImage = (index: number) => {
		setCurrentIndex(index)
	}

	const toggleFullscreen = () => {
		setIsFullscreen(!isFullscreen)
	}

	return (
		<div className="relative w-full">
			{/* Main image container */}
			<div
				className={cn(
					"relative w-full bg-black",
					isFullscreen ? "fixed inset-0 z-50" : "h-[40vh] md:h-[50vh] lg:h-[60vh]",
				)}
			>
				<Image
					src={images[currentIndex]?.url || "/placeholder.svg"}
					alt={images[currentIndex]?.alt || "Image"}
					fill
					className="object-contain"
					priority
				/>

				{/* Navigation arrows */}
				<Button
					variant="ghost"
					size="icon"
					className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full h-10 w-10"
					onClick={goToPrevious}
					aria-label="Previous image"
				>
					<ChevronLeft className="h-6 w-6" />
				</Button>

				<Button
					variant="ghost"
					size="icon"
					className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full h-10 w-10"
					onClick={goToNext}
					aria-label="Next image"
				>
					<ChevronRight className="h-6 w-6" />
				</Button>

				{/* Fullscreen toggle */}
				<Button
					variant="ghost"
					size="icon"
					className="absolute top-2 right-2 bg-black/30 text-white hover:bg-black/50 rounded-full h-10 w-10"
					onClick={toggleFullscreen}
					aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
				>
					{isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
				</Button>

				{/* Image counter */}
				<div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
					{currentIndex + 1} / {images.length}
				</div>
			</div>

			{/* Thumbnails - only show when not in fullscreen */}
			{!isFullscreen && (
				<div className="flex overflow-x-auto gap-2 mt-4 pb-2 px-2">
					{images.map((image, index) => (
						<button
							key={index}
							onClick={() => goToImage(index)}
							className={cn(
								"relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all",
								currentIndex === index
									? "border-blue-500 scale-105"
									: "border-transparent opacity-70 hover:opacity-100",
							)}
							aria-label={`View image ${index + 1}`}
						>
							<Image src={image.url || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
						</button>
					))}
				</div>
			)}

			{/* Fullscreen overlay for thumbnails */}
			{isFullscreen && (
				<div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center">
					<div className="flex gap-2 p-2 bg-black/60 rounded-full overflow-x-auto max-w-[90vw]">
						{images.map((image, index) => (
							<button
								key={index}
								onClick={() => goToImage(index)}
								className={cn(
									"relative h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 rounded-full overflow-hidden border-2 transition-all",
									currentIndex === index
										? "border-blue-500 scale-110"
										: "border-transparent opacity-70 hover:opacity-100",
								)}
								aria-label={`View image ${index + 1}`}
							>
								<Image src={image.url || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
