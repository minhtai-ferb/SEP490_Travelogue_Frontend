import { useCallback, useRef } from 'react'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import ApproveAction from '../ApproveAction'
import RejectAction from '../RejectAction'

import { RejectionRequestDetail, TourGuideDetail, TourGuideItem } from '@/types/Tourguide'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EyeIcon, ExternalLinkIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'


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
	const shouldShowComment = detail?.status === RejectionStatus.Rejected;
	const router = useRouter();
	const pathname = usePathname();
	
	return (
		<div className="space-y-4">
			{/* Basic Information */}
			<div className="bg-gray-50 p-4 rounded-lg">
				<h3 className="text-sm font-semibold text-gray-700 mb-3">Thông tin cơ bản</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground">Loại yêu cầu</p>
						<div className="flex items-center">
							{detail?.requestType === 1 ? (
								<Badge className="bg-blue-50 text-blue-700 border-blue-200">
									Chuyến đi hệ thống
								</Badge>
							) : detail?.requestType === 2 ? (
								<Badge className="bg-orange-50 text-orange-700 border-orange-200">
									Người dùng đặt
								</Badge>
							) : (
								<Badge className="bg-gray-50 text-gray-600 border-gray-200">
									Không xác định
								</Badge>
							)}
						</div>
					</div>
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
					{/* View Detail Buttons */}
					<div className="space-y-1 sm:col-span-2">
						<p className="text-xs text-muted-foreground">Chi tiết liên quan</p>
						<div className="flex flex-wrap gap-2">
							{detail?.requestType === 1 && detail?.tourId && detail?.tourScheduleId && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										const basePath = pathname?.includes("/admin") ? "/admin" : "/moderator";
										router.push(`${basePath}/tour/${detail.tourId}/tour-schedule/${detail.tourScheduleId}`);
									}}
									className="h-8 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
								>
									<EyeIcon className="w-3 h-3 mr-2" />
									Xem chi tiết lịch trình
									<ExternalLinkIcon className="w-3 h-3 ml-1" />
								</Button>
							)}
							{detail?.requestType === 2 && detail?.bookingId && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										const basePath = pathname?.includes("/admin") ? "/admin" : "/moderator";
										router.push(`${basePath}/booking/tour-guide/${detail.bookingId}`);
									}}
									className="h-8 border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300"
								>
									<EyeIcon className="w-3 h-3 mr-2" />
									Xem chi tiết đặt chỗ
									<ExternalLinkIcon className="w-3 h-3 ml-1" />
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Tour Guide Information */}
			<div className="bg-blue-50 p-4 rounded-lg">
				<h3 className="text-sm font-semibold text-blue-700 mb-3">Thông tin hướng dẫn viên</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground">Tên hướng dẫn viên</p>
						<p className="font-medium">{tourguideProfile?.userName || '-'}</p>
					</div>
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground">Email</p>
						<p className="font-medium break-all">{tourguideProfile?.email || '-'}</p>
					</div>
				</div>
			</div>

			{/* Request Details */}
			<div className="bg-red-50 p-4 rounded-lg">
				<h3 className="text-sm font-semibold text-red-700 mb-3">Chi tiết yêu cầu từ chối</h3>
				<div className="space-y-3">
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground font-semibold text-red-600">Lý do từ chối</p>
						<div className="bg-white p-3 rounded border border-red-200">
							<p className="font-medium text-gray-800 whitespace-pre-wrap">{detail?.reason || '-'}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Review Information - Only show for rejected requests */}
			{shouldShowComment && (
				<div className="bg-gray-100 p-4 rounded-lg">
					<h3 className="text-sm font-semibold text-gray-700 mb-3">Thông tin xử lý</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div className="space-y-1">
							<p className="text-xs text-muted-foreground">Người xử lý</p>
							<p className="font-medium">{detail?.reviewedBy || '-'}</p>
						</div>
						<div className="space-y-1">
							<p className="text-xs text-muted-foreground">Thời gian xử lý</p>
							<p className="font-medium">{detail?.reviewedAt ? new Date(detail.reviewedAt).toLocaleString('vi-VN') : '-'}</p>
						</div>
						<div className="space-y-1 sm:col-span-2">
							<p className="text-xs text-muted-foreground">Nhận xét</p>
							<div className="bg-white p-3 rounded border border-gray-300">
								<p className="font-medium whitespace-pre-wrap text-gray-800">{detail?.moderatorComment || 'Không có nhận xét'}</p>
							</div>
						</div>
					</div>
				</div>
			)}
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
			<DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold text-gray-800">Chi tiết yêu cầu từ chối</DialogTitle>
				</DialogHeader>
				<div className="space-y-6">
					<DetailSection detail={detail} tourguideProfile={tourguideProfile} />

					<div className="border-t pt-4 space-y-3">
						<div className={`grid ${mode === 'view' ? 'sm:grid-cols-2 grid-cols-1 gap-3' : ''}`}>
							<p className="text-sm font-semibold text-gray-700">Xử lý yêu cầu</p>
							{mode === 'view' && detail?.status === RejectionStatus.Pending ? (
								<div className="col-span-2">
									<div className="grid grid-cols-2 gap-3">
										<Button 
											variant="default" 
											size="sm" 
											onClick={() => onOpenChange(true, 'approve')}
											className="bg-green-600 hover:bg-green-700"
										>
											Đồng ý yêu cầu
										</Button>
										<Button 
											variant="destructive" 
											size="sm" 
											onClick={() => onOpenChange(true, 'reject')}
										>
											Từ chối yêu cầu
										</Button>
									</div>
								</div>
							) : mode === 'approve' ? (
								<ApproveAction
									guideOptions={guideOptions}
									onSuccess={onSuccess}
									requestId={detail?.id}
									currentGuideId={tourguideProfile?.id}
								/>
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
