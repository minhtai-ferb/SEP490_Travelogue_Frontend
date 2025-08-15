"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useWorkshop } from "@/services/use-workshop"
import type { CreateScheduleDto } from "@/types/Workshop"
import toast from "react-hot-toast"

type Props = {
	workshopId: string
	onBack: () => void
}

export default function SchedulesForm({ workshopId, onBack }: Props) {
	const { createSchedules, submitWorkshop, loading } = useWorkshop()
	const [schedules, setSchedules] = useState<CreateScheduleDto[]>([
		{ startTime: "2025-01-01T08:00", endTime: "2025-01-01T10:00", maxParticipant: 10, adultPrice: 0, childrenPrice: 0, notes: "" },
	])

	const addSchedule = () => setSchedules((prev) => ([...prev, { startTime: "", endTime: "", maxParticipant: 0, adultPrice: 0, childrenPrice: 0, notes: "" }]))
	const removeSchedule = (idx: number) => setSchedules((prev) => prev.filter((_, i) => i !== idx))
	const updateSchedule = (idx: number, field: keyof CreateScheduleDto, value: any) => {
		setSchedules((prev) => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			await createSchedules(workshopId, schedules)
			toast.success("Đã tạo lịch cho workshop")
			await submitWorkshop(workshopId)
			toast.success("Đã gửi workshop lên moderator duyệt")
		} catch (err: any) {
			toast.error(err?.response?.data?.message || "Tạo lịch thất bại")
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Thêm lịch</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-4">
						{schedules.map((s, idx) => (
							<div key={idx} className="grid grid-cols-1 md:grid-cols-6 gap-3 border rounded-md p-3">
								<div className="space-y-1">
									<Label>Bắt đầu</Label>
									<Input type="datetime-local" value={s.startTime} onChange={(e) => updateSchedule(idx, "startTime", e.target.value)} />
								</div>
								<div className="space-y-1">
									<Label>Kết thúc</Label>
									<Input type="datetime-local" value={s.endTime} onChange={(e) => updateSchedule(idx, "endTime", e.target.value)} />
								</div>
								<div className="space-y-1">
									<Label>Số người tối đa</Label>
									<Input type="number" min={1} value={s.maxParticipant} onChange={(e) => updateSchedule(idx, "maxParticipant", Number(e.target.value) || 1)} />
								</div>
								<div className="space-y-1">
									<Label>Giá người lớn</Label>
									<Input type="number" min={0} value={s.adultPrice} onChange={(e) => updateSchedule(idx, "adultPrice", Number(e.target.value) || 0)} />
								</div>
								<div className="space-y-1">
									<Label>Giá trẻ em</Label>
									<Input type="number" min={0} value={s.childrenPrice} onChange={(e) => updateSchedule(idx, "childrenPrice", Number(e.target.value) || 0)} />
								</div>
								<div className="space-y-1 md:col-span-2">
									<Label>Ghi chú</Label>
									<Input value={s.notes} onChange={(e) => updateSchedule(idx, "notes", e.target.value)} />
								</div>
								<div className="flex items-end justify-end">
									<Button type="button" variant="destructive" onClick={() => removeSchedule(idx)} disabled={schedules.length === 1}>Xóa</Button>
								</div>
							</div>
						))}
					</div>
					<div className="flex justify-between">
						<Button type="button" variant="outline" onClick={addSchedule}>Thêm lịch</Button>
						<div className="space-x-2">
							<Button type="button" variant="outline" onClick={onBack}>Quay lại</Button>
							<Button type="submit" disabled={loading}>{loading ? "Đang xử lý..." : "Lưu & gửi duyệt"}</Button>
						</div>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}


