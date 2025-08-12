import { TourguideRequestStatus } from "@/types/Tourguide"

export const displayPrice = (price?: number) =>
  typeof price === "number" ? price.toLocaleString("vi-VN") + " đ" : "—"

export const initials = (name?: string) => {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/)
  const f = parts[0]?.[0] ?? ""
  const l = parts.length > 1 ? parts[parts.length - 1][0] : ""
  return (f + l).toUpperCase()
}

export const resolveCertUrl = (url?: string) => {
  if (!url) return "#"
  if (/^https?:\/\//i.test(url)) return url
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || ""
  if (!base) return url
  return `${base.replace(/\/$/, "")}/${url.replace(/^\//, "")}`
}

export const isPending = (s?: TourguideRequestStatus | number) => Number(s) === Number(TourguideRequestStatus.Pending)