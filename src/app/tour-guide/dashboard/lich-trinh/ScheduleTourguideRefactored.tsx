"use client"

import dayjs from "dayjs"
import { useCallback, useMemo, useState } from "react"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "../component/calendar/calendar-styles.css"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"

import { format, getDay, parse, startOfWeek } from "date-fns"
import { vi } from "date-fns/locale"
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar"

import { useTourguideAssign } from "@/services/tourguide"
import type { GuideScheduleItem } from "@/types/Tourguide"

// Components
import EventChip from "../component/calendar/event-chip"
import EventDetailDialog from "../component/calendar/event-detail-dialog"
import Legend from "../component/calendar/legend"
import { CalendarToolbar } from "../component/calendar/toolbar"
import { CalendarErrorBoundary } from "@/components/common/CalendarErrorBoundary"

// Utils and constants
import {
	createCalendarEvent,
	filterScheduleItems,
	createEventPropGetter,
	type FilterType
} from "@/utils/calendarUtils"
import { CALENDAR_HEIGHT, DATE_FORMATS } from "@/constants/calendar"
import { useScheduleData } from "@/hooks/useScheduleData"

const ScheduleTourguideRefactored = () => {
	// State
	const [month, setMonth] = useState<Date>(new Date())
	const [filter, setFilter] = useState<FilterType>("all")
	const [selected, setSelected] = useState<GuideScheduleItem | undefined>()
	const [detailOpen, setDetailOpen] = useState(false)

	// Computed values
	const monthLabel = month.toLocaleDateString("vi-VN", DATE_FORMATS.MONTH_YEAR)
	const start = useMemo(() => dayjs(month).startOf("month").toISOString(), [month])
	const end = useMemo(() => dayjs(month).endOf("month").toISOString(), [month])

	// Custom hooks
	const { items, loading, error, counts } = useScheduleData({ start, end })
	const { getTourGuideScheduleDetail } = useTourguideAssign()

	// Calendar setup
	const localizer = useMemo(
		() =>
			dateFnsLocalizer({
				format,
				parse,
				startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
				getDay,
				locales: { vi },
			}),
		[]
	)

	// Event processing
	const events = useMemo(() => {
		const filteredItems = filterScheduleItems(items, filter)
		return filteredItems.map(createCalendarEvent)
	}, [items, filter])

	// Event handlers
	const onNavigate = useCallback((newDate: Date) => setMonth(newDate), [])

	const onSelectEvent = useCallback(async (event: any) => {
		try {
			const detail = await getTourGuideScheduleDetail(event.resource.id)
			setSelected(detail as GuideScheduleItem)
			setDetailOpen(true)
		} catch (error) {
			console.error("Failed to fetch event detail:", error)
			// Could add toast notification here
		}
	}, [getTourGuideScheduleDetail])

	const eventPropGetter = createEventPropGetter()

	const handleRetry = useCallback(() => {
		// Trigger refetch - could be implemented in the custom hook
		window.location.reload() // Temporary solution
	}, [])

	return (
		<div className="min-h-[calc(100vh-64px)]">
			{/* Header */}
			<header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbPage>{monthLabel}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</header>

			<div className="flex flex-1 flex-col gap-4 p-4">
				{/* Toolbar */}
				<Card className="border-0 shadow-none bg-gradient-to-r from-sky-50 to-blue-50">
					<CardContent className="p-4">
						<CalendarToolbar
							label={monthLabel}
							onPrev={() => onNavigate(dayjs(month).subtract(1, "month").toDate())}
							onNext={() => onNavigate(dayjs(month).add(1, "month").toDate())}
							onToday={() => onNavigate(new Date())}
							right={
								<Legend
									counts={counts}
									filter={filter}
									onChange={(newFilter) => setFilter(newFilter as FilterType)}
								/>
							}
						/>
					</CardContent>
				</Card>

				{/* Calendar Content */}
				<CalendarErrorBoundary
					error={error}
					loading={loading}
					onRetry={handleRetry}
				>
					<div className="bg-card rounded-xl border p-2">
						<BigCalendar
							localizer={localizer}
							events={events}
							startAccessor="start"
							endAccessor="end"
							defaultView="month"
							view="month"
							onNavigate={onNavigate}
							date={month}
							popup
							components={{
								event: EventChip,
							}}
							eventPropGetter={eventPropGetter}
							style={{ height: CALENDAR_HEIGHT }}
							onSelectEvent={onSelectEvent}
						/>
					</div>
				</CalendarErrorBoundary>
			</div>

			{/* Event Detail Dialog */}
			<EventDetailDialog
				open={detailOpen}
				onOpenChange={setDetailOpen}
				item={selected}
			/>
		</div>
	)
}

export default ScheduleTourguideRefactored
