"use client";

import React from "react";
import dayjs from "dayjs";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useWithdrawalRequests } from "@/services/use-request-withdrawal";
import { WithdrawalRequest } from "@/types/RequestWithdrawal";
import Filters, { FilterValues } from "./filters";
import RequestsTable from "./requests-table";
import RequestDetailModal from "./request-detail-modal";
import { useMediaUpload } from "@/services/use-media-upload";

export default function WithdrawalContainer() {
  const {
    filterWithdrawalRequests,
    approveWithdrawalRequest,
    rejectWithdrawalRequest,
    loading,
  } = useWithdrawalRequests();
  const { uploadMediaMultiple } = useMediaUpload();
  const [rows, setRows] = React.useState<WithdrawalRequest[]>([]);
  const [kw, setKw] = React.useState<string>("");
  const [selected, setSelected] = React.useState<WithdrawalRequest | null>(
    null
  );
  const [detailOpen, setDetailOpen] = React.useState(false);

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

  // CHẤP NHẬN: bắt buộc có ảnh; note tuỳ chọn
  const handleApprove = React.useCallback(
    async ({
      id,
      note,
      files,
    }: {
      id: string;
      note?: string;
      files: File[];
    }) => {
      // 1) upload ảnh
      const uploadRes = await uploadMediaMultiple(files);
      if (!Array.isArray(uploadRes) || uploadRes.length === 0) {
        throw new Error(
          "Upload ảnh thất bại hoặc không nhận được dữ liệu ảnh."
        );
      }

      await approveWithdrawalRequest(id, {
        adminNote: note,
        proofImageUrl: uploadRes.join(","),
      });

      await handleReset();
    },
    []
  );

  // TỪ CHỐI: note tuỳ chọn
  const handleReject = React.useCallback(
    async ({ id, note }: { id: string; note?: string }) => {
      await rejectWithdrawalRequest(id, { reason: note });

      await handleReset();
    },
    []
  );

  return (
    <div className="p-4 md:p-6">
      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">
              Yêu cầu rút tiền
            </h1>
            <p className="text-sm text-muted-foreground">
              Lọc theo trạng thái, khoảng ngày; và tìm theo tên người dùng.
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

        <RequestsTable
          data={dataFilteredByName}
          loading={loading}
          onOpenDetail={(row) => {
            setSelected(row);
            setDetailOpen(true);
          }}
        />

        <RequestDetailModal
          open={detailOpen}
          data={selected}
          onClose={() => {
            setDetailOpen(false);
            setSelected(null);
          }}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </Card>
    </div>
  );
}
