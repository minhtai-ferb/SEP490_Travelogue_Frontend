"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Star } from "lucide-react"
import type { TripPlan } from "@/types/Tripplan"
import { TripHeader } from "./trip-detail-component/trip-header"
import { TripOverview } from "./trip-detail-component/trip-overview"
import { TripItinerary } from "./trip-detail-component/trip-itinerary"
import { TripStats } from "./trip-detail-component/trip-stats"

interface TripPlanDetailProps {
	plan: TripPlan
}

export default function TripPlanDetailUpdate({ plan }: TripPlanDetailProps) {
	const [activeTab, setActiveTab] = useState("overview")

	const formatDate = (date: Date) => {
		return format(date, "EEEE, dd/MM/yyyy", { locale: vi })
	}

	const getEndDate = () => {
		const endDate = new Date(plan.startDate)
		endDate.setDate(endDate.getDate() + plan.duration - 1)
		return endDate
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			<div className="container mx-auto px-4 py-8">
				{/* Hero Section */}
				<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
					<div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
						<Star className="h-4 w-4" />
						Lịch trình đã hoàn thành
					</div>
					<h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
						Chi tiết chuyến du lịch
					</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Khám phá lịch trình chi tiết và chuẩn bị cho chuyến du lịch tuyệt vời
					</p>
				</motion.div>

				{/* Trip Header */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.2 }}
					className="mb-8"
				>
					<TripHeader plan={plan} formatDate={formatDate} getEndDate={getEndDate} />
				</motion.div>

				{/* Trip Stats */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="mb-8"
				>
					<TripStats plan={plan} />
				</motion.div>

				{/* Main Content */}
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
					<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
						<div className="p-8">
							<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
								<TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-2xl h-14">
									<TabsTrigger
										value="overview"
										className="rounded-xl font-medium text-base data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
									>
										Tổng quan
									</TabsTrigger>
									<TabsTrigger
										value="itinerary"
										className="rounded-xl font-medium text-base data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
									>
										Lịch trình chi tiết
									</TabsTrigger>
								</TabsList>

								<div className="mt-8">
									<AnimatePresence mode="wait">
										<TabsContent value="overview" className="mt-0">
											<TripOverview key="overview" plan={plan} formatDate={formatDate} />
										</TabsContent>

										<TabsContent value="itinerary" className="mt-0">
											<TripItinerary key="itinerary" plan={plan} formatDate={formatDate} />
										</TabsContent>
									</AnimatePresence>
								</div>
							</Tabs>
						</div>
					</Card>
				</motion.div>

				{/* Action Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
					className="flex justify-center mt-8 gap-4"
				>
					<Button
						size="lg"
						className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
					>
						Bắt đầu chuyến đi
					</Button>
					<Button
						variant="outline"
						size="lg"
						className="px-8 py-3 rounded-xl font-medium border-2 hover:border-blue-300 transition-colors"
					>
						Chỉnh sửa lịch trình
					</Button>
				</motion.div>
			</div>
		</div>
	)
}
