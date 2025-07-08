"use client"

import { useState } from "react"
import { ParallaxLocationIntro, type LocationType } from "../parallax-effect"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Mountain, Palette, Building2 } from "lucide-react"

export function ParallaxShowcase() {
	const [selectedType, setSelectedType] = useState<LocationType>("scenic-spot")

	const locationTypes: { type: LocationType; label: string; icon: any; description: string }[] = [
		{
			type: "scenic-spot",
			label: "Danh lam thắng cảnh",
			icon: Mountain,
			description: "Khám phá thiên nhiên hùng vĩ",
		},
		{
			type: "craft-village",
			label: "Làng Nghề Truyền Thống",
			icon: Palette,
			description: "Trải nghiệm nghệ thuật thủ công",
		},
		{
			type: "historical-site",
			label: "Di Tích Lịch Sử",
			icon: Building2,
			description: "Khám phá di sản văn hóa",
		},
	]

	const handleLocationSelect = (location: any) => {
		console.log("Selected location:", location)
		// Handle location selection - could navigate to detail page, open modal, etc.
	}

	return (
		<div className="w-full">
			{/* Type Selector */}
			<div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200 py-4">
				<div className="container mx-auto px-4">
					<div className="flex flex-wrap justify-center gap-4">
						{locationTypes.map((item) => (
							<Button
								key={item.type}
								onClick={() => setSelectedType(item.type)}
								variant={selectedType === item.type ? "default" : "outline"}
								className={`gap-2 transition-all duration-300 ${selectedType === item.type
									? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
									: "hover:bg-gray-50"
									}`}
							>
								<item.icon className="w-4 h-4" />
								<div className="text-left">
									<div className="font-medium">{item.label}</div>
									<div className="text-xs opacity-70">{item.description}</div>
								</div>
							</Button>
						))}
					</div>
				</div>
			</div>

			{/* Parallax Component */}
			<motion.div key={selectedType} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
				<ParallaxLocationIntro locationType={selectedType} onLocationSelect={handleLocationSelect} />
			</motion.div>

		</div>
	)
}
