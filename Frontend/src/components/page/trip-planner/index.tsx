// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import TripPlanningForm from "./form"
// import TripPlanDetailUpdate from "./detail/trip-plan-detail"
// import type { TripPlan } from "@/types/Tripplan"
// import { Sparkles } from "lucide-react"
// import TripPlanningWizard from "./form/trip-planning-wizard"

// export default function TripPlannerPage() {
// 	const [activeTab, setActiveTab] = useState("create")
// 	const [currentPlan, setCurrentPlan] = useState<TripPlan | null>(null)

// 	const handlePlanCreated = (plan: TripPlan) => {
// 		setCurrentPlan(plan)
// 		setActiveTab("view")
// 	}

// 	const handleCreateNew = () => {
// 		setActiveTab("create")
// 	}

// 	return (
// 		<div className="container mx-auto px-4 py-8">
// 			<div className="max-w-5xl mx-auto">
// 				<div className="mb-8 text-center">
// 					<h1 className="text-3xl md:text-4xl font-bold mb-3 text-primary">Lập kế hoạch Du lịch Tây Ninh</h1>
// 					<p className="text-muted-foreground max-w-2xl mx-auto">
// 						Tạo lịch trình du lịch cá nhân hóa với các điểm đến, làng nghề và ẩm thực đặc sắc của Tây Ninh
// 					</p>
// 				</div>

// 				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
// 					<TabsList className="grid w-full grid-cols-2 mb-8">
// 						<TabsTrigger value="create">Tạo kế hoạch mới</TabsTrigger>
// 						<TabsTrigger value="view" disabled={!currentPlan}>
// 							Xem kế hoạch
// 						</TabsTrigger>
// 					</TabsList>

// 					<TabsContent value="create">
// 						<Card>
// 							<CardHeader>
// 								<CardTitle className="flex items-center gap-2">
// 									<span>Tạo kế hoạch du lịch</span>
// 									<Sparkles className="h-5 w-5 text-amber-500" />
// 								</CardTitle>
// 								<CardDescription>Chọn các địa điểm bạn muốn đến và thời gian cho chuyến đi của bạn</CardDescription>
// 							</CardHeader>
// 							<CardContent>
// 								{/* <TripPlanningForm onPlanCreated={handlePlanCreated} /> */}
// 								<TripPlanningWizard onPlanCreated={handlePlanCreated} />
// 							</CardContent>
// 						</Card>
// 					</TabsContent>

// 					<TabsContent value="view">
// 						{currentPlan && (
// 							<div className="space-y-6">
// 								{/* <TripPlanDetail plan={currentPlan} /> */}
// 								<TripPlanDetailUpdate plan={currentPlan} />
// 								<div className="flex justify-center mt-8">
// 									<Button onClick={handleCreateNew} variant="outline" className="mr-4">
// 										Tạo kế hoạch mới
// 									</Button>
// 									<Button>Lưu kế hoạch</Button>
// 								</div>
// 							</div>
// 						)}
// 					</TabsContent>
// 				</Tabs>
// 			</div>
// 		</div>
// 	)
// }


"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import TripPlanningWizard from "./form/trip-planning-wizard"
import TripPlanDetailUpdate from "./detail/trip-plan-detail"
import type { TripPlan } from "@/types/Tripplan"
import { Sparkles, MapPin, Calendar, Users, Compass, Star, ArrowRight, Plus, Eye, Save, Share2 } from 'lucide-react'

