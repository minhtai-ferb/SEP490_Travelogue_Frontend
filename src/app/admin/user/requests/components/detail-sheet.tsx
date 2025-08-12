"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { TourGuideRequestItem, TourguideRequestStatus } from "@/types/Tourguide"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { displayPrice, initials, resolveCertUrl } from "../utils/utils"
import StatusBadge from "./status-badge"

export function DetailSheetContent({
  it,
  onApprove,
  onReject,
}: {
  it: TourGuideRequestItem
  onApprove: () => void
  onReject: () => void
}) {
  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>{initials(it.fullName)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold text-gray-900">{it.fullName}</div>
          <div className="text-xs text-gray-500">{it.email}</div>
        </div>
      </div>

      <div className="text-sm">
        <div className="text-gray-600">Giới thiệu</div>
        <div className="mt-1 whitespace-pre-wrap">{it.introduction || "—"}</div>
      </div>

      <div className="text-sm">
        <div className="text-gray-600">Mức giá đề xuất</div>
        <div className="mt-1">{displayPrice(it.price)}</div>
      </div>

      <div className="text-sm">
        <div className="text-gray-600">Trạng thái</div>
        <div className="mt-1"><StatusBadge status={it.status as TourguideRequestStatus} /></div>
      </div>

      <div className="text-sm">
        <div className="text-gray-600">Chứng chỉ</div>
        {it.certifications?.length ? (
          <ul className="mt-1 list-disc pl-5 space-y-1">
            {it.certifications.map((c, idx) => (
              <li key={idx}>
                <span className="font-medium">{c.name}</span>
                {c.certificateUrl ? (
                  <a className="ml-2 text-emerald-700 hover:underline" href={resolveCertUrl(c.certificateUrl)} target="_blank" rel="noreferrer">Xem</a>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-1">—</div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button size="sm" variant="outline" onClick={onApprove}>
          <Check className="w-4 h-4 mr-1" /> Chấp nhận
        </Button>
        <Button size="sm" variant="destructive" onClick={onReject}>
          <X className="w-4 h-4 mr-1" /> Từ chối
        </Button>
      </div>
    </div>
  )
}