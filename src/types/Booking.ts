export type BookingPagedFilter = {
  status?: number;
  bookingType?: number;
  startDate?: Date | string;
  endDate?: Date | string;
  pageNumber?: number;
  pageSize?: number;
};

export const toIso = (d?: Date | string) =>
  d
    ? d instanceof Date
      ? d.toISOString()
      : new Date(d).toISOString()
    : undefined;

export interface BookingPagedResponse {
  items: BookingItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface BookingItem {
  id: string;
  userId: string;
  userName: string;
  tourId: string | null;
  tourName: string | null;
  tourScheduleId: string | null;
  departureDate: string | null;
  tourGuideId: string | null;
  tourGuideName: string | null;
  tripPlanId: string | null;
  tripPlanName: string | null;
  workshopId: string | null;
  workshopName: string | null;
  workshopScheduleId: string | null;
  paymentLinkId: string | null;
  status: number;
  statusText: string;
  bookingType: number;
  bookingTypeText: string;
  bookingDate: string;
  startDate: string;
  endDate: string;
  cancelledAt: string | null;
  promotionId: string | null;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
}
