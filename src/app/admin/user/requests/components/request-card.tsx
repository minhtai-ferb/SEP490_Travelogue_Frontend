"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Banknote, Check, Eye, X } from "lucide-react"
import type { TourGuideRequestItem, TourguideRequestStatus } from "@/types/Tourguide"
import { displayPrice, initials, isPending, resolveCertUrl } from "../utils/utils"
import StatusBadge from "./status-badge"

export function RequestCard({
  it,
  onOpenDetail,
  onApproveClick,
  onRejectClick,
}: {
  it: TourGuideRequestItem
  onOpenDetail: (id: string) => void
  onApproveClick: (id: string) => void
  onRejectClick: (id: string) => void
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{initials(it.fullName)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-gray-900">{it.fullName}</div>
              <div className="text-xs text-gray-500">{it.email}</div>
            </div>
          </div>
          <div className="text-xs"><StatusBadge status={it.status as TourguideRequestStatus} /></div>
        </div>

        {it.introduction && (
          <div className="mt-3 text-sm text-gray-700 line-clamp-3">{it.introduction}</div>
        )}

        <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
          <Banknote className="w-3 h-3" /> {displayPrice(it.price)}
        </div>

        {it.certifications?.length ? (
          <div className="mt-3">
            <div className="text-xs font-medium text-gray-700 mb-1">Chứng chỉ</div>
            <ul className="text-xs text-gray-600 list-disc pl-5 space-y-1">
              {it.certifications.map((c, idx) => (
                <li key={idx} className="truncate">
                  <span className="font-medium">{c.name}</span>
                  {c.certificateUrl ? (
                    <a className="ml-2 text-emerald-700 hover:underline" href={resolveCertUrl(c.certificateUrl)} target="_blank" rel="noreferrer">Xem</a>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-end gap-2">
          <Button size="sm" variant="secondary" onClick={() => onOpenDetail(it.id)}>
            <Eye className="w-4 h-4 mr-1" /> Xem chi tiết
          </Button>

          {isPending(it.status) ? (
            <Button size="sm" variant="outline" onClick={() => onApproveClick(it.id)}>
              <Check className="w-4 h-4 mr-1" /> Chấp nhận
            </Button>
          ) : (
            <Button size="sm" variant="outline" disabled className="hidden">
              <Check className="w-4 h-4 mr-1" /> Đã chấp nhận
            </Button>
          )}

          {isPending(it.status) ? (
            <Button size="sm" variant="destructive" onClick={() => onRejectClick(it.id)}>
              <X className="w-4 h-4 mr-1" /> Từ chối
            </Button>
          ) : (
            <Button size="sm" variant="destructive" disabled className="hidden">
              <X className="w-4 h-4 mr-1" /> Đã từ chối
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}