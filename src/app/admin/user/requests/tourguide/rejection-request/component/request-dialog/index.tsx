
import { useCallback, useRef } from 'react'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import ApproveAction from '../ApproveAction'
import RejectAction from '../RejectAction'

import { RejectionRequestDetail, TourGuideDetail, TourGuideItem } from '@/types/Tourguide'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'


// 1) Status constants & helpers
export enum RejectionStatus {
	Pending = 1,
	Approved = 2,
	Rejected = 3,
}

// 2) Dialog modes
export type DialogMode = 'view' | 'approve' | 'reject' | null


// 3) Small debounce util (no external deps)
export function useDebouncedCallback<T extends (...args: any[]) => void>(fn: T, delay = 400) {
	const timerRef = useRef<NodeJS.Timeout | null>(null)
	return useCallback(
		(...args: Parameters<T>) => {
			if (timerRef.current) clearTimeout(timerRef.current)
			timerRef.current = setTimeout(() => fn(...args), delay)
		},
		[fn, delay],
	)
}

// 4) Detail section reused by all dialog modes
function DetailSection({
	detail,
	tourguideProfile,
}: {
	detail: RejectionRequestDetail | null
	tourguideProfile: TourGuideDetail | null
}) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<div className="space-y-1">
				<p className="text-xs text-muted-foreground">Trạng thái</p>
				<Badge className={`font-medium ${detail?.statusText === "Pending" ? "bg-amber-100 text-amber-800 border-amber-200"
					: detail?.statusText === "Approved" ? "bg-green-100 text-green-800 border-green-200"
						: detail?.statusText === "Rejected" ? "bg-red-100 text-red-800 border-red-200" : ''}`}>
					{detail?.statusText === "Pending" ? "Đang chờ duyệt"
						: detail?.statusText === "Approved" ? "Đã duyệt"
							: detail?.statusText === "Rejected" ? "Đã từ chối" : '-'}
				</Badge>
			</div>
			<div className="space-y-1">
				<p className="text-xs text-muted-foreground">Tourguide</p>
				<p className="font-medium">{tourguideProfile?.userName || '-'}</p>
			</div>
			<div className="space-y-1">
				<p className="text-xs text-muted-foreground">Email</p>
				<p className="font-medium break-all">{tourguideProfile?.email || '-'}</p>
			</div>
			<div className="space-y-1 sm:col-span-2">
				<p className="text-xs text-muted-foreground text-red-500 font-bold">Lý do</p>
				<p className="font-medium">{detail?.reason || '-'}</p>
			</div>
			<div className="space-y-1 sm:col-span-2">
				<p className="text-xs text-muted-foreground">Nhận xét</p>
				<p className="font-medium whitespace-pre-wrap">{detail?.moderatorComment || '-'}</p>
			</div>
		</div>
	)
}

function RequestDialog({
	mode,
	open,
	onOpenChange,
	detail,
	tourguideProfile,
	guideOptions,
	onSuccess,
}: {
	mode: DialogMode
	open: boolean
	onOpenChange: (open: boolean, mode?: DialogMode) => void
	detail: RejectionRequestDetail | null
	tourguideProfile: TourGuideDetail | null
	guideOptions: TourGuideItem[]
	onSuccess: () => void
}) {
	if (!mode) return null
	const showApprove = mode === 'approve' || mode === 'view'
	const showReject = mode === 'reject' || mode === 'view'

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold">Chi tiết yêu cầu</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<DetailSection detail={detail} tourguideProfile={tourguideProfile} />

					<div className="border-t pt-4 space-y-3">
						<div className={`grid ${mode === 'view' ? 'sm:grid-cols-2 grid-cols-1 gap-3' : ''}`}>
							<p className="text-sm font-medium">Xử lý</p>
							{mode === 'view' && detail?.status === RejectionStatus.Pending ? (
								<div className="col-span-2">
									<p className="text-sm text-muted-foreground grid grid-cols-2 gap-2">
										<Button variant="default" size="sm" onClick={() => onOpenChange(true, 'approve')}>Đồng ý</Button>
										<Button variant="destructive" size="sm" onClick={() => onOpenChange(true, 'reject')}>Từ chối</Button>
									</p>
								</div>
							) : mode === 'approve' ? (
								<>
									<ApproveAction guideOptions={guideOptions} onSuccess={onSuccess} requestId={detail?.id} />
								</>
							) : mode === 'reject' ? (
								<RejectAction requestId={detail?.id} onSuccess={onSuccess} />
							) : null}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
export default RequestDialog
