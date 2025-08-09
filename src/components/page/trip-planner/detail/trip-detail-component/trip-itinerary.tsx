"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock } from "lucide-react"
import type { TripPlan } from "@/types/Tripplan"

interface TripItineraryProps {
	plan: TripPlan
	formatDate: (date: Date) => string
}

export function TripItinerary({ plan, formatDate }: TripItineraryProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className="space-y-8"
		>
			{plan?.itinerary?.map((day: any, dayIndex: any) => (
				<motion.div
					key={day.day}
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: dayIndex * 0.1 }}
					className="space-y-6"
				>
					{/* Day Header */}
					<div className="flex items-center gap-4">
						<div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
							<span className="font-bold text-white">{day.day}</span>
						</div>
						<div>
							<h3 className="text-2xl font-bold text-gray-900">Ngày {day.day}</h3>
							<p className="text-gray-600">
								{formatDate(new Date(plan.startDate.getTime() + (day.day - 1) * 24 * 60 * 60 * 1000))}
							</p>
						</div>
					</div>

					{/* Activities Timeline */}
					<div className="ml-8 pl-8 border-l-4 border-gradient-to-b from-blue-200 to-purple-200 space-y-6 relative">
						{day.activities?.map((activity: any, activityIndex: any) => (
							<motion.div
								key={activityIndex}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: dayIndex * 0.1 + activityIndex * 0.05 }}
								className="relative"
							>
								{/* Timeline Dot */}
								<div className="absolute -left-[42px] w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
									<Clock className="h-4 w-4 text-white" />
								</div>

								{/* Activity Card */}
								<Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
									<CardContent className="p-6">
										<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
											<div className="flex-1">
												<h4 className="text-xl font-semibold text-gray-900 mb-2">{activity.title}</h4>
												<p className="text-gray-600 leading-relaxed">{activity.description}</p>
											</div>
											<Badge
												variant="outline"
												className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 font-medium self-start"
											>
												{activity.time}
											</Badge>
										</div>

										<div className="flex items-center gap-2 text-gray-500">
											<MapPin className="h-4 w-4" />
											<span className="text-sm">{activity.location}</span>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</motion.div>
			))}
		</motion.div>
	)
}
