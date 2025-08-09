"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MapPin, Utensils, Briefcase, MessageSquare, Calendar } from "lucide-react"
import type { TripPlan } from "@/types/Tripplan"

interface TripOverviewProps {
	plan: TripPlan
	formatDate: (date: Date) => string
}

export function TripOverview({ plan, formatDate }: TripOverviewProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className="space-y-8"
		>
			{/* Location Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Destinations */}
				<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
					<Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg rounded-2xl h-full">
						<CardHeader className="pb-4">
							<CardTitle className="text-lg font-semibold flex items-center gap-3">
								<div className="p-2 bg-blue-200 rounded-xl">
									<MapPin className="h-5 w-5 text-blue-700" />
								</div>
								<div>
									<div>Điểm du lịch</div>
									<Badge variant="secondary" className="bg-blue-200 text-blue-700 text-xs">
										{plan.destinations?.length} địa điểm
									</Badge>
								</div>
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<ScrollArea className="h-48">
								<div className="space-y-3">
									{plan.destinations?.map((dest: any, index: any) => (
										<motion.div
											key={dest.id}
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.1 * index }}
											className="bg-white rounded-xl p-3 shadow-sm"
										>
											<div className="font-medium text-gray-900">{dest.name}</div>
											<div className="text-xs text-gray-500 mt-1">{dest.address}</div>
										</motion.div>
									))}
								</div>
							</ScrollArea>
						</CardContent>
					</Card>
				</motion.div>

				{/* Restaurants */}
				<motion.div initial={{ opacity: 0, x: 0 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
					<Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0 shadow-lg rounded-2xl h-full">
						<CardHeader className="pb-4">
							<CardTitle className="text-lg font-semibold flex items-center gap-3">
								<div className="p-2 bg-orange-200 rounded-xl">
									<Utensils className="h-5 w-5 text-orange-700" />
								</div>
								<div>
									<div>Nhà hàng</div>
									<Badge variant="secondary" className="bg-orange-200 text-orange-700 text-xs">
										{plan.restaurants?.length} nhà hàng
									</Badge>
								</div>
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<ScrollArea className="h-48">
								<div className="space-y-3">
									{plan.restaurants && plan.restaurants?.length > 0 ? (
										plan.restaurants?.map((rest: any, index: any) => (
											<motion.div
												key={rest.id}
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: 0.1 * index }}
												className="bg-white rounded-xl p-3 shadow-sm"
											>
												<div className="font-medium text-gray-900">{rest.name}</div>
												<div className="text-xs text-gray-500 mt-1">{rest.address}</div>
											</motion.div>
										))
									) : (
										<div className="text-center text-gray-500 py-8">
											<Utensils className="h-12 w-12 mx-auto mb-2 opacity-50" />
											<p className="text-sm">Chưa chọn nhà hàng</p>
										</div>
									)}
								</div>
							</ScrollArea>
						</CardContent>
					</Card>
				</motion.div>

				{/* Craft Villages */}
				<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
					<Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg rounded-2xl h-full">
						<CardHeader className="pb-4">
							<CardTitle className="text-lg font-semibold flex items-center gap-3">
								<div className="p-2 bg-green-200 rounded-xl">
									<Briefcase className="h-5 w-5 text-green-700" />
								</div>
								<div>
									<div>Làng nghề</div>
									<Badge variant="secondary" className="bg-green-200 text-green-700 text-xs">
										{plan.craftVillages?.length} làng nghề
									</Badge>
								</div>
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<ScrollArea className="h-48">
								<div className="space-y-3">
									{plan.craftVillages && plan.craftVillages?.length > 0 ? (
										plan.craftVillages?.map((village: any, index: any) => (
											<motion.div
												key={village.id}
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: 0.1 * index }}
												className="bg-white rounded-xl p-3 shadow-sm"
											>
												<div className="font-medium text-gray-900">{village.name}</div>
												<div className="text-xs text-gray-500 mt-1">{village.address}</div>
											</motion.div>
										))
									) : (
										<div className="text-center text-gray-500 py-8">
											<Briefcase className="h-12 w-12 mx-auto mb-2 opacity-50" />
											<p className="text-sm">Chưa chọn làng nghề</p>
										</div>
									)}
								</div>
							</ScrollArea>
						</CardContent>
					</Card>
				</motion.div>
			</div>

			{/* Preferences */}
			{plan.preferences && (
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
					<Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-lg rounded-2xl">
						<CardHeader className="pb-4">
							<CardTitle className="text-lg font-semibold flex items-center gap-3">
								<div className="p-2 bg-purple-200 rounded-xl">
									<MessageSquare className="h-5 w-5 text-purple-700" />
								</div>
								Sở thích & Yêu cầu đặc biệt
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="bg-white rounded-xl p-4 shadow-sm">
								<p className="text-gray-700 leading-relaxed">{plan.preferences}</p>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			)}

			{/* Itinerary Summary */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
				<Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-0 shadow-lg rounded-2xl">
					<CardHeader className="pb-4">
						<CardTitle className="text-lg font-semibold flex items-center gap-3">
							<div className="p-2 bg-gray-200 rounded-xl">
								<Calendar className="h-5 w-5 text-gray-700" />
							</div>
							Tổng quan lịch trình
						</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="space-y-6">
							{plan.itinerary?.map((day: any, dayIndex: any) => (
								<motion.div
									key={day.day}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.1 * dayIndex }}
									className="flex gap-4"
								>
									<div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
										<span className="font-bold text-white text-sm">Ngày {day.day}</span>
									</div>
									<div className="flex-1 bg-white rounded-xl p-4 shadow-sm">
										<h4 className="font-semibold text-gray-900 mb-2">
											{formatDate(new Date(plan.startDate.getTime() + (day.day - 1) * 24 * 60 * 60 * 1000))}
										</h4>
										<div className="space-y-2">
											{day.activities?.slice(0, 3).map((activity: any, idx: any) => (
												<div key={idx} className="flex items-start gap-3 text-sm">
													<Badge variant="outline" className="text-xs font-medium min-w-[50px] justify-center">
														{activity.time}
													</Badge>
													<span className="flex-1 text-gray-700">{activity.title}</span>
												</div>
											))}
											{day.activities?.length > 3 && (
												<div className="text-sm text-gray-500 ml-[62px]">
													+ {day.activities?.length - 3} hoạt động khác
												</div>
											)}
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</motion.div>
	)
}
