"use client"

import { motion } from "framer-motion"
import { BentoPhotoGrid } from "../grid"
import { bentoItems } from "@/data/data-fake/test-iem"

export function BentoShowcase() {
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
