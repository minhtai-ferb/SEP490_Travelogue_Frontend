'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

interface Schedule {
	id: string
	startTime: string
	endTime: string
	capacity: number
	currentBooked: number
	status: number
	notes?: string
	ticketTypeId?: string
	recurringRules?: RecurringRule[]
}

interface TicketType {
	id: string
	name: string
	type: string
	price?: number
}

interface RecurringRule {
	id: string
	dayOfWeek: number
}

interface WeeklyScheduleTableProps {
	schedules: Schedule[]
	ticketTypes: TicketType[]
	title?: string
	className?: string
}

function getCurrentWeekStart(): Date {
	const now = new Date()
	const dayOfWeek = now.getDay()
	const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
	const monday = new Date(now)
	monday.setDate(now.getDate() + mondayOffset)
	monday.setHours(0, 0, 0, 0)
	return monday
}

function getWeekDates(weekStart: Date): string[] {
	const weekDates: string[] = []
	for (let i = 0; i < 7; i++) {
		const day = new Date(weekStart)
		day.setDate(weekStart.getDate() + i)
		weekDates.push(day.toISOString().split('T')[0])
	}
	return weekDates
}

function formatDate(dateString: string): string {
	const date = new Date(dateString)
	const day = date.getDate().toString().padStart(2, '0')
	const month = (date.getMonth() + 1).toString().padStart(2, '0')
	return `${day}/${month}`
}

function getDayOfWeek(dateString: string): string {
	const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
	const date = new Date(dateString)
	return days[date.getDay()]
}

function getWeekRange(dates: string[]): string {
	if (dates.length === 0) return ''
	const startDate = new Date(Math.min(...dates.map(d => new Date(d).getTime())))
	const endDate = new Date(Math.max(...dates.map(d => new Date(d).getTime())))
	
	const startDay = startDate.getDate().toString().padStart(2, '0')
	const startMonth = (startDate.getMonth() + 1).toString().padStart(2, '0')
	const startYear = startDate.getFullYear()
	
	const endDay = endDate.getDate().toString().padStart(2, '0')
	const endMonth = (endDate.getMonth() + 1).toString().padStart(2, '0')
	const endYear = endDate.getFullYear()
	
	return `${startDay}/${startMonth}/${startYear} - ${endDay}/${endMonth}/${endYear}`
}

