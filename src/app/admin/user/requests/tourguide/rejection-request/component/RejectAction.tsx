"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRejectionRequest } from "@/services/use-rejectionrequest"
import { useMemo, useState } from "react"
import { toast } from "react-hot-toast"

interface RejectActionProps {
	requestId?: string | null
	onSuccess: () => void
}

export default function RejectAction({ requestId, onSuccess }: RejectActionProps) {
	const { rejectRejectionRequest } = useRejectionRequest()
	const [note, setNote] = useState("")
	const [submitting, setSubmitting] = useState(false)
	const canSubmit = useMemo(() => note.trim().length > 0 && !submitting, [note, submitting])

	return (
		<div className="space-y-2">
			<p className="text-xs text-muted-foreground">Nhận xét (bắt buộc khi từ chối)</p>
			<Textarea rows={4} placeholder="Nhập nhận xét..." value={note} onChange={(e) => setNote(e.target.value)} />
			<Button variant="destructive" className="w-full" disabled={!canSubmit} onClick={async () => {
				if (!requestId || note.trim().length === 0) return
				setSubmitting(true)
				try {
					await rejectRejectionRequest(requestId, { moderatorComment: note.trim() })
					toast.success("Đã từ chối yêu cầu")
					onSuccess()
				} catch {
					toast.error("Từ chối thất bại")
				} finally {
					setSubmitting(false)
				}
			}}>Từ chối</Button>
		</div>
	)
}


