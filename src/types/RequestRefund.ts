
export interface RefundRequest {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  status: RefundStatus;
  statusText: string;
  createdTime: string;
  lastUpdatedTime: string;
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