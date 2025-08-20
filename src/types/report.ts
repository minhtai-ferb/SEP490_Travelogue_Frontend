export enum ReportStatus {
	Pending = 1,
	Approved = 2,
	Rejected = 3,
}

export function getReportStatusDisplay(status: ReportStatus | number): string {
	switch (Number(status)) {
		case ReportStatus.Pending:
			return "Chờ duyệt"
		case ReportStatus.Approved:
			return "Đã duyệt"
		case ReportStatus.Rejected:
			return "Từ chối"
		default:
			return "Không xác định"
	}
}

export interface ReportItem {
	id: string
	userId: string
	reviewId: string
	reason: string
	status: ReportStatus | number
	reportedAt?: string
	createdTime?: string
	lastUpdatedTime?: string
	createdBy?: string
	createdByName?: string | null
	lastUpdatedBy?: string
	lastUpdatedByName?: string | null
}

export interface ReportDetail extends ReportItem {
	// Extend when backend returns more detail fields
	content?: string
	images?: string[]
	adminNote?: string
}


