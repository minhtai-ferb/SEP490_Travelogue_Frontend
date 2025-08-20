"use client"
import { Badge } from "@/components/ui/badge"
import { TourguideRequestStatus, TourguideRequestStatusDisplay } from "@/types/Tourguide"

export default function StatusBadge({ status }: { status?: TourguideRequestStatus | number }) {
  const s = (status as TourguideRequestStatus) ?? TourguideRequestStatus.Pending
  switch (s) {
    case TourguideRequestStatus.Pending:
      return <Badge className="border-amber-200 bg-amber-100 text-amber-800">{TourguideRequestStatusDisplay[TourguideRequestStatus.Pending]}</Badge>
    case TourguideRequestStatus.Approved:
      return <Badge className="border-emerald-200 bg-emerald-100 text-emerald-800">{TourguideRequestStatusDisplay[TourguideRequestStatus.Approved]}</Badge>
    case TourguideRequestStatus.Rejected:
      return <Badge className="border-rose-200 bg-rose-100 text-rose-800">{TourguideRequestStatusDisplay[TourguideRequestStatus.Rejected]}</Badge>
    default:
      return <Badge variant="secondary">Trạng thái</Badge>
  }
}