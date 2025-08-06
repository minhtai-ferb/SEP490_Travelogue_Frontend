"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
	icon: LucideIcon
	label: string
	value: number
	delay: number
	iconBgColor: string
	iconColor: string
}

export const StatsCard = React.memo<StatsCardProps>(({ icon: Icon, label, value, delay, iconBgColor, iconColor }) => {
	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
			<Card>
				<CardContent className="p-6">
					<div className="flex items-center">
						<div className={`p-2 rounded-lg ${iconBgColor}`}>
							<Icon className={`w-6 h-6 ${iconColor}`} />
						</div>
						<div className="ml-4">
							<p className="text-sm font-medium text-gray-600">{label}</p>
							<p className="text-2xl font-bold text-gray-900">{value}</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	)
})

StatsCard.displayName = "StatsCard"
