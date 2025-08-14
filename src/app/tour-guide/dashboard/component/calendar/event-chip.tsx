"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { GuideScheduleItem } from "@/types/Tourguide"
import { Trophy } from "lucide-react"

export default function EventChip({ event }: any) {
	const it = (event.resource || {}) as GuideScheduleItem & { eventKind?: string }
	const status = (it as any).eventKind || it.scheduleType || "Booking"

	const color: Record<string, string> = {
		Booking: "from-sky-500 to-blue-600",
		TourSchedule: "from-amber-500 to-yellow-600",
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div
						className={`text-white bg-gradient-to-r ${color[status]} bg-opacity-90 cursor-pointer flex items-center gap-1 px-2 py-0.5 rounded-full w-full`}
					>
						<span className="truncate">{event.title}</span>
						{typeof it.price === "number" && (
							<span className="ml-1 inline-flex items-center">
								<Trophy className="w-3 h-3 opacity-90" />
							</span>
						)}
					</div>
				</TooltipTrigger>
				<TooltipContent side="top" className={`text-xs ${color[status]}`}>
					<p>{event.title}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
