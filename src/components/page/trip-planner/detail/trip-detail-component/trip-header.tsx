"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, Share2, Download, Printer, Sparkles, Wallet } from "lucide-react"
import type { TripPlan } from "@/types/Tripplan"

interface TripHeaderProps {
	plan: TripPlan
	formatDate: (date: Date) => string
	getEndDate: () => Date
}

export function TripHeader({ plan, formatDate, getEndDate }: TripHeaderProps) {
	return (
		<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
			<CardContent className="p-8">
				<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
					{/* Trip Info */}
					<div className="space-y-4">
						<div className="flex items-center gap-3 flex-wrap">
							<h1 className="text-3xl md:text-4xl font-bold text-gray-900">{plan.title}</h1>
							{plan.isAIGenerated && (
								<motion.div
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 0.2 }}
								>
									<Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-sm font-medium">
										<Sparkles className="h-4 w-4 mr-1" />
										AI Tối ưu
									</Badge>
								</motion.div>
							)}
						</div>

						{/* Trip Details Grid */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.1 }}
								className="bg-blue-50 rounded-2xl p-4"
							>
								<div className="flex items-center gap-2 mb-2">
									<Calendar className="h-5 w-5 text-blue-600" />
									<span className="text-sm font-medium text-blue-600">Thời gian</span>
								</div>
								<div className="text-sm text-gray-700">
									<div>{formatDate(plan.startDate)}</div>
									<div className="text-xs text-gray-500">đến {formatDate(getEndDate())}</div>
								</div>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
								className="bg-green-50 rounded-2xl p-4"
							>
								<div className="flex items-center gap-2 mb-2">
									<Clock className="h-5 w-5 text-green-600" />
									<span className="text-sm font-medium text-green-600">Thời lượng</span>
								</div>
								<div className="text-2xl font-bold text-green-700">{plan.duration}</div>
								<div className="text-xs text-gray-500">ngày</div>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
								className="bg-orange-50 rounded-2xl p-4"
							>
								<div className="flex items-center gap-2 mb-2">
									<Users className="h-5 w-5 text-orange-600" />
									<span className="text-sm font-medium text-orange-600">Du khách</span>
								</div>
								<div className="text-2xl font-bold text-orange-700">{plan.travelers}</div>
								<div className="text-xs text-gray-500">người</div>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4 }}
								className="bg-purple-50 rounded-2xl p-4"
							>
								<div className="flex items-center gap-2 mb-2">
									<Wallet className="h-5 w-5 text-purple-600" />
									<span className="text-sm font-medium text-purple-600">Ngân sách</span>
								</div>
								<div className="text-lg font-bold text-purple-700">{plan.budget.toLocaleString("vi-VN")}đ</div>
								<div className="text-xs text-gray-500">mỗi người</div>
							</motion.div>
						</div>
					</div>

					{/* Action Buttons */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.5 }}
						className="flex flex-wrap gap-3"
					>
						<Button
							variant="outline"
							size="sm"
							className="gap-2 rounded-xl border-2 hover:border-blue-300 transition-colors"
						>
							<Share2 className="h-4 w-4" />
							Chia sẻ
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="gap-2 rounded-xl border-2 hover:border-green-300 transition-colors"
						>
							<Download className="h-4 w-4" />
							Tải xuống
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="gap-2 rounded-xl border-2 hover:border-purple-300 transition-colors"
						>
							<Printer className="h-4 w-4" />
							In
						</Button>
					</motion.div>
				</div>
			</CardContent>
		</Card>
	)
}
