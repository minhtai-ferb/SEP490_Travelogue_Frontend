"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
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

export function ImageGallery({ images }: ImageGalleryProps) {
	const [currentIndex, setCurrentIndex] = useState(0)

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

	return (
		<div className="relative">
			{/* Main image */}
			<div className="relative h-screen w-full">
				<Image
					src={images[currentIndex].url || "/placeholder_image.jpg"}
					alt={images[currentIndex].alt}
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

				{/* Image counter */}
				<div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
					{currentIndex + 1} / {images.length}
				</div>
			</div>

			{/* Thumbnails */}
			<div className="flex overflow-x-auto gap-2 mt-4 pb-2">
				{images.map((image, index) => (
					<button
						key={index}
						onClick={() => goToImage(index)}
						className={cn(
							"relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border-2",
							currentIndex === index ? "border-primary" : "border-transparent",
						)}
						aria-label={`View image ${index + 1}`}
					>
						<Image src={image.url || "/placeholder_image.jpg"} alt={image.alt} fill className="object-cover" />
					</button>
				))}
			</div>
		</div>
	)
}

