"use client"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Loader2 } from "lucide-react"
import type { TourDetail } from "@/types/Tour"

interface DeleteConfirmationProps {
	tour: TourDetail
	onConfirm: () => void
	onCancel: () => void
	isLoading?: boolean
}

export function DeleteConfirmation({ tour, onConfirm, onCancel, isLoading = false }: DeleteConfirmationProps) {
	const hasBookings = tour?.schedules?.some((schedule) => schedule.currentBooked > 0)
	const totalBookings = tour?.schedules?.reduce((total, schedule) => total + schedule.currentBooked, 0)

	return (
		<div className="space-y-4">
			<Alert className="flex gap-3 border-red-200 bg-red-50">
				<AlertTriangle className="h-6 w-6" color="red" />
				<AlertDescription className="my-auto mt-2 ml-3 text-red-800">
					<strong>Cảnh báo:</strong> Hành động này không thể hoàn tác!
				</AlertDescription>
			</Alert>

			<div className="space-y-3">
				<p className="text-gray-700">
					Bạn có chắc chắn muốn xóa tour <strong>"{tour.name}"</strong> không?
				</p>

				{hasBookings && (
					<Alert className="border-orange-200 bg-orange-50">
						<AlertTriangle className="h-4 w-4 text-orange-600" />
						<AlertDescription className="text-orange-800">
							Tour này hiện có <strong>{totalBookings} booking</strong>. Việc xóa tour sẽ ảnh hưởng đến khách hàng đã
							đặt tour.
						</AlertDescription>
					</Alert>
				)}

				<div className="bg-gray-50 p-3 rounded-lg text-sm">
					<h4 className="font-medium text-gray-900 mb-2">Thông tin tour sẽ bị xóa:</h4>
					<ul className="space-y-1 text-gray-600">
						<li>• Tên tour: {tour.name}</li>
						<li>• Loại tour: {tour.tourTypeText}</li>
						<li>• Thời gian: {tour.totalDaysText}</li>
						<li>• Số lịch trình: {tour?.schedules?.length || 0}</li>
						<li>• Tổng địa điểm: {tour?.days?.reduce((total, day) => total + day.activities.length, 0) || 0}</li>
					</ul>
				</div>
			</div>

			<div className="flex gap-3 justify-end pt-4 border-t">
				<Button variant="outline" onClick={onCancel} disabled={isLoading}>
					Hủy
				</Button>
				<Button variant="destructive" onClick={onConfirm} disabled={isLoading} className="flex items-center gap-2">
					{isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
					Xác nhận xóa
				</Button>
			</div>
		</div>
	)
}