export default function WeeklyScheduleTable({ 
	schedules,
	ticketTypes,
	title = "Lịch trình theo tuần",
	className = "" 
}: WeeklyScheduleTableProps) {
	const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getCurrentWeekStart())

	const goToPreviousWeek = () => {
		const newWeekStart = new Date(currentWeekStart)
		newWeekStart.setDate(currentWeekStart.getDate() - 7)
		setCurrentWeekStart(newWeekStart)
	}

	const goToNextWeek = () => {
		const newWeekStart = new Date(currentWeekStart)
		newWeekStart.setDate(currentWeekStart.getDate() + 7)
		setCurrentWeekStart(newWeekStart)
	}

	const goToCurrentWeek = () => {
		setCurrentWeekStart(getCurrentWeekStart())
	}

	const weekDates = getWeekDates(currentWeekStart)
	const weekRange = getWeekRange(weekDates.map(d => d + 'T00:00:00'))
	
	// Filter schedules for current week
	const weekSchedules = schedules.filter((schedule: Schedule) => {
		const scheduleDate = new Date(schedule.startTime).toISOString().split('T')[0]
		return weekDates.includes(scheduleDate)
	})

	// Get unique time slots for the week
	const timeSlots = [...new Set(weekSchedules.map((s: Schedule) => {
		const time = new Date(s.startTime)
		return time.getHours().toString().padStart(2, '0') + ':' + time.getMinutes().toString().padStart(2, '0')
	})) as Set<string>].sort()

	return (
		<Card className={`shadow-sm border-0 ${className}`}>
			<CardHeader className="pb-4">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div className="flex items-center gap-2">
						<Calendar className="h-5 w-5 text-blue-600" />
						<CardTitle className="text-xl font-semibold text-gray-900">{title}</CardTitle>
					</div>
					<div className="flex items-center gap-2">
						<Button 
							variant="outline" 
							size="sm" 
							onClick={goToPreviousWeek}
							className="h-9 px-3 border-gray-200 hover:bg-gray-50"
						>
							<ChevronLeft className="h-4 w-4" />
							<span className="hidden sm:inline ml-1">Trước</span>
						</Button>
						<Button 
							variant="outline" 
							size="sm" 
							onClick={goToCurrentWeek}
							className="h-9 px-4 border-blue-200 text-blue-700 hover:bg-blue-50"
						>
							Hôm nay
						</Button>
						<Button 
							variant="outline" 
							size="sm" 
							onClick={goToNextWeek}
							className="h-9 px-3 border-gray-200 hover:bg-gray-50"
						>
							<span className="hidden sm:inline mr-1">Sau</span>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
				<div className="flex items-center justify-center">
					<div className="inline-flex items-center px-3 py-1 bg-blue-50 rounded-full">
						<span className="text-sm font-medium text-blue-800">{weekRange}</span>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				{Array.isArray(schedules) && schedules.length > 0 ? (
					<div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full min-w-[700px]">
								<thead className="bg-gray-50 border-b border-gray-100">
									<tr>
										<th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 w-24">
											Khung giờ
										</th>
										{weekDates.map((date) => {
											const dayName = getDayOfWeek(date + 'T00:00:00')
											const dayNumber = formatDate(date + 'T00:00:00')
											const isToday = date === new Date().toISOString().split('T')[0]
											const isWeekend = dayName === 'CN' || dayName === 'T7'
											
											return (
												<th key={date} className="text-center py-4 px-3 min-w-[100px]">
													<div className="flex flex-col items-center gap-1">
														<span className={`text-xs font-medium uppercase tracking-wide ${
															isWeekend ? 'text-red-500' : 'text-gray-500'
														}`}>
															{dayName}
														</span>
														<span className={`text-sm font-semibold transition-all ${
															isToday 
																? 'bg-blue-600 text-white px-2 py-1 rounded-lg shadow-sm' 
																: isWeekend 
																	? 'text-red-600' 
																	: 'text-gray-900'
														}`}>
															{dayNumber}
														</span>
													</div>
												</th>
											)
										})}
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-50">
									{timeSlots.length > 0 ? timeSlots.map((timeSlot, index) => (
										<tr key={timeSlot} className="hover:bg-gray-25 transition-colors">
											<td className="py-4 px-4 text-sm font-semibold text-gray-900 bg-gray-50">
												<div className="flex items-center">
													<div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
													{timeSlot}
												</div>
											</td>
											{weekDates.map(date => {
												const daySchedules = weekSchedules.filter((s: Schedule) => {
													const scheduleDate = new Date(s.startTime).toISOString().split('T')[0]
													const scheduleTime = new Date(s.startTime)
													const scheduleTimeStr = scheduleTime.getHours().toString().padStart(2, '0') + ':' + scheduleTime.getMinutes().toString().padStart(2, '0')
													return scheduleDate === date && scheduleTimeStr === timeSlot
												})

												return (
													<td key={date} className="py-3 px-3 text-center">
														{daySchedules.length > 0 ? (
															<div className="space-y-1">
																{daySchedules.map((schedule: Schedule) => {
																	// Tìm ticketType tương ứng
																	const ticketType = ticketTypes.find(t => t.id === schedule.ticketTypeId)
																	
																	return (
																		<div
																			key={schedule.id}
																			className={`inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs font-medium shadow-sm transition-all hover:shadow-md ${
																				schedule.status === 1 
																					? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
																					: 'bg-red-100 text-red-800 border border-red-200'
																			}`}
																		>
																			<div className="flex flex-col items-center gap-1">
																				<span className="font-semibold">
																					{ticketType?.name || 'N/A'}
																				</span>
																				<div className="flex items-center gap-1 text-xs">
																					<div className={`w-1.5 h-1.5 rounded-full ${
																						schedule.currentBooked > 0 ? 'bg-orange-400' : 'bg-gray-400'
																					}`}></div>
																					<span className="text-gray-600">
																						{schedule.currentBooked}/{schedule.capacity}
																					</span>
																				</div>
																			</div>
																		</div>
																	)
																})}
															</div>
														) : (
															<div className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-gray-50 text-gray-400 text-xs">
																<span>Nghỉ</span>
															</div>
														)}
													</td>
												)
											})}
										</tr>
									)) : (
										<tr>
											<td colSpan={8} className="text-center py-12">
												<div className="flex flex-col items-center gap-2">
													<div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
														<Calendar className="h-6 w-6 text-gray-400" />
													</div>
													<p className="text-gray-500 font-medium">Không có lịch trình</p>
													<p className="text-gray-400 text-sm">Tuần này chưa có lịch trình nào được tạo</p>
												</div>
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				) : (
					<div className="text-center py-12">
						<div className="flex flex-col items-center gap-4">
							<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
								<Calendar className="h-8 w-8 text-gray-400" />
							</div>
							<div>
								<p className="text-gray-600 font-medium text-lg">Chưa có lịch trình</p>
								<p className="text-gray-400 text-sm mt-1">Vui lòng tạo lịch trình để hiển thị</p>
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