export default function TripPlannerPage() {
	const [activeView, setActiveView] = useState<"landing" | "create" | "view">("landing")
	const [currentPlan, setCurrentPlan] = useState<TripPlan | null>(null)

	const handlePlanCreated = (plan: TripPlan) => {
		setCurrentPlan(plan)
		setActiveView("view")
	}

	const handleCreateNew = () => {
		setActiveView("create")
	}

	const handleBackToLanding = () => {
		setActiveView("landing")
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			<AnimatePresence mode="wait">
				{/* Landing View */}
				{activeView === "landing" && (
					<motion.div
						key="landing"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="container mx-auto px-4 py-12"
					>
						{/* Hero Section */}
						<div className="max-w-6xl mx-auto">
							<motion.div
								initial={{ opacity: 0, y: -30 }}
								animate={{ opacity: 1, y: 0 }}
								className="text-center mb-16"
							>
								<div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-6 py-3 rounded-full text-sm font-medium mb-6">
									<Sparkles className="h-4 w-4" />
									Trải nghiệm du lịch thông minh 2025
								</div>

								<h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
									Khám phá Tây Ninh
									<br />
									<span className="text-4xl md:text-6xl">cùng AI</span>
								</h1>

								<p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
									Tạo lịch trình du lịch hoàn hảo với công nghệ AI tiên tiến.
									Khám phá văn hóa, ẩm thực và làng nghề truyền thống độc đáo.
								</p>

								<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
									<Button
										onClick={handleCreateNew}
										size="lg"
										className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
									>
										<Plus className="mr-2 h-5 w-5" />
										Bắt đầu lập kế hoạch
										<ArrowRight className="ml-2 h-5 w-5" />
									</Button>

									{currentPlan && (
										<Button
											onClick={() => setActiveView("view")}
											variant="outline"
											size="lg"
											className="px-8 py-4 rounded-2xl font-semibold text-lg border-2 hover:border-blue-300 transition-all duration-300"
										>
											<Eye className="mr-2 h-5 w-5" />
											Xem kế hoạch hiện tại
										</Button>
									)}
								</div>
							</motion.div>

							{/* Features Grid */}
							<motion.div
								initial={{ opacity: 0, y: 40 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
								className="grid md:grid-cols-3 gap-8 mb-16"
							>
								{[
									{
										icon: Compass,
										title: "AI Thông minh",
										description: "Lịch trình được tối ưu hóa bởi AI dựa trên sở thích cá nhân",
										gradient: "from-blue-500 to-cyan-500",
										bgGradient: "from-blue-50 to-cyan-50"
									},
									{
										icon: MapPin,
										title: "Điểm đến độc đáo",
										description: "Khám phá những địa điểm ẩn giấu và làng nghề truyền thống",
										gradient: "from-purple-500 to-pink-500",
										bgGradient: "from-purple-50 to-pink-50"
									},
									{
										icon: Star,
										title: "Trải nghiệm cao cấp",
										description: "Ẩm thực đặc sắc và dịch vụ chất lượng cao",
										gradient: "from-orange-500 to-red-500",
										bgGradient: "from-orange-50 to-red-50"
									}
								].map((feature, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.4 + index * 0.1 }}
										className={`bg-gradient-to-br ${feature.bgGradient} p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
									>
										<div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
											<feature.icon className="h-8 w-8 text-white" />
										</div>
										<h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
										<p className="text-gray-600 leading-relaxed">{feature.description}</p>
									</motion.div>
								))}
							</motion.div>

							{/* Stats Section */}
							<motion.div
								initial={{ opacity: 0, y: 40 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.6 }}
								className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100"
							>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
									{[
										{ number: "50+", label: "Điểm du lịch", icon: MapPin },
										{ number: "100+", label: "Nhà hàng", icon: Star },
										{ number: "25+", label: "Làng nghề", icon: Compass },
										{ number: "1000+", label: "Du khách hài lòng", icon: Users }
									].map((stat, index) => (
										<motion.div
											key={index}
											initial={{ opacity: 0, scale: 0.8 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: 0.7 + index * 0.1 }}
											className="text-center"
										>
											<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
												<stat.icon className="h-6 w-6 text-white" />
											</div>
											<div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
											<div className="text-gray-600 text-sm">{stat.label}</div>
										</motion.div>
									))}
								</div>
							</motion.div>
						</div>
					</motion.div>
				)}

				{/* Create View */}
				{activeView === "create" && (
					<motion.div
						key="create"
						initial={{ opacity: 0, x: 100 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -100 }}
						className="container mx-auto px-4 py-8"
					>
						<div className="max-w-6xl mx-auto">
							{/* Header */}
							<motion.div
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								className="flex items-center justify-between mb-8"
							>
								<div>
									<Button
										onClick={handleBackToLanding}
										variant="ghost"
										className="mb-4 text-gray-600 hover:text-gray-900"
									>
										← Quay lại trang chủ
									</Button>
									<h1 className="text-3xl md:text-4xl font-bold text-gray-900">
										Tạo kế hoạch du lịch mới
									</h1>
									<p className="text-gray-600 mt-2">
										Hãy để chúng tôi giúp bạn tạo ra chuyến du lịch hoàn hảo
									</p>
								</div>
								<Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2">
									<Sparkles className="h-4 w-4 mr-1" />
									AI Powered
								</Badge>
							</motion.div>

							{/* Form */}
							<TripPlanningWizard onPlanCreated={handlePlanCreated} />
						</div>
					</motion.div>
				)}

				{/* View Plan */}
				{activeView === "view" && currentPlan && (
					<motion.div
						key="view"
						initial={{ opacity: 0, x: 100 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -100 }}
						className="container mx-auto px-4 py-8"
					>
						<div className="max-w-6xl mx-auto">
							{/* Header */}
							<motion.div
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
							>
								<div>
									<Button
										onClick={handleBackToLanding}
										variant="ghost"
										className="mb-4 text-gray-600 hover:text-gray-900"
									>
										← Quay lại trang chủ
									</Button>
									<h1 className="text-3xl md:text-4xl font-bold text-gray-900">
										Kế hoạch du lịch của bạn
									</h1>
									<p className="text-gray-600 mt-2">
										Xem chi tiết và chuẩn bị cho chuyến đi tuyệt vời
									</p>
								</div>

								<div className="flex gap-3">
									<Button
										onClick={handleCreateNew}
										variant="outline"
										className="rounded-xl border-2 hover:border-blue-300 transition-colors"
									>
										<Plus className="mr-2 h-4 w-4" />
										Tạo kế hoạch mới
									</Button>
									<Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl">
										<Save className="mr-2 h-4 w-4" />
										Lưu kế hoạch
									</Button>
									<Button
										variant="outline"
										className="rounded-xl border-2 hover:border-purple-300 transition-colors"
									>
										<Share2 className="mr-2 h-4 w-4" />
										Chia sẻ
									</Button>
								</div>
							</motion.div>

							{/* Plan Detail */}
							<TripPlanDetailUpdate plan={currentPlan} />
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
