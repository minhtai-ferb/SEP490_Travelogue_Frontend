"use client";

import React from "react";
import dayjs from "dayjs";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WithdrawalRequest } from "@/types/RequestWithdrawal";
import Filters, { FilterValues } from "./filters";
import RequestsTable from "./requests-table";
import { useMediaUpload } from "@/services/use-media-upload";
import { useRefundRequests } from "@/services/use-refundrequest";
import { RefundRequest } from "@/types/RequestRefund";

export default function RefundContainer() {
  const {
    filterRefundRequests,
    loading,
  } = useRefundRequests();
  const [rows, setRows] = React.useState<RefundRequest[]>([]);
  const [kw, setKw] = React.useState<string>("");

  const initialRange = React.useMemo(() => {
    const to = dayjs();
    const from = to.subtract(30, "day");
    return [from, to] as [dayjs.Dayjs, dayjs.Dayjs];
  }, []);

  React.useEffect(() => {
    void doFilter({ range: initialRange });
  }, []);

  async function doFilter(values?: Partial<FilterValues>) {
    const v = { ...(values ?? {}) };

    const res = await filterRefundRequests({
      userId: v.userId?.trim() || undefined,
      status: typeof v.status === "number" ? v.status : undefined,
      fromDate: v.range?.[0]?.toDate(),
      toDate: v.range?.[1]?.toDate(),
    });

    setRows(Array.isArray(res) ? res : res?.items ?? []);
  }

  function handleReset() {
    setKw("");
    setRows([]);
    void doFilter({ userId: undefined, status: undefined, range: undefined });
  }

  const dataFilteredByName = React.useMemo(() => {
    const k = kw.trim().toLowerCase();
    if (!k) return rows;
    return rows.filter((r) => r.userName?.toLowerCase().includes(k));
  }, [rows, kw]);

  // Handlers for viewing details
  const handleViewTourDetail = React.useCallback((tourId: string) => {
    // TODO: Implement navigation to tour details
    console.log("View tour details:", tourId);
    // window.open(`/admin/tours/${tourId}`, '_blank');
  }, []);

  const handleViewTripPlanDetail = React.useCallback((tripPlanId: string) => {
    // TODO: Implement navigation to trip plan details
    console.log("View trip plan details:", tripPlanId);
    // window.open(`/admin/trip-plans/${tripPlanId}`, '_blank');
  }, []);

  const handleViewWorkshopDetail = React.useCallback((workshopId: string) => {
    // TODO: Implement navigation to workshop details
    console.log("View workshop details:", workshopId);
    // window.open(`/admin/workshops/${workshopId}`, '_blank');
  }, []);

  return (
    <div className="absolute p-4 w-full mt-16">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">
            Yêu cầu hoàn tiền
          </h1>
          <p className="text-sm text-muted-foreground">
            Lọc theo trạng thái, khoảng ngày; và tìm theo tên người dùng.
          </p>
        </div>
      </div>
      <Separator className="my-4" />
      <Card className="md:p-6">
        <Filters
          loading={loading}
          initialRange={initialRange}
          onSubmit={(values) => void doFilter(values)}
          onReset={handleReset}
          onSearchName={setKw}
        />

        <RequestsTable
          data={dataFilteredByName}
          loading={loading}
          onViewTourDetail={handleViewTourDetail}
          onViewTripPlanDetail={handleViewTripPlanDetail}
          onViewWorkshopDetail={handleViewWorkshopDetail}
        />
      </Card>
    </div>
  );
}
