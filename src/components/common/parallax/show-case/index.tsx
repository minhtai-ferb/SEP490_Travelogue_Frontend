"use client"

import { useEffect, useState } from "react"
import { useLocationController } from "@/services/location-controller"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ParallaxLocationIntro } from "../parallax-effect"
import { TypeLocation } from "@/types/Location"

export function ParallaxShowcase() {
	// 1) selectedType is your chosen `id` string, or null if none
	const [selectedType, setSelectedType] = useState<string | null>(null)
	const { getAllTypeLocation, searchLocation } = useLocationController()
	const [locationTypes, setLocationTypes] = useState<TypeLocation[]>([])

	// Fetch all types once on mount
	useEffect(() => {
		fetchAllTypes()
	}, [])

	const fetchAllTypes = async () => {
		try {
			const types = await getAllTypeLocation()
			console.log("Types fetched:", types)
			setLocationTypes(types)
		} catch (error) {
			console.error("Error fetching location types:", error)
		}
	}

	// Whenever we pick a type-id, refetch locations
	useEffect(() => {
		if (selectedType) {
			fetchLocationsByType(selectedType)
		}
	}, [selectedType])

	// 2) Accept only the typeId, not the full object
	const fetchLocationsByType = async (typeId: string) => {
		try {
			const locations = await searchLocation({ typeId })
		} catch (error) {
			console.error("Error fetching locations:", error)
		}
	}

	const handleLocationSelect = (location: any) => {
		console.log("Selected location:", location)
	}

	return (
		<div className="w-full">
			{/* Type Selector */}
			<div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200 py-4">
				<div className="container mx-auto px-4">
					<div className="flex flex-wrap justify-center gap-4">
						{locationTypes?.map((item) => (
							<Button
								key={item.id}
								onClick={() => setSelectedType(item.id)}
								// 3) Compare against item.id, since that's what we store
								variant={selectedType === item.id ? "default" : "outline"}
								className={`
                  gap-2 transition-all duration-300
                  ${selectedType === item.id
										? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
										: "hover:bg-gray-50"
									}
                `}
							>
								<div className="text-left">
									<div className="font-medium">{item?.name}</div>
									{/* <div className="text-xs opacity-70">{item.description}</div> */}
								</div>
							</Button>
						))}
					</div>
				</div>
			</div>

			{/* Parallax Component */}
			<motion.div
				key={selectedType}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<ParallaxLocationIntro
					locationType={
						locationTypes.find((t) => t.id === selectedType) ?? null
					}
					onLocationSelect={handleLocationSelect}
				/>
			</motion.div>
		</div>
	)
}
