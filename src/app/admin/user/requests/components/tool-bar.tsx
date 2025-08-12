"use client"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { TourguideRequestStatus, TourguideRequestStatusDisplay } from "@/types/Tourguide"

export function Toolbar({
  query,
  setQuery,
  status,
  setStatus,
}: {
  query: string
  setQuery: (v: string) => void
  status: TourguideRequestStatus | "all"
  setStatus: (s: TourguideRequestStatus | "all") => void
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Tìm theo tên hoặc email hướng dẫn viên"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={String(status)} onValueChange={(v) => setStatus(v === "all" ? "all" : (Number(v) as TourguideRequestStatus))}>
        <SelectTrigger className="sm:w-56">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value={String(TourguideRequestStatus.Pending)}>{TourguideRequestStatusDisplay[TourguideRequestStatus.Pending]}</SelectItem>
          <SelectItem value={String(TourguideRequestStatus.Approved)}>{TourguideRequestStatusDisplay[TourguideRequestStatus.Approved]}</SelectItem>
          <SelectItem value={String(TourguideRequestStatus.Rejected)}>{TourguideRequestStatusDisplay[TourguideRequestStatus.Rejected]}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}