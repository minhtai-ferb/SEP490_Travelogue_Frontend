"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRejectionRequest } from "@/services/use-rejectionrequest"
import { TourGuideItem } from "@/types/Tourguide"
import { useMemo, useState } from "react"
import { toast } from "react-hot-toast"

interface ApproveActionProps {
	requestId?: string | null
	guideOptions: TourGuideItem[]
	currentGuideId?: string | null
	onSuccess: () => void
}

export default function ApproveAction({ requestId, guideOptions, currentGuideId, onSuccess }: ApproveActionProps) {
	const { approveRejectionRequest } = useRejectionRequest()
	const [selectedGuideId, setSelectedGuideId] = useState<string>("")
	const [submitting, setSubmitting] = useState(false)

	const options = useMemo(() => (guideOptions || []).filter(g => !currentGuideId || g.id !== currentGuideId), [guideOptions, currentGuideId])
	const canSubmit = useMemo(() => !!selectedGuideId && !submitting, [selectedGuideId, submitting])

	return (
		<div className="space-y-2">
			<p className="text-xs text-muted-foreground">Chọn tourguide thay thế</p>
			<Select value={selectedGuideId} onValueChange={setSelectedGuideId}>
				<SelectTrigger>
					<SelectValue placeholder="Chọn tourguide" />
				</SelectTrigger>
				<SelectContent>
					{options.map((g) => (
						<SelectItem key={g.id} value={g.id}>{g.userName || g.email || g.id}</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Button className="w-full" disabled={!canSubmit} onClick={async () => {
				if (!requestId || !selectedGuideId) return
				setSubmitting(true)
				try {
					await approveRejectionRequest(requestId, { newTourGuideId: selectedGuideId })
					toast.success("Đã xác nhận yêu cầu")
					onSuccess()
				} catch {
					toast.error("Xác nhận thất bại")
				} finally {
					setSubmitting(false)
				}
			}}>Xác nhận</Button>
		</div>
	)
}


