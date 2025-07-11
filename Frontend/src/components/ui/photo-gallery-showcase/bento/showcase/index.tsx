"use client"

import { Location } from "@/types/Location"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { BentoPhotoGrid } from "../grid"
import { useLocationController } from "@/services/location-controller"

export function BentoShowcase() {
	const [bentoItems, setBentoItems] = useState<Location[]>([])
	const { searchLocation } = useLocationController()

	const fetchLocations = async () => {
		try {
			const response = await searchLocation({
				title: "",
				pageNumber: 1,
				pageSize: 9,
			})
			if (response) {
				console.log("Fetched locations:", response)
				// Assuming response is an array of Location objects
				setBentoItems(response?.data || [])
			} else {
				console.warn("No locations found")
			}
		}
		catch (error) {
			console.error("Error fetching locations:", error)
		}
	}

	useEffect(() => {
		fetchLocations()
	}, [])

	return (
		<div className="relative w-full space-y-12 py-12">
			{/* Bento Grid */}
			<motion.div
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="max-w-7xl mx-auto px-4"
			>
				<BentoPhotoGrid items={bentoItems as any} />
			</motion.div>
		</div>
	)
}
