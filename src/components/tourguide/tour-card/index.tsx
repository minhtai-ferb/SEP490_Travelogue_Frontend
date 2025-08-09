"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Eye } from "lucide-react"
import type { AssignedTour } from "@/types/Tour"
import { formatDate, formatPrice } from "@/utils/format"
import { getStatusBadge } from "@/utils/tour"

interface TourCardProps {
	tour: AssignedTour
	index: number
	onViewDetails: (tour: AssignedTour) => void
}

export const TourCard = React.memo<TourCardProps>(({ tour, index, onViewDetails }) => {
	const statusMeta = getStatusBadge(tour.status)

	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
			<Card className="hover:shadow-md transition-shadow">
				<CardContent className="p-6">
					<div className="flex flex-col md:flex-row md:items-center justify-between">
						<div className="flex-1">
							<div className="flex items-center space-x-3 mb-2">
								<h3 className="text-lg font-semibold text-gray-900">{tour.name}</h3>
								<Badge className={statusMeta.variant}>{statusMeta.label}</Badge>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
								<div className="flex items-center">
									<Calendar className="w-4 h-4 mr-2" />
									<span>
										{formatDate(tour.startDate)} - {formatDate(tour.endDate)}
									</span>
								</div>
								<div className="flex items-center">
									<MapPin className="w-4 h-4 mr-2" />
									<span>{tour.meetingLocation}</span>
								</div>
								<div className="flex items-center">
									<Users className="w-4 h-4 mr-2" />
									<span>
										{tour.participants}/{tour.maxParticipants} người
									</span>
								</div>
								<div className="flex items-center">
									<span className="font-medium text-green-600">{formatPrice(tour.price)}</span>
								</div>
							</div>

							{tour.notes && (
								<div className="mt-3 p-3 bg-yellow-50 rounded-lg">
									<p className="text-sm text-yellow-800">
										<strong>Ghi chú:</strong> {tour.notes}
									</p>
								</div>
							)}
						</div>

						<div className="mt-4 md:mt-0 md:ml-6">
							<Button onClick={() => onViewDetails(tour)}>
								<Eye className="w-4 h-4 mr-2" />
								Chi tiết
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	)
})

TourCard.displayName = "TourCard"
