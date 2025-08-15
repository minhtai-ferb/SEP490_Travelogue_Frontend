"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useWorkshop } from "@/services/use-workshop"
import type { CreateActivityDto } from "@/types/Workshop"
import toast from "react-hot-toast"

type Props = {
	workshopId: string
	onNext: () => void
	onBack: () => void
}

export default function ActivitiesForm({ workshopId, onNext, onBack }: Props) {
	const { createActivitiesBulk, loading } = useWorkshop()
	const [activities, setActivities] = useState<CreateActivityDto[]>([
		{ activity: "", description: "", startTime: "08:00", endTime: "09:00", notes: "", dayOrder: 1 },
	])
	const [errors, setErrors] = useState<Record<number, string>>({})

	const addActivity = () => setActivities((prev) => ([...prev, { activity: "", description: "", startTime: "", endTime: "", notes: "", dayOrder: 1 }]))
	const removeActivity = (idx: number) => setActivities((prev) => prev.filter((_, i) => i !== idx))
	const updateActivity = (idx: number, field: keyof CreateActivityDto, value: any) => {
		setActivities((prev) => prev.map((a, i) => i === idx ? { ...a, [field]: value } : a))
		if (errors[idx]) setErrors((p) => { const n = { ...p }; delete n[idx]; return n })
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		const newErrors: Record<number, string> = {}
		activities.forEach((a, idx) => {
			if (!a.activity.trim()) newErrors[idx] = "Tên hoạt động là bắt buộc"
			const start = a.startTime
			const end = a.endTime
			if (start && end && start >= end) newErrors[idx] = "Thời gian không hợp lệ (bắt đầu < kết thúc)"
			if ((a.dayOrder ?? 0) < 1) newErrors[idx] = "Thứ tự ngày phải ≥ 1"
		})
		setErrors(newErrors)
		if (Object.keys(newErrors).length > 0) return
		try {
			const payload = { workshopId, activities }
			await createActivitiesBulk(payload)
			toast.success("Đã tạo hoạt động cho workshop")
			onNext()
		} catch (err: any) {
			toast.error(err?.response?.data?.message || "Tạo hoạt động thất bại")
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Thêm hoạt động</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-4">
						{activities.map((a, idx) => (
							<div key={idx} className="grid grid-cols-1 md:grid-cols-6 gap-3 border rounded-md p-3">
								<div className="md:col-span-2 space-y-1">
									<Label>Tên hoạt động</Label>
									<Input value={a.activity} onChange={(e) => updateActivity(idx, "activity", e.target.value)} required />
									{errors[idx] && <div className="text-xs text-red-600">{errors[idx]}</div>}
								</div>
								<div className="md:col-span-2 space-y-1">
									<Label>Mô tả</Label>
									<Textarea rows={2} value={a.description} onChange={(e) => updateActivity(idx, "description", e.target.value)} />
								</div>
								<div className="space-y-1">
									<Label>Bắt đầu</Label>
									<Input type="time" value={a.startTime} onChange={(e) => updateActivity(idx, "startTime", e.target.value)} />
								</div>
								<div className="space-y-1">
									<Label>Kết thúc</Label>
									<Input type="time" value={a.endTime} onChange={(e) => updateActivity(idx, "endTime", e.target.value)} />
								</div>
								<div className="md:col-span-2 space-y-1">
									<Label>Ghi chú</Label>
									<Input value={a.notes} onChange={(e) => updateActivity(idx, "notes", e.target.value)} />
								</div>
								<div className="space-y-1">
									<Label>Thứ tự ngày</Label>
									<Input type="number" min={1} value={a.dayOrder} onChange={(e) => updateActivity(idx, "dayOrder", Number(e.target.value) || 1)} />
								</div>
								<div className="flex items-end justify-end">
									<Button type="button" variant="destructive" onClick={() => removeActivity(idx)} disabled={activities.length === 1}>Xóa</Button>
								</div>
							</div>
						))}
					</div>
					<div className="flex justify-between">
						<Button type="button" variant="outline" onClick={addActivity}>Thêm hoạt động</Button>
						<div className="space-x-2">
							<Button type="button" variant="outline" onClick={onBack}>Quay lại</Button>
							<Button type="submit" disabled={loading}>Lưu & tiếp tục</Button>
						</div>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}


