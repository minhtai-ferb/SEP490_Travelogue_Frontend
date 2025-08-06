import type { TourStatus } from "@/types/Tour"

export const STATUS_META: Record<TourStatus, { label: string; variant: string }> = {
	upcoming: {
		label: "Sắp diễn ra",
		variant: "bg-blue-100 text-blue-800",
	},
	in_progress: {
		label: "Đang diễn ra",
		variant: "bg-green-100 text-green-800",
	},
	completed: {
		label: "Đã hoàn thành",
		variant: "bg-gray-100 text-gray-800",
	},
}

export const getStatusBadge = (status: TourStatus) => {
	return STATUS_META[status]
}

export const validateTourData = (tour: any): boolean => {
	return (
		tour &&
		typeof tour.id === "string" &&
		typeof tour.name === "string" &&
		typeof tour.startDate === "string" &&
		typeof tour.endDate === "string" &&
		typeof tour.status === "string" &&
		["upcoming", "in_progress", "completed"].includes(tour.status)
	)
}
