"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Calendar, Clock, MapPin, Share2, Download, Printer, Sparkles } from "lucide-react"
import type { TripPlan } from "@/types/Tripplan"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface TripPlanDetailProps {
	plan: TripPlan
}

export default function TripPlanDetail({ plan }: TripPlanDetailProps) {
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
		<div className="space-y-6">
			<Card>
				<CardHeader className="pb-4">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
						<div>
							<CardTitle className="text-2xl font-bold flex items-center gap-2">
								{plan.title}
								{plan?.isAIGenerated && (
									<Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
										<Sparkles className="h-3.5 w-3.5 mr-1" />
										AI Tối ưu
									</Badge>
								)}
							</CardTitle>
							<div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
								<div className="flex items-center">
									<Calendar className="h-4 w-4 mr-1" />
									<span>
										{formatDate(plan.startDate)} - {formatDate(getEndDate())}
									</span>
								</div>
								<div className="flex items-center">
									<Clock className="h-4 w-4 mr-1" />
									<span>{plan.duration} ngày</span>
								</div>
								<div className="flex items-center">
									<Avatar className="h-4 w-4 mr-1">
										<AvatarFallback className="text-[8px]">{plan.travelers}</AvatarFallback>
									</Avatar>
									<span>{plan.travelers} người</span>
								</div>
								<div>
									<Badge variant="outline">{plan.budget.toLocaleString("vi-VN")}đ/người</Badge>
								</div>
							</div>
						</div>
						<div className="flex flex-wrap gap-2">
							<Button variant="outline" size="sm" className="gap-1">
								<Share2 className="h-4 w-4" />
								<span className="hidden sm:inline">Chia sẻ</span>
							</Button>
							<Button variant="outline" size="sm" className="gap-1">
								<Download className="h-4 w-4" />
								<span className="hidden sm:inline">Tải xuống</span>
							</Button>
							<Button variant="outline" size="sm" className="gap-1">
								<Printer className="h-4 w-4" />
								<span className="hidden sm:inline">In</span>
							</Button>
						</div>
					</div>
				</CardHeader>

				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<CardContent className="pt-0">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="overview">Tổng quan</TabsTrigger>
							<TabsTrigger value="itinerary">Lịch trình chi tiết</TabsTrigger>
						</TabsList>

						<TabsContent value="overview" className="mt-4 space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{/* Destinations */}
								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-base font-medium flex items-center">
											<MapPin className="h-4 w-4 mr-2 text-primary" />
											Điểm du lịch ({plan.destinations.length})
										</CardTitle>
									</CardHeader>
									<CardContent className="pt-0">
										<ScrollArea className="h-48">
											<ul className="space-y-2">
												{plan.destinations.map((dest) => (
													<li key={dest.id} className="text-sm">
														<div className="font-medium">{dest.name}</div>
														<div className="text-xs text-muted-foreground">{dest.address}</div>
													</li>
												))}
											</ul>
										</ScrollArea>
									</CardContent>
								</Card>

								{/* Restaurants */}
								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-base font-medium flex items-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="h-4 w-4 mr-2 text-primary"
											>
												<path d="M17 12c.74-2.3 2.5-4 4.5-5a9.9 9.9 0 0 0-3-4c-1.66 1.37-2.5 3.44-2.5 5.5a9 9 0 0 0 1 4.5Z" />
												<path d="M14 12.5c.74-2.3 2.5-4 4.5-5a9.9 9.9 0 0 0-3-4c-1.66 1.37-2.5 3.44-2.5 5.5a9 9 0 0 0 1 4.5Z" />
												<path d="M10 19c.74-2.3 2.5-4 4.5-5a9.9 9.9 0 0 0-3-4c-1.66 1.37-2.5 3.44-2.5 5.5a9 9 0 0 0 1 4.5Z" />
												<path d="M7 19c.74-2.3 2.5-4 4.5-5a9.9 9.9 0 0 0-3-4c-1.66 1.37-2.5 3.44-2.5 5.5a9 9 0 0 0 1 4.5Z" />
												<path d="M14 12c-1.8 0-3 1.2-3 3s1.2 3 3 3 3-1.2 3-3-1.2-3-3-3Z" />
											</svg>
											Nhà hàng & Quán ăn ({plan.restaurants?.length})
										</CardTitle>
									</CardHeader>
									<CardContent className="pt-0">
										<ScrollArea className="h-48">
											<ul className="space-y-2">
												{plan.restaurants?.map((rest) => (
													<li key={rest.id} className="text-sm">
														<div className="font-medium">{rest.name}</div>
														<div className="text-xs text-muted-foreground">{rest.address}</div>
													</li>
												))}
												{plan.restaurants?.length === 0 && (
													<li className="text-sm text-muted-foreground">Không có nhà hàng được chọn</li>
												)}
											</ul>
										</ScrollArea>
									</CardContent>
								</Card>

								{/* Craft Villages */}
								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-base font-medium flex items-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="h-4 w-4 mr-2 text-primary"
											>
												<path d="M2 22V7c0-2 2-4 4-4s4 2 4 4v15" />
												<path d="M18 22V10c0-2 2-4 4-4s4 2 4 4v12" />
												<path d="M18 10H6" />
											</svg>
											Làng nghề truyền thống ({plan.craftVillages?.length})
										</CardTitle>
									</CardHeader>
									<CardContent className="pt-0">
										<ScrollArea className="h-48">
											<ul className="space-y-2">
												{plan.craftVillages?.map((village) => (
													<li key={village.id} className="text-sm">
														<div className="font-medium">{village.name}</div>
														<div className="text-xs text-muted-foreground">{village.address}</div>
													</li>
												))}
												{plan.craftVillages?.length === 0 && (
													<li className="text-sm text-muted-foreground">Không có làng nghề được chọn</li>
												)}
											</ul>
										</ScrollArea>
									</CardContent>
								</Card>
							</div>

							{plan.preferences && (
								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-base font-medium">Sở thích & Yêu cầu đặc biệt</CardTitle>
									</CardHeader>
									<CardContent className="pt-0">
										<p className="text-sm">{plan.preferences}</p>
									</CardContent>
								</Card>
							)}

							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-base font-medium">Tổng quan lịch trình</CardTitle>
								</CardHeader>
								<CardContent className="pt-0">
									<div className="space-y-4">
										{plan.itinerary?.map((day: any) => (
											<div key={day.day} className="flex gap-4">
												<div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
													<span className="font-bold text-primary">Ngày {day.day}</span>
												</div>
												<div className="flex-1">
													<h4 className="font-medium">
														{formatDate(new Date(plan.startDate.getTime() + (day.day - 1) * 24 * 60 * 60 * 1000))}
													</h4>
													<ul className="mt-2 space-y-1">
														{day.activities?.slice(0, 3).map((activity: any, idx: any) => (
															<li key={idx} className="text-sm flex items-start">
																<span className="text-xs font-medium text-muted-foreground w-12">{activity.time}</span>
																<span className="flex-1">{activity.title}</span>
															</li>
														))}
														{day.activities.length > 3 && (
															<li className="text-sm text-muted-foreground">
																+ {day.activities.length - 3} hoạt động khác
															</li>
														)}
													</ul>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="itinerary" className="mt-4">
							<Card>
								<CardContent className="p-6">
									<div className="space-y-8">
										{plan.itinerary?.map((day: any) => (
											<div key={day.day} className="space-y-4">
												<div className="flex items-center gap-4">
													<div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
														<span className="font-bold text-primary">{day.day}</span>
													</div>
													<div>
														<h3 className="font-bold text-lg">Ngày {day.day}</h3>
														<p className="text-sm text-muted-foreground">
															{formatDate(new Date(plan.startDate.getTime() + (day.day - 1) * 24 * 60 * 60 * 1000))}
														</p>
													</div>
												</div>

												<div className="ml-6 pl-6 border-l-2 border-primary/20 space-y-6">
													{day.activities?.map((activity: any, idx: any) => (
														<div key={idx} className="relative">
															<div className="absolute -left-[33px] w-6 h-6 rounded-full bg-primary flex items-center justify-center">
																<div className="w-2 h-2 rounded-full bg-white"></div>
															</div>
															<div className="bg-muted/50 rounded-lg p-4">
																<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
																	<h4 className="font-medium text-base">{activity.title}</h4>
																	<Badge variant="outline" className="sm:ml-2 mt-1 sm:mt-0 w-fit">
																		{activity.time}
																	</Badge>
																</div>
																<p className="text-sm mb-2">{activity.description}</p>
																<div className="flex items-center text-xs text-muted-foreground">
																	<MapPin className="h-3 w-3 mr-1" />
																	{activity.location}
																</div>
															</div>
														</div>
													))}
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</CardContent>
				</Tabs>
			</Card>
		</div>
	)
}
