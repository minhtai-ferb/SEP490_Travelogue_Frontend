"use client"

type Item = { status?: number | string }

function count(items: Item[], status: number) {
	return items.filter((i) => String(i.status) === String(status)).length
}

export default function WorkshopStats({ items }: { items: Item[] }) {
	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
			<div className="rounded-md border p-3">
				<div className="text-xs text-gray-500">Nháp</div>
				<div className="text-xl font-semibold">{count(items, 0)}</div>
			</div>
			<div className="rounded-md border p-3">
				<div className="text-xs text-amber-600">Chờ duyệt</div>
				<div className="text-xl font-semibold">{count(items, 1)}</div>
			</div>
			<div className="rounded-md border p-3">
				<div className="text-xs text-emerald-600">Đã duyệt</div>
				<div className="text-xl font-semibold">{count(items, 2)}</div>
			</div>
			<div className="rounded-md border p-3">
				<div className="text-xs text-red-600">Bị từ chối</div>
				<div className="text-xl font-semibold">{count(items, 3)}</div>
			</div>
		</div>
	)
}


