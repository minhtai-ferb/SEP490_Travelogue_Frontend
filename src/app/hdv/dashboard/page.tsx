"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import dayjs from "dayjs"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "./component/calendar/calendar-styles.css"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./component/app-sidebar"

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"

import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { vi } from "date-fns/locale"

import { useTourguideAssign } from "@/services/tourguide"
import type { GuideScheduleItem } from "@/types/Tourguide"

import { CalendarToolbar } from "./component/calendar/toolbar"
import Legend from "./component/calendar/legend"
import EventChip from "./component/calendar/event-chip"
import EventDetailDialog from "./component/calendar/event-detail-dialog"
import { Card, CardContent } from "@/components/ui/card"

export default function Page() {
	const [month, setMonth] = useState<Date>(new Date())
	const monthLabel = month.toLocaleDateString("vi-VN", { month: "long", year: "numeric" })

	const { getTourGuideSchedule } = useTourguideAssign()
	const [items, setItems] = useState<GuideScheduleItem[]>([])
	const [filter, setFilter] = useState<"all" | "Booking" | "TourSchedule">("all")
	const [selected, setSelected] = useState<GuideScheduleItem | undefined>()
	const [detailOpen, setDetailOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	const start = useMemo(() => dayjs(month).startOf("month").toISOString(), [month])
	const end = useMemo(() => dayjs(month).endOf("month").toISOString(), [month])

	useEffect(() => {
		let cancelled = false
			; (async () => {
				try {
					setLoading(true)
					const [resBooking, resTourSchedule] = await Promise.all([
						getTourGuideSchedule(2 as 2, start, end, 1, 1000),
						getTourGuideSchedule(3 as 3, start, end, 1, 1000),
					])

					const extract = (res: any): GuideScheduleItem[] =>
						Array.isArray(res?.items)
							? res.items
							: Array.isArray(res?.data)
								? res.data
								: Array.isArray(res)
									? res
									: []

					const combined = [...extract(resBooking), ...extract(resTourSchedule)]
					const normalized = combined.map((it: any) => ({
						...it,
						eventKind: (it.scheduleType || it.status || "Booking") as "Booking" | "TourSchedule",
					}))
					const unique = Array.from(new Map(normalized.map((it: any) => [it.id ?? `${it.eventKind}-${it.date}-${it.tourScheduleId ?? it.bookingId ?? Math.random()}`, it])).values())

					if (!cancelled) setItems(unique as any)
				} catch {
					if (!cancelled) setItems([])
				} finally {
					if (!cancelled) setLoading(false)
				}
			})()
		return () => {
			cancelled = true
		}
	}, [getTourGuideSchedule, start, end])

	const localizer = useMemo(
		() =>
			dateFnsLocalizer({
				format,
				parse,
				startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
				getDay,
				locales: { vi },
			}),
		[],
	)

	const events: any[] = useMemo(() => {
		return items
			.filter((it: any) => (filter === "all" ? true : (it.eventKind || it.scheduleType || it.status) === filter))
			.map((it: any) => {
				const d = new Date(it.date)
				const start = new Date(d.getFullYear(), d.getMonth(), d.getDate())
				const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
				const title = `${it.tourName ?? "Lịch"}${it.price ? ` · ${Math.round((it.price as number) / 1000)}K` : ""}`
				return { title, start, end, allDay: true, resource: it }
			})
	}, [items, filter])

	const counts = useMemo(() => {
		const base = { all: items.length, Booking: 0, TourSchedule: 0 }
		for (const it of items as any) {
			const s = (it.eventKind || it.scheduleType || it.status || "Booking") as keyof typeof base
			if (s === "Booking" || s === "TourSchedule") base[s]++
		}
		return base
	}, [items])

	const onNavigate = useCallback((newDate: Date) => setMonth(newDate), [])

	const eventPropGetter: any = (event: any) => {
		const it = (event.resource || {}) as any
		const kind = it.eventKind || it.scheduleType || it.status || "Booking"
		const bg: Record<string, string> = {
			Booking: "#3b82f6",
			TourSchedule: "#f59e0b",
		}
		return {
			style: {
				background: bg[kind] || bg.Booking,
			},
			title: event.title as string,
		}
	}

	const onSelectEvent = useCallback((e: any) => {
		setSelected(e.resource as any)
		setDetailOpen(true)
	}, [])

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
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
					<Card className="border-0 shadow-none bg-gradient-to-r from-sky-50 to-blue-50">
						<CardContent className="p-4">
							<CalendarToolbar
								label={monthLabel}
								onPrev={() => onNavigate(dayjs(month).subtract(1, "month").toDate())}
								onNext={() => onNavigate(dayjs(month).add(1, "month").toDate())}
								onToday={() => onNavigate(new Date())}
								right={<Legend counts={counts as any} filter={filter} onChange={(s) => setFilter(s as any)} />}
							/>
						</CardContent>
					</Card>

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
							messages={{
								next: "Sau",
								previous: "Trước",
								today: "Hôm nay",
								month: "Tháng",
								week: "Tuần",
								day: "Ngày",
								agenda: "Lịch",
							}}
							components={{
								event: EventChip,
							}}
							eventPropGetter={eventPropGetter}
							style={{ height: "calc(100vh - 160px)" }}
							onSelectEvent={onSelectEvent}
						/>
					</div>
				</div>

				<EventDetailDialog open={detailOpen} onOpenChange={setDetailOpen} item={selected} />
			</SidebarInset>
		</SidebarProvider>
	)
}
