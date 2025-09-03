'use client'

import { ColumnDef } from '@tanstack/react-table'
import { CheckIcon, EyeIcon, XIcon } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import DataTable from './component/DataTable'

import { useTourguideAssign } from '@/services/tourguide'
import { useRejectionRequest } from '@/services/use-rejectionrequest'
import { RejectionRequestDetail, TourGuideDetail, TourGuideItem } from '@/types/Tourguide'
import RequestDialog, { DialogMode, RejectionStatus } from './component/request-dialog'

const STATUS_OPTIONS: Array<{ label: string; value: RejectionStatus | 'all' }> = [
	{ label: 'Tất cả', value: 'all' },
	{ label: 'Chờ duyệt', value: RejectionStatus.Pending },
	{ label: 'Đã duyệt', value: RejectionStatus.Approved },
	{ label: 'Từ chối', value: RejectionStatus.Rejected },
]

export default function RejectionRequestTable() {
	// services
	const { filterRejectionRequests, getRejectionRequestDetail } = useRejectionRequest()
	const { getTourguideProfile, getTourGuide, getAvailableTourGuides, getTourScheduleDetails } = useTourguideAssign()

	// table state
	const [data, setData] = useState<RejectionRequestDetail[]>([])
	const [total, setTotal] = useState(0)
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [loading, setLoading] = useState(false)

	// filters
	const [status, setStatus] = useState<RejectionStatus | 'all'>('all')
	const [fromDate, setFromDate] = useState('')
	const [toDate, setToDate] = useState('')

	// dialog state
	const [dialogMode, setDialogMode] = useState<DialogMode>(null)
	const [openDialog, setOpenDialog] = useState(false)
	const [detail, setDetail] = useState<RejectionRequestDetail | null>(null)
	const [tourguideProfile, setTourguideProfile] = useState<TourGuideDetail | null>(null)
	const [guideOptions, setGuideOptions] = useState<TourGuideItem[]>([])

	const listAbortRef = useRef<AbortController | null>(null)

	const fetchList = useCallback(
		async (opts?: { page?: number; pageSize?: number; status?: RejectionStatus | 'all'; fromDate?: string; toDate?: string }) => {
			const _page = opts?.page ?? page
			const _pageSize = opts?.pageSize ?? pageSize
			const _status = (opts?.status ?? status)
			const _from = opts?.fromDate ?? fromDate
			const _to = opts?.toDate ?? toDate

			listAbortRef.current?.abort()
			const controller = new AbortController()
			listAbortRef.current = controller

			setLoading(true)
			try {
				const params = {
					pageNumber: _page,
					pageSize: _pageSize,
					Status: _status === 'all' ? undefined : Number(_status),
					FromDate: _from,
					ToDate: _to,
				}

				console.log('Rejection Request Params:', params) // Debug log

				const res = await filterRejectionRequests(params)

				console.log('Rejection Request Response:', res) // Debug log

				setData(res?.items ?? [])
				setTotal(res?.totalCount ?? 0)
			} catch (err) {
				if ((err as any)?.name !== 'AbortError') console.error(err)
			} finally {
				setLoading(false)
			}
		},
		[page, pageSize, status, fromDate, toDate, filterRejectionRequests],
	)

	// initial & pagination fetch
	useEffect(() => {
		fetchList()
	}, [page, pageSize])

	useEffect(() => {
		setPage(1) // Reset về trang 1 khi thay đổi filter
		fetchList({ page: 1 })
	}, [status, fromDate, toDate])

	const openWithData = useCallback(
		async (id: string, mode: Exclude<DialogMode, null>) => {
			try {
				const res = await getRejectionRequestDetail(id)
				setDetail(res)

				// Lấy thông tin tour guide hiện tại
				const profile = res?.tourGuideId ? await getTourguideProfile(res.tourGuideId) : null
				setTourguideProfile((profile || null) as TourGuideDetail | null)

				// Nếu mode là approve hoặc view, lấy danh sách tour guides có sẵn
				if (mode !== 'reject') {
					let availableGuides: any[] = []

					// Nếu có tourScheduleId, lấy thông tin chi tiết để biết ngày
					if (res?.tourScheduleId) {
						try {
							const scheduleDetails = await getTourScheduleDetails(res.tourScheduleId)
							console.log('Schedule Details:', scheduleDetails)

							// Nếu có thông tin ngày trong schedule, lấy available guides cho ngày đó
							if (scheduleDetails?.startDate) {
								const scheduleDate = new Date(scheduleDetails.startDate).toISOString().split('T')[0]
								console.log('Getting available guides for date:', scheduleDate)
								availableGuides = await getAvailableTourGuides(scheduleDate)

								// Loại bỏ tour guide hiện tại khỏi danh sách available guides
								if (res.tourGuideId && Array.isArray(availableGuides)) {
									availableGuides = availableGuides.filter(guide => guide.id !== res.tourGuideId)
								}

								console.log('Available guides (excluding current guide):', availableGuides)
							} else {
								// Fallback: lấy tất cả tour guides (trừ guide hiện tại)
								const allGuides = await getTourGuide()
								availableGuides = Array.isArray(allGuides)
									? allGuides.filter(guide => guide.id !== res.tourGuideId)
									: []
							}
						} catch (error) {
							console.error('Error getting schedule details, falling back to all guides:', error)
							const allGuides = await getTourGuide()
							availableGuides = Array.isArray(allGuides)
								? allGuides.filter(guide => guide.id !== res.tourGuideId)
								: []
						}
					} else {
						// Không có tourScheduleId, lấy tất cả tour guides (trừ guide hiện tại)
						const allGuides = await getTourGuide()
						availableGuides = Array.isArray(allGuides)
							? allGuides.filter(guide => guide.id !== res.tourGuideId)
							: []
					}

					setGuideOptions(availableGuides)
				} else {
					setGuideOptions([])
				}

				setDialogMode(mode)
				setOpenDialog(true)
			} catch (error) {
				console.error(error)
			}
		},
		[getRejectionRequestDetail, getTourguideProfile, getTourGuide, getAvailableTourGuides, getTourScheduleDetails],
	)

	const handleOpenView = useCallback((id: string) => openWithData(id, 'view'), [openWithData])
	const handleOpenApprove = useCallback((id: string) => openWithData(id, 'approve'), [openWithData])
	const handleOpenReject = useCallback((id: string) => openWithData(id, 'reject'), [openWithData])

	const onSuccess = useCallback(() => {
		setOpenDialog(false)
		setDialogMode(null)
		setDetail(null)
		setTourguideProfile(null)
		fetchList({ page: 1 })
	}, [fetchList])

	const columns: ColumnDef<RejectionRequestDetail>[] = useMemo(
		() => [
			{
				header: 'Loại yêu cầu',
				accessorKey: 'requestType',
				cell: ({ row }) => {
					const requestType = row.original.requestType
					return (
						<div className="flex items-center gap-2">
							{requestType === 1 ? (
								<>
									<span className="text-sm font-medium text-blue-500">Chuyến đi hệ thống</span>
								</>
							) : requestType === 2 ? (
								<>
									<span className="text-sm font-medium text-orange-950">Người dùng đặt</span>
								</>
							) : (
								<>
									<span className="text-sm font-medium text-gray-600">Không xác định</span>
								</>
							)}
						</div>
					)
				}
			},
			{
				header: 'Hướng dẫn viên',
				accessorKey: 'tourGuideId',
				cell: ({ row }) => {
					const tourGuideId = row.original.tourGuideId
					return (
						<div className="text-sm">
							{tourGuideId ? (
								<span className="font-medium text-blue-600">
									ID: {tourGuideId.slice(-8)}
								</span>
							) : (
								<span className="text-gray-400">Không có</span>
							)}
						</div>
					)
				}
			},
			{
				header: 'Trạng thái',
				accessorKey: 'status',
				cell: ({ row }) => {
					const status = row.original.status
					const statusText = row.original.statusText

					// Tạo badge dựa trên status
					if (status === RejectionStatus.Pending) {
						return (
							<Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
								{statusText || 'Chờ duyệt'}
							</Badge>
						)
					} else if (status === RejectionStatus.Approved) {
						return (
							<Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
								{statusText || 'Đã duyệt'}
							</Badge>
						)
					} else if (status === RejectionStatus.Rejected) {
						return (
							<Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">
								{statusText || 'Từ chối'}
							</Badge>
						)
					} else {
						return (
							<Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-700">
								{statusText || 'Không xác định'}
							</Badge>
						)
					}
				}
			},
			// {
			// 	hidden: true,
			// 	header: 'Lịch trình',
			// 	accessorKey: 'tourScheduleId',
			// 	cell: ({ row }) => {
			// 		const tourScheduleId = row.original.tourScheduleId
			// 		return (
			// 			<div className="text-sm">
			// 				{tourScheduleId ? (
			// 					<span className="font-medium text-green-600">
			// 						ID: {tourScheduleId.slice(-8)}
			// 					</span>
			// 				) : (
			// 					<span className="text-gray-400">Không có</span>
			// 				)}
			// 			</div>
			// 		)
			// 	}
			// },
			{ header: 'Lý do', accessorKey: 'reason' },
			{ header: 'Comment', accessorKey: 'moderatorComment' },
			{
				header: 'Hành động',
				accessorKey: 'action',
				cell: ({ row }) => (
					row.original.status === RejectionStatus.Pending ? (
						<div className="flex gap-2">
							<Button variant="default" size="sm" onClick={() => handleOpenApprove(row.original.id)}>
								<CheckIcon className="w-4 h-4" /> Xác nhận
							</Button>
							<Button variant="destructive" size="sm" onClick={() => handleOpenReject(row.original.id)}>
								<XIcon className="w-4 h-4" /> Từ chối
							</Button>
							<Button variant="outline" size="sm" onClick={() => handleOpenView(row.original.id)}>
								<EyeIcon className="w-4 h-4" /> Xem
							</Button>
						</div>
					) : (
						<p className="text-sm text-muted-foreground">
							<Button variant="outline" size="sm" onClick={() => handleOpenView(row.original.id)}>
								<EyeIcon className="w-4 h-4" /> Xem
							</Button>
						</p>
					)
				),
			},
		],
		[handleOpenApprove, handleOpenReject, handleOpenView],
	)

	return (
		<div>
			<Card>
				<CardHeader>
					<CardTitle>Yêu cầu từ chối chuyến tham quan (Hướng Dẫn Viên)</CardTitle>
				</CardHeader>
				<CardContent>
					<DataTable
						columns={columns}
						data={data}
						loading={loading}
						total={total}
						page={page}
						pageSize={pageSize}
						onPageChange={setPage}
						onPageSizeChange={setPageSize}
					/>
				</CardContent>
			</Card>

			<RequestDialog
				mode={dialogMode}
				open={openDialog}
				onOpenChange={(open, mode?: DialogMode) => {
					setOpenDialog(open)
					if (!open) setDialogMode(null)
					if (mode) setDialogMode(mode)
				}}
				detail={detail}
				tourguideProfile={tourguideProfile}
				guideOptions={guideOptions}
				onSuccess={onSuccess}
			/>
		</div>
	)
}
