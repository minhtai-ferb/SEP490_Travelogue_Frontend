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
	Navigation,
	Plus,
	Settings,
	Trash2,
	Users,
	Wrench
} from "lucide-react"
import { useEffect, useState } from "react"
import { LocationSelect } from "./LocationSelect"
import { getActivityColor } from "@/utils/format"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const VIETMAP_ROUTE_ENDPOINT = "https://maps.vietmap.vn/api/route?api-version=1.1"
// https://smartlog-lc.map.zone/api/route/v3?apikey={your-apikey}&point={point}&point={point}&points_encoded={points_encoded}&vehicle={vehicle}
// Activity Types Constants - Based on backend enum
const ACTIVITY_TYPES = [
	{ value: 1, label: "Tham quan" },
	{ value: 2, label: "Ăn uống" },
	{ value: 3, label: "Trải nghiệm làng nghề" },
	{ value: 4, label: "Nghỉ ngơi" },
	{ value: 5, label: "Mua sắm" },
	{ value: 6, label: "Giải trí" },
	{ value: 7, label: "Trải nghiệm" }
] as const


// Helper function to add minutes to time string
const addMinutesToTime = (timeStr: string, minutes: number): string => {
	if (!timeStr) return ""

	const [hours, mins] = timeStr.split(':').map(Number)
	const totalMinutes = hours * 60 + mins + minutes
	const newHours = Math.floor(totalMinutes / 60) % 24
	const newMins = totalMinutes % 60

	return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`
}

// Helper function to calculate suggested start time
const calculateSuggestedStartTime = (prevEndTime: string, travelTimeMinutes: number): string => {
	if (!prevEndTime || travelTimeMinutes === 0) return ""
	return addMinutesToTime(prevEndTime, travelTimeMinutes)
}
const normalizeTimeString = (time: string): string => {
	if (!time) return "00:00:00"
	const parts = time.split(":")
	if (parts.length === 2) return `${parts[0]}:${parts[1]}:00`
	return time
}

// Helper function to convert HH:MM:SS to minutes for comparison
const timeToMinutes = (timeStr: string): number => {
	if (!timeStr) return 0
	const [hours, minutes] = timeStr.split(':').map(Number)
	return hours * 60 + minutes
}

// Helper function to check if times overlap
const timesOverlap = (start1: string, end1: string, start2: string, end2: string): boolean => {
	const start1Min = timeToMinutes(start1)
	const end1Min = timeToMinutes(end1)
	const start2Min = timeToMinutes(start2)
	const end2Min = timeToMinutes(end2)

	return (start1Min < end2Min && end1Min > start2Min)
}

// Helper function to check if time is within location's operating hours
const isTimeWithinOperatingHours = (startTime: string, endTime: string, location: Location): boolean => {
	if (!location.openTime || !location.closeTime) return true // No operating hours specified

	const startMin = timeToMinutes(startTime)
	const endMin = timeToMinutes(endTime)
	const openMin = timeToMinutes(location.openTime)
	const closeMin = timeToMinutes(location.closeTime)

	return startMin >= openMin && endMin <= closeMin
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

interface DialogData {
	suggestedTime?: string
	travelInfo?: {
		previousEndTime: string
		duration: number // in seconds
		distance: number // in meters
	}
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
		workshopTicketTypeId: undefined,
		workshopSessionRuleId: undefined,
		preferredStartTime: undefined,
		preferredEndTime: undefined
	})

	// Dialog and workshop states
	const [showWorkshopDialog, setShowWorkshopDialog] = useState(false)
	const [dialogData, setDialogData] = useState<DialogData | null>(null)
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

		// Workshop ID is now handled through locationId - no separate workshopId needed

		// Load available tickets
		setAvailableTickets(workshop.ticketTypes || [])

		// Reset selections
		setSelectedTicketType(null)
		setSelectedSession(null)
		setAvailableSessions([])

		// Calculate travel time and suggested time for dialog
		const prevLocation = getLastLocationOfDay(newLocation.dayOrder)
		if (prevLocation) {
			setLoadingRouteCalculation(true)
			try {
				const fromCoords = getCoordsByLocationId(prevLocation.locationId)
				const toCoords = { lat: location.latitude, lng: location.longitude }

				if (fromCoords && toCoords) {
					const metrics = await fetchRouteMetrics(fromCoords, toCoords)
					if (metrics) {
						const travelTimeMinutes = Math.ceil(metrics.travelTime)
						const suggestedStartTime = calculateSuggestedStartTime(prevLocation.endTime, travelTimeMinutes)

						// Set dialog data for suggested time display
						setDialogData({
							suggestedTime: suggestedStartTime.substring(0, 5), // HH:MM format
							travelInfo: {
								previousEndTime: prevLocation.endTime.substring(0, 5),
								duration: metrics.travelTime * 60, // convert to seconds
								distance: metrics.distance * 1000 // convert to meters
							}
						})

						// Also update the form
						setNewLocation(prev => ({
							...prev,
							travelTimeFromPrev: travelTimeMinutes,
							distanceFromPrev: Math.ceil(metrics.distance),
							startTime: suggestedStartTime
						}))
					}
				}
			} catch (error) {
				console.error("Error calculating travel time for workshop:", error)
			} finally {
				setLoadingRouteCalculation(false)
			}
		} else {
			// No previous location, reset dialog data
			setDialogData(null)
		}

		// Also calculate travel time for craft village locations
		await calculateTravelTime(location)
	}

	// Calculate travel time from previous location and auto-suggest start time
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
					const travelTimeMinutes = Math.ceil(metrics.travelTime)
					const distanceKm = Math.ceil(metrics.distance)

					// Calculate suggested start time: previous end time + travel time
					const suggestedStartTime = calculateSuggestedStartTime(prevLocation.endTime, travelTimeMinutes)

					setNewLocation(prev => ({
						...prev,
						travelTimeFromPrev: travelTimeMinutes,
						distanceFromPrev: distanceKm,
						// Auto-fill suggested start time
						startTime: suggestedStartTime
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

		// All ticket types need to have sessions - load available sessions for any ticket type
		loadAvailableSessionsForTicket(ticket)
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

	// Step 2a.2: Handle session selection with travel time consideration
	const handleSessionSelect = (sessionId: string) => {
		const session = availableSessions.find(s => s.id === sessionId)
		if (!session) return

		setSelectedSession(session)

		// Get previous location to calculate travel time
		const prevLocation = getLastLocationOfDay(newLocation.dayOrder)
		let finalStartTime = session.startTime.substring(0, 5) // HH:MM from session
		let finalEndTime = session.endTime.substring(0, 5)

		// If there's a previous location, suggest start time based on travel time
		if (prevLocation && newLocation.travelTimeFromPrev > 0) {
			const suggestedStartTime = calculateSuggestedStartTime(prevLocation.endTime, newLocation.travelTimeFromPrev)

			// Compare suggested time with session time
			const sessionStartTime = session.startTime.substring(0, 5)

			// If suggested time is later than session start, use suggested time
			// This handles the case where travel time pushes the start time later
			if (suggestedStartTime && suggestedStartTime > sessionStartTime) {
				finalStartTime = suggestedStartTime

				// Calculate session duration to adjust end time
				const sessionStart = session.startTime.substring(0, 5)
				const sessionEnd = session.endTime.substring(0, 5)
				const [startH, startM] = sessionStart.split(':').map(Number)
				const [endH, endM] = sessionEnd.split(':').map(Number)
				const durationMinutes = (endH * 60 + endM) - (startH * 60 + startM)

				// Adjust end time based on new start time and session duration
				finalEndTime = addMinutesToTime(finalStartTime, durationMinutes)
			}
		}

		// Convert to HH:MM:SS format
		const startTimeWithSeconds = finalStartTime.includes(':') ? `${finalStartTime}:00` : finalStartTime
		const endTimeWithSeconds = finalEndTime.includes(':') ? `${finalEndTime}:00` : finalEndTime

		setNewLocation(prev => ({
			...prev,
			startTime: startTimeWithSeconds,
			endTime: endTimeWithSeconds,
			workshopSessionRuleId: sessionId,
			// Send actual workshop time in HH:MM:SS format
			preferredStartTime: startTimeWithSeconds,
			preferredEndTime: endTimeWithSeconds
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

		// All ticket types now require session selection
		if (!selectedSession) {
			setErrors({ workshop: "Vui lòng chọn khung giờ hoạt động" })
			return
		}

		// Automatically set activity type to "Trải nghiệm" (7) when workshop is selected
		setNewLocation(prev => ({
			...prev,
			activityType: 7 // Experience activity type for workshops
		}))

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

		// Check operating hours
		if (newLocation.locationId && newLocation.startTime && newLocation.endTime) {
			const locationData = availableLocations.find(l => l.id === newLocation.locationId)
			if (locationData && !isTimeWithinOperatingHours(newLocation.startTime, newLocation.endTime, locationData)) {
				const openTime = locationData.openTime?.substring(0, 5) || "N/A"
				const closeTime = locationData.closeTime?.substring(0, 5) || "N/A"
				newErrors.operatingHours = `Thời gian hoạt động của địa điểm: ${openTime} - ${closeTime}`
			}
		}

		// Check for time conflicts with existing locations on the same day
		if (newLocation.startTime && newLocation.endTime && newLocation.dayOrder) {
			const existingLocationsOnDay = locations.filter(loc => loc.dayOrder === newLocation.dayOrder)

			for (const existingLocation of existingLocationsOnDay) {
				if (timesOverlap(newLocation.startTime, newLocation.endTime, existingLocation.startTime, existingLocation.endTime)) {
					const conflictLocation = availableLocations.find(l => l.id === existingLocation.locationId)
					newErrors.timeConflict = `Thời gian bị trùng với địa điểm: ${conflictLocation?.name || 'N/A'} (${existingLocation.startTime.substring(0, 5)} - ${existingLocation.endTime.substring(0, 5)})`
					break
				}
			}
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

			const url = `${VIETMAP_ROUTE_ENDPOINT}&apikey=${SeccretKey.VIET_MAP_KEY}&point=${from.lat},${from.lng}&point=${to.lat},${to.lng}&vehicle=car`;

			const response = await axios.get(url)

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

	// Validate locations for time conflicts and operating hours
	const validateLocations = (): { isValid: boolean; errors: Record<string, string> } => {
		const validationErrors: Record<string, string> = {}

		// Check for time conflicts within the same day
		const locationsByDay = locations.reduce((acc, loc) => {
			if (!acc[loc.dayOrder]) acc[loc.dayOrder] = []
			acc[loc.dayOrder].push(loc)
			return acc
		}, {} as Record<number, TourLocationBulkRequest[]>)

		Object.entries(locationsByDay).forEach(([dayOrder, dayLocations]) => {
			// Sort locations by start time for easier conflict detection
			const sortedLocations = dayLocations.sort((a, b) =>
				timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
			)

			// Check for overlapping times
			for (let i = 0; i < sortedLocations.length - 1; i++) {
				const current = sortedLocations[i]
				const next = sortedLocations[i + 1]

				if (timesOverlap(current.startTime, current.endTime, next.startTime, next.endTime)) {
					validationErrors[`conflict_day_${dayOrder}`] =
						`Ngày ${dayOrder}: Thời gian các địa điểm bị trùng lặp. Vui lòng điều chỉnh lại.`
				}
			}
		})

		// Check operating hours
		locations.forEach((loc, index) => {
			const locationData = availableLocations.find(l => l.id === loc.locationId)
			if (locationData && !isTimeWithinOperatingHours(loc.startTime, loc.endTime, locationData)) {
				const openTime = locationData.openTime?.substring(0, 5) || "N/A"
				const closeTime = locationData.closeTime?.substring(0, 5) || "N/A"
				validationErrors[`hours_${index}`] =
					`${locationData.name}: Thời gian hoạt động không phù hợp. Giờ mở cửa: ${openTime} - ${closeTime}`
			}
		})

		return {
			isValid: Object.keys(validationErrors).length === 0,
			errors: validationErrors
		}
	}

	// Submit handler - Create payload matching the required format
	const handleSubmit = () => {
		if (locations.length === 0) {
			setErrors({ submit: "Vui lòng thêm ít nhất một địa điểm" })
			return
		}

		// Validate locations before submitting
		const validation = validateLocations()
		if (!validation.isValid) {
			setErrors(validation.errors)
			return
		}

		// Clear any previous errors
		setErrors({})

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
			// Workshop fields (only if workshop ticket and session are selected)
			...(loc.workshopTicketTypeId && {
				workshopTicketTypeId: loc.workshopTicketTypeId, // ticketId
				workshopSessionRuleId: loc.workshopSessionRuleId, // sessionId
				preferredStartTime: loc.preferredStartTime, // Workshop time in HH:MM:SS format
				preferredEndTime: loc.preferredEndTime      // Workshop time in HH:MM:SS format
			})
		}))

		onSubmit(payload)
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">Thêm địa điểm cho chuyến đi</h2>
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

							{/* Show operating hours when location is selected */}
							{selectedLocation && selectedLocation.openTime && selectedLocation.closeTime && (
								<div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
									<div className="flex items-center gap-2 text-sm text-blue-800">
										<Clock className="h-4 w-4" />
										<span>Giờ hoạt động: {selectedLocation.openTime.substring(0, 5)} - {selectedLocation.closeTime.substring(0, 5)}</span>
									</div>
								</div>
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
						<>
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

							{/* Time validation errors */}
							{errors.time && (
								<p className="text-sm text-destructive">{errors.time}</p>
							)}
							{errors.operatingHours && (
								<p className="text-sm text-destructive">{errors.operatingHours}</p>
							)}
							{errors.timeConflict && (
								<p className="text-sm text-destructive">{errors.timeConflict}</p>
							)}
						</>
					)}

					{/* Auto-suggested Time Information */}
					{/* {newLocation.startTime && newLocation.travelTimeFromPrev > 0 && (
						<div className="p-3 bg-green-50 border border-green-200 rounded-lg">
							<div className="flex items-center gap-2 text-green-800 mb-2">
								<Clock className="h-4 w-4" />
								<span className="font-medium">Thời gian được đề xuất</span>
							</div>
							<div className="text-sm text-green-700">
								<p>🕐 Thời gian bắt đầu được tự động tính từ:</p>
								<p className="ml-4">• Thời gian kết thúc địa điểm trước: {(() => {
									const prevLocation = getLastLocationOfDay(newLocation.dayOrder)
									return prevLocation?.endTime || "N/A"
								})()}</p>
								<p className="ml-4">• + Thời gian di chuyển: {newLocation.travelTimeFromPrev} phút</p>
								<p className="ml-4">• = Thời gian bắt đầu đề xuất: <strong>{newLocation.startTime}</strong></p>
								<p className="text-xs mt-1 text-green-600">💡 Bạn có thể điều chỉnh thời gian này nếu cần</p>
							</div>
						</div>
					)} */}

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
					{(errors.time || errors.submit || errors.operatingHours || errors.timeConflict) && (
						<div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
							<p className="text-sm text-destructive">
								{errors.time || errors.submit || errors.operatingHours || errors.timeConflict}
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
							{selectedLocation?.openTime && selectedLocation?.closeTime && (
								<div className="text-sm text-muted-foreground mt-1">
									⏰ Giờ mở cửa: {selectedLocation.openTime.substring(0, 5)} - {selectedLocation.closeTime.substring(0, 5)}
								</div>
							)}
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

						{/* Session Selection (for all ticket types) */}
						{selectedTicketType && (
							<div>
								<Label>Khung giờ hoạt động *</Label>
								<Select
									value={selectedSession?.id || ""}
									onValueChange={handleSessionSelect}
									disabled={availableSessions.length === 0}
								>
									<SelectTrigger>
										<SelectValue placeholder={availableSessions.length === 0 ? "Không có khung giờ khả dụng cho lịch trình của bạn" : "Chọn khung giờ hoạt động"} />
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

								{/* {availableSessions.length === 0 && (
									<p className="text-sm text-muted-foreground mt-1">
										Không có khung giờ khả dụng cho lịch trình của bạn
									</p>
								)} */}
							</div>
						)}

						{/* Suggested Time Info */}
						{dialogData?.suggestedTime && (
							<div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-3">
								<div className="flex items-center gap-2 text-blue-800 mb-2">
									<Clock className="h-4 w-4" />
									<span className="font-medium">Thời gian được đề xuất</span>
								</div>
								<div className="text-sm text-blue-600">
									<p>🕐 Đề xuất bắt đầu: {dialogData.suggestedTime}</p>
									{dialogData.travelInfo && (
										<p className="mt-1 text-xs opacity-75">
											Dựa trên kết thúc địa điểm trước ({dialogData.travelInfo.previousEndTime}) +
											thời gian di chuyển ({Math.round(dialogData.travelInfo.duration / 60)} phút)
										</p>
									)}
								</div>
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
			{
				locations.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<div className="w-2 h-2 bg-blue-500 rounded-full" />
								Danh sách địa điểm đã thêm ({locations.length} địa điểm)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Accordion type="multiple" className="w-full">
								{(() => {
									// Group locations by dayOrder
									const locationsByDay = locations.reduce((acc, location, originalIndex) => {
										if (!acc[location.dayOrder]) {
											acc[location.dayOrder] = []
										}
										acc[location.dayOrder].push({ ...location, originalIndex })
										return acc
									}, {} as Record<number, Array<TourLocationBulkRequest & { originalIndex: number }>>)

									// Sort days
									const sortedDays = Object.keys(locationsByDay).sort((a, b) => parseInt(a) - parseInt(b))

									return sortedDays.map(dayOrder => {
										const dayNumber = parseInt(dayOrder)
										const dayLocations = locationsByDay[dayNumber].sort((a, b) =>
											timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
										)

										console.log("Day location", dayLocations);

										// Calculate day stats
										const totalTravelTime = dayLocations.reduce((sum, loc) => sum + (loc.travelTimeFromPrev || 0), 0)
										const totalDistance = dayLocations.reduce((sum, loc) => sum + (loc.distanceFromPrev || 0), 0)
										const workshopCount = dayLocations.filter(loc => loc.workshopTicketTypeId).length

										return (
											<AccordionItem key={dayNumber} value={`day-${dayNumber}`}>
												<AccordionTrigger className="hover:no-underline">
													<div className="flex items-center gap-4 w-full">
														<Badge variant="outline" className="bg-blue-50 text-blue-700">
															Ngày {dayNumber}
														</Badge>
														<div className="flex items-center gap-4 text-sm text-gray-600">
															<span className="flex items-center gap-1">
																<MapPin className="w-3 h-3" />
																{dayLocations.length} địa điểm
															</span>
															<span className="flex items-center gap-1">
																<Clock className="w-3 h-3" />
																{dayLocations.length > 0 ? `${dayLocations[0].startTime.substring(0, 5)} - ${dayLocations[dayLocations.length - 1].endTime.substring(0, 5)}` : 'N/A'}
															</span>
															<span className="flex items-center gap-1">
																<Navigation className="w-3 h-3" />
																{totalDistance}km
															</span>
															<span className="flex items-center gap-1">
																🚗
																{totalTravelTime}phút
															</span>
															{workshopCount > 0 && (
																<span className="flex items-center gap-1">
																	<Wrench className="w-3 h-3" />
																	{workshopCount} workshop
																</span>
															)}
														</div>
													</div>
												</AccordionTrigger>
												<AccordionContent>
													{dayLocations.length === 0 ? (
														<p className="text-gray-500 text-sm py-4">Chưa có hoạt động nào cho ngày này</p>
													) : (
														<div className="space-y-4">
															{dayLocations.map((location) => {
																const locationData = availableLocations.find(loc => loc.id === location.locationId)
																const activityType = ACTIVITY_TYPES.find(type => type.value === location.activityType)

																return (
																	<div key={location.originalIndex} className="border rounded-lg p-4 bg-gray-50">
																		<div className="flex items-start justify-between">
																			<div className="flex-1">
																				<div className="flex items-center gap-2 mb-2">
																					<div className="flex items-center gap-2">
																						{/* <Badge className={`text-xs ${getActivityColor(location?.activityType)}`}>
																						{getActivityIcon(location.activityType)}
																						<span className="ml-1">{activityType?.label}</span>
																					</Badge> */}
																						{location.workshopTicketTypeId && (
																							<Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
																								🏭 Workshop
																							</Badge>
																						)}
																					</div>
																					<h4 className="font-semibold">{locationData?.name || 'Unknown Location'}</h4>
																					<Badge variant="outline" className="text-xs">
																						<Clock className="w-3 h-3 mr-1" />
																						{location.startTime.substring(0, 5)} - {location.endTime.substring(0, 5)}
																					</Badge>
																				</div>

																				<p className="text-sm text-gray-500 mb-2">📍 {locationData?.address || 'Chưa có địa chỉ'}</p>

																				{location.notes && (
																					<p className="text-sm text-blue-600 italic mb-2">💡 {location.notes}</p>
																				)}

																				{/* Workshop Information */}
																				{location.workshopTicketTypeId && (
																					<div className="p-2 bg-purple-50 border border-purple-200 rounded-lg mb-2">
																						<div className="text-sm space-y-1">
																							{location.workshopTicketTypeId && (
																								<p><span className="text-purple-600 font-medium">Loại vé:</span> {availableLocations.find(loc => loc.id === location.locationId)?.craftVillage?.workshop?.ticketTypes?.find(t => t.id === location.workshopTicketTypeId)?.name}</p>
																							)}
																							{location.preferredStartTime && (
																								<p><span className="text-purple-600 font-medium">Thời gian workshop:</span> {location.preferredStartTime.substring(0, 5)} - {location.preferredEndTime?.substring(0, 5)}</p>
																							)}
																						</div>
																					</div>
																				)}

																				<div className="flex gap-4 text-xs text-gray-500">
																					{location.travelTimeFromPrev > 0 && (
																						<span className="flex items-center gap-1">
																							🚗
																							Di chuyển: {location.travelTimeFromPrev} phút
																						</span>
																					)}
																					{location.distanceFromPrev > 0 && (
																						<span className="flex items-center gap-1">
																							<Navigation className="w-3 h-3" />
																							Khoảng cách: {location.distanceFromPrev} km
																						</span>
																					)}
																				</div>
																			</div>

																			<div className="flex items-center gap-2 ml-4">
																				<div className="flex flex-col gap-1">
																					<Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleRemoveLocation(location.originalIndex)}>
																						<Trash2 className="w-4 h-4" />
																					</Button>
																				</div>
																			</div>
																		</div>
																	</div>
																)
															})}
														</div>
													)}
												</AccordionContent>
											</AccordionItem>
										)
									})
								})()}
							</Accordion>
						</CardContent>
					</Card>
				)
			}

			{/* Global Validation Errors */}
			{
				Object.entries(errors).some(([key, _]) => key.startsWith('conflict_') || key.startsWith('hours_')) && (
					<Card className="border-destructive/20">
						<CardHeader>
							<CardTitle className="text-destructive">Lỗi validation</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								{Object.entries(errors).map(([key, message]) => {
									if (key.startsWith('conflict_') || key.startsWith('hours_')) {
										return (
											<div key={key} className="flex items-start gap-2">
												<div className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
												<p className="text-sm text-destructive">{message}</p>
											</div>
										)
									}
									return null
								})}
							</div>
						</CardContent>
					</Card>
				)
			}

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
		</div >
	)
}
