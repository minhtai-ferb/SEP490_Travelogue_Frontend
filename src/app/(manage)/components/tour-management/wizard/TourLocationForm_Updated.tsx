"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useLocationController } from "@/services/location-controller"
import type { Location, TourLocationBulkRequest, WorkshopSession, TicketType } from "@/types/Tour"
import axios from "axios"
import { SeccretKey } from "@/secret/secret"
import {
	ArrowLeft,
	ArrowRight,
	CheckCircle2,
	Clock,
	Loader2,
	MapPin,
	Plus,
	Settings,
	Trash2
} from "lucide-react"
import { useEffect, useState } from "react"
import { LocationSelect } from "./LocationSelect"

const VIETMAP_ROUTE_ENDPOINT = "https://maps.vietmap.vn/api/route"

// Activity Types Constants
const ACTIVITY_TYPES = [
	{ value: 1, label: "Tham quan" },
	{ value: 2, label: "Ăn uống" },
	{ value: 3, label: "Mua sắm" },
	{ value: 4, label: "Nghỉ ngơi" },
	{ value: 5, label: "Giải trí" },
	{ value: 6, label: "Trải nghiệm" }
] as const

// Helper function to convert time string to .NET ticks
const timeStringToTicks = (timeStr: string): number => {
	const [hours, minutes, seconds] = timeStr.split(':').map(Number)
	const totalMilliseconds = (hours * 3600 + minutes * 60 + (seconds || 0)) * 1000
	return totalMilliseconds * 10000 // Convert to .NET ticks (100 nanoseconds)
}

// Helper function to normalize time strings
const normalizeTimeString = (time: string): string => {
	if (!time) return "00:00:00"
	const parts = time.split(":")
	if (parts.length === 2) return `${parts[0]}:${parts[1]}:00`
	return time
}

interface TourLocationFormProps {
	tourId: string
	tourDays: number
	initialData?: TourLocationBulkRequest[]
	onSubmit: (data: TourLocationBulkRequest[]) => void
	onPrevious: () => void
	onCancel: () => void
	isLoading?: boolean
}

