"use client"

import { useState, useCallback } from "react"

export function useImageCarousel(totalImages: number) {
	const [currentIndex, setCurrentIndex] = useState(0)

	const nextImage = useCallback(() => {
		setCurrentIndex((prev) => (prev + 1) % totalImages)
	}, [totalImages])

	const prevImage = useCallback(() => {
		setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages)
	}, [totalImages])

	const goToImage = useCallback((index: number) => {
		setCurrentIndex(index)
	}, [])

	return {
		currentIndex,
		nextImage,
		prevImage,
		goToImage,
	}
}
