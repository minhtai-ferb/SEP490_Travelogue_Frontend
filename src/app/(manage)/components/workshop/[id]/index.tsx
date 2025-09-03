'use client'

import { useWorkshop } from '@/services/use-workshop'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import StatusBadge from '@/app/craftvillage/dashboard/workshop/molecules/StatusBadge'
import WeeklyScheduleTable from '../components/WeeklyScheduleTable'
import { Loader2, MapPin, Clock, Users, Star, Activity, Calendar, Settings } from 'lucide-react'

function WorkShopView({ href }: { href: string }) {
	const { id } = useParams()
	const { getWorkshopDetail, loading } = useWorkshop()
	const [workshop, setWorkshop] = useState<any>(null)

	useEffect(() => {
		const run = async () => {
			try {
				const res = await getWorkshopDetail(id as string)
				setWorkshop(res)
			} catch (error) {
				toast.error('Lỗi khi lấy chi tiết workshop')
			}
		}
		if (id) run()
	}, [getWorkshopDetail, id])

	if (loading && !workshop) {
		return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin" /></div>
	}

	if (!workshop) return <div className="text-center text-sm text-gray-500 py-10">Không tìm thấy workshop</div>

	return (
		<div className="space-y-8 bg-gray-50 min-h-screen p-6">
			{/* Header Card */}
			<Card className="shadow-sm border-0 bg-gradient-to-r from-blue-600 to-blue-700">
				<CardContent className="p-8">
					<div className="flex items-start justify-between">
						<div className="text-white">
							<h1 className="text-3xl font-bold mb-3">{workshop.name}</h1>
							<div className="flex flex-wrap items-center gap-4 text-blue-100">
								<div className="flex items-center gap-2">
									<StatusBadge 
										status={workshop.status} 
										text={workshop.status === 1 ? 'Hoạt động' : 'Không hoạt động'} 
									/>
								</div>
								{workshop.craftVillageName && (
									<div className="flex items-center gap-2">
										<MapPin className="h-4 w-4" />
										<span>{workshop.craftVillageName}</span>
									</div>
								)}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Tabs */}
			<Tabs defaultValue="overview" className="space-y-6">
				<div className="bg-white rounded-lg p-1 shadow-sm border">
					<TabsList className="grid w-full grid-cols-4 bg-gray-50">
						<TabsTrigger value="overview" className="flex items-center gap-2">
							<Activity className="h-4 w-4" />
							<span className="hidden sm:inline">Tổng quan</span>
						</TabsTrigger>
						<TabsTrigger value="tickets" className="flex items-center gap-2">
							<Users className="h-4 w-4" />
							<span className="hidden sm:inline">Loại vé</span>
						</TabsTrigger>
						<TabsTrigger value="schedules" className="flex items-center gap-2">
							<Calendar className="h-4 w-4" />
							<span className="hidden sm:inline">Lịch trình</span>
						</TabsTrigger>
						<TabsTrigger value="recurring" className="flex items-center gap-2">
							<Settings className="h-4 w-4" />
							<span className="hidden sm:inline">Quy tắc</span>
						</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value="overview" className="space-y-6">
					<Card className="shadow-sm border-0">
						<CardHeader className="pb-4">
							<div className="flex items-center gap-2">
								<Activity className="h-5 w-5 text-blue-600" />
								<CardTitle className="text-xl font-semibold">Thông tin chi tiết</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid md:grid-cols-2 gap-6">
								<div className="space-y-4">
									<div className="p-4 bg-gray-50 rounded-lg">
										<div className="flex items-center gap-2 mb-2">
											<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
											<span className="text-sm font-medium text-gray-700">Mô tả</span>
										</div>
										<p className="text-gray-900 leading-relaxed">{workshop.description}</p>
									</div>
								</div>
								<div className="space-y-4">
									<div className="p-4 bg-blue-50 rounded-lg">
										<div className="flex items-center gap-2 mb-2">
											<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
											<span className="text-sm font-medium text-blue-700">Nội dung chi tiết</span>
										</div>
										<div className="text-gray-900 leading-relaxed whitespace-pre-line">{workshop.content}</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="tickets" className="space-y-6">
					<Card className="shadow-sm border-0">
						<CardHeader className="pb-4">
							<div className="flex items-center gap-2">
								<Users className="h-5 w-5 text-blue-600" />
								<CardTitle className="text-xl font-semibold">Các loại vé</CardTitle>
							</div>
						</CardHeader>
						<CardContent>
							{Array.isArray(workshop.ticketTypes) && workshop.ticketTypes.length > 0 ? (
								<div className="grid gap-6">
									{workshop.ticketTypes.map((ticket: any) => (
										<Card key={ticket.id} className="border border-gray-100 hover:shadow-md transition-all">
											<CardContent className="p-6">
												<div className="flex justify-between items-start mb-4">
													<div className="flex-1">
														<h3 className="text-xl font-semibold text-gray-900 mb-2">{ticket.name}</h3>
														<div className="flex flex-wrap items-center gap-4 text-sm">
															<Badge variant="outline" className="flex items-center gap-1">
																<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
																Loại {ticket.type}
															</Badge>
															<Badge variant="outline" className="flex items-center gap-1">
																<Clock className="h-3 w-3" />
																{ticket.durationMinutes} phút
															</Badge>
															<Badge variant={ticket.isCombo ? "default" : "secondary"}>
																{ticket.isCombo ? 'Combo' : 'Đơn lẻ'}
															</Badge>
														</div>
													</div>
													<div className="text-right">
														<div className="text-2xl font-bold text-blue-600">
															{ticket.price?.toLocaleString('vi-VN')}
														</div>
														<div className="text-sm text-gray-500">VND</div>
													</div>
												</div>
												
												{ticket.content && (
													<div className="mb-4 p-4 bg-gray-50 rounded-lg">
														<h4 className="text-sm font-medium text-gray-700 mb-2">Nội dung:</h4>
														<p className="text-gray-900 leading-relaxed">{ticket.content}</p>
													</div>
												)}
												
												{Array.isArray(ticket.activities) && ticket.activities.length > 0 && (
													<div>
														<h4 className="text-sm font-medium text-gray-700 mb-3">Hoạt động bao gồm:</h4>
														<div className="space-y-3">
															{ticket.activities
																.sort((a: any, b: any) => a.activityOrder - b.activityOrder)
																.map((activity: any, index: number) => (
																<div key={activity.id} className="flex gap-3 p-3 bg-white border border-gray-100 rounded-lg">
																	<div className="flex-shrink-0">
																		<div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
																			{index + 1}
																		</div>
																	</div>
																	<div className="flex-1">
																		<div className="flex items-center justify-between mb-1">
																			<h5 className="font-medium text-gray-900">{activity.activity}</h5>
																			<Badge variant="outline" className="text-xs">
																				<Clock className="h-3 w-3 mr-1" />
																				{activity.durationMinutes} phút
																			</Badge>
																		</div>
																		{activity.description && (
																			<p className="text-sm text-gray-600 leading-relaxed">
																				{activity.description}
																			</p>
																		)}
																	</div>
																</div>
															))}
														</div>
													</div>
												)}
											</CardContent>
										</Card>
									))}
								</div>
							) : (
								<div className="text-center py-12">
									<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
										<Users className="h-8 w-8 text-gray-400" />
									</div>
									<p className="text-gray-600 font-medium">Chưa có loại vé nào</p>
									<p className="text-gray-400 text-sm mt-1">Vui lòng thêm loại vé để bắt đầu</p>
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="schedules" className="space-y-6">
					<WeeklyScheduleTable 
						schedules={workshop.schedules || []}
						ticketTypes={workshop.ticketTypes || []}
					/>
				</TabsContent>

				<TabsContent value="recurring" className="space-y-6">
					<Card className="shadow-sm border-0">
						<CardHeader className="pb-4">
							<div className="flex items-center gap-2">
								<Calendar className="h-5 w-5 text-blue-600" />
								<CardTitle className="text-xl font-semibold">Quy tắc lặp lại</CardTitle>
							</div>
						</CardHeader>
						<CardContent>
							{Array.isArray(workshop.recurringRules) && workshop.recurringRules.length > 0 ? (
								<div className="grid gap-6">
									{workshop.recurringRules.map((rule: any) => (
										<Card key={rule.id} className="border border-gray-100 hover:shadow-md transition-all">
											<CardContent className="p-6">
												<div className="mb-4">
													<h3 className="text-lg font-semibold text-gray-900 mb-2">Quy tắc lặp lại</h3>
													<div className="flex items-center gap-2">
														<Badge variant="outline" className="flex items-center gap-1">
															<div className="w-2 h-2 bg-green-500 rounded-full"></div>
															Các ngày trong tuần
														</Badge>
														<span className="text-sm text-gray-600">{rule.daysOfWeekDisplay}</span>
													</div>
												</div>
												
												{Array.isArray(rule.sessions) && rule.sessions.length > 0 && (
													<div>
														<h4 className="text-sm font-medium text-gray-700 mb-3">Các khung giờ:</h4>
														<div className="space-y-3">
															{rule.sessions.map((session: any) => (
																<div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
																	<div className="flex items-center gap-3">
																		<div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
																			<Clock className="h-4 w-4" />
																		</div>
																		<div>
																			<div className="font-medium text-gray-900">
																				{session.startTime} - {session.endTime}
																			</div>
																			<div className="text-xs text-gray-500 mt-1">Khung giờ hoạt động</div>
																		</div>
																	</div>
																	<div className="text-right">
																		<div className="text-sm font-medium text-gray-900">
																			Sức chứa: <span className="text-blue-600">{session.capacity}</span>
																		</div>
																		<div className="text-xs text-gray-500">người tham gia</div>
																	</div>
																</div>
															))}
														</div>
													</div>
												)}
											</CardContent>
										</Card>
									))}
								</div>
							) : (
								<div className="text-center py-12">
									<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
										<Calendar className="h-8 w-8 text-gray-400" />
									</div>
									<p className="text-gray-600 font-medium">Chưa có quy tắc lặp lại</p>
									<p className="text-gray-400 text-sm mt-1">Vui lòng thêm quy tắc để tự động lặp lại workshop</p>
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}

export default WorkShopView;
