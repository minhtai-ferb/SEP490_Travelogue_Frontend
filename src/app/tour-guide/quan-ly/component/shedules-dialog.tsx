"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTour } from "@/services/tour"
import { useTourguideAssign } from "@/services/tourguide"
import type { ScheduleFormData } from "@/types/Tour"
import { CalendarDays } from 'lucide-react'
import { useMemo, useState } from "react"
import { toast } from "sonner"

interface Schedule {
	scheduleId: string
	departureDate: string
	maxParticipant: number
	currentBooked: number
	totalDays?: number
	adultPrice: number
	childrenPrice: number
}

export default function SchedulesDialog({
	open,
	onOpenChange,
	tourId,
	initialSchedules,
	onRefetch,
}: {
	open: boolean
	onOpenChange: (v: boolean) => void
	tourId: string
	initialSchedules: Schedule[]
	onRefetch: () => Promise<void> | void
}) {
	const { updateTourSchedule, loading: loadingSchedule } = useTour()
	const [editing, setEditing] = useState<Record<string, Partial<Schedule>>>({})
	const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules)
	const [confirmId, setConfirmId] = useState<string | null>(null)

	// Add schedule state
	const [newSchedule, setNewSchedule] = useState<ScheduleFormData | null>(null)

	const hasChanges = useMemo(() => Object.keys(editing).length > 0, [editing])

	const onChangeField = (id: string, field: keyof Schedule, value: any) => {
		setEditing((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }))
		setSchedules((prev) => prev.map((s) => (s.scheduleId === id ? { ...s, [field]: value } : s)))
	}

	const saveOne = async (s: Schedule) => {
		try {
			const payload: ScheduleFormData = {
				departureDate: s.departureDate,
				maxParticipant: s.maxParticipant,
				adultPrice: s.adultPrice,
				childrenPrice: s.childrenPrice,
				totalDays: s.totalDays || 1, // Đảm bảo luôn có giá trị, mặc định là 1
			}
			await updateTourSchedule(tourId, s.scheduleId, payload)
			setEditing((prev) => {
				const copy = { ...prev }
				delete copy[s.scheduleId]
				return copy
			})
			toast.success("Cập nhật lịch khởi hành thành công.")
			await Promise.resolve(onRefetch())
		} catch (e: any) {
			toast.error("Lỗi: " + e?.message || "Không thể lưu")
		}
	}

	// const confirmDelete = async () => {
	// 	if (!confirmId) return
	// 	try {
	// 		await deleteTourSchedule(confirmId, tourId)
	// 		setSchedules((prev) => prev.filter((s) => s.scheduleId !== confirmId))
	// 		setConfirmId(null)
	// 		toast({ title: "Đã xóa", description: "Lịch khởi hành đã được xóa." })
	// 		await Promise.resolve(onRefetch())
	// 	} catch (e: any) {
	// 		toast({ title: "Lỗi", description: e?.message || "Không thể xóa", variant: "destructive" })
	// 	}
	// }

	// const addSchedule = async () => {
	// 	if (!newSchedule) return
	// 	try {
	// 		await createTourSchedule(tourId, [newSchedule])
	// 		setNewSchedule(null)
	// 		toast({ title: "Thành công", description: "Đã thêm lịch khởi hành." })
	// 		await Promise.resolve(onRefetch())
	// 	} catch (e: any) {
	// 		toast({ title: "Lỗi", description: e?.message || "Không thể thêm", variant: "destructive" })
	// 	}
	// }

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl">
				<DialogHeader>
					<DialogTitle>Quản lý lịch khởi hành</DialogTitle>
					<DialogDescription>Thêm, sửa, xóa các lịch của tour</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* Add schedule */}
					<div className="rounded-xl border p-4 bg-blue-50/40">
						<div className="font-medium mb-3">Thêm lịch mới</div>
						<div className="grid sm:grid-cols-5 gap-3">
							<div className="sm:col-span-2">
								<Label>Ngày khởi hành</Label>
								<Input
									type="date"
									value={newSchedule?.departureDate ? newSchedule.departureDate.toString().slice(0, 10) : ""}
									onChange={(e) =>
										setNewSchedule((prev: any) => ({
											...(prev || {}),
											departureDate: e.target.value,
										}))
									}
								/>
							</div>
							<div>
								<Label>Số khách tối đa</Label>
								<Input
									type="number"
									min={1}
									value={(newSchedule as any)?.maxParticipant || ""}
									onChange={(e) =>
										setNewSchedule((prev: any) => ({
											...(prev || {}),
											maxParticipant: Number(e.target.value),
										}))
									}
								/>
							</div>
							<div>
								<Label>Giá người lớn</Label>
								<Input
									type="number"
									min={0}
									value={(newSchedule as any)?.adultPrice || ""}
									onChange={(e) =>
										setNewSchedule((prev: any) => ({
											...(prev || {}),
											adultPrice: Number(e.target.value),
										}))
									}
								/>
							</div>
							<div>
								<Label>Giá trẻ em</Label>
								<Input
									type="number"
									min={0}
									value={(newSchedule as any)?.childrenPrice || ""}
									onChange={(e) =>
										setNewSchedule((prev: any) => ({
											...(prev || {}),
											childrenPrice: Number(e.target.value),
										}))
									}
								/>
							</div>
						</div>
						{/* <div className="mt-3 flex justify-end">
							<Button onClick={addSchedule} disabled={loading}>
								Thêm lịch
							</Button>
						</div> */}
					</div>

					{/* Existing schedules */}
					<div className="overflow-x-auto">
						<table className="min-w-full text-sm">
							<thead>
								<tr className="text-left text-gray-600 border-b">
									<th className="py-2 pr-4">Ngày khởi hành</th>
									<th className="py-2 pr-4">Tối đa</th>
									<th className="py-2 pr-4">Đã đặt</th>
									<th className="py-2 pr-4">Giá NL</th>
									<th className="py-2 pr-4">Giá TE</th>
									<th className="py-2 pr-4 text-right">Thao tác</th>
								</tr>
							</thead>
							<tbody>
								{schedules.map((s) => {
									const dirty = editing[s.scheduleId]
									return (
										<tr key={s.scheduleId} className="border-b last:border-0">
											<td className="py-2 pr-4">
												<div className="flex items-center gap-2">
													<CalendarDays className="w-4 h-4 text-gray-500" />
													<Input
														type="date"
														value={s.departureDate.slice(0, 10)}
														onChange={(e) => onChangeField(s.scheduleId, "departureDate", e.target.value)}
													/>
												</div>
											</td>
											<td className="py-2 pr-4">
												<Input
													type="number"
													min={1}
													value={s.maxParticipant}
													onChange={(e) => onChangeField(s.scheduleId, "maxParticipant", Number(e.target.value))}
												/>
											</td>
											<td className="py-2 pr-4">{s.currentBooked}</td>
											<td className="py-2 pr-4">
												<Input
													type="number"
													min={0}
													value={s.adultPrice}
													onChange={(e) => onChangeField(s.scheduleId, "adultPrice", Number(e.target.value))}
												/>
											</td>
											<td className="py-2 pr-4">
												<Input
													type="number"
													min={0}
													value={s.childrenPrice}
													onChange={(e) => onChangeField(s.scheduleId, "childrenPrice", Number(e.target.value))}
												/>
											</td>
											{/* <td className="py-2 pr-4 text-right">
												<div className="flex justify-end gap-2">
													<Button
														variant="outline"
														size="sm"
														onClick={() => saveOne(s)}
														disabled={!dirty || loading}
													>
														Lưu
													</Button>
													<Button
														variant="destructive"
														size="sm"
														onClick={() => setConfirmId(s.scheduleId)}
													>
														<Trash2 className="w-4 h-4 mr-1" />
														Xóa
													</Button>
												</div>
											</td> */}
										</tr>
									)
								})}
								{schedules.length === 0 && (
									<tr>
										<td colSpan={6} className="py-6 text-center text-gray-500">
											Chưa có lịch nào
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					{/* Confirm delete modal */}
					{/* {confirmId && (
						<div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center">
							<div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
								<h3 className="text-lg font-semibold">Xóa lịch khởi hành?</h3>
								<p className="text-sm text-gray-600 mt-1">
									Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa?
								</p>
								<div className="mt-4 flex justify-end gap-2">
									<Button variant="outline" onClick={() => setConfirmId(null)}>
										Hủy
									</Button>
									<Button variant="destructive" onClick={confirmDelete} disabled={loading}>
										Xác nhận xóa
									</Button>
								</div>
							</div>
						</div>
					)} */}
				</div>
			</DialogContent>
		</Dialog>
	)
}
