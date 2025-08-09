
export const STATUS_META: Record<string, { label: string; variant: string }> = {
	Draft: {
		label: "Nháp",
		variant: "bg-blue-100 text-blue-800",
	},
	Confirmed: {
		label: "Đã xác nhận",
		variant: "bg-green-100 text-green-800",
	},
	Cancelled: {
		label: "Đã hủy bỏ",
		variant: "bg-gray-100 text-gray-800",
	},
	upcoming: {
		label: "Sắp diễn ra",
		variant: "bg-blue-100 text-blue-800",
	},
	in_progress: {
		label: "Đang diễn ra",
		variant: "bg-yellow-100 text-yellow-800",
	},
	completed: {
		label: "Đã hoàn thành",
		variant: "bg-green-100 text-green-800",
	},
}

export const getStatusBadge = (status: string) => {
	return STATUS_META[status] || {
		label: "Không xác định",
		variant: "bg-gray-100 text-gray-800",
	}
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
