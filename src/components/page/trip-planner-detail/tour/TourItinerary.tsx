"use client"

import { MapPin, Clock, Navigation } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { TourDay } from "@/types/Tour"

interface TourItineraryProps {
	days: TourDay[]
}

export default function TourItinerary({ days }: TourItineraryProps) {
	return (
		<div className="space-y-8">
			{days.map((day, dayIndex) => (
				<div key={day.dayNumber} className="relative">
					{/* Day Header */}
					<div className="flex items-center gap-4 mb-6">
						<div className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full font-bold text-lg">
							{day.dayNumber}
						</div>
						<div>
							<h3 className="text-xl font-bold text-gray-900">Ngày {day.dayNumber}</h3>
							<p className="text-gray-600">{day.activities.length} hoạt động</p>
						</div>
					</div>

					{/* Activities */}
					<div className="ml-6 space-y-4">
						{day.activities.map((activity, activityIndex) => (
							<div key={activity?.tourPlanLocationId} className="relative">
								{/* Timeline connector */}
								{activityIndex < day.activities.length - 1 && (
									<div className="absolute left-6 top-16 w-0.5 h-16 bg-gray-200"></div>
								)}

								<Card className="hover:shadow-md transition-shadow duration-200">
									<CardContent className="p-6">
										<div className="flex gap-4">
											{/* Activity Image */}
											<div className="flex-shrink-0">
												<img
													src={activity?.imageUrl || "/placeholder.svg?height=80&width=80"}
													alt={activity.name}
													className="w-20 h-20 rounded-lg object-cover"
												/>
											</div>

											{/* Activity Details */}
											<div className="flex-1">
												<div className="flex items-start justify-between mb-2">
													<div>
														<h4 className="text-lg font-semibold text-gray-900 mb-1">{activity.name}</h4>
														<div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
															<Clock className="h-4 w-4" />
															<span>
																{activity.startTimeFormatted} - {activity.endTimeFormatted}
															</span>
															<Badge variant="secondary" className="text-xs">
																{activity.duration}
															</Badge>
														</div>
													</div>
												</div>

												<p className="text-gray-700 mb-3 leading-relaxed">{activity.description}</p>

												<div className="flex items-center gap-4 text-sm text-gray-600">
													<div className="flex items-center gap-1">
														<MapPin className="h-4 w-4" />
														<span>{activity.address}</span>
													</div>

													{activity.travelTimeFromPrev > 0 && (
														<div className="flex items-center gap-1">
															<Navigation className="h-4 w-4" />
															<span>{activity.travelTimeFromPrev} phút di chuyển</span>
														</div>
													)}
												</div>

												{activity.notes && (
													<div className="mt-3 p-3 bg-blue-50 rounded-lg">
														<p className="text-sm text-blue-800">
															<strong>Ghi chú:</strong> {activity.notes}
														</p>
													</div>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						))}
					</div>

					{/* Day separator */}
					{dayIndex < days.length - 1 && <Separator className="mt-8" />}
				</div>
			))}
		</div>
	)
}
