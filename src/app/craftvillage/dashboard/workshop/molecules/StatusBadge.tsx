"use client"

type Props = {
	status?: number | string
	text?: string
}

const map = {
	draft: { label: "Nháp", className: "bg-gray-100 text-gray-700 border-gray-200" },
	pending: { label: "Chờ duyệt", className: "bg-amber-100 text-amber-800 border-amber-200" },
	approved: { label: "Đã duyệt", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
	rejected: { label: "Từ chối", className: "bg-red-100 text-red-700 border-red-200" },
}

function toKey(status?: number | string) {
	if (status === 0 || status === "0") return "draft" as const
	if (status === 1 || status === "1") return "pending" as const
	if (status === 2 || status === "2") return "approved" as const
	if (status === 3 || status === "3") return "rejected" as const
	return "draft" as const
}

export default function StatusBadge({ status, text }: Props) {
	const key = toKey(status)
	const conf = map[key]
	return (
		<span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs border ${conf.className}`}>
			{text || conf.label}
		</span>
	)
}


