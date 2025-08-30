
export interface RefundRequest {
  id: string;
  bookingId: string;
  reason: string;
  userId: string;
  userName: string;
  status: RefundStatus;
  statusText: string;
  requestedAt: string;
  respondedAt: string;
  lastUpdatedTime: string;
  bookingDataModel: BookingInfo;
}

export interface BookingInfo {
 		id: string;
    tourId: string;
    tourName: string;
    tourScheduleId: string;
    tourGuideId: string;
    tourGuideName: string;
    tripPlanId: string;
    tripPlanName: string;
    workshopId: string;
    workshopName: string;
    workshopScheduleId: string;
    statusText: string;
    departureDate: string;
		bookingTypeText: string;
		bookingDate: string;
		startDate: string;
		endDate: string;
		finalPrice: number;
		contactName: string;
		contactEmail: string;
		contactPhone: string;
		contactAddress: string;
}

export enum RefundStatus {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
}

export function getRefundStatusText(status: RefundStatus): string {
  switch (status) {
    case RefundStatus.PENDING:
      return "Chờ xử lý";
    case RefundStatus.APPROVED:
      return "Đã chấp nhận";
    case RefundStatus.REJECTED:
      return "Đã từ chối";
    default:
      return "Không xác định";
  }
}