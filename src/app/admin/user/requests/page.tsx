"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTourguideAssign } from "@/services/tourguide";
import {
  TourguideRequestStatus,
  type TourGuideRequestItem,
} from "@/types/Tourguide";
import { Toolbar } from "./components/tool-bar";
import { RequestCard } from "./components/request-card";
import { LoadingGrid } from "./components/loading-grid";
import { EmptyState } from "./components/empty-state";
import { DetailSheetContent } from "./components/detail-sheet";
import { ApproveDialog } from "./components/approve-dialog";
import { RejectDialog } from "./components/reject-dialog";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";

const crumbs: Crumb[] = [
  { label: "Quản lý tài khoản", href: "/admin/user" },
  { label: "Yêu cầu hướng dẫn viên", href: "/admin/user/requests" },
];

export default function TourguideRequestsPage() {
  const { getTourguideRequest, requestReview, loading } = useTourguideAssign();

  const [status, setStatus] = useState<TourguideRequestStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<TourGuideRequestItem[]>([]);

  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [approveReason, setApproveReason] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(query);
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  const fetchData = async () => {
    try {
      const response: any = await getTourguideRequest(
        status === "all"
          ? TourguideRequestStatus.All
          : (status as TourguideRequestStatus)
      );
      const list: TourGuideRequestItem[] = Array.isArray(response)
        ? response
        : [];
      const filtered = search
        ? list.filter(
            (it) =>
              it.fullName?.toLowerCase().includes(search.toLowerCase()) ||
              it.email?.toLowerCase().includes(search.toLowerCase())
          )
        : list;
      setItems(filtered);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  const handleApproveConfirm = async () => {
    if (!approvingId) return;
    try {
      const payload: any = { status: TourguideRequestStatus.Approved };
      // Giữ nguyên key "rejectionReason" theo hành vi hiện tại của API phía bạn
      if (approveReason?.trim()) payload.rejectionReason = approveReason.trim();
      await requestReview(approvingId, payload);
      setApprovingId(null);
      setApproveReason("");
      toast.success("Yêu cầu đã được chấp nhận");
      await fetchData();
    } catch (e) {
      console.error(e);
      toast.error("Lỗi khi thực hiện yêu cầu, hãy thử lại sau ít phút");
    }
  };

  const handleReject = async () => {
    if (!rejectingId) return;
    try {
      await requestReview(rejectingId, {
        status: TourguideRequestStatus.Rejected,
        rejectionReason: rejectReason,
      });
      setRejectingId(null);
      setRejectReason("");
      toast.success("Yêu cầu đã được từ chối");
      await fetchData();
    } catch (e) {
      console.error(e);
      toast.error("Lỗi khi thực hiện yêu cầu, hãy thử lại sau ít phút");
    }
  };

  const currentItem = useMemo(
    () => items.find((x) => x.id === openId) || null,
    [items, openId]
  );

  return (
    <>
      <BreadcrumbHeader items={crumbs} />
      <div className="w-full mx-auto px-4 space-y-6 mt-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Quản lý yêu cầu hướng dẫn viên
            </h1>
            <p className="text-sm text-muted-foreground">
              Duyệt, chấp nhận hoặc từ chối các yêu cầu đăng ký
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <Toolbar
          query={query}
          setQuery={setQuery}
          status={status}
          setStatus={setStatus}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading && items.length === 0 && <LoadingGrid />}

          {!loading &&
            items.map((it) => (
              <RequestCard
                key={it.id}
                it={it}
                onOpenDetail={(id) => setOpenId(id)}
                onApproveClick={(id) => {
                  setApprovingId(id);
                  setApproveReason("");
                }}
                onRejectClick={(id) => {
                  setRejectingId(id);
                  setRejectReason("");
                }}
              />
            ))}

          {!loading && items.length === 0 && <EmptyState />}
        </div>

        {/* Detail Sheet */}
        <Sheet open={!!openId} onOpenChange={(o) => !o && setOpenId(null)}>
          <SheetContent side="right" className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Chi tiết yêu cầu</SheetTitle>
              <SheetDescription>Thông tin từ hướng dẫn viên</SheetDescription>
            </SheetHeader>

            {currentItem ? (
              <DetailSheetContent
                it={currentItem}
                onApprove={() => {
                  setApprovingId(currentItem.id);
                  setApproveReason("");
                }}
                onReject={() => {
                  setRejectingId(currentItem.id);
                  setRejectReason("");
                }}
              />
            ) : null}
          </SheetContent>
        </Sheet>

        {/* Centralized dialogs */}
        <ApproveDialog
          open={!!approvingId}
          onOpenChange={(o) => !o && setApprovingId(null)}
          onConfirm={handleApproveConfirm}
          note={approveReason}
          setNote={setApproveReason}
        />
        <RejectDialog
          open={!!rejectingId}
          onOpenChange={(o) => !o && setRejectingId(null)}
          onConfirm={handleReject}
          reason={rejectReason}
          setReason={setRejectReason}
          disabled={!rejectingId || !rejectReason.trim()}
        />
      </div>
    </>
  );
}
