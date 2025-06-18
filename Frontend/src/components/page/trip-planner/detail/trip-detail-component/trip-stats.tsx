"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Utensils, Briefcase, Route } from "lucide-react"
import type { TripPlan } from "@/types/Tripplan"

interface TripStatsProps {
	plan: TripPlan
}

export function TripStats({ plan }: TripStatsProps) {
	const stats = [
		{
			icon: MapPin,
			label: "Điểm du lịch",
			value: plan.destinations.length,
			color: "blue",
			bgColor: "bg-blue-50",
			iconColor: "text-blue-600",
			textColor: "text-blue-700",
		},
		{
			icon: Utensils,
			label: "Nhà hàng",
			value: plan.restaurants.length,
			color: "orange",
			bgColor: "bg-orange-50",
			iconColor: "text-orange-600",
			textColor: "text-orange-700",
		},
		{
			icon: Briefcase,
			label: "Làng nghề",
			value: plan.craftVillages.length,
			color: "green",
			bgColor: "bg-green-50",
			iconColor: "text-green-600",
			textColor: "text-green-700",
		},
		{
			icon: Route,
			label: "Hoạt động",
			value: plan.itinerary.reduce((total, day) => total + day.activities.length, 0),
			color: "purple",
			bgColor: "bg-purple-50",
			iconColor: "text-purple-600",
			textColor: "text-purple-700",
		},
	]

	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
			{stats.map((stat, index) => (
				<motion.div
					key={stat.label}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: index * 0.1 }}
				>
					<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
						<CardContent className="p-6">
							<div className={`${stat.bgColor} rounded-2xl p-4 mb-4`}>
								<stat.icon className={`h-8 w-8 ${stat.iconColor} mx-auto`} />
							</div>
							<div className="text-center">
								<div className={`text-3xl font-bold ${stat.textColor} mb-1`}>{stat.value}</div>
								<div className="text-sm text-gray-600">{stat.label}</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			))}
		</div>
	)
}
