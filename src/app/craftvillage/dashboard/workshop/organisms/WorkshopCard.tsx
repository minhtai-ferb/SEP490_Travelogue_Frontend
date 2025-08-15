"use client"

import StatusBadge from "../molecules/StatusBadge"

type Item = {
	id: string
	name: string
	description?: string
	mediaDtos?: { mediaUrl: string; isThumbnail: boolean }[]
	status?: number | string
	statusText?: string
}

type Props = {
	item: Item
	onClick?: (id: string) => void
}

export default function WorkshopCard({ item, onClick }: Props) {
	const thumbnail = item.mediaDtos?.find((m) => m.isThumbnail)?.mediaUrl || item.mediaDtos?.[0]?.mediaUrl
	return (
		<button type="button" onClick={() => onClick?.(item.id)} className="text-left group border rounded-lg overflow-hidden hover:shadow-md transition">
			<div className="aspect-video bg-gray-100 overflow-hidden">
				{thumbnail ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={thumbnail} alt={item.name} className="w-full h-full object-cover" />
				) : (
					<div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
				)}
			</div>
			<div className="p-3 space-y-1">
				<div className="flex items-center justify-between gap-2">
					<div className="font-medium truncate">{item.name}</div>
					<StatusBadge status={item.status} text={item.statusText} />
				</div>
				<div className="text-sm text-gray-500 line-clamp-2">{item.description}</div>
			</div>
		</button>
	)
}


