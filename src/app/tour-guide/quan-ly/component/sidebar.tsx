"use client"

import { BookOpen, CalendarCheck2, ChevronDown, HomeIcon as House, LayoutGrid } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useRouter } from 'next/navigation'

export default function Sidebar({
	active,
	onChange,
}: {
	active: "tours" | "trip-plans"
	onChange: (v: "tours" | "trip-plans") => void
}) {
	const router = useRouter()
	return (
		<div className="h-full p-4">
			<nav className="mt-4 space-y-1">
				<button
					onClick={() => onChange("tours")}
					className={cn(
						"w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100",
						active === "tours" && "bg-gray-100 font-medium",
					)}
				>
					<LayoutGrid className="w-4 h-4" />
					<span>Tour</span>
				</button>
				<button
					onClick={() => onChange("trip-plans")}
					className={cn(
						"w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100",
						active === "trip-plans" && "bg-gray-100 font-medium",
					)}
				>
					<CalendarCheck2 className="w-4 h-4" />
					<span>Lịch trình</span>
				</button>

				<div className="h-px bg-gray-200 my-3" />

				<button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100" onClick={() => router.push("/")}>
					<House className="w-4 h-4" />
					<span>Về trang chủ</span>
				</button>
				{/* <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100">
					<BookOpen className="w-4 h-4" />
					<span>Tài liệu & hướng dẫn</span>
				</button> */}
			</nav>
		</div>
	)
}
