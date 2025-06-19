import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Camera, Utensils, Mountain, CheckCircle2, ArrowRight } from 'lucide-react'
import type { TourItineraryDay } from "@/types/Tour"

interface TourItineraryProps {
	itinerary: TourItineraryDay[]
}

const dayColors = [
	{
		gradient: "from-blue-500 to-cyan-500",
		bg: "from-blue-50 to-cyan-50",
		border: "border-blue-200",
		icon: "text-blue-600",
		badge: "bg-blue-100 text-blue-700 border-blue-200",
	},
	{
		gradient: "from-emerald-500 to-teal-500",
		bg: "from-emerald-50 to-teal-50",
		border: "border-emerald-200",
		icon: "text-emerald-600",
		badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
	},
	{
		gradient: "from-purple-500 to-pink-500",
		bg: "from-purple-50 to-pink-50",
		border: "border-purple-200",
		icon: "text-purple-600",
		badge: "bg-purple-100 text-purple-700 border-purple-200",
	},
	{
		gradient: "from-orange-500 to-red-500",
		bg: "from-orange-50 to-red-50",
		border: "border-orange-200",
		icon: "text-orange-600",
		badge: "bg-orange-100 text-orange-700 border-orange-200",
	},
]

const activityIcons = [Camera, Utensils, Mountain, MapPin]

export function TourItinerary({ itinerary }: TourItineraryProps) {
	return (
		<div className="space-y-8">
			{/* Header Section */}
			<div className="text-center space-y-4">
				<h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
					🗓️ Lịch trình phiêu lưu
				</h2>
				<p className="text-gray-600 max-w-2xl mx-auto">
					Khám phá từng khoảnh khắc đáng nhớ trong hành trình của bạn với lịch trình được thiết kế tỉ mỉ
				</p>
			</div>

			{/* Timeline Container */}
			<div className="relative">
				{/* Vertical Timeline Line */}
				<div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200 rounded-full hidden md:block"></div>

				<div className="space-y-8">
					{itinerary.map((day, index) => {
						const colorScheme = dayColors[index % dayColors.length]
						const isEven = index % 2 === 0

						return (
							<div key={day.day} className="relative">
								{/* Timeline Dot */}
								<div className="absolute left-6 top-8 w-5 h-5 rounded-full bg-white border-4 border-current z-10 hidden md:block">
									<div className={`w-full h-full rounded-full bg-gradient-to-r ${colorScheme.gradient}`}></div>
								</div>

								{/* Card Container */}
								<div className={`md:ml-16 ${isEven ? 'md:mr-8' : 'md:ml-24'}`}>
									<Card className={`
                    group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2
                    border-2 ${colorScheme.border} bg-gradient-to-br ${colorScheme.bg}
                    overflow-hidden relative
                  `}>
										{/* Decorative Elements */}
										<div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
										<div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

										<CardHeader className="relative z-10 pb-4">
											<div className="flex items-start justify-between gap-4">
												<div className="flex-1">
													{/* Day Number Badge */}
													<div className="flex items-center gap-3 mb-3">
														<div className={`
                              inline-flex items-center justify-center w-12 h-12 rounded-2xl
                              bg-gradient-to-r ${colorScheme.gradient} text-white font-bold text-lg
                              shadow-lg transform group-hover:scale-110 transition-transform duration-300
                            `}>
															{day.day}
														</div>
														<div>
															<Badge className={`${colorScheme.badge} border font-medium px-3 py-1`}>
																Ngày {day.day}
															</Badge>
														</div>
													</div>

													<CardTitle className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
														{day.title}
													</CardTitle>
												</div>

												{/* Time Badge */}
												<Badge variant="outline" className="flex items-center gap-1 px-3 py-1 bg-white/80 backdrop-blur-sm">
													<Clock className="h-3 w-3" />
													{day.time}
												</Badge>
											</div>

											<CardDescription className="text-base text-gray-700 leading-relaxed">
												{day.description}
											</CardDescription>
										</CardHeader>

										<CardContent className="relative z-10 pt-0">
											<div className="space-y-4">
												<div className="flex items-center gap-2">
													<div className={`w-6 h-6 rounded-full bg-gradient-to-r ${colorScheme.gradient} flex items-center justify-center`}>
														<CheckCircle2 className="h-3 w-3 text-white" />
													</div>
													<h4 className="font-semibold text-gray-800">Hoạt động nổi bật:</h4>
												</div>

												<div className="grid gap-3">
													{day.activities.map((activity, actIndex) => {
														const IconComponent = activityIcons[actIndex % activityIcons.length]

														return (
															<div
																key={activity.id}
																className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 hover:bg-white/80 transition-all duration-200 group/activity"
															>
																<div className={`
                                  w-8 h-8 rounded-lg bg-gradient-to-r ${colorScheme.gradient} 
                                  flex items-center justify-center flex-shrink-0
                                  group-hover/activity:scale-110 transition-transform duration-200
                                `}>
																	<IconComponent className="h-4 w-4 text-white" />
																</div>
																<span className="text-sm font-medium text-gray-700 flex-1">
																	{activity.name}
																</span>
																<ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover/activity:opacity-100 transition-opacity duration-200" />
															</div>
														)
													})}
												</div>

												{/* Bottom Highlight */}
												<div className="flex items-center justify-between pt-2 border-t border-white/40">
													<span className="text-xs text-gray-600 font-medium">
														{day.activities.length} hoạt động
													</span>
													<div className="flex items-center gap-1 text-xs text-gray-600">
														<span>Thời gian:</span>
														<span className="font-medium">{day.time}</span>
													</div>
												</div>
											</div>
										</CardContent>

										{/* Hover Shine Effect */}
										<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
									</Card>
								</div>

								{/* Connection Arrow for Desktop */}
								{index < itinerary.length - 1 && (
									<div className="hidden md:flex justify-center mt-6 mb-2">
										<div className={`w-8 h-8 rounded-full bg-gradient-to-r ${colorScheme.gradient} flex items-center justify-center animate-bounce`}>
											<ArrowRight className="h-4 w-4 text-white rotate-90" />
										</div>
									</div>
								)}
							</div>
						)
					})}
				</div>
			</div>

			{/* Summary Footer */}
			<div className="text-center p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl border border-purple-200">
				<div className="flex items-center justify-center gap-2 text-purple-700 font-semibold">
					<CheckCircle2 className="h-5 w-5" />
					<span>Tổng cộng {itinerary.length} ngày khám phá đầy thú vị!</span>
				</div>
			</div>
		</div>
	)
}
