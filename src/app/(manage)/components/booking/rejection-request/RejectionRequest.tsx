'use client'

import { ColumnDef } from '@tanstack/react-table'
import { CheckIcon, EyeIcon, XIcon } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
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
	const { getTourguideProfile, getTourGuide } = useTourguideAssign()

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
				const res = await filterRejectionRequests({
					pageNumber: _page,
					pageSize: _pageSize,
					Status: _status === 'all' ? undefined : Number(_status),
					FromDate: _from,
					ToDate: _to,
				})
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
		fetchList()
	}, [status, fromDate, toDate])

	const openWithData = useCallback(
		async (id: string, mode: Exclude<DialogMode, null>) => {
			try {
				const res = await getRejectionRequestDetail(id)
				setDetail(res)

				const [profile, guides] = await Promise.all([
					res?.tourGuideId ? getTourguideProfile(res.tourGuideId) : Promise.resolve(null),
					mode !== 'reject' ? getTourGuide() : Promise.resolve([]), // guides only needed for approve/view
				])

				setTourguideProfile((profile || null) as TourGuideDetail | null)
				setGuideOptions(Array.isArray(guides) ? guides : [])

				setDialogMode(mode)
				setOpenDialog(true)
			} catch (error) {
				console.error(error)
			}
		},
		[getRejectionRequestDetail, getTourguideProfile, getTourGuide],
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
			{ header: 'Loại yêu cầu', accessorKey: 'requestType' },
			{
				header: 'Tourguide',
				accessorKey: 'tourGuideId',
			},
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
					<CardTitle>Yêu cầu từ chối tour</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex justify-between items-center">
						<div className="flex gap-2">
							<Select value={String(status)} onValueChange={(value) => setStatus(value === 'all' ? 'all' : (Number(value) as RejectionStatus))}>
								<SelectTrigger>
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									{STATUS_OPTIONS.map((opt) => (
										<SelectItem key={opt.label} value={String(opt.value)}>
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Input type="date" placeholder="Từ ngày" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
							<Input type="date" placeholder="Đến ngày" value={toDate} onChange={(e) => setToDate(e.target.value)} />
						</div>
						<Button variant="outline" onClick={() => fetchList({ page: 1 })}>Làm mới</Button>
					</div>

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
