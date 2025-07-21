"use client"

import type { Region } from "@/interfaces/region"
import { motion } from "framer-motion"
import { useState } from "react"
import { arrayDpath } from "@/data/region-data"

interface TayNinhMapDynamicProps {
	onPathClick: (region: Region) => void
}

function TayNinhMapDynamic({ onPathClick }: TayNinhMapDynamicProps) {
	const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)

	const pathVariants = {
		initial: {
			fill: "rgba(255, 255, 255, 0.9)",
			stroke: "#ffffff",
			strokeWidth: 1,
		},
		hover: {
			fill: "rgba(109, 213, 250, 0.8)",
			stroke: "#ffffff",
			strokeWidth: 1.5,
			transition: {
				duration: 0.3,
				ease: [0.16, 1, 0.3, 1],
			},
		},
	}

	return (
		<div className="relative flex justify-center items-center mx-auto">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				version="1.2"
				baseProfile="tiny"
				width="50%"
				height=""
				viewBox="0 0 800 958"
				className="md:w-1/4 w-screen max-w-xl"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<motion.g initial="initial">
					{arrayDpath.map((item, index) => (
						<motion.path
							key={item.id}
							variants={pathVariants}
							initial="initial"
							whileHover="hover"
							animate={hoveredRegion === item.id ? "hover" : "initial"}
							onHoverStart={() => setHoveredRegion(item.id)}
							onHoverEnd={() => setHoveredRegion(null)}
							className="cursor-pointer"
							onClick={() => onPathClick(item)}
							d={item.path}
						/>
					))}
				</motion.g>
			</svg>
		</div>
	)
}

export default TayNinhMapDynamic

