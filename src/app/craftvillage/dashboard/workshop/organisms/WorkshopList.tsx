"use client"

import WorkshopCard from "./WorkshopCard"
import Link from "next/link"

type Props = {
	items: Array<{ id: string; name: string; description?: string; mediaDtos?: { mediaUrl: string; isThumbnail: boolean }[]; status?: number | string; statusText?: string }>
}

export default function WorkshopList({ items }: Props) {
	if (!items?.length) return <div className="p-6 text-sm text-gray-500 border rounded-md">
		Không có workshop nào được tạo{" "}
		<Link href="/craftvillage/dashboard/workshop/create" className="text-sm text-blue-600 hover:underline">Tạo workshop</Link>
	</div>
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{items.map((w) => (
				<WorkshopCard key={w.id} item={w as any} />
			))}
		</div>
	)
}


