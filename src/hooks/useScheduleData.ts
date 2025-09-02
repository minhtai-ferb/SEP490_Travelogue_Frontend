import { useState, useEffect, useMemo } from 'react'
import { useTourguideAssign } from '@/services/tourguide'
import type { GuideScheduleItem } from '@/types/Tourguide'

// Constants
const SCHEDULE_TYPES = {
	BOOKING: 2 as const,
	TOUR_SCHEDULE: 3 as const,
} as const

const DEFAULT_PAGE_SIZE = 1000

interface UseScheduleDataProps {
	start: string
	end: string
}

export const useScheduleData = ({ start, end }: UseScheduleDataProps) => {
	const { getTourGuideSchedule } = useTourguideAssign()
	const [items, setItems] = useState<GuideScheduleItem[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Extract and normalize data helper
	const extractScheduleItems = (response: any): GuideScheduleItem[] => {
		if (Array.isArray(response?.items)) return response.items
		if (Array.isArray(response?.data)) return response.data
		if (Array.isArray(response)) return response
		return []
	}

	const normalizeScheduleItem = (item: any): GuideScheduleItem => ({
		...item,
		eventKind: (item.scheduleType || item.status || 'Booking') as 'Booking' | 'TourSchedule',
	})

	const removeDuplicates = (items: GuideScheduleItem[]): GuideScheduleItem[] => {
		const map = new Map()
		items.forEach(item => {
			const key = item.id ?? `${item.eventKind}-${item.date}-${item.tourScheduleId ?? item.bookingId ?? Math.random()}`
			map.set(key, item)
		})
		return Array.from(map.values())
	}

	useEffect(() => {
		let cancelled = false

		const fetchScheduleData = async () => {
			try {
				setLoading(true)
				setError(null)

				const [bookingResponse, tourScheduleResponse] = await Promise.all([
					getTourGuideSchedule(SCHEDULE_TYPES.BOOKING, start, end, 1, DEFAULT_PAGE_SIZE),
					getTourGuideSchedule(SCHEDULE_TYPES.TOUR_SCHEDULE, start, end, 1, DEFAULT_PAGE_SIZE),
				])

				const bookingItems = extractScheduleItems(bookingResponse)
				const tourScheduleItems = extractScheduleItems(tourScheduleResponse)

				const combinedItems = [...bookingItems, ...tourScheduleItems]
				const normalizedItems = combinedItems.map(normalizeScheduleItem)
				const uniqueItems = removeDuplicates(normalizedItems)

				if (!cancelled) {
					setItems(uniqueItems)
				}
			} catch (err) {
				if (!cancelled) {
					setError(err instanceof Error ? err.message : 'Failed to fetch schedule data')
					setItems([])
				}
			} finally {
				if (!cancelled) {
					setLoading(false)
				}
			}
		}

		fetchScheduleData()

		return () => {
			cancelled = true
		}
	}, [getTourGuideSchedule, start, end])

	// Calculate counts
	const counts = useMemo(() => {
		const base = { all: items.length, Booking: 0, TourSchedule: 0 }

		items.forEach(item => {
			const eventType = item.eventKind || 'Booking'
			if (eventType === 'Booking' || eventType === 'TourSchedule') {
				base[eventType]++
			}
		})

		return base
	}, [items])

	return {
		items,
		loading,
		error,
		counts,
		refetch: () => {
			// Trigger re-fetch by updating a dependency
		}
	}
}
