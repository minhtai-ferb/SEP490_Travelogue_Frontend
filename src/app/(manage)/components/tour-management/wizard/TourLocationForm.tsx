"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useLocationController } from "@/services/location-controller"
import type { Location, TourLocationBulkRequest, WorkshopSession } from "@/types/Tour"
import axios from "axios"
import { SeccretKey } from "@/secret/secret"
import {
	AlertTriangle,
	ArrowLeft,
	ArrowRight,
	Calendar,
	CheckCircle,
	Clock,
	Loader2,
	MapPin,
	Plus,
	Trash2
} from "lucide-react"
import { useEffect, useState } from "react"
import { LocationSelect } from "./LocationSelect"
import { SimpleSessionSelector } from "@/components/workshop/SimpleSessionSelector"

const VIETMAP_ROUTE_ENDPOINT = "https://maps.vietmap.vn/api/route"

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
	const [locations, setLocations] = useState<TourLocationBulkRequest[]>([])
	const [availableLocations, setAvailableLocations] = useState<Location[]>([])
	const [loadingLocations, setLoadingLocations] = useState(true)
	const [searchTerm, setSearchTerm] = useState("")
	const [newLocation, setNewLocation] = useState<TourLocationBulkRequest>({
		locationId: "",
		dayOrder: 1,
		startTime: "",
		endTime: "",
		notes: "",
		travelTimeFromPrev: 0,
		distanceFromPrev: 0,
		estimatedStartTime: 0,
		estimatedEndTime: 0,
		workshopData: undefined
	})
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
	const [showWorkshopSelector, setShowWorkshopSelector] = useState(false)
	const [selectedSession, setSelectedSession] = useState<WorkshopSession | null>(null)
	const [loadingLocationDetail, setLoadingLocationDetail] = useState(false)
	const [loadingRouteCalculation, setLoadingRouteCalculation] = useState(false)

	// ticket state
	const [availableTickets, setAvailableTickets] = useState<any[]>([])
	const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)

	// Helper function to get default time from workshop
	const getDefaultWorkshopTimes = (location: Location | null): { startTime: string; endTime: string } => {
		const rules = location?.craftVillage?.workshop?.recurringRules
		if (!rules || !Array.isArray(rules) || rules.length === 0) {
			return { startTime: "", endTime: "" }
		}

		const firstRule = rules[0]
		const sessions = firstRule.sessions
		if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
			return { startTime: "", endTime: "" }
		}

		const firstSession = sessions[0]
		return {
			startTime: firstSession.startTime.substring(0, 5), // Lấy HH:MM
			endTime: firstSession.endTime.substring(0, 5)
		}
	}

	const { getAllLocation, getLocationById } = useLocationController()

	// Helper functions for conflict detection
	const getExistingLocationsForConflictCheck = () => {
		return locations.map(loc => ({
			startTime: loc.startTime,
			endTime: loc.endTime,
			locationId: loc.locationId,
			dayNumber: loc.dayOrder
		}))
	}

	const getDayNumberForNewLocation = () => {
		return newLocation.dayOrder || 1
	}

	const getLocationDetail = async (locationId: string) => {
		try {
			setLoadingLocationDetail(true)
			const location = await getLocationById(locationId)
			setSelectedLocation(location)

			// if workshop: populate tickets and default times
			if (location?.craftVillage?.workshop) {
				const tickets = location.craftVillage.workshop.ticketTypes ?? []
				setAvailableTickets(tickets)

				// Set default times from first session if available
				const rules = location.craftVillage.workshop.recurringRules
				if (rules && rules.length > 0 && rules[0].sessions?.length > 0) {
					const firstSession = rules[0].sessions[0]
					const defaultStartTime = firstSession.startTime.substring(0, 5)
					const defaultEndTime = firstSession.endTime.substring(0, 5)

					setNewLocation(prev => ({
						...prev,
						startTime: defaultStartTime,
						endTime: defaultEndTime
					}))
				}
			}
		} catch (error) {
			console.error("Error fetching location:", error)
			setSelectedLocation(null)
			setAvailableTickets([])
		} finally {
			setLoadingLocationDetail(false)
		}
	}

	// Calculate travel time using Vietmap API and auto-fill location data
	const calculateTravelTimeAndAutoFill = async (location: Location | null, locationId: string) => {
		if (!location) return

		const prevLocation = getLastLocationOfDay(newLocation.dayOrder)

		setNewLocation(prev => ({
			...prev,
			locationId,
			workshopData: undefined // Reset workshop data when changing location
		}))

		if (!prevLocation) {
			// First location of the day - no travel time needed
			return
		}

		// We need to get the actual Location object from prevLocation.locationId
		const prevLocationDetail = availableLocations.find(loc => loc.id === prevLocation.locationId)

		if (!prevLocationDetail) {
			return
		}

		try {
			setLoadingRouteCalculation(true)

			const response = await axios.post(VIETMAP_ROUTE_ENDPOINT, {
				point: [
					`${prevLocationDetail.latitude || 0},${prevLocationDetail.longitude || 0}`,
					`${location.latitude || 0},${location.longitude || 0}`
				]
			}, {
				headers: {
					'api-key': SeccretKey.VIET_MAP_KEY
				}
			})

			if (response.data && response.data.paths && response.data.paths.length > 0) {
				const path = response.data.paths[0]
				const distanceMeters = path.distance || 0
				const durationSeconds = path.time || 0

				// Convert to appropriate units
				const distanceKm = Math.round((distanceMeters / 1000) * 100) / 100 // Round to 2 decimals
				const travelTimeMinutes = Math.ceil(durationSeconds / 60) // Round up to next minute

				// Update location with calculated travel data
				setNewLocation(prev => ({
					...prev,
					travelTimeFromPrev: travelTimeMinutes,
					distanceFromPrev: distanceKm
				}))

				// Note: Auto-fill will be handled by useEffect when travelTimeFromPrev changes
			} else {
				throw new Error("No paths found")
			}
		} catch (error) {
			console.error("Error calculating travel time:", error)
			// Fallback: assume reasonable travel time based on typical city travel
			const fallbackTravelTime = 30 // Default 30 minutes for fallback

			setNewLocation(prev => ({
				...prev,
				travelTimeFromPrev: fallbackTravelTime,
				distanceFromPrev: 10
			}))

			// Note: Auto-fill will be handled by useEffect when travelTimeFromPrev changes
		} finally {
			setLoadingRouteCalculation(false)
		}
	}

	// Handle location selection and auto-calculate travel time + auto-fill times
	const handleLocationSelect = async (locationId: string) => {
		const location = availableLocations.find(loc => loc.id === locationId)
		setSelectedLocation(location || null)

		// Reset workshop-related states
		setSelectedTicketId(null)
		setSelectedSession(null)

		// Calculate travel time from previous location
		await calculateTravelTimeAndAutoFill(location || null, locationId)

		getLocationDetail(locationId)

		// Check if location has workshop
		if (location?.craftVillage?.workshopsAvailable && location.craftVillage.workshop) {
			setShowWorkshopSelector(true)
		} else {
			setShowWorkshopSelector(false)
			setAvailableTickets([])
			// Times are auto-filled in calculateTravelTimeAndAutoFill for non-workshop locations
		}
	}

	// Handle session selection - auto-fill start/end times based on travel time
	const handleSessionSelect = (session: WorkshopSession | null) => {
		setSelectedSession(session)

		if (!session) {
			// Clear times when session is cleared
			setNewLocation(prev => ({
				...prev,
				startTime: "",
				endTime: "",
				workshopData: {
					sessionId: "",
					ticketTypeId: selectedTicketId || ""
				}
			}))
			return
		}

		// Get selected ticket for duration calculation
		const selectedTicket = availableTickets.find(t => t.id === selectedTicketId)
		const ticketDuration = selectedTicket?.durationMinutes

		// Auto-fill times based on previous location + travel time
		autoFillStartTimeBasedOnTravelTime(ticketDuration, newLocation.travelTimeFromPrev)

		// Update workshop data
		setNewLocation(prev => ({
			...prev,
			workshopData: {
				sessionId: session.id,
				ticketTypeId: selectedTicketId || ""
			}
		}))

		// Clear any time-related errors when session is selected
		setErrors(prev => {
			const newErrors = { ...prev }
			delete newErrors.startTime
			delete newErrors.endTime
			return newErrors
		})
	}

	// Handle ticket selection
	const handleTicketSelect = (ticketId: string) => {
		setSelectedTicketId(ticketId)
		setSelectedSession(null) // Clear session when ticket changes

		// Find selected ticket for duration
		const selectedTicket = availableTickets.find(t => t.id === ticketId)

		// Auto-fill times based on previous location + travel time + ticket duration
		if (selectedTicket) {
			autoFillStartTimeBasedOnTravelTime(selectedTicket.durationMinutes, newLocation.travelTimeFromPrev)
		}

		// Clear any time-related values when ticket changes
		setNewLocation(prev => ({
			...prev,
			workshopData: {
				sessionId: "",
				ticketTypeId: ticketId
			}
		}))
	}


	// NEW helper: convert "HH:MM" or "HH:MM:SS" to minutes since midnight
	const timeStringToMinutes = (t: string) => {
		if (!t) return 0
		const parts = t.split(":").map(Number)
		const h = parts[0] ?? 0
		const m = parts[1] ?? 0
		const s = parts[2] ?? 0
		return h * 60 + m + Math.floor(s / 60)
	}
	// minutes -> "HH:MM" (24h)
	const minutesToTimeString = (mins: number) => {
		const m = ((mins % (24 * 60)) + (24 * 60)) % (24 * 60)
		const h = Math.floor(m / 60)
		const mm = m % 60
		const hh = String(h).padStart(2, "0")
		const mms = String(mm).padStart(2, "0")
		return `${hh}:${mms}`
	}

	// Compute earliest arrival B as "HH:MM" string based on prev endTime + travelTimeFromPrev
	const computeEarliestArrivalForNew = (currentTravelTime?: number) => {
		const prev = getLastLocationOfDay(newLocation.dayOrder)
		if (!prev) return ""

		// Get previous location's end time (should be "HH:MM" format)
		const prevEndTime = prev.endTime || "00:00"

		// Convert previous end time to minutes
		const prevEndMins = timeStringToMinutes(prevEndTime)

		// Get travel time in minutes
		const travelTime = currentTravelTime ?? newLocation.travelTimeFromPrev ?? 0

		// Calculate arrival time = previous end time + travel time
		const arrivalMins = prevEndMins + travelTime

		const arrivalTime = minutesToTimeString(arrivalMins)

		return arrivalTime
	}

	// Auto-calculate and fill start time based on previous location + travel time
	const autoFillStartTimeBasedOnTravelTime = (selectedTicketDuration?: number, travelTimeFromPrev?: number) => {
		const earliestArrivalTime = computeEarliestArrivalForNew(travelTimeFromPrev)

		if (!earliestArrivalTime) {
			// First location of the day - use default times or current time
			const defaultTimes = getDefaultWorkshopTimes(selectedLocation)
			if (defaultTimes.startTime) {
				setNewLocation(prev => ({
					...prev,
					startTime: defaultTimes.startTime,
					endTime: defaultTimes.endTime
				}))
			}
			return
		}

		// For subsequent locations: startTime = previousEndTime + travelTime
		const startTime = earliestArrivalTime
		let endTime = startTime

		// If we have ticket duration, calculate end time
		if (selectedTicketDuration) {
			const startMinutes = timeStringToMinutes(startTime)
			const endMinutes = startMinutes + selectedTicketDuration
			endTime = minutesToTimeString(endMinutes)
		} else if (selectedLocation) {
			// Fallback to workshop default duration
			const defaultTimes = getDefaultWorkshopTimes(selectedLocation)
			if (defaultTimes.endTime) {
				const startMinutes = timeStringToMinutes(startTime)
				const defaultStartMinutes = timeStringToMinutes(defaultTimes.startTime)
				const defaultEndMinutes = timeStringToMinutes(defaultTimes.endTime)
				const defaultDuration = defaultEndMinutes - defaultStartMinutes
				const endMinutes = startMinutes + defaultDuration
				endTime = minutesToTimeString(endMinutes)
			}
		}

		setNewLocation(prev => ({
			...prev,
			startTime,
			endTime
		}))

		// Clear time-related errors
		setErrors(prev => {
			const newErrors = { ...prev }
			delete newErrors.startTime
			delete newErrors.endTime
			return newErrors
		})
	}

	useEffect(() => {
		const fetchLocations = async () => {
			try {
				setLoadingLocations(true)
				const response = await getAllLocation()
				if (response) {
					setAvailableLocations(response)
				}
			} catch (error) {
				console.error("Error fetching locations:", error)
			} finally {
				setLoadingLocations(false)
			}
		}

		fetchLocations()
	}, [getAllLocation])


	// Hydrate with initial data when provided (preserves state across wizard navigation)
	useEffect(() => {
		if (initialData && initialData.length > 0) {
			setLocations(initialData)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialData])

	// Auto-fill times when travel time changes (after API calculation)
	useEffect(() => {
		if (newLocation.locationId && newLocation.travelTimeFromPrev > 0 && !showWorkshopSelector) {
			autoFillStartTimeBasedOnTravelTime(undefined, newLocation.travelTimeFromPrev)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [newLocation.travelTimeFromPrev, newLocation.locationId, showWorkshopSelector])

	const validateNewLocation = () => {
		const newErrors: Record<string, string> = {}

		if (!newLocation.locationId) {
			newErrors.locationId = "Địa điểm là bắt buộc"
		}

		if (!newLocation.startTime) {
			newErrors.startTime = "Thời gian bắt đầu là bắt buộc"
		}

		if (!newLocation.endTime) {
			newErrors.endTime = "Thời gian kết thúc là bắt buộc"
		}

		if (newLocation.startTime && newLocation.endTime) {
			if (newLocation.startTime >= newLocation.endTime) {
				newErrors.endTime = "Thời gian kết thúc phải sau thời gian bắt đầu"
			}
		}

		if (newLocation.dayOrder < 1 || newLocation.dayOrder > tourDays) {
			newErrors.dayOrder = `Ngày phải từ 1 đến ${tourDays}`
		}

		if (newLocation.travelTimeFromPrev < 0) {
			newErrors.travelTimeFromPrev = "Thời gian di chuyển không được âm"
		}

		if (newLocation.distanceFromPrev < 0) {
			newErrors.distanceFromPrev = "Khoảng cách không được âm"
		}

		// Check for time conflicts on the same day
		const sameDay = locations.filter((loc) => loc.dayOrder === newLocation.dayOrder)
		const hasTimeConflict = sameDay.some((loc) => {
			const existingStart = loc.startTime
			const existingEnd = loc.endTime
			const newStart = newLocation.startTime
			const newEnd = newLocation.endTime

			return (
				(newStart >= existingStart && newStart < existingEnd) ||
				(newEnd > existingStart && newEnd <= existingEnd) ||
				(newStart <= existingStart && newEnd >= existingEnd)
			)
		})

		if (hasTimeConflict) {
			newErrors.startTime = "Thời gian bị trùng với địa điểm khác trong cùng ngày"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	// Helper: get last added location for a specific day
	const getLastLocationOfDay = (day: number) => {
		const sameDay = locations.filter((loc) => loc.dayOrder === day)
		return sameDay.length > 0 ? sameDay[sameDay.length - 1] : null
	}

	// Helper: get coords by locationId from availableLocations
	const getCoordsByLocationId = (id: string) => {
		const loc = availableLocations.find((l) => l.id === id)
		if (!loc) return null
		return { latitude: loc.latitude, longitude: loc.longitude }
	}

	const fetchRouteMetrics = async (
		from: { latitude: number; longitude: number },
		to: { latitude: number; longitude: number },
	): Promise<{ distanceKm: number; durationMin: number } | null> => {
		try {
			const params = new URLSearchParams({
				"api-version": "1.1",
				apikey: String(SeccretKey.VIET_MAP_KEY ?? ""),
				points_encoded: "false",
				vehicle: "car",
				point: `${from.latitude},${from.longitude}`,
			})
			// Note: duplicate 'point' for destination
			const url = `${VIETMAP_ROUTE_ENDPOINT}?${params.toString()}&point=${to.latitude},${to.longitude}`
			const res = await axios.get(url)
			const path = res?.data?.paths?.[0]
			if (!path) return null
			const distanceMeters = Number(path.distance ?? 0)
			const timeMs = Number(path.time ?? 0)
			return {
				distanceKm: Math.round(distanceMeters / 1000),
				durationMin: Math.round(timeMs / 60000),
			}
		} catch (err) {
			console.error("Failed to fetch Vietmap route:", err)
			return null
		}
	}

	// Auto-compute distance/time when a previous location exists for the same day
	useEffect(() => {
		const compute = async () => {
			if (!newLocation.locationId) return
			const prev = getLastLocationOfDay(newLocation.dayOrder)
			if (!prev) {
				// first location of the day → zeroes
				setNewLocation((p) => ({ ...p, travelTimeFromPrev: 0, distanceFromPrev: 0 }))
				return
			}
			const fromCoords = getCoordsByLocationId(prev.locationId)
			const toCoords = getCoordsByLocationId(newLocation.locationId)
			if (!fromCoords || !toCoords) return

			setLoadingRouteCalculation(true)
			try {
				const metrics = await fetchRouteMetrics(fromCoords, toCoords)
				if (metrics) {
					setNewLocation((p) => ({
						...p,
						distanceFromPrev: metrics.distanceKm,
						travelTimeFromPrev: metrics.durationMin,
					}))
				}
			} catch (error) {
				console.error("Error calculating route:", error)
			} finally {
				setLoadingRouteCalculation(false)
			}
		}
		compute().catch((e) => console.error(e))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [newLocation.locationId, newLocation.dayOrder])

	const handleAddLocation = async () => {
		if (!validateNewLocation()) return
		// Prepare item with current, possibly auto-computed values
		const itemToAdd: TourLocationBulkRequest = {
			...newLocation,
			startTime: normalizeTimeString(newLocation.startTime),
			endTime: normalizeTimeString(newLocation.endTime),
			estimatedStartTime: toSecondsSinceMidnight(newLocation.startTime),
			estimatedEndTime: toSecondsSinceMidnight(newLocation.endTime),
		}
		const prev = getLastLocationOfDay(itemToAdd.dayOrder)
		if (!prev) {
			itemToAdd.travelTimeFromPrev = 0
			itemToAdd.distanceFromPrev = 0
		} else if (itemToAdd.distanceFromPrev === 0 && itemToAdd.travelTimeFromPrev === 0) {
			// If inputs haven’t auto-computed yet, compute now
			const fromCoords = getCoordsByLocationId(prev.locationId)
			const toCoords = getCoordsByLocationId(itemToAdd.locationId)
			if (fromCoords && toCoords) {
				const metrics = await fetchRouteMetrics(fromCoords, toCoords)
				if (metrics) {
					itemToAdd.distanceFromPrev = metrics.distanceKm
					itemToAdd.travelTimeFromPrev = metrics.durationMin
				}
			}
		}

		setLocations((list) => [...list, itemToAdd])
		// Reset form
		setNewLocation({
			locationId: "",
			dayOrder: itemToAdd.dayOrder,
			startTime: "",
			endTime: "",
			notes: "",
			travelTimeFromPrev: 0,
			distanceFromPrev: 0,
			estimatedStartTime: 0,
			estimatedEndTime: 0,
			workshopData: undefined
		})
		setSelectedLocation(null)
		setSelectedSession(null)
		setShowWorkshopSelector(false)
		setErrors({})
	}

	const handleRemoveLocation = (index: number) => {
		setLocations(locations.filter((_, i) => i !== index))
	}

	const handleSubmit = () => {
		if (locations.length === 0) {
			setErrors({ general: "Vui lòng thêm ít nhất một địa điểm" })
			return
		}
		const payload = locations.map((loc) => ({
			...loc,
			startTime: normalizeTimeString(loc.startTime),
			endTime: normalizeTimeString(loc.endTime),
			estimatedStartTime:
				typeof loc.estimatedStartTime === "number" && loc.estimatedStartTime > 0
					? loc.estimatedStartTime
					: toSecondsSinceMidnight(loc.startTime),
			estimatedEndTime:
				typeof loc.estimatedEndTime === "number" && loc.estimatedEndTime > 0
					? loc.estimatedEndTime
					: toSecondsSinceMidnight(loc.endTime),
		}))
		onSubmit(payload)
	}

	const getLocationsByDay = (day: number) => {
		return locations.filter((loc) => loc.dayOrder === day)
	}

	const getDayArray = () => {
		return Array.from({ length: tourDays }, (_, i) => i + 1)
	}

	const getLocationName = (locationId: string) => {
		const location = availableLocations.find((loc) => loc.id === locationId)
		return location?.name || "Unknown Location"
	}

	const getLocationDetails = (locationId: string) => {
		return availableLocations.find((loc) => loc.id === locationId)
	}

	const filteredLocations = availableLocations.filter(
		(location) =>
			location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
			location.category.toLowerCase().includes(searchTerm.toLowerCase()),
	)

	const formatTime = (time: string) => {
		return time.substring(0, 5) // HH:MM format
	}

	const calculateDuration = (startTime: string, endTime: string) => {
		if (!startTime || !endTime) return ""

		const start = new Date(`2000-01-01T${startTime}`)
		const end = new Date(`2000-01-01T${endTime}`)
		const diffMs = end.getTime() - start.getTime()
		const diffMins = Math.floor(diffMs / 60000)

		if (diffMins < 60) {
			return `${diffMins} phút`
		} else {
			const hours = Math.floor(diffMins / 60)
			const mins = diffMins % 60
			return `${hours}h${mins > 0 ? ` ${mins}m` : ""}`
		}
	}

	// Helpers to format time fields for API
	const normalizeTimeString = (time: string): string => {
		if (!time) return "00:00:00"
		const parts = time.split(":")
		if (parts.length === 2) return `${time}:00`
		return time
	}

	const toSecondsSinceMidnight = (time: string): number => {
		const [h, m, s] = normalizeTimeString(time).split(":").map((v) => Number.parseInt(v, 10) || 0)
		return h * 3600 + m * 60 + s
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="text-center">
				<h2 className="text-2xl font-bold">Địa Điểm Của chuyến đi</h2>
				<p className="text-gray-600 mt-2">Thêm các địa điểm tham quan cho chuyến đi {tourDays} ngày</p>
			</div>

			{/* Add New Location */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Plus className="w-5 h-5" />
						Thêm Địa Điểm Mới
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label className="flex items-center gap-2">
								<MapPin className="w-4 h-4" />
								Chọn Địa Điểm <span className="text-red-500">*</span>
							</Label>
							<LocationSelect
								locations={filteredLocations}
								value={newLocation.locationId}
								onChange={handleLocationSelect}
								placeholder={loadingLocations ? "Đang tải..." : "Chọn địa điểm"}
								disabled={isLoading || loadingLocations}
								error={errors.locationId}
							/>
						</div>

						<div className="space-y-2">
							<Label className="flex items-center gap-2">
								<Calendar className="w-4 h-4" />
								Ngày Thứ <span className="text-red-500">*</span>
							</Label>
							<Select
								value={newLocation.dayOrder.toString()}
								onValueChange={(value) => setNewLocation({ ...newLocation, dayOrder: Number.parseInt(value) })}
								disabled={isLoading}
							>
								<SelectTrigger className={errors.dayOrder ? "border-red-500" : ""}>
									<SelectValue placeholder="Chọn ngày" />
								</SelectTrigger>
								<SelectContent>
									{getDayArray().map((day) => (
										<SelectItem key={day} value={day.toString()}>
											Ngày {day}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.dayOrder && <p className="text-sm text-red-500">{errors.dayOrder}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="startTime" className="flex items-center gap-2">
								<Clock className="w-4 h-4" />
								Thời Gian Bắt Đầu <span className="text-red-500">*</span>
							</Label>
							<Input
								id="startTime"
								type="time"
								value={newLocation.startTime}
								onChange={(e) => setNewLocation({ ...newLocation, startTime: e.target.value })}
								className={errors.startTime ? "border-red-500" : ""}
								disabled={isLoading}
							/>
							{errors.startTime && <p className="text-sm text-red-500">{errors.startTime}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="endTime" className="flex items-center gap-2">
								<Clock className="w-4 h-4" />
								Thời Gian Kết Thúc <span className="text-red-500">*</span>
							</Label>
							<Input
								id="endTime"
								type="time"
								value={newLocation.endTime}
								onChange={(e) => setNewLocation({ ...newLocation, endTime: e.target.value })}
								className={errors.endTime ? "border-red-500" : ""}
								disabled={isLoading}
							/>
							{errors.endTime && <p className="text-sm text-red-500">{errors.endTime}</p>}

							{newLocation.startTime && newLocation.endTime && (
								<div className="space-y-1">
									<p className="text-xs text-blue-600">
										Thời gian: {calculateDuration(newLocation.startTime, newLocation.endTime)}
									</p>
									{selectedSession && (
										<p className="text-xs text-purple-600 flex items-center gap-1">
											<span>🏭</span>
											Đã chọn session làng nghề: {selectedSession.startTime.substring(0, 5)} - {selectedSession.endTime.substring(0, 5)}
										</p>
									)}
								</div>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="travelTimeFromPrev" className="flex items-center gap-2">
								{loadingRouteCalculation && <Loader2 className="w-4 h-4 animate-spin" />}
								Thời Gian Di Chuyển (phút) <span className="text-red-500">*</span>
							</Label>
							<Input
								id="travelTimeFromPrev"
								type="number"
								min="0"
								placeholder={loadingRouteCalculation ? "Đang tính toán..." : "0"}
								value={newLocation.travelTimeFromPrev}
								onChange={(e) => {
									const newTravelTime = Number.parseInt(e.target.value) || 0
									setNewLocation({ ...newLocation, travelTimeFromPrev: newTravelTime })

									// Note: Auto-fill will be handled by useEffect when travelTimeFromPrev changes
								}}
								className={errors.travelTimeFromPrev ? "border-red-500" : ""}
								disabled={loadingRouteCalculation} // Only disable when calculating
							/>
							{errors.travelTimeFromPrev && <p className="text-sm text-red-500">{errors.travelTimeFromPrev}</p>}
							{loadingRouteCalculation && (
								<p className="text-xs text-blue-600">Đang tính toán thời gian di chuyển...</p>
							)}
							{/* Auto-fill info */}
							{newLocation.travelTimeFromPrev > 0 && (
								<p className="text-xs text-green-600">
									Thời gian bắt đầu sẽ được tự động điền
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="distanceFromPrev" className="flex items-center gap-2">
								{loadingRouteCalculation && <Loader2 className="w-4 h-4 animate-spin" />}
								Khoảng Cách (km)
							</Label>
							<Input
								id="distanceFromPrev"
								type="number"
								disabled={true}
								min="0"
								placeholder={loadingRouteCalculation ? "Đang tính toán..." : "0"}
								value={newLocation.distanceFromPrev}
								onChange={(e) =>
									setNewLocation({ ...newLocation, distanceFromPrev: Number.parseInt(e.target.value) || 0 })
								}
								className={errors.distanceFromPrev ? "border-red-500" : ""}
							/>
							{errors.distanceFromPrev && <p className="text-sm text-red-500">{errors.distanceFromPrev}</p>}
							{loadingRouteCalculation && (
								<p className="text-xs text-blue-600">Đang tính toán khoảng cách...</p>
							)}
						</div>

						<div className="md:col-span-2 space-y-2">
							<Label htmlFor="notes">Ghi Chú</Label>
							<Textarea
								id="notes"
								placeholder="Nhập ghi chú về địa điểm (tùy chọn)"
								value={newLocation.notes}
								onChange={(e) => setNewLocation({ ...newLocation, notes: e.target.value })}
								rows={3}
								disabled={isLoading}
							/>
						</div>
					</div>

					{/* Location Preview */}
					{newLocation.locationId && (
						<div className="mt-4 p-4 bg-blue-50 rounded-lg">
							<h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
								{loadingLocationDetail && <Loader2 className="w-4 h-4 animate-spin" />}
								Xem Trước Địa Điểm
							</h4>
							{loadingLocationDetail ? (
								<div className="flex items-center gap-2 text-blue-800">
									<Loader2 className="w-4 h-4 animate-spin" />
									<span>Đang tải thông tin địa điểm...</span>
								</div>
							) : selectedLocation ? (
								<div className="space-y-2 text-sm text-blue-800">
									<p><strong>Tên:</strong> {selectedLocation.name}</p>
									<p><strong>Địa chỉ:</strong> {selectedLocation.address}</p>
									<p><strong>Loại:</strong> {selectedLocation.category}</p>
									<p><strong>Mô tả:</strong> {selectedLocation.description}</p>
									{selectedLocation.openTime && selectedLocation.closeTime && (
										<p>
											<strong>Giờ mở cửa:</strong> {formatTime(selectedLocation.openTime)} -{" "}
											{formatTime(selectedLocation.closeTime)}
										</p>
									)}
									{selectedLocation.craftVillage?.workshopsAvailable && (
										<div className="space-y-2">
											<div className="flex items-center gap-2 text-purple-600">
												<span className="text-purple-500">🏭</span>
												<strong>Có trải nghiệm làng nghề</strong>
											</div>
											{selectedTicketId && selectedLocation.craftVillage?.workshop?.ticketTypes && (
												<div className="text-purple-700">
													<p><strong>Vé đã chọn:</strong> {
														selectedLocation.craftVillage.workshop.ticketTypes.find(t => t.id === selectedTicketId)?.name
													}</p>
												</div>
											)}
											{selectedSession && (
												<div className="text-purple-700">
													<p><strong>Khung giờ đã chọn:</strong> {formatTime(selectedSession.startTime)} - {formatTime(selectedSession.endTime)}</p>
												</div>
											)}
										</div>
									)}
								</div>
							) : (
								<div className="text-red-600 text-sm">
									Không thể tải thông tin địa điểm. Vui lòng thử lại.
								</div>
							)}
						</div>
					)}

					{/* Session Selector for Workshop Locations */}
					{showWorkshopSelector && selectedLocation?.craftVillage?.workshop && (
						<div className="mt-4 space-y-3">
							<div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
								<div className="flex items-start gap-2">
									<span className="text-purple-500 text-lg">🏭</span>
									<div className="flex-1">
										<h4 className="font-medium text-purple-900 mb-1">Địa điểm có trải nghiệm làng nghề</h4>
										<p className="text-sm text-purple-700">
											Vui lòng chọn một khung giờ phù hợp bên dưới. Thời gian bắt đầu và kết thúc sẽ được tự động điền.
										</p>
									</div>
								</div>
							</div>
							<SimpleSessionSelector
								workshop={selectedLocation.craftVillage.workshop}
								selectedSession={selectedSession}
								selectedTicketId={selectedTicketId}
								onSessionSelect={handleSessionSelect}
								onTicketSelect={handleTicketSelect}
								earliestArrival={computeEarliestArrivalForNew(newLocation.travelTimeFromPrev)}
								isLoading={isLoading || loadingLocationDetail}
								existingTourLocations={getExistingLocationsForConflictCheck()}
								currentDayNumber={getDayNumberForNewLocation()}
							/>
						</div>
					)}

					<div className="flex justify-end mt-4">
						<Button onClick={handleAddLocation} className="flex items-center gap-2" disabled={isLoading}>
							<Plus className="w-4 h-4" />
							{showWorkshopSelector ? "Lưu lịch" : "Thêm Địa Điểm"}
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Locations by Day */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<span>Lịch Trình Theo Ngày ({locations.length} địa điểm)</span>
						{locations.length > 0 && (
							<Badge variant="secondary" className="bg-green-100 text-green-800">
								{locations.length} địa điểm
							</Badge>
						)}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{locations.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							<MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
							<p>Chưa có địa điểm nào</p>
							<p className="text-sm">Vui lòng thêm ít nhất một địa điểm để tiếp tục</p>
						</div>
					) : (
						<Accordion type="multiple" className="w-full">
							{getDayArray().map((day) => {
								const dayLocations = getLocationsByDay(day).sort((a, b) => a.startTime.localeCompare(b.startTime))
								return (
									<AccordionItem key={day} value={`day-${day}`}>
										<AccordionTrigger className="hover:no-underline">
											<div className="flex items-center gap-3">
												<Badge variant="outline" className="bg-blue-50 text-blue-700">
													Ngày {day}
												</Badge>
												<span className="text-sm text-gray-600">{dayLocations.length} địa điểm</span>
												{dayLocations.length > 0 && <CheckCircle className="w-4 h-4 text-green-500" />}
											</div>
										</AccordionTrigger>
										<AccordionContent>
											{dayLocations.length === 0 ? (
												<p className="text-gray-500 text-sm py-4">Chưa có địa điểm nào cho ngày này</p>
											) : (
												<div className="space-y-3">
													{dayLocations.map((location, index) => {
														const globalIndex = locations.findIndex((loc) => loc === location)
														const locationDetails = getLocationDetails(location.locationId)
														return (
															<div key={index} className="border rounded-lg p-4 bg-gray-50">
																<div className="flex items-start justify-between">
																	<div className="flex-1">
																		<div className="flex items-center gap-2 mb-2">
																			<MapPin className="w-4 h-4 text-blue-500" />
																			<h4 className="font-semibold">{getLocationName(location.locationId)}</h4>
																			<Badge variant="outline" className="text-xs">
																				<Clock className="w-3 h-3 mr-1" />
																				{formatTime(location.startTime)} - {formatTime(location.endTime)}
																			</Badge>
																			<Badge variant="secondary" className="text-xs">
																				{calculateDuration(location.startTime, location.endTime)}
																			</Badge>
																		</div>
																		{locationDetails && (
																			<div>
																				<p className="text-sm text-gray-600 mb-2">{locationDetails.description}</p>
																				<p>Giờ mở cửa: {formatTime(locationDetails.openTime || "")} - {formatTime(locationDetails.closeTime || "")}</p>
																			</div>
																		)}
																		{location.notes && (
																			<p className="text-sm text-blue-600 italic">Ghi chú: {location.notes}</p>
																		)}
																		<div className="flex gap-4 mt-2 text-xs text-gray-500">
																			{location.travelTimeFromPrev > 0 && (
																				<span>Di chuyển: {location.travelTimeFromPrev} phút</span>
																			)}
																			{location.distanceFromPrev > 0 && (
																				<span>Khoảng cách: {location.distanceFromPrev} km</span>
																			)}
																		</div>
																	</div>
																	<Button
																		variant="ghost"
																		size="sm"
																		onClick={() => handleRemoveLocation(globalIndex)}
																		className="text-red-500 hover:text-red-700"
																		disabled={isLoading}
																	>
																		<Trash2 className="w-4 h-4" />
																	</Button>
																</div>
															</div>
														)
													})}
												</div>
											)}
										</AccordionContent>
									</AccordionItem>
								)
							})}
						</Accordion>
					)}
				</CardContent>
			</Card>

			{errors.general && (
				<Alert className="border-red-200 bg-red-50">
					<AlertTriangle className="h-4 w-4 text-red-600" />
					<AlertDescription className="text-red-800">{errors.general}</AlertDescription>
				</Alert>
			)}

			{/* Action Buttons */}
			<div className="flex justify-between items-center pt-6 border-t">
				<Button
					variant="outline"
					onClick={onPrevious}
					className="flex items-center gap-2 bg-transparent"
					disabled={isLoading}
				>
					<ArrowLeft className="w-4 h-4" />
					Quay lại
				</Button>
				<div className="flex gap-3">
					<Button variant="ghost" onClick={onCancel} disabled={isLoading}>
						Hủy
					</Button>
					<Button onClick={handleSubmit} disabled={isLoading} className="flex items-center gap-2">
						{isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
						Tiếp theo
						<ArrowRight className="w-4 h-4" />
					</Button>
				</div>
			</div>
		</div>
	)
}
