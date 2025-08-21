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
import { DetailSheetContent } from "./components/detail-sheet";
import { ApproveDialog } from "./components/approve-dialog";
import { RejectDialog } from "./components/reject-dialog";
import BreadcrumbHeader, { Crumb } from "@/components/common/breadcrumb-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDown, ArrowUp, ArrowUpDown, Banknote, Check, Eye, X } from "lucide-react";


export default function TourguideRequestsTable() {
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

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [sortBy, setSortBy] = useState<"fullName" | "price" | "status">("fullName");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

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

  const displayPrice = (price?: number) =>
    typeof price === "number" ? price.toLocaleString("vi-VN") + " đ" : "—";

  const initials = (name?: string) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    const f = parts[0]?.[0] ?? "";
    const l = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (f + l).toUpperCase();
  };

  const statusBadge = (s: TourguideRequestStatus | number | undefined) => {
    const st = (s as TourguideRequestStatus) ?? TourguideRequestStatus.Pending;
    switch (st) {
      case TourguideRequestStatus.Pending:
        return (
          <Badge className="border-amber-200 bg-amber-100 text-amber-800">Chờ duyệt</Badge>
        );
      case TourguideRequestStatus.Approved:
        return (
          <Badge className="border-emerald-200 bg-emerald-100 text-emerald-800">Đã duyệt</Badge>
        );
      case TourguideRequestStatus.Rejected:
        return (
          <Badge className="border-rose-200 bg-rose-100 text-rose-800">Từ chối</Badge>
        );
      default:
        return <Badge variant="secondary">Trạng thái</Badge>;
    }
  };

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

  const isPending = (s?: TourguideRequestStatus | number) =>
    Number(s) === Number(TourguideRequestStatus.Pending);

  const sortedItems = useMemo(() => {
    const list = [...items];
    list.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "fullName") {
        const av = (a.fullName || "").toLowerCase();
        const bv = (b.fullName || "").toLowerCase();
        return av.localeCompare(bv) * dir;
      }
      if (sortBy === "price") {
        const av = typeof a.price === "number" ? a.price : Number.POSITIVE_INFINITY;
        const bv = typeof b.price === "number" ? b.price : Number.POSITIVE_INFINITY;
        return (av - bv) * dir;
      }
      const av = Number(a.status ?? TourguideRequestStatus.Pending);
      const bv = Number(b.status ?? TourguideRequestStatus.Pending);
      return (av - bv) * dir;
    });
    return list;
  }, [items, sortBy, sortDir]);

  const totalItems = sortedItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedItems.slice(start, start + pageSize);
  }, [sortedItems, page, pageSize]);

  const toggleSort = (field: "fullName" | "price" | "status") => {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
    setPage(1);
  };

  return (
    <div>
      <div >
        {/* Toolbar */}
        <Toolbar
          query={query}
          setQuery={setQuery}
          status={status}
          setStatus={setStatus}
        />

        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <Table className="min-w-[980px]">
              <TableHeader className="sticky top-0 z-10 bg-white">
                <TableRow>
                  <TableHead className="w-[320px]">
                    <button
                      className="inline-flex items-center gap-1 font-medium"
                      onClick={() => toggleSort("fullName")}
                      title="Sắp xếp theo tên"
                    >
                      <span>Hướng dẫn viên</span>
                      {sortBy !== "fullName" ? (
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                      ) : sortDir === "asc" ? (
                        <ArrowUp className="w-3.5 h-3.5 text-gray-600" />
                      ) : (
                        <ArrowDown className="w-3.5 h-3.5 text-gray-600" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>Giới thiệu</TableHead>
                  <TableHead className="w-[160px]">
                    <button
                      className="inline-flex items-center gap-1 font-medium"
                      onClick={() => toggleSort("price")}
                      title="Sắp xếp theo giá"
                    >
                      <span>Giá đề xuất</span>
                      {sortBy !== "price" ? (
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                      ) : sortDir === "asc" ? (
                        <ArrowUp className="w-3.5 h-3.5 text-gray-600" />
                      ) : (
                        <ArrowDown className="w-3.5 h-3.5 text-gray-600" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead className="w-[160px]">
                    <button
                      className="inline-flex items-center gap-1 font-medium"
                      onClick={() => toggleSort("status")}
                      title="Sắp xếp theo trạng thái"
                    >
                      <span>Trạng thái</span>
                      {sortBy !== "status" ? (
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                      ) : sortDir === "asc" ? (
                        <ArrowUp className="w-3.5 h-3.5 text-gray-600" />
                      ) : (
                        <ArrowDown className="w-3.5 h-3.5 text-gray-600" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead className="w-[140px]">Chứng chỉ</TableHead>
                  <TableHead className="w-[280px] text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!isHydrated && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-sm text-gray-600">
                      Đang tải...
                    </TableCell>
                  </TableRow>
                )}

                {isHydrated && loading && items.length === 0 &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={`sk-${i}`} className="hover:bg-transparent">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                          <div className="space-y-2">
                            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                            <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-10 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                {isHydrated && !loading && pagedItems.map((it) => (
                  <TableRow key={it.id} className="hover:bg-muted/40">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{initials(it.fullName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-gray-900">{it.fullName}</div>
                          <div className="text-xs text-gray-500">{it.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[520px] text-sm text-gray-700 line-clamp-2">
                        {it.introduction || "—"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Banknote className="w-3.5 h-3.5 text-gray-500" /> {displayPrice(it.price)}
                      </div>
                    </TableCell>
                    <TableCell>{statusBadge(it.status as TourguideRequestStatus)}</TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-700">
                        {it.certifications?.length ? <span>{it.certifications.length} mục</span> : <span>—</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="secondary" onClick={() => setOpenId(it.id)}>
                          <Eye className="w-4 h-4 mr-1" /> Xem chi tiết
                        </Button>
                        <Sheet>
                          {/* dummy wrapper to satisfy asChild types in some setups */}
                        </Sheet>
                        <ApproveDialog open={false} onOpenChange={() => { }} onConfirm={() => { }} note="" setNote={() => { }} />
                        <RejectDialog open={false} onOpenChange={() => { }} onConfirm={() => { }} reason="" setReason={() => { }} />
                        <button className="hidden" aria-hidden />
                        <Sheet>
                          {/* end dummy */}
                        </Sheet>
                        <span className="sr-only">Actions</span>
                        <>
                          {isPending(it.status) ? (
                            <Button size="sm" variant="outline" onClick={() => { setApprovingId(it.id); setApproveReason(""); }}>
                              <Check className="w-4 h-4 mr-1" /> Chấp nhận
                            </Button>
                          ) : null}
                          {isPending(it.status) ? (
                            <Button size="sm" variant="destructive" onClick={() => { setRejectingId(it.id); setRejectReason(""); }}>
                              <X className="w-4 h-4 mr-1" /> Từ chối
                            </Button>
                          ) : null}
                        </>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {isHydrated && !loading && pagedItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-sm text-gray-600">
                      Không có yêu cầu nào — thử đổi bộ lọc hoặc từ khóa.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3">
            <div className="text-sm text-gray-600">
              Hiển thị {Math.min((page - 1) * pageSize + 1, totalItems)}-{Math.min(page * pageSize, totalItems)} trong {totalItems}
            </div>
            <div className="flex items-center gap-2">
              <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
                <SelectTrigger className="w-28"><SelectValue placeholder="Số dòng" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 / trang</SelectItem>
                  <SelectItem value="20">20 / trang</SelectItem>
                  <SelectItem value="50">50 / trang</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Trước</Button>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Sau</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Sheet */}
        <Sheet open={!!openId} onOpenChange={(o) => !o && setOpenId(null)}>
          <SheetContent side="right" className="sm:max-w-lg">
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
    </div>
  );
}