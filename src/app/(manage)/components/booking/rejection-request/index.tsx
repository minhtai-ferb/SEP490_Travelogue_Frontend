"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  CheckIcon,
  EyeIcon,
  XIcon,
  Calendar,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import DataTable from "./component/DataTable";

import { useTourguideAssign } from "@/services/tourguide";
import { useRejectionRequest } from "@/services/use-rejectionrequest";
import {
  RejectionRequestDetail,
  TourGuideDetail,
  TourGuideItem,
} from "@/types/Tourguide";
import RequestDialog, {
  DialogMode,
  RejectionStatus,
} from "./component/request-dialog";
import { usePathname, useRouter } from "next/navigation";

const STATUS_OPTIONS: Array<{
  label: string;
  value: RejectionStatus | "all";
  icon: React.ReactNode;
  color: string;
}> = [
  {
    label: "Tất cả",
    value: "all",
    icon: <Filter className="w-4 h-4" />,
    color: "bg-gray-100 text-gray-800",
  },
  {
    label: "Chờ duyệt",
    value: RejectionStatus.Pending,
    icon: <Clock className="w-4 h-4" />,
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    label: "Đã duyệt",
    value: RejectionStatus.Approved,
    icon: <CheckCircle className="w-4 h-4" />,
    color: "bg-green-100 text-green-800",
  },
  {
    label: "Từ chối",
    value: RejectionStatus.Rejected,
    icon: <XCircle className="w-4 h-4" />,
    color: "bg-red-100 text-red-800",
  },
];

