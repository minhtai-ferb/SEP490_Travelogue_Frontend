"use client"

import { motion } from "framer-motion"

export function BackgroundElements() {
	return (
		<div className="fixed inset-0 overflow-hidden pointer-events-none">
			{/* Floating Shapes */}
			<motion.div
				animate={{
					y: [0, -20, 0],
					rotate: [0, 5, 0],
				}}
				transition={{
					duration: 6,
					repeat: Number.POSITIVE_INFINITY,
					ease: "easeInOut",
				}}
				className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 blur-xl"
			/>

			<motion.div
				animate={{
					y: [0, 30, 0],
					rotate: [0, -5, 0],
				}}
				transition={{
					duration: 8,
					repeat: Number.POSITIVE_INFINITY,
					ease: "easeInOut",
					delay: 1,
				}}
				className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-200 to-orange-200 rounded-full opacity-20 blur-xl"
			/>

			<motion.div
				animate={{
					y: [0, -15, 0],
					x: [0, 10, 0],
				}}
				transition={{
					duration: 7,
					repeat: Number.POSITIVE_INFINITY,
					ease: "easeInOut",
					delay: 2,
				}}
				className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-r from-green-200 to-blue-200 rounded-full opacity-15 blur-xl"
			/>

			<motion.div
				animate={{
					y: [0, 25, 0],
					rotate: [0, 10, 0],
				}}
				transition={{
					duration: 9,
					repeat: Number.POSITIVE_INFINITY,
					ease: "easeInOut",
					delay: 0.5,
				}}
				className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-20 blur-xl"
			/>
		</div>
	)
}
