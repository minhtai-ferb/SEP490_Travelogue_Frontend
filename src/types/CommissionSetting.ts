export interface CommissionRate {
  id: string;
  type: number; // 1 = Tour guide, 2 = Làng nghề
  commissionTypeText: string;
  rateValue: number; // phần trăm (%)
  effectiveDate: string; // ISO date string
  expiryDate: string | null; // ISO date string hoặc null nếu chưa hết hạn
}

export interface CommissionGroup {
  type: number; // 1 = Tour guide, 2 = Làng nghề
  commissionTypeText: string;
  rates: CommissionRate[];
}
