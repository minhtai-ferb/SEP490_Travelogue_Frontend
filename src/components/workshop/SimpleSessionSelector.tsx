"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, CheckCircle2, AlertCircle, Ticket } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { Workshop, WorkshopSession, TicketType } from "@/types/Tour"

interface SimpleSessionSelectorProps {
	workshop: Workshop
	selectedSession?: WorkshopSession | null
	selectedTicketId?: string | null
	onSessionSelect: (session: WorkshopSession | null) => void
	onTicketSelect: (ticketId: string) => void
	earliestArrival?: string
	isLoading?: boolean
	existingTourLocations?: Array<{
		startTime: string
		endTime: string
		locationId: string
		dayNumber?: number
	}>
	currentDayNumber?: number
}

export function SimpleSessionSelector({
	workshop,
	selectedSession,
	selectedTicketId,
	onSessionSelect,
	onTicketSelect,
	earliestArrival = "",
	isLoading = false,
	existingTourLocations = [],
	currentDayNumber = 1
}: SimpleSessionSelectorProps) {
	const [availableSessions, setAvailableSessions] = useState<WorkshopSession[]>([])
	const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);


	// Time conversion utilities
	const timeStringToMinutes = (timeStr: string): number => {
		if (!timeStr) return 0
		const parts = timeStr.split(':').map(Number)
		const h = parts[0] ?? 0
		const m = parts[1] ?? 0
		return h * 60 + m
	}

	const timeToMinutes = (timeStr: string): number => {
		return timeStringToMinutes(timeStr) // Alias for compatibility
	}

	// Enhanced session validation with time conflict detection
	const getSessionValidation = (session: WorkshopSession) => {
		const selectedTicket = workshop.ticketTypes?.find(t => t.id === selectedTicketId)

		if (!selectedTicket) {
			return {
				isValid: false,
				reason: "Vui lòng chọn loại vé trước",
				hasConflict: false,
				alternatives: []
			}
		}

		const sessionStart = timeStringToMinutes(session.startTime)
		const sessionEnd = timeStringToMinutes(session.endTime)
		const sessionDuration = sessionEnd - sessionStart

		// Check earliest arrival
		if (earliestArrival) {
			const arrivalTime = timeStringToMinutes(earliestArrival)
			if (sessionStart < arrivalTime) {
				return {
					isValid: false,
					reason: `Bạn đến sớm nhất ${formatTime(earliestArrival)}. Ca bắt đầu ${formatTime(session.startTime)}`,
					hasConflict: false,
					alternatives: []
				}
			}
		}

		// Check session duration vs ticket duration
		if (sessionDuration < selectedTicket.durationMinutes) {
			return {
				isValid: false,
				reason: `Ca chỉ có ${sessionDuration} phút, vé yêu cầu ${selectedTicket.durationMinutes} phút`,
				hasConflict: false,
				alternatives: []
			}
		}

		// Check for time conflicts
		const conflictCheck = checkTimeConflict(session, selectedTicket.durationMinutes)

		if (conflictCheck.hasConflict) {
			return {
				isValid: false,
				reason: `Xung đột với địa điểm khác (${conflictCheck.conflictDetails?.conflictTimeRange})`,
				hasConflict: true,
				alternatives: conflictCheck.suggestedAlternatives,
				conflictDetails: conflictCheck.conflictDetails
			}
		}

		return {
			isValid: true,
			hasConflict: false,
			alternatives: []
		}
	}

	// Check for time conflicts and generate alternative sessions
	const checkTimeConflict = (session: WorkshopSession, ticketDuration: number) => {
		const selectedTicket = workshop.ticketTypes?.find(t => t.id === selectedTicketId)
		if (!selectedTicket) return { hasConflict: false, conflictDetails: null, suggestedAlternatives: [] }

		// Calculate proposed end time based on session start + ticket duration
		const sessionStartMinutes = timeStringToMinutes(session.startTime)
		const proposedEndMinutes = sessionStartMinutes + ticketDuration

		// Check conflicts with same day locations
		const sameDayLocations = existingTourLocations.filter(loc =>
			(loc.dayNumber || 1) === currentDayNumber
		)

		for (const existingLocation of sameDayLocations) {
			const existingStart = timeStringToMinutes(existingLocation.startTime)
			const existingEnd = timeStringToMinutes(existingLocation.endTime)

			// Check if times overlap
			if (
				(sessionStartMinutes >= existingStart && sessionStartMinutes < existingEnd) ||
				(proposedEndMinutes > existingStart && proposedEndMinutes <= existingEnd) ||
				(sessionStartMinutes <= existingStart && proposedEndMinutes >= existingEnd)
			) {
				return {
					hasConflict: true,
					conflictDetails: {
						conflictWith: existingLocation,
						conflictTimeRange: `${formatTimeForDisplay(existingLocation.startTime)} - ${formatTimeForDisplay(existingLocation.endTime)}`
					},
					suggestedAlternatives: generateAlternativeSessions(session, existingEnd, ticketDuration)
				}
			}
		}

		return { hasConflict: false, conflictDetails: null, suggestedAlternatives: [] }
	}

	// Generate alternative sessions when there's a conflict
	const generateAlternativeSessions = (originalSession: WorkshopSession, conflictEndTime: number, ticketDuration: number) => {
		const alternatives = []

		// Option 1: Start after the conflicting location ends
		const newStartMinutes = conflictEndTime + 15 // 15 minutes buffer
		const newEndMinutes = newStartMinutes + ticketDuration

		// Check if this fits within the original session time
		const originalSessionEndMinutes = timeStringToMinutes(originalSession.endTime)

		if (newEndMinutes <= originalSessionEndMinutes) {
			const newStartTime = `${String(Math.floor(newStartMinutes / 60)).padStart(2, '0')}:${String(newStartMinutes % 60).padStart(2, '0')}:00`
			const newEndTime = `${String(Math.floor(newEndMinutes / 60)).padStart(2, '0')}:${String(newEndMinutes % 60).padStart(2, '0')}:00`

			alternatives.push({
				...originalSession,
				startTime: newStartTime,
				endTime: newEndTime,
				isAlternative: true,
				alternativeReason: `Bắt đầu sau ${formatTimeForDisplay(`${String(Math.floor(conflictEndTime / 60)).padStart(2, '0')}:${String(conflictEndTime % 60).padStart(2, '0')}`)}`
			})
		}

		// Option 2: Find other sessions that don't conflict
		availableSessions.forEach(session => {
			if (session.startTime !== originalSession.startTime) {
				const conflict = checkTimeConflict(session, ticketDuration)
				if (!conflict.hasConflict) {
					alternatives.push({
						...session,
						isAlternative: true,
						alternativeReason: "Session khác không bị xung đột"
					})
				}
			}
		})

		return alternatives.slice(0, 3) // Limit to 3 alternatives
	}	// Get & filter sessions based on selected ticket
	useEffect(() => {
		const allSessions: WorkshopSession[] = []
		workshop.recurringRules.forEach(rule => {
			rule.sessions.forEach(session => allSessions.push(session))
		})
		setAvailableSessions(allSessions)
	}, [workshop.recurringRules])

	// Update selected ticket when ID changes
	useEffect(() => {
		const ticket = workshop.ticketTypes?.find(t => t.id === selectedTicketId)
		setSelectedTicket(ticket || null)
	}, [selectedTicketId, workshop.ticketTypes])

	const handleSessionSelect = (session: WorkshopSession) => {
		const validation = getSessionValidation(session)
		if (validation.isValid) {
			onSessionSelect(session)
		}
	}

	const handleTicketSelect = (ticketId: string) => {
		onTicketSelect(ticketId)
		// Clear selected session when ticket changes since validity may change
		if (selectedSession) {
			onSessionSelect(null)
		}
	}

	const formatTime = (timeString: string): string => {
		return timeString.substring(0, 5) // "HH:MM:SS" -> "HH:MM"
	}

	const formatTimeForDisplay = (timeString: string): string => {
		return formatTime(timeString) // Alias for consistency
	}

	const calculateDuration = (startTime: string, endTime: string): string => {
		const [startHours, startMinutes] = startTime.split(':').map(Number)
		const [endHours, endMinutes] = endTime.split(':').map(Number)
		const startTotal = startHours * 60 + startMinutes
		const endTotal = endHours * 60 + endMinutes
		const diffMins = endTotal - startTotal

		if (diffMins < 60) {
			return `${diffMins} phút`
		} else {
			const hours = Math.floor(diffMins / 60)
			const mins = diffMins % 60
			return `${hours}h${mins > 0 ? ` ${mins}m` : ""}`
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<div className="w-2 h-2 bg-purple-500 rounded-full" />
					Chọn vé và khung giờ làng nghề
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="p-3 bg-blue-50 rounded-lg">
					<h4 className="font-medium text-blue-900 mb-2">Thông tin làng nghề</h4>
					<div className="space-y-1 text-sm text-blue-800">
						<p><strong>Tên:</strong> {workshop.name}</p>
						<p><strong>Mô tả:</strong> {workshop.description}</p>
					</div>
				</div>

				{/* Ticket Type Selector */}
				{workshop.ticketTypes && workshop.ticketTypes.length > 0 && (
					<div className="space-y-2">
						<Label className="flex items-center gap-2">
							<Ticket className="w-4 h-4" />
							Chọn loại vé <span className="text-red-500">*</span>
						</Label>
						<Select value={selectedTicketId || ''} onValueChange={handleTicketSelect}>
							<SelectTrigger>
								<SelectValue placeholder="Chọn loại vé trước" />
							</SelectTrigger>
							<SelectContent>
								{workshop.ticketTypes.map((ticket, index) => (
									<SelectItem key={ticket.id || `ticket-${index}`} value={ticket.id || `ticket-${index}`}>
										<div className="flex items-center justify-between w-full">
											<span>{ticket.name}</span>
											<div className="flex items-center gap-2 ml-2">
												<Badge variant="secondary" className="text-xs">
													{ticket.durationMinutes} phút
												</Badge>
												<span className="text-xs text-green-600 font-medium">
													{ticket.price.toLocaleString()}đ
												</span>
											</div>
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{selectedTicketId && (
							<div className="p-2 bg-green-50 rounded text-sm text-green-800">
								{(() => {
									const selectedTicket = workshop.ticketTypes.find((t, index) =>
										t.id === selectedTicketId || `ticket-${index}` === selectedTicketId
									)
									return selectedTicket ? (
										<>
											<p><strong>Đã chọn:</strong> {selectedTicket.name} - {selectedTicket.durationMinutes} phút</p>
											<p className="text-xs text-gray-600 mt-1">Giá: {selectedTicket.price.toLocaleString()}đ</p>
										</>
									) : null
								})()}
							</div>
						)}
					</div>
				)}

				{/* Earliest Arrival Info */}
				{earliestArrival && (
					<div className="p-2 bg-yellow-50 rounded text-sm text-yellow-800 flex items-center gap-2">
						<Clock className="w-4 h-4" />
						<span>Thời gian đến sớm nhất: <strong>{formatTime(earliestArrival)}</strong></span>
					</div>
				)}

				{/* Session Selector */}
				{availableSessions.length > 0 && (
					<>
						<div className="p-2 bg-green-50 rounded text-sm text-green-800 flex items-start gap-2">
							<CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
							<span>
								{selectedTicketId ? (
									<>Chọn khung giờ phù hợp cho vé đã chọn</>
								) : (
									<>Vui lòng chọn loại vé trước khi chọn khung giờ</>
								)}
							</span>
						</div>

						<div className="space-y-2">
							<h4 className="font-medium">Các khung giờ có sẵn</h4>
							<div className="grid gap-3">
								{availableSessions.map((session, index) => {
									const isSelected = selectedSession &&
										selectedSession.startTime === session.startTime &&
										selectedSession.endTime === session.endTime
									const validation = getSessionValidation(session)
									const isValid = validation.isValid

									return (
										<div key={index} className="space-y-2">
											{/* Main Session */}
											<div
												className={`border rounded-lg p-3 transition-colors ${isSelected
													? 'border-purple-500 bg-purple-50'
													: isValid
														? 'border-gray-200 hover:border-gray-300 cursor-pointer'
														: validation.hasConflict
															? 'border-orange-200 bg-orange-50'
															: 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
													}`}
												onClick={() => isValid && handleSessionSelect(session)}
											>
												<div className="flex items-center justify-between">
													<div className="flex-1">
														<div className="flex items-center gap-2 mb-1">
															<Clock className="w-4 h-4 text-purple-500" />
															<span className="font-medium">
																{formatTime(session.startTime)} - {formatTime(session.endTime)}
															</span>
															<Badge variant="outline" className="text-xs">
																{calculateDuration(session.startTime, session.endTime)}
															</Badge>
														</div>
														<div className="text-sm text-gray-600">
															<span className="flex items-center gap-1">
																<Users className="w-3 h-3" />
																Sức chứa: {session.capacity} người
															</span>
														</div>
														{!isValid && validation.reason && (
															<div className={`text-xs mt-1 flex items-center gap-1 ${validation.hasConflict ? 'text-orange-600' : 'text-red-500'
																}`}>
																<AlertCircle className="w-3 h-3" />
																<span>{validation.reason}</span>
															</div>
														)}
													</div>
													{isSelected && (
														<CheckCircle2 className="w-5 h-5 text-purple-500" />
													)}
												</div>
											</div>

											{/* Alternative Sessions when there's a conflict */}
											{!isValid && validation.hasConflict && validation.alternatives && validation.alternatives.length > 0 && (
												<div className="ml-4 pl-4 border-l-2 border-orange-200 space-y-2">
													<h5 className="text-sm font-medium text-orange-800 flex items-center gap-1">
														<Clock className="w-3 h-3" />
														Gợi ý thời gian khác:
													</h5>
													{validation.alternatives.map((altSession: any, altIndex: number) => (
														<div
															key={altIndex}
															className="border border-green-200 rounded-lg p-2 bg-green-50 hover:bg-green-100 cursor-pointer transition-colors"
															onClick={() => handleSessionSelect(altSession)}
														>
															<div className="flex items-center justify-between">
																<div className="flex-1">
																	<div className="flex items-center gap-2 mb-1">
																		<Clock className="w-3 h-3 text-green-600" />
																		<span className="text-sm font-medium text-green-800">
																			{formatTime(altSession.startTime)} - {formatTime(altSession.endTime)}
																		</span>
																		<Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
																			Thay thế
																		</Badge>
																	</div>
																	{altSession.alternativeReason && (
																		<p className="text-xs text-green-700">
																			{altSession.alternativeReason}
																		</p>
																	)}
																</div>
																<CheckCircle2 className="w-4 h-4 text-green-600" />
															</div>
														</div>
													))}
												</div>
											)}
										</div>
									)
								})}
							</div>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	)
}