export default function RejectionRequestTable() {
  // services
  const { filterRejectionRequests, getRejectionRequestDetail } =
    useRejectionRequest();
  const { getTourguideProfile, getTourGuide } = useTourguideAssign();

  // table state
  const [data, setData] = useState<RejectionRequestDetail[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  // filters
  const [status, setStatus] = useState<RejectionStatus | "all">("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // dialog state
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [detail, setDetail] = useState<RejectionRequestDetail | null>(null);
  const [tourguideProfile, setTourguideProfile] =
    useState<TourGuideDetail | null>(null);
  const [guideOptions, setGuideOptions] = useState<TourGuideItem[]>([]);

  const listAbortRef = useRef<AbortController | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const fetchList = useCallback(
    async (opts?: {
      page?: number;
      pageSize?: number;
      status?: RejectionStatus | "all";
      fromDate?: string;
      toDate?: string;
    }) => {
      const _page = opts?.page ?? page;
      const _pageSize = opts?.pageSize ?? pageSize;
      const _status = opts?.status ?? status;
      const _from = opts?.fromDate ?? fromDate;
      const _to = opts?.toDate ?? toDate;

      listAbortRef.current?.abort();
      const controller = new AbortController();
      listAbortRef.current = controller;

      setLoading(true);
      try {
        const res = await filterRejectionRequests({
          pageNumber: _page,
          pageSize: _pageSize,
          Status: _status === "all" ? undefined : Number(_status),
          FromDate: _from,
          ToDate: _to,
        });
        setData(res?.items ?? []);
        setTotal(res?.totalCount ?? 0);
      } catch (err) {
        if ((err as any)?.name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, status, fromDate, toDate, filterRejectionRequests]
  );

  // initial & pagination fetch
  useEffect(() => {
    fetchList();
  }, [page, pageSize]);

  useEffect(() => {
    fetchList();
  }, [status, fromDate, toDate]);

  const openWithData = useCallback(
    async (id: string, mode: Exclude<DialogMode, null>) => {
      try {
        const res = await getRejectionRequestDetail(id);
        setDetail(res);

        const [profile, guides] = await Promise.all([
          res?.tourGuideId
            ? getTourguideProfile(res.tourGuideId)
            : Promise.resolve(null),
          mode !== "reject" ? getTourGuide() : Promise.resolve([]), // guides only needed for approve/view
        ]);

        setTourguideProfile((profile || null) as TourGuideDetail | null);
        setGuideOptions(Array.isArray(guides) ? guides : []);

        setDialogMode(mode);
        setOpenDialog(true);
      } catch (error) {
        console.error(error);
      }
    },
    [getRejectionRequestDetail, getTourguideProfile, getTourGuide]
  );

  const handleOpenView = useCallback(
    (id: string) => openWithData(id, "view"),
    [openWithData]
  );
  const handleOpenApprove = useCallback(
    (id: string) => openWithData(id, "approve"),
    [openWithData]
  );
  const handleOpenReject = useCallback(
    (id: string) => openWithData(id, "reject"),
    [openWithData]
  );

  const onSuccess = useCallback(() => {
    setOpenDialog(false);
    setDialogMode(null);
    setDetail(null);
    setTourguideProfile(null);
    fetchList({ page: 1 });
  }, [fetchList]);

  const columns: ColumnDef<RejectionRequestDetail>[] = useMemo(
    () => [
      {
        header: "Loại yêu cầu",
        accessorKey: "requestType",
        cell: ({ row }) => {
          const requestType = row.original.requestType;
          return (
            <div className="flex items-center justify-start">
              {requestType === 1 ? (
                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-300 font-medium px-3 py-1.5 rounded-lg shadow-sm"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Chuyến đi hệ thống
                </Badge>
              ) : requestType === 2 ? (
                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-orange-50 to-orange-100 text-orange-800 border-orange-300 font-medium px-3 py-1.5 rounded-lg shadow-sm"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Người dùng đặt
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-300 font-medium px-3 py-1.5 rounded-lg shadow-sm"
                >
                  <XIcon className="w-4 h-4 mr-2" />
                  Không xác định
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        header: "Hướng dẫn viên",
        accessorKey: "tourGuideId",
        cell: ({ row }) => {
          const tourGuideId = row.original.tourGuideId;
          return (
            <div className="space-y-1">
              <div
                className="font-medium text-gray-900 truncate max-w-[150px]"
                title={tourGuideId}
              >
                {tourGuideId}
              </div>
            </div>
          );
        },
      },
      {
        header: "Lý do",
        accessorKey: "reason",
        cell: ({ row }) => {
          const reason = row.original.reason;
          return (
            <div className="max-w-[200px]">
              <p className="text-sm text-gray-700 line-clamp-2" title={reason}>
                {reason}
              </p>
            </div>
          );
        },
      },
      {
        header: "Trạng thái",
        accessorKey: "status",
        cell: ({ row }) => {
          const status = row.original.status;
          const statusConfig = STATUS_OPTIONS.find(
            (opt) => opt.value === status
          );

          return (
            <Badge
              className={`${
                statusConfig?.color || "bg-gray-100 text-gray-800"
              } flex items-center gap-1 w-fit`}
            >
              {statusConfig?.icon}
              {statusConfig?.label || "Không xác định"}
            </Badge>
          );
        },
      },
      {
        header: "Nhận xét",
        accessorKey: "moderatorComment",
        cell: ({ row }) => {
          const comment = row.original.moderatorComment;
          return comment ? (
            <div className="max-w-[150px]">
              <p className="text-sm text-gray-600 line-clamp-1" title={comment}>
                {comment}
              </p>
            </div>
          ) : (
            <span className="text-gray-400 text-sm italic">
              Chưa có nhận xét
            </span>
          );
        },
      },
      {
        header: "Hành động",
        accessorKey: "action",
        cell: ({ row }) => {
          const requestType = row.original.requestType;
          const status = row.original.status;
          const isPending = status === RejectionStatus.Pending;
          
          return (
            <div className="flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                  >
                    <MoreHorizontal className="h-4 w-4 text-gray-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {/* View Detail Options */}
                  {requestType === 1 && (
                    <DropdownMenuItem
                      onClick={() => {
                        const basePath = pathname?.includes("/admin")
                          ? "/admin"
                          : "/moderator";
                        router.push(
                          `${basePath}/tour/${row.original.tourId}/tour-schedule/${row.original.tourScheduleId}`
                        );
                      }}
                      className="cursor-pointer"
                    >
                      <EyeIcon className="mr-2 h-4 w-4 text-blue-600" />
                      Xem lịch trình
                    </DropdownMenuItem>
                  )}
                  {requestType === 2 && (
                    <DropdownMenuItem
                      onClick={() => {
                        const basePath = pathname?.includes("/admin")
                          ? "/admin"
                          : "/moderator";
                        router.push(
                          `${basePath}/booking/tour-guide/${row.original.bookingId}`
                        );
                      }}
                      className="cursor-pointer"
                    >
                      <EyeIcon className="mr-2 h-4 w-4 text-orange-600" />
                      Xem booking
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem
                    onClick={() => handleOpenView(row.original.id)}
                    className="cursor-pointer"
                  >
                    <EyeIcon className="mr-2 h-4 w-4 text-gray-600" />
                    Xem chi tiết yêu cầu
                  </DropdownMenuItem>
                  
                  {/* Actions for Pending Status */}
                  {isPending && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleOpenApprove(row.original.id)}
                        className="cursor-pointer text-green-700 hover:bg-green-50"
                      >
                        <CheckIcon className="mr-2 h-4 w-4 text-green-600" />
                        Duyệt yêu cầu
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleOpenReject(row.original.id)}
                        className="cursor-pointer text-red-700 hover:bg-red-50"
                      >
                        <XIcon className="mr-2 h-4 w-4 text-red-600" />
                        Từ chối yêu cầu
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [handleOpenApprove, handleOpenReject, handleOpenView]
  );

  return (
    <div className="space-y-6">
      {/* Main Content */}
      <div className="shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Yêu cầu từ chối lịch trình
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Quản lý các yêu cầu từ chối từ hướng dẫn viên
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              {total} yêu cầu
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Filters Section */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-6 border border-gray-200">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Filter className="w-5 h-5 text-blue-600" />
                Bộ lọc tìm kiếm
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Trạng thái
                  </label>
                  <Select
                    value={String(status)}
                    onValueChange={(value) =>
                      setStatus(
                        value === "all"
                          ? "all"
                          : (Number(value) as RejectionStatus)
                      )
                    }
                  >
                    <SelectTrigger className="bg-white border-gray-300 hover:border-blue-400 transition-colors shadow-sm">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent className="bg-white shadow-lg border-gray-200">
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem
                          key={opt.label}
                          value={String(opt.value)}
                          className="hover:bg-blue-50"
                        >
                          <div className="flex items-center gap-2">
                            {opt.icon}
                            {opt.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Từ ngày
                  </label>
                  <DatePicker
                    placeholder="Chọn từ ngày"
                    value={fromDate ? dayjs(fromDate) : null}
                    onChange={(date) =>
                      setFromDate(date ? date.format("YYYY-MM-DD") : "")
                    }
                    format="DD/MM/YYYY"
                    className="w-full bg-white border-gray-300 hover:border-blue-400 transition-colors shadow-sm"
                    style={{ height: "40px" }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Đến ngày
                  </label>
                  <DatePicker
                    placeholder="Chọn đến ngày"
                    value={toDate ? dayjs(toDate) : null}
                    onChange={(date) =>
                      setToDate(date ? date.format("YYYY-MM-DD") : "")
                    }
                    format="DD/MM/YYYY"
                    className="w-full bg-white border-gray-300 hover:border-blue-400 transition-colors shadow-sm"
                    style={{ height: "40px" }}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => fetchList({ page: 1 })}
                    className="w-full bg-white hover:bg-blue-50 border-blue-300 text-blue-700 font-medium shadow-sm hover:shadow-md transition-all duration-200"
                    disabled={loading}
                  >
                    <RefreshCw
                      className={`w-4 h-4 mr-2 ${
                        loading ? "animate-spin" : ""
                      }`}
                    />
                    {loading ? "Đang tải..." : "Làm mới"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={data}
            loading={loading}
            total={total}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </CardContent>
      </div>

      <RequestDialog
        mode={dialogMode}
        open={openDialog}
        onOpenChange={(open, mode?: DialogMode) => {
          setOpenDialog(open);
          if (!open) setDialogMode(null);
          if (mode) setDialogMode(mode);
        }}
        detail={detail}
        tourguideProfile={tourguideProfile}
        guideOptions={guideOptions}
        onSuccess={onSuccess}
      />
    </div>
  );
}
