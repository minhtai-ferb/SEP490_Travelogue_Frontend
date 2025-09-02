import { GuideScheduleItem } from '@/types/Tourguide'

export type FilterType = 'all' | 'Booking' | 'TourSchedule'

export interface CalendarEvent {
	title: string
	start: Date
	end: Date
	allDay: boolean
	resource: GuideScheduleItem
}

export const createCalendarEvent = (item: GuideScheduleItem): CalendarEvent => {
	const date = new Date(item.date)
	const start = new Date(date.getFullYear(), date.getMonth(), date.getDate())
	const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)

	const formatPrice = (price?: number): string => {
		if (!price) return ''
		return ` · ${Math.round(price / 1000)}K`
	}

	const title = `${item.tourName ?? 'Lịch'}${formatPrice(item.price)}`

	return {
		title,
		start,
		end,
		allDay: true,
		resource: item
	}
}

export const filterScheduleItems = (
	items: GuideScheduleItem[],
	filter: FilterType
): GuideScheduleItem[] => {
	if (filter === 'all') return items

	return items.filter(item => {
		const eventKind = (item as any).eventKind || (item as any).scheduleType || (item as any).status
		return eventKind === filter
	})
}

export const getEventBackgroundColor = (eventKind: string): string => {
	const colorMap: Record<string, string> = {
		Booking: '#3b82f6',
		TourSchedule: '#f59e0b',
	}

	return colorMap[eventKind] || colorMap.Booking
}

export const createEventPropGetter = () => (event: CalendarEvent) => {
	const item = event.resource as any
	const kind = item.eventKind || item.scheduleType || item.status || 'Booking'

	return {
		style: {
			background: getEventBackgroundColor(kind),
		},
		title: event.title,
	}
}
