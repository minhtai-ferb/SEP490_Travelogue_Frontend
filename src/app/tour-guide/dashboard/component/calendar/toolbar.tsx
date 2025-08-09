"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"

export function CalendarToolbar({
	label,
	onPrev,
	onToday,
	onNext,
	right,
}: {
	label: string
	onPrev: () => void
	onToday: () => void
	onNext: () => void
	right?: React.ReactNode
}) {
	return (
		<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
			<div className="flex items-center gap-2">
				<Button variant="outline" size="icon" onClick={onPrev} aria-label="Trước">
					<ChevronLeft className="w-4 h-4" />
				</Button>
				<Button variant="outline" onClick={onToday}>
					<CalendarDays className="w-4 h-4 mr-2" />
					Hôm nay
				</Button>
				<Button variant="outline" size="icon" onClick={onNext} aria-label="Tiếp">
					<ChevronRight className="w-4 h-4" />
				</Button>
				<div className="ml-2 text-xl font-bold">{label}</div>
			</div>
			{right}
		</div>
	)
}
