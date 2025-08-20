'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTourguideAssign } from '@/services/tourguide'
import React, { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { RejectionRequestType } from '@/types/Tourguide'
import { toast } from 'react-hot-toast'

function RejectionDialog({ open, onOpenChange, item }: { open: boolean, onOpenChange: (open: boolean) => void, item: any }) {
	const [reason, setReason] = useState("")
	const [loading, setLoading] = useState(false)
	const { createRejectionRequest } = useTourguideAssign()

	const handleCreateRejectionRequest = async () => {
		console.log(item)
		try {
			setLoading(true)
			const response = await createRejectionRequest({
				requestType: item.bookingId ? 2 : 1,
				tourScheduleId: item?.tourScheduleId || null,
				bookingId: item?.bookingId || null,
				reason: reason
			})
			console.log(response)
			toast.success("Đã gửi đơn từ chối lịch trình này, vui lòng chờ hệ thống xử lý")
			onOpenChange(false)
			setReason("")
		} catch (error: any) {
			console.log(error)
			toast?.error(error?.response?.data?.Message || "Lỗi khi từ chối lịch trình")
		} finally {
			setLoading(false)
		}

	}
	return (
		<div>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Từ chối lịch trình</DialogTitle>
						<DialogDescription>
							<div className="flex flex-col gap-2">
								<p>Lý do bạn từ chối lịch trình này ?</p>
								<Textarea placeholder="Lý do" value={reason} onChange={(e) => setReason(e.target.value)} />
								<p className="text-sm text-gray-500">Lý do sẽ được gửi đến người dùng đặt lịch trình</p>
							</div>
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button onClick={handleCreateRejectionRequest} disabled={!reason || loading} className="bg-red-500 text-white">
							{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Từ chối"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default RejectionDialog