export function TourLocationForm({
	tourId,
	tourDays,
	initialData = [],
	onSubmit,
	onPrevious,
	onCancel,
	isLoading = false,
}: TourLocationFormProps) {
	// Main state
	const [locations, setLocations] = useState<TourLocationBulkRequest[]>([])
	const [availableLocations, setAvailableLocations] = useState<Location[]>([])
	const [loadingLocations, setLoadingLocations] = useState(true)

	// New location form states
	const [newLocation, setNewLocation] = useState<TourLocationBulkRequest>({
		locationId: "",
		dayOrder: 1,
		startTime: "",
		endTime: "",
		notes: "",
		travelTimeFromPrev: 0,
		distanceFromPrev: 0,
		activityType: 1,
		workshopId: undefined,
		workshopTicketTypeId: undefined,
		workshopSessionRuleId: undefined,
		preferredStartTime: undefined,
		preferredEndTime: undefined
	})

	// Dialog and workshop states
	const [showWorkshopDialog, setShowWorkshopDialog] = useState(false)
	const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
	const [selectedTicketType, setSelectedTicketType] = useState<TicketType | null>(null)
	const [selectedSession, setSelectedSession] = useState<WorkshopSession | null>(null)
	const [availableTickets, setAvailableTickets] = useState<TicketType[]>([])
	const [availableSessions, setAvailableSessions] = useState<WorkshopSession[]>([])

	// Loading states
	const [loadingLocationDetail, setLoadingLocationDetail] = useState(false)
	const [loadingRouteCalculation, setLoadingRouteCalculation] = useState(false)
	const [errors, setErrors] = useState<Record<string, string>>({})

	const { getAllLocation, getLocationById } = useLocationController()

	// Load all available locations on component mount
	useEffect(() => {
		loadAvailableLocations()
		if (initialData.length > 0) {
			setLocations(initialData)
		}
	}, [initialData])

	const loadAvailableLocations = async () => {
		try {
			setLoadingLocations(true)
			const data = await getAllLocation()
			setAvailableLocations(data || [])
		} catch (error) {
			console.error("Error loading locations:", error)
		} finally {
			setLoadingLocations(false)
		}
	}

	// Step 1: Location Selection Handler
	const handleLocationSelect = async (locationId: string) => {
		if (!locationId) return

		setLoadingLocationDetail(true)
		setErrors({})

		try {
			const locationData = await getLocationById(locationId)
			if (!locationData) throw new Error("Location not found")

			setSelectedLocation(locationData)
			setNewLocation(prev => ({
				...prev,
				locationId: locationId
			}))

			// Step 2: Check if it's a craft village
			if (locationData.craftVillage?.workshopsAvailable && locationData.craftVillage.workshop) {
				// Step 2a: Show workshop dialog for craft village
				await loadWorkshopData(locationData)
				setShowWorkshopDialog(true)
			} else {
				// Step 2: Regular location - user inputs start/end time manually
				setShowWorkshopDialog(false)
				await calculateTravelTime(locationData)
			}
		} catch (error) {
			console.error("Error loading location:", error)
			setErrors({ location: "Không thể tải thông tin địa điểm" })
		} finally {
			setLoadingLocationDetail(false)
		}
	}

	// Load workshop data for craft village locations
	const loadWorkshopData = async (location: Location) => {
		const workshop = location.craftVillage?.workshop
		if (!workshop) return

		// Set workshop ID to location ID as specified
		setNewLocation(prev => ({
			...prev,
			workshopId: location.id  // workshopId = locationId as per requirement
		}))

		// Load available tickets
		setAvailableTickets(workshop.ticketTypes || [])

		// Reset selections
		setSelectedTicketType(null)
		setSelectedSession(null)
		setAvailableSessions([])
	}

	// Calculate travel time from previous location
	const calculateTravelTime = async (toLocation: Location) => {
		const prevLocation = getLastLocationOfDay(newLocation.dayOrder)
		if (!prevLocation) {
			setNewLocation(prev => ({
				...prev,
				travelTimeFromPrev: 0,
				distanceFromPrev: 0
			}))
			return
		}

		setLoadingRouteCalculation(true)
		try {
			const fromCoords = getCoordsByLocationId(prevLocation.locationId)
			const toCoords = { lat: toLocation.latitude, lng: toLocation.longitude }

			if (fromCoords && toCoords) {
				const metrics = await fetchRouteMetrics(fromCoords, toCoords)
				if (metrics) {
					setNewLocation(prev => ({
						...prev,
						travelTimeFromPrev: Math.ceil(metrics.travelTime),
						distanceFromPrev: Math.ceil(metrics.distance)
					}))
				}
			}
		} catch (error) {
			console.error("Error calculating travel time:", error)
		} finally {
			setLoadingRouteCalculation(false)
		}
	}

	// Step 2a.1: Handle ticket type selection
	const handleTicketSelect = (ticketId: string) => {
		const ticket = availableTickets.find(t => t.id === ticketId)
		if (!ticket) return

		setSelectedTicketType(ticket)
		setNewLocation(prev => ({
			...prev,
			workshopTicketTypeId: ticketId
		}))

		// Check if it's a combo ticket (experience ticket) - using type checking instead of isCombo
		// Assuming combo tickets have certain characteristics, we'll check by ticket type or name
		const isExperienceTicket = ticket.name.toLowerCase().includes('trải nghiệm') ||
			ticket.name.toLowerCase().includes('workshop') ||
			ticket.name.toLowerCase().includes('combo')

		if (isExperienceTicket) {
			// Step 2a.2: Load available sessions for experience ticket
			loadAvailableSessionsForTicket(ticket)
		} else {
			// Step 2a.1: Regular sightseeing ticket - user can set custom time
			setAvailableSessions([])
			setSelectedSession(null)
			setNewLocation(prev => ({
				...prev,
				workshopSessionRuleId: undefined,
				preferredStartTime: undefined,
				preferredEndTime: undefined
			}))
		}
	}

	// Load available sessions for experience tickets
	const loadAvailableSessionsForTicket = (ticket: TicketType) => {
		if (!selectedLocation?.craftVillage?.workshop?.recurringRules) return

		const currentDayOfWeek = new Date().getDay() // For demo, use current day
		const availableRules = selectedLocation.craftVillage.workshop.recurringRules
			.filter(rule => rule.daysOfWeek.includes(currentDayOfWeek))

		const allSessions: WorkshopSession[] = []
		availableRules.forEach(rule => {
			if (rule.sessions) {
				// Filter out conflicting sessions
				const nonConflictingSessions = rule.sessions.filter(session =>
					!isSessionConflicting(session, newLocation.dayOrder)
				)
				allSessions.push(...nonConflictingSessions)
			}
		})

		setAvailableSessions(allSessions)
	}

	// Step 2a.2: Handle session selection
	const handleSessionSelect = (sessionId: string) => {
		const session = availableSessions.find(s => s.id === sessionId)
		if (!session) return

		setSelectedSession(session)

		// Auto-fill start and end times from session
		const startTime = session.startTime.substring(0, 8) // HH:MM:SS
		const endTime = session.endTime.substring(0, 8)

		setNewLocation(prev => ({
			...prev,
			startTime: startTime,
			endTime: endTime,
			workshopSessionRuleId: sessionId,
			// Convert to .NET ticks as specified in requirement
			preferredStartTime: timeStringToTicks(startTime).toString(),
			preferredEndTime: timeStringToTicks(endTime).toString()
		}))
	}

	// Check if session conflicts with existing tour locations
	const isSessionConflicting = (session: WorkshopSession, dayOrder: number): boolean => {
		const existingLocations = locations.filter(loc => loc.dayOrder === dayOrder)

		return existingLocations.some(loc => {
			const sessionStart = session.startTime.substring(0, 8)
			const sessionEnd = session.endTime.substring(0, 8)

			return (
				(sessionStart >= loc.startTime && sessionStart < loc.endTime) ||
				(sessionEnd > loc.startTime && sessionEnd <= loc.endTime) ||
				(sessionStart <= loc.startTime && sessionEnd >= loc.endTime)
			)
		})
	}

	// Confirm workshop selection
	const handleWorkshopConfirm = () => {
		if (!selectedTicketType) {
			setErrors({ workshop: "Vui lòng chọn loại vé" })
			return
		}

		const isExperienceTicket = selectedTicketType.name.toLowerCase().includes('trải nghiệm') ||
			selectedTicketType.name.toLowerCase().includes('workshop') ||
			selectedTicketType.name.toLowerCase().includes('combo')

		if (isExperienceTicket && !selectedSession) {
			setErrors({ workshop: "Vui lòng chọn session trải nghiệm" })
			return
		}

		setShowWorkshopDialog(false)
		setErrors({})
	}

	// Cancel workshop selection
	const handleWorkshopCancel = () => {
		setShowWorkshopDialog(false)
		setSelectedLocation(null)
		setSelectedTicketType(null)
		setSelectedSession(null)
		setNewLocation(prev => ({
			...prev,
			locationId: "",
			workshopId: undefined,
			workshopTicketTypeId: undefined,
			workshopSessionRuleId: undefined,
			preferredStartTime: undefined,
			preferredEndTime: undefined
		}))
	}

	// Add location to tour
	const handleAddLocation = async () => {
		if (!validateNewLocation()) return

		const itemToAdd: TourLocationBulkRequest = {
			...newLocation,
			startTime: normalizeTimeString(newLocation.startTime),
			endTime: normalizeTimeString(newLocation.endTime)
		}

		setLocations(prev => [...prev, itemToAdd])
		resetForm()
	}

	// Validation
	const validateNewLocation = (): boolean => {
		const newErrors: Record<string, string> = {}

		if (!newLocation.locationId) {
			newErrors.location = "Vui lòng chọn địa điểm"
		}

		if (!newLocation.startTime) {
			newErrors.startTime = "Vui lòng nhập thời gian bắt đầu"
		}

		if (!newLocation.endTime) {
			newErrors.endTime = "Vui lòng nhập thời gian kết thúc"
		}

		if (newLocation.startTime && newLocation.endTime && newLocation.startTime >= newLocation.endTime) {
			newErrors.time = "Thời gian kết thúc phải sau thời gian bắt đầu"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	// Reset form after adding location
	const resetForm = () => {
		setNewLocation({
			locationId: "",
			dayOrder: newLocation.dayOrder,
			startTime: "",
			endTime: "",
			notes: "",
			travelTimeFromPrev: 0,
			distanceFromPrev: 0,
			activityType: 1,
			workshopId: undefined,
			workshopTicketTypeId: undefined,
			workshopSessionRuleId: undefined,
			preferredStartTime: undefined,
			preferredEndTime: undefined
		})
		setSelectedLocation(null)
		setSelectedTicketType(null)
		setSelectedSession(null)
		setShowWorkshopDialog(false)
		setErrors({})
	}

	// Helper functions
	const getLastLocationOfDay = (dayOrder: number) => {
		const locationsOfDay = locations.filter(loc => loc.dayOrder === dayOrder)
		return locationsOfDay.length > 0 ? locationsOfDay[locationsOfDay.length - 1] : null
	}

	const getCoordsByLocationId = (locationId: string) => {
		const location = availableLocations.find(loc => loc.id === locationId)
		return location ? { lat: location.latitude, lng: location.longitude } : null
	}

	const fetchRouteMetrics = async (from: { lat: number; lng: number }, to: { lat: number; lng: number }) => {
		try {
			const response = await axios.get(VIETMAP_ROUTE_ENDPOINT, {
				params: {
					api_key: SeccretKey.VIET_MAP_KEY,
					points: `${from.lat},${from.lng}|${to.lat},${to.lng}`,
					vehicle: 'car'
				}
			})

			if (response.data.paths && response.data.paths[0]) {
				const path = response.data.paths[0]
				return {
					travelTime: Math.ceil(path.time / 60000), // Convert to minutes
					distance: Math.ceil(path.distance / 1000)  // Convert to km
				}
			}
		} catch (error) {
			console.error("Error fetching route:", error)
		}
		return null
	}

	// Remove location
	const handleRemoveLocation = (index: number) => {
		setLocations(prev => prev.filter((_, i) => i !== index))
	}

	// Submit handler - Create payload matching the required format
	const handleSubmit = () => {
		if (locations.length === 0) {
			setErrors({ submit: "Vui lòng thêm ít nhất một địa điểm" })
			return
		}

		// Transform data to match required API format
		const payload = locations.map(loc => ({
			// tourPlanLocationId will be null for new requests
			locationId: loc.locationId,
			dayOrder: loc.dayOrder,
			activityType: loc.activityType,
			startTime: normalizeTimeString(loc.startTime), // "HH:MM:SS" format
			endTime: normalizeTimeString(loc.endTime),     // "HH:MM:SS" format
			notes: loc.notes || "",
			travelTimeFromPrev: loc.travelTimeFromPrev || 0,
			distanceFromPrev: loc.distanceFromPrev || 0,
			estimatedStartTime: "00:00:00", // String format as per interface
			estimatedEndTime: "00:00:00",   // String format as per interface
			// Workshop fields (only if workshop is selected)
			...(loc.workshopId && {
				workshopId: loc.workshopId,                    // = locationId for craft villages
				workshopTicketTypeId: loc.workshopTicketTypeId, // ticketId
				workshopSessionRuleId: loc.workshopSessionRuleId, // sessionId
				preferredStartTime: loc.preferredStartTime, // Already in ticks string format
				preferredEndTime: loc.preferredEndTime      // Already in ticks string format
			})
		}))

		onSubmit(payload)
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">Thêm địa điểm cho tour</h2>
				<div className="text-sm text-muted-foreground">
					Đã thêm: {locations.length} địa điểm
				</div>
			</div>

			{/* Add New Location Form */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Plus className="h-5 w-5" />
						Thêm địa điểm mới
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Step 1: Location Selection */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label htmlFor="location">Chọn địa điểm *</Label>
							<LocationSelect
								locations={availableLocations}
								value={newLocation.locationId}
								onChange={handleLocationSelect}
								isLoading={loadingLocations}
								placeholder="Tìm kiếm địa điểm..."
							/>
							{errors.location && (
								<p className="text-sm text-destructive mt-1">{errors.location}</p>
							)}
						</div>

						<div>
							<Label htmlFor="dayOrder">Ngày thứ *</Label>
							<Select
								value={newLocation.dayOrder.toString()}
								onValueChange={(value) =>
									setNewLocation(prev => ({ ...prev, dayOrder: parseInt(value) }))
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Array.from({ length: tourDays }, (_, i) => (
										<SelectItem key={i + 1} value={(i + 1).toString()}>
											Ngày {i + 1}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Activity Type Selection */}
					<div>
						<Label htmlFor="activityType">Loại hoạt động *</Label>
						<Select
							value={newLocation.activityType?.toString()}
							onValueChange={(value) =>
								setNewLocation(prev => ({ ...prev, activityType: parseInt(value) }))
							}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{ACTIVITY_TYPES.map(type => (
									<SelectItem key={type.value} value={type.value.toString()}>
										{type.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Step 2: Time Input (for regular locations) */}
					{selectedLocation && !showWorkshopDialog && (
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="startTime">Thời gian bắt đầu *</Label>
								<Input
									id="startTime"
									type="time"
									value={newLocation.startTime}
									onChange={(e) => setNewLocation(prev => ({
										...prev,
										startTime: e.target.value
									}))}
								/>
								{errors.startTime && (
									<p className="text-sm text-destructive mt-1">{errors.startTime}</p>
								)}
							</div>

							<div>
								<Label htmlFor="endTime">Thời gian kết thúc *</Label>
								<Input
									id="endTime"
									type="time"
									value={newLocation.endTime}
									onChange={(e) => setNewLocation(prev => ({
										...prev,
										endTime: e.target.value
									}))}
								/>
								{errors.endTime && (
									<p className="text-sm text-destructive mt-1">{errors.endTime}</p>
								)}
							</div>
						</div>
					)}

					{/* Travel Information */}
					{(newLocation.travelTimeFromPrev > 0 || newLocation.distanceFromPrev > 0) && (
						<div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
							<div className="flex items-center gap-2 text-blue-800 mb-2">
								<MapPin className="h-4 w-4" />
								<span className="font-medium">Thông tin di chuyển</span>
							</div>
							<div className="text-sm text-blue-600">
								<p>⏱️ Thời gian di chuyển: {newLocation.travelTimeFromPrev} phút</p>
								<p>📍 Khoảng cách: {newLocation.distanceFromPrev} km</p>
							</div>
						</div>
					)}

					{/* Notes */}
					<div>
						<Label htmlFor="notes">Ghi chú</Label>
						<Textarea
							id="notes"
							value={newLocation.notes}
							onChange={(e) => setNewLocation(prev => ({ ...prev, notes: e.target.value }))}
							placeholder="Ghi chú về địa điểm này..."
						/>
					</div>

					{/* Errors */}
					{(errors.time || errors.submit) && (
						<div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
							<p className="text-sm text-destructive">
								{errors.time || errors.submit}
							</p>
						</div>
					)}

					{/* Add Button */}
					<Button
						onClick={handleAddLocation}
						className="w-full"
						disabled={loadingLocationDetail || loadingRouteCalculation}
					>
						{(loadingLocationDetail || loadingRouteCalculation) && (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						)}
						Thêm địa điểm
					</Button>
				</CardContent>
			</Card>

			{/* Step 2a: Workshop Dialog */}
			<Dialog open={showWorkshopDialog} onOpenChange={setShowWorkshopDialog}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Settings className="h-5 w-5" />
							Chọn trải nghiệm làng nghề
						</DialogTitle>
						<DialogDescription>
							{selectedLocation?.name} - Vui lòng chọn loại vé và session phù hợp
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4">
						{/* Ticket Type Selection */}
						<div>
							<Label>Loại vé *</Label>
							<Select
								value={selectedTicketType?.id || ""}
								onValueChange={handleTicketSelect}
							>
								<SelectTrigger>
									<SelectValue placeholder="Chọn loại vé" />
								</SelectTrigger>
								<SelectContent>
									{availableTickets.map(ticket => {
										const isExperience = ticket.name.toLowerCase().includes('trải nghiệm') ||
											ticket.name.toLowerCase().includes('workshop') ||
											ticket.name.toLowerCase().includes('combo')
										return (
											<SelectItem key={ticket.id} value={ticket.id}>
												<div className="flex items-center justify-between w-full">
													<span>{ticket.name}</span>
													<Badge variant={isExperience ? "default" : "secondary"}>
														{isExperience ? "Trải nghiệm" : "Tham quan"}
													</Badge>
												</div>
											</SelectItem>
										)
									})}
								</SelectContent>
							</Select>
						</div>

						{/* Session Selection (for experience tickets) */}
						{selectedTicketType && (selectedTicketType.name.toLowerCase().includes('trải nghiệm') ||
							selectedTicketType.name.toLowerCase().includes('workshop') ||
							selectedTicketType.name.toLowerCase().includes('combo')) && (
								<div>
									<Label>Session trải nghiệm *</Label>
									<Select
										value={selectedSession?.id || ""}
										onValueChange={handleSessionSelect}
									>
										<SelectTrigger>
											<SelectValue placeholder="Chọn khung giờ trải nghiệm" />
										</SelectTrigger>
										<SelectContent>
											{availableSessions.map(session => (
												<SelectItem key={session.id} value={session.id}>
													<div className="flex items-center gap-2">
														<Clock className="h-4 w-4" />
														<span>
															{session.startTime.substring(0, 5)} - {session.endTime.substring(0, 5)}
														</span>
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>

									{availableSessions.length === 0 && (
										<p className="text-sm text-muted-foreground mt-1">
											Không có session khả dụng cho ngày này
										</p>
									)}
								</div>
							)}

						{/* Selected Time Display */}
						{selectedSession && (
							<div className="p-3 bg-green-50 border border-green-200 rounded-lg">
								<div className="flex items-center gap-2 text-green-800 mb-2">
									<CheckCircle2 className="h-4 w-4" />
									<span className="font-medium">Thời gian đã chọn</span>
								</div>
								<div className="text-sm text-green-600">
									<p>🕐 Bắt đầu: {selectedSession.startTime.substring(0, 5)}</p>
									<p>🕐 Kết thúc: {selectedSession.endTime.substring(0, 5)}</p>
								</div>
							</div>
						)}

						{errors.workshop && (
							<p className="text-sm text-destructive">{errors.workshop}</p>
						)}
					</div>

					<div className="flex gap-2 justify-end">
						<Button variant="outline" onClick={handleWorkshopCancel}>
							Hủy
						</Button>
						<Button onClick={handleWorkshopConfirm}>
							Xác nhận
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* Added Locations List */}
			{locations.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Danh sách địa điểm đã thêm</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{locations.map((location, index) => {
								const locationData = availableLocations.find(loc => loc.id === location.locationId)
								const activityType = ACTIVITY_TYPES.find(type => type.value === location.activityType)

								return (
									<div key={index} className="flex items-center justify-between p-3 border rounded-lg">
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-2">
												<Badge variant="outline">Ngày {location.dayOrder}</Badge>
												<Badge>{activityType?.label}</Badge>
												{location.workshopId && (
													<Badge variant="secondary">Làng nghề</Badge>
												)}
											</div>
											<h4 className="font-medium">{locationData?.name || 'Unknown Location'}</h4>
											<div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
												<span className="flex items-center gap-1">
													<Clock className="h-3 w-3" />
													{location.startTime} - {location.endTime}
												</span>
												{location.travelTimeFromPrev > 0 && (
													<span>🚗 {location.travelTimeFromPrev}p</span>
												)}
											</div>
										</div>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleRemoveLocation(index)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								)
							})}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Footer Actions */}
			<div className="flex justify-between">
				<Button variant="outline" onClick={onPrevious}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Quay lại
				</Button>

				<div className="flex gap-2">
					<Button variant="outline" onClick={onCancel}>
						Hủy
					</Button>
					<Button onClick={handleSubmit} disabled={isLoading || locations.length === 0}>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Tiếp tục
						<ArrowRight className="ml-2 h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	)
}
