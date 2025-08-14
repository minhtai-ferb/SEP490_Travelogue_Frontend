"use client";

import React from "react";
import dayjs from "dayjs";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useWithdrawalRequests } from "@/services/use-request-withdrawal";
import { WithdrawalRequest } from "@/types/RequestWithdrawal";
import Filters, { FilterValues } from "./filters";
import RequestsTable from "./requests-table";

export default function WithdrawalContainer() {
  const { filterWithdrawalRequests, loading } = useWithdrawalRequests();
  const [rows, setRows] = React.useState<WithdrawalRequest[]>([]);
  const [kw, setKw] = React.useState<string>("");

  const initialRange = React.useMemo(() => {
    const to = dayjs();
    const from = to.subtract(7, "day");
    return [from, to] as [dayjs.Dayjs, dayjs.Dayjs];
  }, []);

  React.useEffect(() => {
    void doFilter({ range: initialRange });
  }, []);

  async function doFilter(values?: Partial<FilterValues>) {
    const v = { ...(values ?? {}) };

    const res = await filterWithdrawalRequests({
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

  return (
    <div className="p-4 md:p-6">
      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">Yêu cầu rút tiền</h1>
            <p className="text-sm text-muted-foreground">
              Lọc theo User ID, trạng thái, khoảng ngày; và tìm theo tên người dùng.
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        <Filters
          loading={loading}
          initialRange={initialRange}
          onSubmit={(values) => void doFilter(values)}
          onReset={handleReset}
          onSearchName={setKw}
        />

        <RequestsTable data={dataFilteredByName} loading={loading} />
      </Card>
    </div>
  );
}
