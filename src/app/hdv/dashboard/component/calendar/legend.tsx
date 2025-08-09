"use client"

import { Badge } from "@/components/ui/badge"

export default function Legend({
	counts,
	filter,
	onChange,
}: {
	counts: Record<string, number>
	filter: string
	onChange: (s: string) => void
}) {
	const chips = [
		{ key: "all", label: "Tất cả", className: "bg-gray-200 text-gray-900 hover:bg-gray-300" },
		{ key: "Booking", label: "Người dùng đặt", className: "bg-sky-600 text-white" },
		{ key: "TourSchedule", label: "Lịch trình", className: "bg-amber-600 text-white" },
	]
	return (
		<div className="flex flex-wrap gap-2">
			{chips.map((c) => (
				<button
					key={c.key}
					onClick={() => onChange(c.key)}
					className={`rounded-full px-3 h-7 inline-flex items-center gap-2 ${c.className} ${filter === c.key ? "ring-2 ring-offset-1 ring-black/10" : "opacity-90"
						}`}
				>
					<span className="text-xs font-medium">{c.label}</span>
					<Badge variant="secondary" className="h-5 px-1 text-[10px]">
						{counts[c.key as keyof typeof counts] ?? 0}
					</Badge>
				</button>
			))}
		</div>
	)
}
