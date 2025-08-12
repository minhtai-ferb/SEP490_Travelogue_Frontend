"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Clock, Calendar, Loader2, AlertCircle } from "lucide-react"
import { useLocationController } from "@/services/location-controller"
import type { Location, TourLocationBulkRequest } from "@/types/Tour"
import axios from "axios"
import { SeccretKey } from "@/secret/secret"

type PrevOfDay = {
	locationId: string
}

export interface TourLocationUpdateFormProps {
	tourDays: number
	initial: Partial<TourLocationBulkRequest> & { dayOrder: number }
	onSubmit: (payload: TourLocationBulkRequest) => Promise<void> | void
	onCancel: () => void
	prevOfDay?: PrevOfDay | null
}

const VIETMAP_ROUTE_ENDPOINT = "https://maps.vietmap.vn/api/route"

export default function TourLocationUpdateForm({ tourDays, initial, onSubmit, onCancel, prevOfDay }: TourLocationUpdateFormProps) {
	const [availableLocations, setAvailableLocations] = useState<Location[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [loadingLocations, setLoadingLocations] = useState(true)
	const [error, setError] = useState<string>("")

	const { getAllLocation } = useLocationController()

	const [form, setForm] = useState<TourLocationBulkRequest>({
		tourPlanLocationId: initial.tourPlanLocationId,
		locationId: initial.locationId || "",
		dayOrder: initial.dayOrder,
		startTime: normalizeTimeString(initial.startTime || (initial as any).startTimeFormatted || ""),
		endTime: normalizeTimeString(initial.endTime || (initial as any).endTimeFormatted || ""),
		notes: initial.notes || "",
		travelTimeFromPrev: initial.travelTimeFromPrev ?? 0,
		distanceFromPrev: initial.distanceFromPrev ?? 0,
		estimatedStartTime: initial.estimatedStartTime ?? 0,
		estimatedEndTime: initial.estimatedEndTime ?? 0,
	})

	useEffect(() => {
		const fetchLocations = async () => {
			try {
				setLoadingLocations(true)
				const response = await getAllLocation()
				if (response) setAvailableLocations(response)
			} catch (e) {
				console.error(e)
			} finally {
				setLoadingLocations(false)
			}
		}
		fetchLocations()
	}, [getAllLocation])

	const validate = (): boolean => {
		if (!form.locationId) return setErr("Địa điểm là bắt buộc")
		if (!form.startTime) return setErr("Thời gian bắt đầu là bắt buộc")
		if (!form.endTime) return setErr("Thời gian kết thúc là bắt buộc")
		if (form.startTime >= form.endTime) return setErr("Thời gian kết thúc phải sau thời gian bắt đầu")
		if (form.dayOrder < 1 || form.dayOrder > tourDays) return setErr(`Ngày phải từ 1 đến ${tourDays}`)
		return true
	}

	const setErr = (msg: string) => {
		setError(msg)
		return false
	}

	const handleAutoCompute = async () => {
		if (!prevOfDay?.locationId || !form.locationId) return
		const from = getCoords(prevOfDay.locationId)
		const to = getCoords(form.locationId)
		if (!from || !to) return
		const metrics = await fetchRouteMetrics(from, to)
		if (metrics) {
			setForm((p) => ({ ...p, distanceFromPrev: metrics.distanceKm, travelTimeFromPrev: metrics.durationMin }))
		}
	}

	const getCoords = (id: string) => {
		const loc = availableLocations.find((l) => l.id === id)
		if (!loc) return null
		return { latitude: loc.latitude, longitude: loc.longitude }
	}

	const handleSubmit = async () => {
		setError("")
		if (!validate()) return
		setIsLoading(true)
		try {
			const payload: TourLocationBulkRequest = {
				...form,
				startTime: normalizeTimeString(form.startTime),
				endTime: normalizeTimeString(form.endTime),
				estimatedStartTime:
					typeof form.estimatedStartTime === "number" && form.estimatedStartTime > 0
						? form.estimatedStartTime
						: toSecondsSinceMidnight(form.startTime),
				estimatedEndTime:
					typeof form.estimatedEndTime === "number" && form.estimatedEndTime > 0
						? form.estimatedEndTime
						: toSecondsSinceMidnight(form.endTime),
			}
			await onSubmit(payload)
		} catch (e: any) {
			setError(e?.response?.data?.message || e.message || "Có lỗi khi cập nhật địa điểm")
		} finally {
			setIsLoading(false)
		}
	}

	const durationLabel = useMemo(() => {
		if (!form.startTime || !form.endTime) return ""
		const start = new Date(`2000-01-01T${normalizeTimeString(form.startTime)}`)
		const end = new Date(`2000-01-01T${normalizeTimeString(form.endTime)}`)
		const diff = Math.max(0, end.getTime() - start.getTime())
		const mins = Math.floor(diff / 60000)
		if (mins < 60) return `${mins} phút`
		const h = Math.floor(mins / 60)
		const m = mins % 60
		return `${h}h${m ? ` ${m}m` : ""}`
	}, [form.startTime, form.endTime])

	const isEditingExisting = Boolean(form.tourPlanLocationId)

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span>{isEditingExisting ? "Cập Nhật Địa Điểm" : "Thêm Địa Điểm"}</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{error && (
					<Alert className="border-red-200 bg-red-50">
						<AlertCircle className="h-4 w-4 text-red-600" />
						<AlertDescription className="text-red-800">{error}</AlertDescription>
					</Alert>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label className="flex items-center gap-2"><MapPin className="w-4 h-4" />Địa điểm</Label>
						<Select
							value={form.locationId}
							onValueChange={(v) => setForm((p) => ({ ...p, locationId: v }))}
							disabled={isLoading || loadingLocations}
						>
							<SelectTrigger>
								<SelectValue placeholder={loadingLocations ? "Đang tải..." : "Chọn địa điểm"} />
							</SelectTrigger>
							<SelectContent>
								{availableLocations.map((loc) => (
									<SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label className="flex items-center gap-2"><Calendar className="w-4 h-4" />Ngày thứ</Label>
						<Select
							value={String(form.dayOrder)}
							onValueChange={(v) => setForm((p) => ({ ...p, dayOrder: Number(v) }))}
							disabled={isLoading}
						>
							<SelectTrigger>
								<SelectValue placeholder="Chọn ngày" />
							</SelectTrigger>
							<SelectContent>
								{Array.from({ length: tourDays }, (_, i) => i + 1).map((d) => (
									<SelectItem key={d} value={String(d)}>Ngày {d}</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label className="flex items-center gap-2"><Clock className="w-4 h-4" />Bắt đầu</Label>
						<Input type="time" value={trimTime(form.startTime)} onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))} />
					</div>
					<div className="space-y-2">
						<Label className="flex items-center gap-2"><Clock className="w-4 h-4" />Kết thúc</Label>
						<Input type="time" value={trimTime(form.endTime)} onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))} />
						{durationLabel && <p className="text-xs text-muted-foreground">Thời gian: {durationLabel}</p>}
					</div>

					<div className="space-y-2">
						<Label>Thời gian di chuyển (phút)</Label>
						<Input type="number" min={0} value={form.travelTimeFromPrev}
							onChange={(e) => setForm((p) => ({ ...p, travelTimeFromPrev: Number(e.target.value) || 0 }))} />
					</div>
					<div className="space-y-2">
						<Label>Khoảng cách (km)</Label>
						<Input type="number" min={0} value={form.distanceFromPrev}
							onChange={(e) => setForm((p) => ({ ...p, distanceFromPrev: Number(e.target.value) || 0 }))} />
					</div>

					<div className="md:col-span-2 space-y-2">
						<Label>Ghi chú</Label>
						<Textarea rows={3} value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
					</div>
				</div>

				<div className="flex justify-between items-center pt-4">
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						{isEditingExisting ? (
							<span>Cập nhật mục có tourPlanLocationId. Nếu để trống trường này nghĩa là thêm mới.</span>
						) : (
							<span>Thêm mới địa điểm. Để cập nhật, form sẽ nhận tourPlanLocationId.</span>
						)}
					</div>
					<div className="flex gap-2">
						{prevOfDay?.locationId && (
							<Button type="button" variant="outline" onClick={handleAutoCompute} disabled={isLoading || loadingLocations}>
								Tự tính quãng đường/di chuyển
							</Button>
						)}
						<Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>Hủy</Button>
						<Button type="button" onClick={handleSubmit} disabled={isLoading}>
							{isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
							{isEditingExisting ? "Cập nhật" : "Thêm mới"}
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

function normalizeTimeString(time: string): string {
	if (!time) return "00:00:00"
	const parts = time.split(":")
	if (parts.length === 2) return `${time}:00`
	return time
}

function trimTime(time: string): string {
	if (!time) return ""
	const parts = time.split(":")
	return `${parts[0] || "00"}:${parts[1] || "00"}`
}

function toSecondsSinceMidnight(time: string): number {
	const [h, m, s] = normalizeTimeString(time).split(":").map((v) => parseInt(v, 10) || 0)
	return h * 3600 + m * 60 + s
}

async function fetchRouteMetrics(
	from: { latitude: number; longitude: number },
	to: { latitude: number; longitude: number },
): Promise<{ distanceKm: number; durationMin: number } | null> {
	try {
		const params = new URLSearchParams({
			"api-version": "1.1",
			apikey: String(SeccretKey.VIET_MAP_KEY ?? ""),
			points_encoded: "false",
			vehicle: "car",
			point: `${from.latitude},${from.longitude}`,
		})
		const url = `${VIETMAP_ROUTE_ENDPOINT}?${params.toString()}&point=${to.latitude},${to.longitude}`
		const res = await axios.get(url)
		const path = res?.data?.paths?.[0]
		if (!path) return null
		const distanceMeters = Number(path.distance ?? 0)
		const timeMs = Number(path.time ?? 0)
		return { distanceKm: Math.round(distanceMeters / 1000), durationMin: Math.round(timeMs / 60000) }
	} catch {
		return null
	}
}


